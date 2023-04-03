package appeditor

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"path/filepath"
	"strings"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (*AppEditor) CreateApplicationZIP(ctxCtx context.Context, applicationID string) ([]byte, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return nil, stacktrace.NewError("application not found")
	}

	files, _, err := types.GetApplicationFilesForApplication[*types.ApplicationFile](ctx, applicationID, "", nil)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	buf := new(bytes.Buffer)
	zipWriter := zip.NewWriter(buf)

	for _, file := range files {
		fileWriter, err := zipWriter.CreateHeader(&zip.FileHeader{
			Name:     file.Name,
			Comment:  file.EditMessage,
			Modified: file.UpdatedAt,
			Extra:    buildZIPExtraFieldForFile(file),
			Method:   zip.Deflate,
		})
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		_, err = fileWriter.Write(file.Content)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}

	err = zipWriter.SetComment(fmt.Sprintf("Export of JungleTV application %s version %v", application.ID, time.Time(application.UpdatedAt).UTC()))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = zipWriter.Close()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return buf.Bytes(), nil
}

type zipExtraField struct {
	Magic  string `json:"magic"`
	Public bool   `json:"public"`
	Type   string `json:"type"`
}

const zipExtraFieldMagic = "JungleTV AF File"

func buildZIPExtraFieldForFile(file *types.ApplicationFile) []byte {
	f := zipExtraField{
		Magic:  zipExtraFieldMagic,
		Public: file.Public,
		Type:   file.Type,
	}
	fieldBytes, _ := json.Marshal(f)

	b := make([]byte, 0, 4+len(fieldBytes))
	b = append(b, 'A', 'F')
	b = binary.LittleEndian.AppendUint16(b, uint16(len(fieldBytes)))
	b = append(b, fieldBytes...)
	return b
}

func parseZIPExtraField(extra []byte) (string, bool, error) {
	e := extra[:]
	for len(e) > 4 {
		fieldLen := int(binary.LittleEndian.Uint16(e[2:4]))
		if 4+fieldLen > len(e) {
			// malformed field length that's longer than the entire remaining length, skip
			break
		}
		if e[0] == 'A' && e[1] == 'F' && fieldLen > 2 {
			var f zipExtraField
			err := json.Unmarshal(e[4:4+fieldLen], &f)
			if err == nil && f.Magic == zipExtraFieldMagic {
				return f.Type, f.Public, nil
			}
		}
		// skip to next field
		e = e[4+fieldLen:]
	}
	return "", false, stacktrace.NewError("did not find our extra field")
}

func (e *AppEditor) ImportApplicationFilesFromZIP(ctxCtx context.Context, applicationID string, zipContents []byte, deleteFilesNotInArchive bool, restoreEditMessages bool, importedBy auth.User) error {
	zipReader, err := zip.NewReader(bytes.NewReader(zipContents), int64(len(zipContents)))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return stacktrace.NewError("application not found")
	}

	now := time.Now()

	filesInZip := map[string]struct{}{}
	for _, zipFile := range zipReader.File {
		fileName := filepath.Base(zipFile.Name) // effectively flatten any folder structure
		if strings.HasPrefix(fileName, "*") {
			return stacktrace.Propagate(err, "invalid file name in archive: %s", fileName)
		}
		filesInZip[fileName] = struct{}{}

		fileReader, err := zipFile.Open()
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		file := &types.ApplicationFile{
			ApplicationID: applicationID,
			Name:          fileName,
			// do not restore modified time because that doesn't play very well
			// with our concept of a more recent UpdatedAt equalling a higher file version
			UpdatedAt:   now,
			UpdatedBy:   importedBy.Address(),
			EditMessage: "Import from archive",
			Deleted:     false,
		}

		if restoreEditMessages && zipFile.Comment != "" {
			file.EditMessage = zipFile.Comment
		}

		file.Content, err = io.ReadAll(fileReader)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		err = fileReader.Close()
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		decodedType, decodedPublic, decodeErr := parseZIPExtraField(zipFile.Extra)
		if decodeErr == nil {
			file.Type = decodedType
			file.Public = decodedPublic
		} else {
			file.Type = mimetype.Detect(file.Content).String()
		}

		err = file.Update(ctx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	if deleteFilesNotInArchive {
		files, _, err := types.GetApplicationFilesForApplication[*types.ApplicationFile](ctx, application.ID, "", nil)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		for _, file := range files {
			if _, presentInZip := filesInZip[file.Name]; !presentInZip {
				file.Deleted = true
				file.UpdatedAt = now
				file.UpdatedBy = importedBy.Address()
				file.EditMessage = "Delete during archive import"

				err = file.Update(ctx)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		}
	}

	application.UpdatedAt = types.ApplicationVersion(now)
	application.UpdatedBy = importedBy.Address()
	application.EditMessage = "Import files from archive"

	err = application.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
