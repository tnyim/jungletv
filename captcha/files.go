package captcha

import (
	"image"
	"math/rand"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/palantir/stacktrace"
)

type ImageDatabase struct {
	cgiFilepaths        []string
	photoFilepaths      []string
	orientableFilepaths []string
	allFilepaths        []string
}

func NewImageDatabase(imagesFolder string) (*ImageDatabase, error) {
	db := &ImageDatabase{}
	err := filepath.Walk(imagesFolder,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return nil
			}
			if strings.HasSuffix(path, ".jpg") || strings.HasSuffix(path, ".jpeg") || strings.HasSuffix(path, ".png") {
				if strings.Contains(info.Name(), "[cgi]") {
					db.cgiFilepaths = append(db.cgiFilepaths, path)
				}
				if strings.Contains(info.Name(), "[photo]") {
					db.photoFilepaths = append(db.photoFilepaths, path)
				}
				if strings.Contains(info.Name(), "[orientable]") {
					db.orientableFilepaths = append(db.orientableFilepaths, path)
				}
				db.allFilepaths = append(db.allFilepaths, path)
			}
			return nil
		})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return db, nil
}

func (i *ImageDatabase) GetCGIPicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.cgiFilepaths)
}

func (i *ImageDatabase) GetPhotoPicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.photoFilepaths)
}

func (i *ImageDatabase) GetOrientablePicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.orientableFilepaths)
}

func (i *ImageDatabase) GetAnyPicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.allFilepaths)
}

func (i *ImageDatabase) pick(rng *rand.Rand, arr []string) (image.Image, error) {
	path := arr[rng.Intn(len(arr))]
	img, err := imaging.Open(path)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return img, nil
}
