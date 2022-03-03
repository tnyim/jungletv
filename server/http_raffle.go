package server

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/csv"
	"encoding/hex"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/icza/gox/timex"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"github.com/vechain/go-ecvrf"
)

func (s *grpcServer) RaffleTickets(w http.ResponseWriter, r *http.Request) error {
	year, week, err := extractWeeklyRaffleParametersFromMuxVars(r)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	raffleID, periodStart, periodEnd, validPeriod := weeklyRaffleParameters(year, week)

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

	drawings, entries, err := processRaffle(ctx, raffleID, periodStart, periodEnd, s.raffleSecretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	drawingReasons := []string{}
	for _, d := range drawings {
		drawingReasons = append(drawingReasons, d.Reason)
	}

	err = generateRaffleEntriesPlaintext(raffleID, periodStart, periodEnd, entries, drawingReasons, w)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func (s *grpcServer) RaffleInfo(w http.ResponseWriter, r *http.Request) error {
	year, week, err := extractWeeklyRaffleParametersFromMuxVars(r)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	raffleID, periodStart, periodEnd, validPeriod := weeklyRaffleParameters(year, week)

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

	drawings, entries, err := processRaffle(ctx, raffleID, periodStart, periodEnd, s.raffleSecretKey)
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
		s.raffleEntriesURL(year, week),
		statusString))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func extractWeeklyRaffleParametersFromMuxVars(r *http.Request) (int, int, error) {
	vars := mux.Vars(r)

	yearStr := vars["year"]
	weekStr := vars["week"]

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

func weeklyRaffleParameters(year, week int) (string, time.Time, time.Time, bool) {
	periodStart := timex.WeekStart(year, week)
	periodEnd := timex.WeekStart(year, week+1)
	raffleID := generateWeeklyRaffleID(periodStart)
	firstRaffle := time.Date(2021, time.October, 17, 0, 0, 0, 0, time.UTC)
	valid := !time.Now().Before(periodStart) && periodStart.After(firstRaffle)

	return raffleID, periodStart, periodEnd, valid
}

func (s *grpcServer) raffleEntriesURL(year, week int) string {
	return fmt.Sprintf("%s/raffles/weekly/%d/%d/tickets", s.websiteURL, year, week)
}

func (s *grpcServer) raffleInfoURL(year, week int) string {
	return fmt.Sprintf("%s/raffles/weekly/%d/%d", s.websiteURL, year, week)
}

func processRaffle(ctxCtx context.Context, raffleID string, periodStart, periodEnd time.Time, secretKey *ecdsa.PrivateKey) ([]*types.RaffleDrawing, []*types.PlayedMediaRaffleEntry, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	drawings, err := types.GetRaffleDrawingsOfRaffle(ctx, raffleID)
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "")
	}

	var latestDrawing *types.RaffleDrawing
	if len(drawings) == 0 {
		latestDrawing = &types.RaffleDrawing{
			RaffleID:      raffleID,
			DrawingNumber: 1,
			PeriodStart:   periodStart,
			PeriodEnd:     periodEnd,
			Status:        types.RaffleDrawingStatusOngoing,
			Reason:        "Initial drawing.",
		}

		err = latestDrawing.Update(ctx)
		if err != nil {
			return nil, nil, stacktrace.Propagate(err, "")
		}
		drawings = []*types.RaffleDrawing{latestDrawing}
	} else {
		latestDrawing = drawings[len(drawings)-1]
	}

	entries, err := types.GetPlayedMediaRaffleEntriesBetween(ctx, latestDrawing.PeriodStart, latestDrawing.PeriodEnd)
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "")
	}

	needsDrawingsUpdate := false
	if latestDrawing.Status == types.RaffleDrawingStatusOngoing {
		err = processOngoingRaffle(ctx, latestDrawing, entries, secretKey)
		if err != nil {
			return nil, nil, stacktrace.Propagate(err, "")
		}
		needsDrawingsUpdate = true
	}

	if needsDrawingsUpdate {
		drawings, err = types.GetRaffleDrawingsOfRaffle(ctx, raffleID)
		if err != nil {
			return nil, nil, stacktrace.Propagate(err, "")
		}
	}
	return drawings, entries, stacktrace.Propagate(ctx.Commit(), "")
}

