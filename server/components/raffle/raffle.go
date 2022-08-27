package raffle

import (
	"context"
	"crypto/ecdsa"
	"encoding/csv"
	"encoding/hex"
	"fmt"
	"io"
	"math/big"
	"strings"
	"time"

	"github.com/icza/gox/timex"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"github.com/vechain/go-ecvrf"
)

// ProcessRaffle returns information about a raffle, triggering raffle lifecycle operations in the process as needed
func ProcessRaffle(ctxCtx context.Context, raffleID string, periodStart, periodEnd time.Time, secretKey *ecdsa.PrivateKey) ([]*types.RaffleDrawing, []*types.PlayedMediaRaffleEntry, error) {
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
	err = GenerateRaffleEntriesPlaintext(drawing.RaffleID, drawing.PeriodStart, drawing.PeriodEnd, entries, drawingReasons, plaintextBuffer)
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
	hash, proof, err := ecvrf.Secp256k1Sha256Tai.Prove(secretKey, []byte(plaintext))
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

// generateWeeklyRaffleID generates the raffle ID for the given start period
func generateWeeklyRaffleID(periodStart time.Time) string {
	year, week := periodStart.ISOWeek()
	return fmt.Sprintf("weekly-%d-%d", year, week)
}

// WeeklyRaffleParameters returns the correct data necessary to process the raffle relative to the provided year and week
func WeeklyRaffleParameters(year, week int) (string, time.Time, time.Time, bool) {
	periodStart := timex.WeekStart(year, week)
	periodEnd := timex.WeekStart(year, week+1)
	raffleID := generateWeeklyRaffleID(periodStart)
	firstRaffle := time.Date(2021, time.October, 17, 0, 0, 0, 0, time.UTC)
	valid := !time.Now().Before(periodStart) && periodStart.After(firstRaffle)

	return raffleID, periodStart, periodEnd, valid
}

func GenerateRaffleEntriesPlaintext(raffleID string, periodStart, periodEnd time.Time, entries []*types.PlayedMediaRaffleEntry, drawings []string, output io.Writer) error {
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
		err = csvWriter.Write([]string{fmt.Sprintf("%d", entry.TicketNumber), entry.MediaID, entry.RequestedBy})
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

// ConfirmRaffleWinner modifies the given raffle, which must be in pending status, to mark its winner as confirmed
func ConfirmRaffleWinner(ctxCtx context.Context, raffleID string) error {
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

// CompleteRaffle modifies the given raffle, which must be in winner confirmed status, in order to change it to a complete state
func CompleteRaffle(ctxCtx context.Context, raffleID, txHash string) error {
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

// RedrawRaffle modifies the given raffle in order to redraw it, due to the provided reason
func RedrawRaffle(ctxCtx context.Context, raffleID, reason string, secretKey *ecdsa.PrivateKey) error {
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

// RaffleEntriesURL returns the URL of the entries for the given raffle
func RaffleEntriesURL(websiteURL string, year, week int) string {
	return fmt.Sprintf("%s/raffles/weekly/%d/%d/tickets", websiteURL, year, week)
}

// RaffleInfoURL returns the URL of the information for the given raffle
func RaffleInfoURL(websiteURL string, year, week int) string {
	return fmt.Sprintf("%s/raffles/weekly/%d/%d", websiteURL, year, week)
}
