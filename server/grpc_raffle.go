package server

import (
	"context"
	"fmt"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) OngoingRaffleInfo(ctxCtx context.Context, r *proto.OngoingRaffleInfoRequest) (*proto.OngoingRaffleInfoResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctxCtx)

	year, week := time.Now().UTC().ISOWeek()
	raffleID, periodStart, periodEnd, valid := weeklyRaffleParameters(year, week)

	if !valid {
		return &proto.OngoingRaffleInfoResponse{}, nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	totalTickets, err := types.CountMediaRaffleEntriesBetween(ctx, periodStart, periodEnd)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	raffleInfo := &proto.OngoingRaffleInfo{
		RaffleId:     raffleID,
		EntriesUrl:   s.raffleEntriesURL(year, week),
		InfoUrl:      s.raffleInfoURL(year, week),
		PeriodStart:  timestamppb.New(periodStart),
		PeriodEnd:    timestamppb.New(periodEnd),
		TotalTickets: uint32(totalTickets),
	}
	if user != nil {
		userTickets, err := types.CountMediaRaffleEntriesRequestedByBetween(ctx, periodStart, periodEnd, user.Address())
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		t := uint32(userTickets)
		raffleInfo.UserTickets = &t
	}

	return &proto.OngoingRaffleInfoResponse{
		RaffleInfo: raffleInfo,
	}, nil
}

func (s *grpcServer) ConfirmRaffleWinner(ctx context.Context, r *proto.ConfirmRaffleWinnerRequest) (*proto.ConfirmRaffleWinnerResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := confirmRaffleWinner(ctx, r.RaffleId)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to confirm raffle winner")
	}

	s.log.Printf("Winner of raffle %s confirmed by  %s (remote address %s)", r.RaffleId, user.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) confirmed winner of raffle `%s`",
				user.Address()[:14], user.Username, r.RaffleId))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.ConfirmRaffleWinnerResponse{}, nil
}

func (s *grpcServer) RedrawRaffle(ctx context.Context, r *proto.RedrawRaffleRequest) (*proto.RedrawRaffleResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := redrawRaffle(ctx, r.RaffleId, r.Reason, s.raffleSecretKey)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to redraw raffle")
	}

	s.log.Printf("Raffle %s redrawn by %s (remote address %s) with reason \"%s\"", r.RaffleId, user.Username, authinterceptor.RemoteAddressFromContext(ctx), r.Reason)

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) redrawed raffle `%s` with reason \"%s\"",
				user.Address()[:14], user.Username, r.RaffleId, r.Reason))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RedrawRaffleResponse{}, nil
}

func (s *grpcServer) CompleteRaffle(ctx context.Context, r *proto.CompleteRaffleRequest) (*proto.CompleteRaffleResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := completeRaffle(ctx, r.RaffleId, r.PrizeTxHash)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to complete raffle")
	}

	s.log.Printf("Raffle %s completed by %s (remote address %s) with prize block %s", r.RaffleId, user.Username, authinterceptor.RemoteAddressFromContext(ctx), r.PrizeTxHash)

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) completed raffle `%s` with prize block `%s`",
				user.Address()[:14], user.Username, r.RaffleId, r.PrizeTxHash))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.CompleteRaffleResponse{}, nil
}
