package segcha

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
	cgiFilepaths           []string
	photoFilepaths         []string
	orientableFilepaths    []string
	glassBottleFilepaths   []string
	glassFilepaths         []string
	unbrokenGlassFilepaths []string
	brokenGlassFilepaths   []string
	allFilepaths           []string
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
				if strings.Contains(info.Name(), "[glassbottle]") {
					db.glassBottleFilepaths = append(db.glassBottleFilepaths, path)
					db.unbrokenGlassFilepaths = append(db.unbrokenGlassFilepaths, path)
				}
				if strings.Contains(info.Name(), "[glass]") {
					db.glassFilepaths = append(db.glassFilepaths, path)
					db.unbrokenGlassFilepaths = append(db.unbrokenGlassFilepaths, path)
				}
				if strings.Contains(info.Name(), "[brokenglass]") {
					db.brokenGlassFilepaths = append(db.brokenGlassFilepaths, path)
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

func (i *ImageDatabase) GetGlassBottlePicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.glassBottleFilepaths)
}

func (i *ImageDatabase) GetGlassPicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.glassFilepaths)
}

func (i *ImageDatabase) GetUnbrokenGlassPicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.unbrokenGlassFilepaths)
}

func (i *ImageDatabase) GetBrokenGlassPicture(rng *rand.Rand) (image.Image, error) {
	return i.pick(rng, i.brokenGlassFilepaths)
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
