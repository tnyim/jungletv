package server

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/raffle"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) RaffleDrawings(ctxCtx context.Context, r *proto.RaffleDrawingsRequest) (*proto.RaffleDrawingsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	// process the current raffle in order to create a raffle drawing record for the current week, if it doesn't exist yet
	year, week := time.Now().UTC().ISOWeek()
	raffleID, periodStart, periodEnd, valid := raffle.WeeklyRaffleParameters(year, week)
	if valid {
		_, _, err := raffle.ProcessRaffle(ctx, raffleID, periodStart, periodEnd, s.raffleSecretKey)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}

	raffleDrawings, total, err := types.GetRaffleDrawings(ctx, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.RaffleDrawingsResponse{
		RaffleDrawings: s.convertRaffleDrawings(ctx, raffleDrawings, s.userSerializer),
		Offset:         readOffset(r),
		Total:          total,
	}, stacktrace.Propagate(ctx.Commit(), "")
}

func (s *grpcServer) convertRaffleDrawings(ctx context.Context, orig []*types.RaffleDrawing, userSerializer auth.APIUserSerializer) []*proto.RaffleDrawing {
	protoEntries := make([]*proto.RaffleDrawing, len(orig))
	for i, entry := range orig {
		protoEntries[i] = s.convertRaffleDrawing(ctx, entry, userSerializer)
	}
	return protoEntries
}

func (s *grpcServer) convertRaffleDrawing(ctx context.Context, orig *types.RaffleDrawing, userSerializer auth.APIUserSerializer) *proto.RaffleDrawing {
	drawing := &proto.RaffleDrawing{
		RaffleId:      orig.RaffleID,
		DrawingNumber: uint32(orig.DrawingNumber),
		PeriodStart:   timestamppb.New(orig.PeriodStart),
		PeriodEnd:     timestamppb.New(orig.PeriodEnd),
		Reason:        orig.Reason,
		PrizeTxHash:   orig.PrizeTxHash,
	}

	switch orig.Status {
	case types.RaffleDrawingStatusOngoing:
		drawing.Status = proto.RaffleDrawingStatus_RAFFLE_DRAWING_STATUS_ONGOING
	case types.RaffleDrawingStatusPending:
		drawing.Status = proto.RaffleDrawingStatus_RAFFLE_DRAWING_STATUS_PENDING
	case types.RaffleDrawingStatusConfirmed:
		drawing.Status = proto.RaffleDrawingStatus_RAFFLE_DRAWING_STATUS_CONFIRMED
	case types.RaffleDrawingStatusVoided:
		drawing.Status = proto.RaffleDrawingStatus_RAFFLE_DRAWING_STATUS_VOIDED
	case types.RaffleDrawingStatusComplete:
		drawing.Status = proto.RaffleDrawingStatus_RAFFLE_DRAWING_STATUS_COMPLETE
	}

	if orig.WinningTicketNumber != nil && orig.WinningRewardsAddress != nil {
		n := uint32(*orig.WinningTicketNumber)
		drawing.WinningTicketNumber = &n
		drawing.Winner = userSerializer(ctx, auth.NewAddressOnlyUser(*orig.WinningRewardsAddress))
	}

	if strings.HasPrefix(orig.RaffleID, "weekly-") {
		year, week := orig.PeriodStart.UTC().ISOWeek()
		drawing.EntriesUrl = raffle.RaffleEntriesURL(s.websiteURL, year, week)
		drawing.InfoUrl = raffle.RaffleInfoURL(s.websiteURL, year, week)
	}

	return drawing
}

func (s *grpcServer) OngoingRaffleInfo(ctxCtx context.Context, r *proto.OngoingRaffleInfoRequest) (*proto.OngoingRaffleInfoResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctxCtx)

	year, week := time.Now().UTC().ISOWeek()
	raffleID, periodStart, periodEnd, valid := raffle.WeeklyRaffleParameters(year, week)

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
		EntriesUrl:   raffle.RaffleEntriesURL(s.websiteURL, year, week),
		InfoUrl:      raffle.RaffleInfoURL(s.websiteURL, year, week),
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

	err := raffle.ConfirmRaffleWinner(ctx, r.RaffleId)
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

	err := raffle.RedrawRaffle(ctx, r.RaffleId, r.Reason, s.raffleSecretKey)
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

	err := raffle.CompleteRaffle(ctx, r.RaffleId, r.PrizeTxHash)
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
