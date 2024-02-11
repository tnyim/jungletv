package httpserver

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/raffle"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"github.com/uptrace/bunrouter"
)

func (s *HTTPServer) RaffleTickets(w http.ResponseWriter, r bunrouter.Request) error {
	year, week, err := extractWeeklyRaffleParametersFromRouterParams(r)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	raffleID, periodStart, periodEnd, validPeriod := raffle.WeeklyRaffleParameters(year, week)

	w.Header().Add("Content-Type", "text/plain; charset=UTF-8")
	if !validPeriod {
		w.WriteHeader(http.StatusNotFound)
		_, err := w.Write([]byte("No raffle found for this period.\n"))
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		return nil
	}

	ctx, err := transaction.Begin(r.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	drawings, entries, err := raffle.ProcessRaffle(ctx, raffleID, periodStart, periodEnd, s.raffleSecretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	drawingReasons := []string{}
	for _, d := range drawings {
		drawingReasons = append(drawingReasons, d.Reason)
	}

	err = raffle.GenerateRaffleEntriesPlaintext(raffleID, periodStart, periodEnd, entries, drawingReasons, w)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func (s *HTTPServer) RaffleInfo(w http.ResponseWriter, r bunrouter.Request) error {
	year, week, err := extractWeeklyRaffleParametersFromRouterParams(r)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	raffleID, periodStart, periodEnd, validPeriod := raffle.WeeklyRaffleParameters(year, week)

	w.Header().Add("Content-Type", "text/plain; charset=UTF-8")
	if !validPeriod {
		w.WriteHeader(http.StatusNotFound)
		_, err := w.Write([]byte("No raffle found for this period.\n"))
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		return nil
	}

	ctx, err := transaction.Begin(r.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	drawings, entries, err := raffle.ProcessRaffle(ctx, raffleID, periodStart, periodEnd, s.raffleSecretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	latestDrawing := drawings[len(drawings)-1]

	ticketsString := fmt.Sprintf("%d tickets were included in this raffle", len(entries))
	if latestDrawing.Status == types.RaffleDrawingStatusOngoing {
		ticketsString = fmt.Sprintf("This raffle has %d tickets so far", len(entries))
	}

	statusString := ""
	if len(drawings) > 1 {
		statusString = fmt.Sprintf("This raffle has had %d voided drawings:\n", len(drawings)-1)
		for i := 1; i < len(drawings); i++ {
			statusString += fmt.Sprintf("  - Drawing %d: %s\n", i, drawings[i].Reason)
		}
		statusString += "\n"
	}
	publicKey := s.raffleSecretKey.Public().(*ecdsa.PublicKey)
	publicKeyHex := hex.EncodeToString(elliptic.MarshalCompressed(publicKey, publicKey.X, publicKey.Y))

	winnerStr := ""
	if latestDrawing.WinningTicketNumber != nil &&
		latestDrawing.WinningRewardsAddress != nil &&
		latestDrawing.VRFProof != nil {
		winnerStr = fmt.Sprintf("Ticket #%d\nAddress %s\n", *latestDrawing.WinningTicketNumber, *latestDrawing.WinningRewardsAddress)
		winnerStr += fmt.Sprintf(`
This result can be verified using the following proof:

%s

and the following public key, encoded into the compressed form specified in
section 4.3.6 of ANSI X9.62. This key is used across all drawings of all
JungleTV raffles:

%s`, *latestDrawing.VRFProof, publicKeyHex)
	} else {
		winnerStr += fmt.Sprintf(`Once the raffle is drawn, the result will be verifiable using a proof that will
be disclosed together with the number of the winning ticket, plus the following
public key, encoded into the compressed form specified in section 4.3.6 of ANSI
X9.62. This key is used across all drawings of all JungleTV raffles:

%s`, publicKeyHex)
	}

	switch latestDrawing.Status {
	case types.RaffleDrawingStatusOngoing:
		statusString += fmt.Sprintf("This raffle will be drawn by the end of its period, i.e, at the following time:\n%s\n\n%s", periodEnd.Format(time.RFC3339), winnerStr)
	case types.RaffleDrawingStatusPending:
		statusString += "This raffle has been drawn, but the winner has not been confirmed yet.\n"
		if winnerStr != "" {
			statusString += "The PROVISIONAL winner of this raffle is:\n\n"
			statusString += winnerStr
			statusString += `

The raffle supervisor may still request a new drawing if this winner is not
eligible or if they refuse the prize. In such case, the reason for the
additional drawings will be made public.`
		}
	case types.RaffleDrawingStatusVoided:
		statusString += "This raffle has been voided, i.e. no prize will be paid."
	case types.RaffleDrawingStatusConfirmed:
		if winnerStr != "" {
			statusString += "The winner of this raffle is YET TO BE PAID and is confirmed to be:\n\n"
			statusString += winnerStr
		}
	case types.RaffleDrawingStatusComplete:
		if winnerStr != "" {
			statusString += "The winner of this raffle is confirmed to be:\n"
			statusString += winnerStr
		} else {
			statusString += "There was no winner for this raffle as there were no tickets."
		}
		if latestDrawing.PrizeTxHash != nil {
			statusString += fmt.Sprintf("\n\nThe winner was paid on block:\n%s", *latestDrawing.PrizeTxHash)
		}
	}

	_, err = io.WriteString(w, fmt.Sprintf(`JungleTV Media Enqueuing Raffle - ID %s
Raffle period: %s - %s

%s, which can be seen at:

%s

%s
`, raffleID, periodStart.Format(time.RFC3339), periodEnd.Add(-1*time.Second).Format(time.RFC3339),
		ticketsString,
		raffle.RaffleEntriesURL(s.websiteURL, year, week),
		statusString))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func extractWeeklyRaffleParametersFromRouterParams(r bunrouter.Request) (int, int, error) {
	yearStr := r.Param("year")
	weekStr := r.Param("week")

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		return 0, 0, stacktrace.Propagate(err, "")
	}

	week, err := strconv.Atoi(weekStr)
	if err != nil {
		return 0, 0, stacktrace.Propagate(err, "")
	}
	return year, week, nil
}
