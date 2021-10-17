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

// getRaffleDrawingWithSelect returns a slice with all raffle drawings that match the conditions in sbuilder
func getRaffleDrawingWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*RaffleDrawing, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &RaffleDrawing{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, err
	}

	converted := make([]*RaffleDrawing, len(values))
	for i := range values {
		converted[i] = values[i].(*RaffleDrawing)
	}

	return converted, totalCount, nil
}

// GetRaffleDrawings returns all the drawings for a raffle
func GetRaffleDrawings(node sqalx.Node, raffleID string) ([]*RaffleDrawing, error) {
	s := sdb.Select().
		Where(sq.Eq{"raffle_drawing.raffle_id": raffleID}).
		OrderBy("raffle_drawing.drawing_number ASC")
	drawings, _, err := getRaffleDrawingWithSelect(node, s)
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
