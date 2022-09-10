package segcha

import (
	"bufio"
	"bytes"
	cryptorand "crypto/rand"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"math"
	"math/big"
	"math/rand"

	"github.com/anthonynsimon/bild/noise"
	"github.com/disintegration/imaging"
	"github.com/fogleman/gg"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
)

type Challenge struct {
	id string

	pics     [][]byte
	answers  []int
	imageDB  *ImageDatabase
	fontPath string
}

// NewChallenge returns a new challenge
func NewChallenge(steps int, imageDB *ImageDatabase, fontPath string) (*Challenge, error) {
	c := &Challenge{
		id:       uuid.NewV4().String(),
		imageDB:  imageDB,
		fontPath: fontPath,
	}
	bigSeed, err := cryptorand.Int(cryptorand.Reader, big.NewInt(math.MaxInt64))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	err = c.fillRuntimeInfo(bigSeed.Int64(), steps)
	return c, stacktrace.Propagate(err, "")
}

func (c *Challenge) ID() string {
	return c.id
}

func (c *Challenge) Pictures() [][]byte {
	return c.pics
}

func (c *Challenge) Answers() []int {
	return c.answers
}

func (c *Challenge) fillRuntimeInfo(seed int64, numSteps int) error {
	rng := rand.New(rand.NewSource(seed))

	encodePicture := func(pic image.Image) ([]byte, error) {
		var b bytes.Buffer
		w := bufio.NewWriter(&b)

		err := jpeg.Encode(w, pic, &jpeg.Options{Quality: 90})
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		return b.Bytes(), nil
	}

	c.pics = make([][]byte, numSteps)
	c.answers = make([]int, numSteps)
	for i := range c.pics {
		var err error
		var pic image.Image
		c.answers[i], pic, err = c.createStep(rng)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		c.pics[i], err = encodePicture(pic)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
	return nil
}

type challengeType int

const (
	challengeTypeSelectCGI challengeType = iota
	challengeTypeSelectPhoto
	challengeTypeSelectUpsideDown
	challengeTypeSelectUpright
	challengeTypeSelectGarbage
	challengeTypeSimpleMath
	challengeTypeSelectUnbrokenGlass
	challengeTypeSelectBrokenGlass
	challengeTypeSelectGlassBottle
	challengeTypeSelectGlassCup
)

var allChallengeTypes = []challengeType{
	challengeTypeSelectCGI,
	challengeTypeSelectPhoto,
	challengeTypeSelectUpsideDown,
	challengeTypeSelectUpright,
	challengeTypeSelectGarbage,
	challengeTypeSimpleMath,
	challengeTypeSelectUnbrokenGlass,
	challengeTypeSelectBrokenGlass,
	challengeTypeSelectGlassBottle,
	challengeTypeSelectGlassCup,
}

func (c *Challenge) createStep(rng *rand.Rand) (int, image.Image, error) {
	cType := allChallengeTypes[rng.Intn(len(allChallengeTypes))]
	answer := rng.Intn(4)

	pic := image.Image(imaging.New(600, 650, color.Black))

	fourPics, instructions, err := c.createFourPics(rng, cType, answer)
	if err != nil {
		return 0, nil, stacktrace.Propagate(err, "")
	}

	dc := gg.NewContextForImage(pic)
	err = dc.LoadFontFace(c.fontPath, 25)
	if err != nil {
		return 0, nil, stacktrace.Propagate(err, "")
	}
	dc.SetRGB(1, 1, 1)
	dc.DrawStringWrapped(instructions, 300, 25, 0.5, 0.5, 500, 1.2, gg.AlignCenter)
	pic = dc.Image()

	pic = imaging.Paste(pic, imaging.New(600, 600, color.White), image.Pt(0, 50))
	pic = imaging.Paste(pic, fourPics[0], image.Pt(0, 50))
	pic = imaging.Paste(pic, fourPics[1], image.Pt(300, 50))
	pic = imaging.Paste(pic, fourPics[2], image.Pt(0, 350))
	pic = imaging.Paste(pic, fourPics[3], image.Pt(300, 350))

	return answer, pic, nil
}

func (c *Challenge) createFourPics(rng *rand.Rand, cType challengeType, answer int) ([]image.Image, string, error) {
	fourPics, instructions, err := c.pickFourPics(rng, cType, answer)
	if err != nil {
		return nil, "", stacktrace.Propagate(err, "")
	}

	for i := 0; i < 4; i++ {
		bounds := fourPics[i].Bounds()
		if bounds.Dx() > bounds.Dy() {
			fourPics[i] = imaging.Resize(fourPics[i], 0, 350, imaging.Lanczos)
		} else {
			fourPics[i] = imaging.Resize(fourPics[i], 350, 0, imaging.Lanczos)
		}
		fourPics[i] = imaging.Rotate(fourPics[i], -10.0+rng.Float64()*20.0, color.Transparent)
		fourPics[i] = imaging.CropCenter(fourPics[i], 300, 300)
	}

	return fourPics, instructions, nil
}

func (c *Challenge) pickFourPics(rng *rand.Rand, cType challengeType, answer int) ([]image.Image, string, error) {
	pics := make([]image.Image, 4)
	var err error
	var instructions string
	switch cType {
	case challengeTypeSelectCGI:
		instructions = "Select the picture that is NOT a photo."
		for i := 0; i < 4; i++ {
			if i == answer {
				pics[i], err = c.imageDB.GetCGIPicture(rng)
			} else {
				pics[i], err = c.imageDB.GetPhotoPicture(rng)
			}
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
		}
	case challengeTypeSelectPhoto:
		instructions = "Select the picture that is a photo."
		for i := 0; i < 4; i++ {
			if i == answer {
				pics[i], err = c.imageDB.GetPhotoPicture(rng)
			} else {
				pics[i], err = c.imageDB.GetCGIPicture(rng)
				if rng.Intn(3) < 1 {
					pics[i] = imaging.Invert(pics[i])
				}
			}
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
		}
	case challengeTypeSelectUpsideDown:
		instructions = "Select the picture that is upside down."
		for i := 0; i < 4; i++ {
			pics[i], err = c.imageDB.GetOrientablePicture(rng)
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
			if i == answer {
				pics[i] = imaging.Rotate180(pics[i])
			}
		}
	case challengeTypeSelectUpright:
		instructions = "Select the picture that is NOT upside down."
		for i := 0; i < 4; i++ {
			pics[i], err = c.imageDB.GetOrientablePicture(rng)
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
			if i != answer {
				pics[i] = imaging.Rotate180(pics[i])
			}
		}
	case challengeTypeSelectGarbage:
		instructions = "Select the picture that appears corrupted."
		for i := 0; i < 4; i++ {
			pics[i], err = c.imageDB.GetAnyPicture(rng)
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
			if i == answer {
				pics[i] = imaging.Resize(pics[i], 600, 1000+rng.Intn(5000), imaging.NearestNeighbor)
				for r := 0; r < 5; r++ {
					var ov1 image.Image
					if rng.Intn(4) == 0 {
						ov1 = noise.Generate(300, 300, &noise.Options{Monochrome: false, NoiseFn: noise.Uniform})
					} else {
						ov1, err = c.imageDB.GetAnyPicture(rng)
						if err != nil {
							return nil, "", stacktrace.Propagate(err, "")
						}
					}
					ov1 = imaging.Rotate(ov1, rng.Float64()*360, color.Transparent)
					ov1 = imaging.Resize(ov1, 500+rng.Intn(150), 1000+rng.Intn(5000), imaging.NearestNeighbor)
					if rng.Intn(2) < 1 {
						ov1 = imaging.Invert(imaging.Rotate(ov1, rng.Float64()*360, color.Transparent))
					}
					imaging.AdjustSaturation(ov1, -15.0+rng.Float64()*30.0)
					imaging.AdjustBrightness(ov1, -10.0+rng.Float64()*20.0)
					pics[i] = imaging.OverlayCenter(pics[i], ov1, 0.5+rng.Float64()*0.15)
				}
				if rng.Intn(2) < 1 {
					pics[i] = imaging.Invert(pics[i])
				}
			}
		}
	case challengeTypeSimpleMath:
		num1 := rng.Intn(10)
		num2 := rng.Intn(10)
		operator := []string{"+", "-"}[rng.Intn(2)]
		result := num1 + num2
		if operator == "-" {
			result = num1 - num2
			for result < 0 {
				num2--
				result = num1 - num2
			}
		}
		instructions = fmt.Sprintf("How much is %d %s %d?", num1, operator, num2)

		for i := 0; i < 4; i++ {
			if i == answer {
				pics[i], err = c.picForNumber(rng, result)
			} else {
				wrongResult := rng.Intn(20)
				for wrongResult == result {
					wrongResult = rng.Intn(20)
				}
				pics[i], err = c.picForNumber(rng, wrongResult)
			}
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
		}
	case challengeTypeSelectUnbrokenGlass:
		instructions = "Select the picture without broken glass."
		for i := 0; i < 4; i++ {
			if i == answer {
				pics[i], err = c.imageDB.GetUnbrokenGlassPicture(rng)
			} else {
				pics[i], err = c.imageDB.GetBrokenGlassPicture(rng)
			}
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
		}
	case challengeTypeSelectBrokenGlass:
		instructions = "Select the picture with broken glass."
		for i := 0; i < 4; i++ {
			if i == answer {
				pics[i], err = c.imageDB.GetBrokenGlassPicture(rng)
			} else {
				pics[i], err = c.imageDB.GetUnbrokenGlassPicture(rng)
			}
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
		}
	case challengeTypeSelectGlassBottle:
		instructions = "Select the unbroken glass bottle."
		for i := 0; i < 4; i++ {
			if i == answer {
				pics[i], err = c.imageDB.GetGlassBottlePicture(rng)
			} else if rng.Intn(2) < 1 {
				pics[i], err = c.imageDB.GetGlassPicture(rng)
			} else {
				pics[i], err = c.imageDB.GetBrokenGlassPicture(rng)
			}
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
		}
	case challengeTypeSelectGlassCup:
		instructions = "Select the unbroken glass cup."
		for i := 0; i < 4; i++ {
			if i == answer {
				pics[i], err = c.imageDB.GetGlassPicture(rng)
			} else if rng.Intn(2) < 1 {
				pics[i], err = c.imageDB.GetGlassBottlePicture(rng)
			} else {
				pics[i], err = c.imageDB.GetBrokenGlassPicture(rng)
			}
			if err != nil {
				return nil, "", stacktrace.Propagate(err, "")
			}
		}
	}
	return pics, instructions, nil
}

func (c *Challenge) picForNumber(rng *rand.Rand, number int) (image.Image, error) {
	pic := imaging.New(350, 350, color.Black)
	dc := gg.NewContextForImage(pic)
	err := dc.LoadFontFace(c.fontPath, float64(100+rng.Intn(100)))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	dc.SetRGB(1, 1, 1)
	dc.DrawStringWrapped(fmt.Sprintf("%d", number), float64(125+rng.Intn(50)), float64(125+rng.Intn(50)), 0.5, 0.5, 350, 1.2, gg.AlignCenter)

	return dc.Image(), nil
}
