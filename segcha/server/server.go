package main

import (
	"context"
	"log"
	"net"
	"os"
	"time"

	"github.com/gbl08ma/keybox"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/segcha"
	"github.com/tnyim/jungletv/segcha/segchaproto"
	"google.golang.org/grpc"
)

var mainLog = log.New(os.Stdout, "", log.Ldate|log.Ltime)

func main() {
	mainLog.Println("Segcha work server starting, opening keybox config.json...")
	secrets, err := keybox.Open("config.json")
	if err != nil {
		mainLog.Fatalln(err)
	}
	mainLog.Println("Keybox opened")

	listenAddr, present := secrets.Get("listenAddress")
	if !present {
		mainLog.Fatalln("listenAddress not present in keybox")
	}

	segchaImageDBPath, present := secrets.Get("imageDBPath")
	if !present {
		mainLog.Fatalln("imageDBPath not present in keybox")
	}

	segchaFontPath, present := secrets.Get("fontPath")
	if !present {
		mainLog.Fatalln("fontPath not present in segcha keybox")
	}

	imageDB, err := segcha.NewImageDatabase(segchaImageDBPath)
	if err != nil {
		mainLog.Fatalln("error building segcha image DB:", err)
	}

	lis, err := net.Listen("tcp", listenAddr)
	if err != nil {
		mainLog.Fatalf("failed to listen: %v", err)
	}

	server := &segchaServer{
		fontPath: segchaFontPath,
		imageDB:  imageDB,
	}

	grpcServer := grpc.NewServer()
	segchaproto.RegisterSegchaServer(grpcServer, server)
	mainLog.Fatalln("error serving:", grpcServer.Serve(lis))
}

type segchaServer struct {
	segchaproto.UnimplementedSegchaServer

	imageDB  *segcha.ImageDatabase
	fontPath string
}

func (s *segchaServer) GenerateChallenge(ctx context.Context, r *segchaproto.GenerateChallengeRequest) (*segchaproto.Challenge, error) {
	t := time.Now()
	challenge, err := segcha.NewChallenge(int(r.NumSteps), s.imageDB, s.fontPath)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	origAnswers := challenge.Answers()
	answers := make([]uint32, len(origAnswers))
	for i := range origAnswers {
		answers[i] = uint32(origAnswers[i])
	}

	mainLog.Printf("Generated challenge in %v", time.Since(t))

	return &segchaproto.Challenge{
		Id:       challenge.ID(),
		Pictures: challenge.Pictures(),
		Answers:  answers,
	}, nil
}
