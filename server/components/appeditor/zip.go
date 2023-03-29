package appeditor

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"time"

	"github.com/palantir/stacktrace"
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

func buildZIPExtraFieldForFile(file *types.ApplicationFile) []byte {
	type field struct {
		Magic  string `json:"magic"`
		Public bool   `json:"public"`
		Type   string `json:"type"`
	}

	f := field{
		Magic:  "JungleTV AF File",
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
