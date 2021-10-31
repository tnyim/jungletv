package segcha

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/segcha/segchaproto"
	"google.golang.org/grpc"
)

// NewClient returns a new client for making remote challenge generation calls
// The connection to `address` is not secured! It is assumed that it is protected externally (e.g. through an SSH tunnel)
func NewClient(ctx context.Context, address string) (segchaproto.SegchaClient, func() error, error) {
	conn, err := grpc.DialContext(ctx, address, grpc.WithInsecure())
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "")
	}

	client := segchaproto.NewSegchaClient(conn)

	return client, conn.Close, nil
}

// NewChallengeUsingClient requests the generation of a challenge using the provided client and returns it
func NewChallengeUsingClient(ctx context.Context, steps int, client segchaproto.SegchaClient) (*Challenge, error) {
	response, err := client.GenerateChallenge(ctx, &segchaproto.GenerateChallengeRequest{
		NumSteps: uint32(steps),
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	answers := make([]int, len(response.Answers))
	for i := range response.Answers {
		answers[i] = int(response.Answers[i])
	}

	return &Challenge{
		id:      response.Id,
		pics:    response.Pictures,
		answers: answers,
	}, nil
}
