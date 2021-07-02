package server

import (
	"context"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) ConsumeMedia(r *proto.ConsumeMediaRequest, stream proto.JungleTV_ConsumeMediaServer) error {
	// stream.Send is not safe to be called on concurrent goroutines
	streamSendLock := sync.Mutex{}
	send := func(cp *proto.MediaConsumptionCheckpoint) error {
		streamSendLock.Lock()
		defer streamSendLock.Unlock()
		return stream.Send(cp)
	}

	user := UserClaimsFromContext(stream.Context())
	err := stream.Send(s.produceMediaConsumptionCheckpoint(stream.Context()))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	errChan := make(chan error)

	if user != nil {
		spectator, err := s.rewardsHandler.RegisterSpectator(stream.Context(), user)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		// SubscribeUsingCallback returns a function that unsubscribes when called. That's the reason for the defers

		defer spectator.OnRewarded().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(reward Amount) {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context())
			s := reward.String()
			cp.Reward = &s
			err := send(cp)
			if err != nil {
				errChan <- stacktrace.Propagate(err, "")
			}
		})()

		defer spectator.OnActivityChallenge().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(challenge string) {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context())
			cp.ActivityChallenge = &challenge
			err := send(cp)
			if err != nil {
				errChan <- stacktrace.Propagate(err, "")
			}
		})()

		defer s.rewardsHandler.UnregisterSpectator(stream.Context(), spectator)
	}

	statsCleanup, err := s.statsHandler.RegisterSpectator(stream.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer statsCleanup()

	t := time.NewTicker(3 * time.Second)
	// if we set this ticker to e.g. 10 seconds, it seems to be too long and CloudFlare or something drops connection :(

	onMediaChanged := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer s.mediaQueue.mediaChanged.Unsubscribe(onMediaChanged)
	lastPowTask := time.Time{}
	for {
		var powTask *WorkRequest
		powTaskChan := make(<-chan WorkRequest)
		if r.ParticipateInPow && time.Since(lastPowTask) > 30*time.Second {
			powTaskChan = s.workGenerator.TaskChannel()
		}
		select {
		case <-t.C:
			break
		case <-onMediaChanged:
			break
		case <-stream.Context().Done():
			return nil
		case err := <-errChan:
			return err
		case t := <-powTaskChan:
			powTask = &t
			lastPowTask = time.Now()
			break
		}
		cp := s.produceMediaConsumptionCheckpoint(stream.Context())
		if powTask != nil {
			cp.PowTask = &proto.ProofOfWorkTask{
				Previous: powTask.Data,
				Target:   powTask.Target[:],
			}
		}
		err := send(cp)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) produceMediaConsumptionCheckpoint(ctx context.Context) *proto.MediaConsumptionCheckpoint {
	cp := s.mediaQueue.ProduceCheckpointForAPI()
	cp.CurrentlyWatching = uint32(s.statsHandler.CurrentlyWatching(ctx))
	return cp
}

func (s *grpcServer) SubmitProofOfWork(ctx context.Context, r *proto.SubmitProofOfWorkRequest) (*proto.SubmitProofOfWorkResponse, error) {
	if len(r.Previous) != 32 {
		return nil, stacktrace.NewError("invalid previous length")
	}
	var previous [32]byte
	copy(previous[:], r.Previous)

	if len(r.Work) != 8 {
		return nil, stacktrace.NewError("invalid work length")
	}
	var work [8]byte
	copy(work[:], r.Work)
	err := s.workGenerator.DeliverWork(previous, work)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.SubmitProofOfWorkResponse{}, nil
}
