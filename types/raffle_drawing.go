package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

type RaffleDrawingStatus string

/* (drawing created) -> ongoing
   (no tickets) -> complete
   (draw happens) -> pending
     (raffle supervisor rejects winner) -> voided (a new drawing is created with the reason added to the plaintext)
     (raffle supervisor approves winner) -> confirmed
       (winner is paid) -> complete
*/

const RaffleDrawingStatusOngoing RaffleDrawingStatus = "ongoing"
const RaffleDrawingStatusPending RaffleDrawingStatus = "pending"
const RaffleDrawingStatusConfirmed RaffleDrawingStatus = "confirmed"
const RaffleDrawingStatusVoided RaffleDrawingStatus = "voided"
const RaffleDrawingStatusComplete RaffleDrawingStatus = "complete"

// RaffleDrawing is one of the drawings of a raffle
type RaffleDrawing struct {
	RaffleID              string `dbKey:"true"`
	DrawingNumber         int    `dbKey:"true"`
	PeriodStart           time.Time
	PeriodEnd             time.Time
	Status                RaffleDrawingStatus
	Reason                string
	Plaintext             *string
	VRFHash               *string `db:"vrf_hash"`
	VRFProof              *string `db:"vrf_proof"`
	WinningTicketNumber   *int
	WinningRewardsAddress *string
	PrizeTxHash           *string
}

// GetRaffleDrawings returns all the raffle drawings
func GetRaffleDrawings(node sqalx.Node, pagParams *PaginationParams) ([]*RaffleDrawing, uint64, error) {
	s := sdb.Select().
		OrderBy("raffle_drawing.period_start DESC", "raffle_drawing.drawing_number ASC")
	s = applyPaginationParameters(s, pagParams)
	items, total, err := GetWithSelectAndCount[*RaffleDrawing](node, s)
	return items, total, stacktrace.Propagate(err, "")
}

// GetRaffleDrawingsOfRaffle returns all the drawings for a raffle
func GetRaffleDrawingsOfRaffle(node sqalx.Node, raffleID string) ([]*RaffleDrawing, error) {
	s := sdb.Select().
		Where(sq.Eq{"raffle_drawing.raffle_id": raffleID}).
		OrderBy("raffle_drawing.drawing_number ASC")
	drawings, err := GetWithSelect[*RaffleDrawing](node, s)
	return drawings, stacktrace.Propagate(err, "")
}

// Update updates or inserts the RaffleDrawing
func (obj *RaffleDrawing) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the RaffleDrawing
func (obj *RaffleDrawing) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