func processOngoingRaffle(ctxCtx context.Context, drawing *types.RaffleDrawing, entries []*types.PlayedMediaRaffleEntry, secretKey *ecdsa.PrivateKey) error {
	if !time.Now().After(drawing.PeriodEnd) {
		// nothing to do yet
		return nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	err = computeRaffleDrawing(ctx, drawing, entries, secretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = drawing.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func computeRaffleDrawing(ctxCtx context.Context, drawing *types.RaffleDrawing, entries []*types.PlayedMediaRaffleEntry, secretKey *ecdsa.PrivateKey) error {
	if drawing.Status != types.RaffleDrawingStatusOngoing {
		return stacktrace.NewError("raffle already drawn")
	}

	if len(entries) == 0 {
		drawing.Status = types.RaffleDrawingStatusComplete
		return nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	allDrawings, err := types.GetRaffleDrawingsOfRaffle(ctx, drawing.RaffleID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	drawingReasons := []string{}
	for _, d := range allDrawings {
		drawingReasons = append(drawingReasons, d.Reason)
	}

	plaintextBuffer := new(strings.Builder)
	err = generateRaffleEntriesPlaintext(drawing.RaffleID, drawing.PeriodStart, drawing.PeriodEnd, entries, drawingReasons, plaintextBuffer)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	plaintext := plaintextBuffer.String()
	drawing.Plaintext = &plaintext

	hash, hashBytes, proof, err := computeRaffleHashAndProof(*drawing.Plaintext, secretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	drawing.VRFHash = &hash
	drawing.VRFProof = &proof

	winningTicketNumber := computeRaffleWinnerFromHash(hashBytes, len(entries))
	drawing.WinningTicketNumber = &winningTicketNumber
	drawing.WinningRewardsAddress = &entries[winningTicketNumber-1].RequestedBy
	drawing.Status = types.RaffleDrawingStatusPending
	return nil
}

func computeRaffleHashAndProof(plaintext string, secretKey *ecdsa.PrivateKey) (string, []byte, string, error) {
	hash, proof, err := ecvrf.NewSecp256k1Sha256Tai().Prove(secretKey, []byte(plaintext))
	if err != nil {
		return "", []byte{}, "", stacktrace.Propagate(err, "")
	}

	return hex.EncodeToString(hash), hash, hex.EncodeToString(proof), nil
}

func computeRaffleWinnerFromHash(hash []byte, numEntries int) int {
	hashNum := big.NewInt(0).SetBytes(hash)
	mod := hashNum.Mod(hashNum, big.NewInt(int64(numEntries)))
	return int(mod.Int64()) + 1
}

func generateWeeklyRaffleID(periodStart time.Time) string {
	year, week := periodStart.ISOWeek()
	return fmt.Sprintf("weekly-%d-%d", year, week)
}

func generateRaffleEntriesPlaintext(raffleID string, periodStart, periodEnd time.Time, entries []*types.PlayedMediaRaffleEntry, drawings []string, output io.Writer) error {
	_, err := io.WriteString(output, fmt.Sprintf("JungleTV Media Enqueuing Raffle - ID %s\nRaffle period: %s - %s\n", raffleID, periodStart.Format(time.RFC3339), periodEnd.Add(-1*time.Second).Format(time.RFC3339)))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	_, err = io.WriteString(output, `
Each played media corresponds to a raffle ticket.
Tickets are assigned once a media begins playing.
Tickets are ordered by the start time of the corresponding media.
Once a ticket is issued, it is guaranteed not to change number and not to be
removed from this list.
The entirety of this document, including this introduction, is considered in the
winner selection algorithm. When cryptographically verifying the results, make
sure to consider the UTF-8 encoding of this document and the LF line breaks.
`)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	_, err = io.WriteString(output, `
Under normal conditions, each raffle has a single drawing.
However, in exceptional circumstances - such as winner ineligibility due to a
moderation penalty - further drawings will be made until a suitable winner is
found. In such case, in the name of transparency and verifiability, the reason
why the previous drawing was voided will be detailed below.

The addition of drawings to the list below changes the contents of this
document, which is necessary and sufficient to change the selected winner.
Drawing and ticket numbers always start at 1, always use the decimal numeral
system, never have leading zeros and are always consecutive.

For each raffle, the valid drawing shall be the one with the highest drawing
number that has a corresponding valid cryptographic proof as produced by
JungleTV.

-----BEGIN RAFFLE DRAWINGS LIST (CSV)-----
`)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	drawingsWriter := csv.NewWriter(output)
	err = drawingsWriter.Write([]string{"drawing_number", "reason"})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	for i, drawing := range drawings {
		err = drawingsWriter.Write([]string{fmt.Sprintf("%d", i+1), drawing})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
	drawingsWriter.Flush()
	err = drawingsWriter.Error()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	_, err = io.WriteString(output, "-----END RAFFLE DRAWINGS LIST (CSV)-----\n")
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if time.Now().Before(periodEnd) {
		_, err = io.WriteString(output, "\nWARNING: raffle period ongoing. The tickets list is not complete!\n")
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	_, err = io.WriteString(output, "\n-----BEGIN RAFFLE TICKETS LIST (CSV)-----\n")
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	csvWriter := csv.NewWriter(output)
	err = csvWriter.Write([]string{"ticket_number", "yt_video_id", "reward_address"})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	for _, entry := range entries {
		vid := ""
		if entry.YouTubeVideoID != nil {
			vid = *entry.YouTubeVideoID
		}
		err = csvWriter.Write([]string{fmt.Sprintf("%d", entry.TicketNumber), vid, entry.RequestedBy})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
	csvWriter.Flush()
	err = csvWriter.Error()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	_, err = io.WriteString(output, "-----END RAFFLE TICKETS LIST (CSV)-----\n")
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return nil
}

func confirmRaffleWinner(ctxCtx context.Context, raffleID string) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	drawings, err := types.GetRaffleDrawingsOfRaffle(ctx, raffleID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if len(drawings) == 0 {
		return stacktrace.NewError("raffle does not exist")
	}
	latestDrawing := drawings[len(drawings)-1]

	if latestDrawing.Status != types.RaffleDrawingStatusPending {
		return stacktrace.NewError("raffle is not in pending status")
	}

	latestDrawing.Status = types.RaffleDrawingStatusConfirmed

	err = latestDrawing.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func completeRaffle(ctxCtx context.Context, raffleID, txHash string) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	drawings, err := types.GetRaffleDrawingsOfRaffle(ctx, raffleID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if len(drawings) == 0 {
		return stacktrace.NewError("raffle does not exist")
	}
	latestDrawing := drawings[len(drawings)-1]

	if latestDrawing.Status != types.RaffleDrawingStatusConfirmed {
		return stacktrace.NewError("raffle is not in confirmed status")
	}

	latestDrawing.Status = types.RaffleDrawingStatusComplete
	latestDrawing.PrizeTxHash = &txHash

	err = latestDrawing.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func redrawRaffle(ctxCtx context.Context, raffleID, reason string, secretKey *ecdsa.PrivateKey) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	drawings, err := types.GetRaffleDrawingsOfRaffle(ctx, raffleID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if len(drawings) == 0 {
		return stacktrace.NewError("raffle does not exist")
	}
	latestDrawing := drawings[len(drawings)-1]

	if latestDrawing.Status != types.RaffleDrawingStatusPending && latestDrawing.Status != types.RaffleDrawingStatusVoided {
		return stacktrace.NewError("raffle is not in pending or voided status")
	}

	latestDrawing.Status = types.RaffleDrawingStatusVoided
	err = latestDrawing.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	newDrawing := &types.RaffleDrawing{
		RaffleID:      raffleID,
		DrawingNumber: latestDrawing.DrawingNumber + 1,
		PeriodStart:   latestDrawing.PeriodStart,
		PeriodEnd:     latestDrawing.PeriodEnd,
		Status:        types.RaffleDrawingStatusOngoing,
		Reason:        reason,
	}

	entries, err := types.GetPlayedMediaRaffleEntriesBetween(ctx, latestDrawing.PeriodStart, latestDrawing.PeriodEnd)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = processOngoingRaffle(ctx, newDrawing, entries, secretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
