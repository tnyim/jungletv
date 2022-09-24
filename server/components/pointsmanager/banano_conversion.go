package pointsmanager

import (
	"context"
	"log"
	"math/big"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
)

const flowExpiry = 10 * time.Minute
const flowExpiryTolerance = 1 * time.Minute

// bananoUnit is 1 BAN
var bananoUnit *big.Int = big.NewInt(1).Exp(big.NewInt(10), big.NewInt(29), big.NewInt(0)) // 100000000000000000000000000000

// BananoCostPerPoint is the cost of each point in Banano
var BananoCostPerPoint *big.Int = new(big.Int).Div(bananoUnit, big.NewInt(100))

func (m *Manager) CreateOrRecoverBananoConversionFlow(user auth.User) (*BananoConversionFlow, error) {
	if user == nil || user.IsUnknown() {
		return nil, stacktrace.NewError("can't create flow for unknown user")
	}

	m.bananoConversionFlowsLock.Lock()
	defer m.bananoConversionFlowsLock.Unlock()

	if existingFlow, present := m.bananoConversionFlows[user.Address()]; present && time.Until(existingFlow.Expiration()) > 10*time.Second {
		existingFlow.clientReconnected.Notify(true)
		return existingFlow, nil
	}

	flow, err := m.createBananoConversionFlow(user)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	m.bananoConversionFlows[user.Address()] = flow

	return flow, nil
}

func (m *Manager) createBananoConversionFlow(user auth.User) (*BananoConversionFlow, error) {
	paymentReceiver, err := m.paymentAccountPool.ReceivePayment()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	flow := &BananoConversionFlow{
		createdOrRecoveredAt: time.Now(),
		user:                 user,
		paymentAddress:       paymentReceiver.Address(),
		clientReconnected:    event.NewNoArg(),
		expired:              event.NewNoArg(),
		destroyed:            event.NewNoArg(),
		converted:            event.New[BananoConvertedEventArgs](),
		sessionBananoTotal:   payment.NewAmount(),
	}
	go flow.worker(m.workerContext, paymentReceiver.PaymentReceived(), m.convertBanano, func() {
		m.bananoConversionFlowsLock.Lock()
		defer m.bananoConversionFlowsLock.Unlock()
		delete(m.bananoConversionFlows, flow.user.Address())
	})

	return flow, nil
}

func (m *Manager) convertBanano(ctx context.Context, user auth.User, pointsTotalSoFar int, paymentArgs payment.PaymentReceivedEventArgs) (int, error) {
	// always refer to the total balance, so that if the user sends 0.015 + 0.015 BAN, we credit 1+2 points and not the
	// 1+1 points we'd credit if we looked into the individual transaction amounts
	expectedTotalPointsAmount := int(big.NewInt(0).Div(paymentArgs.Balance.Int, BananoCostPerPoint).Int64())
	pointsAmount := expectedTotalPointsAmount - pointsTotalSoFar

	if pointsAmount <= 0 {
		return 0, nil
	}

	_, err := m.CreateTransaction(ctx, user, types.PointsTxTypeConversionFromBanano,
		pointsAmount, TxExtraField{Key: "tx_hash", Value: paymentArgs.BlockHash})
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	return pointsAmount, nil
}

// BananoConversionFlow represents a Banano to points conversion flow for one user
type BananoConversionFlow struct {
	lock sync.RWMutex

	createdOrRecoveredAt time.Time
	user                 auth.User
	paymentAddress       string

	clientReconnected *event.NoArgEvent
	expired           *event.NoArgEvent
	destroyed         *event.NoArgEvent
	converted         *event.Event[BananoConvertedEventArgs]

	sessionBananoTotal payment.Amount
	sessionPointsTotal int
}

type BananoConvertedEventArgs struct {
	BananoAmount       payment.Amount
	SessionBananoTotal payment.Amount
	PointsAmount       int
	SessionPointsTotal int
}

func (f *BananoConversionFlow) PaymentAddress() string {
	return f.paymentAddress
}

func (f *BananoConversionFlow) SessionBananoTotal() payment.Amount {
	f.lock.RLock()
	defer f.lock.RUnlock()
	return f.sessionBananoTotal
}

func (f *BananoConversionFlow) SessionPointsTotal() int {
	f.lock.RLock()
	defer f.lock.RUnlock()
	return f.sessionPointsTotal
}

func (f *BananoConversionFlow) Expired() *event.NoArgEvent {
	return f.expired
}

func (f *BananoConversionFlow) Destroyed() *event.NoArgEvent {
	return f.destroyed
}

func (f *BananoConversionFlow) Expiration() time.Time {
	f.lock.RLock()
	defer f.lock.RUnlock()
	return f.createdOrRecoveredAt.Add(flowExpiry)
}

func (f *BananoConversionFlow) Converted() *event.Event[BananoConvertedEventArgs] {
	return f.converted
}

type convertPointsToBananoFunction func(ctx context.Context, user auth.User, pointsTotalSoFar int, paymentArgs payment.PaymentReceivedEventArgs) (int, error)

func (f *BananoConversionFlow) worker(ctx context.Context, paymentReceivedEvent *event.Event[payment.PaymentReceivedEventArgs], convertPointsFn convertPointsToBananoFunction, cleanupFn func()) {
	defer cleanupFn()
	defer f.destroyed.Notify(true)

	f.createdOrRecoveredAt = time.Now()
	expireTimer := time.NewTimer(flowExpiry)
	defer expireTimer.Stop()

	actualExpirationTimer := time.NewTimer(flowExpiry + flowExpiryTolerance)
	defer actualExpirationTimer.Stop()

	onPaymentReceived, onPaymentReceivedUnsub := paymentReceivedEvent.Subscribe(event.ExactlyOnceGuarantee)
	defer onPaymentReceivedUnsub()

	onClientReconnected, onClientReconnectedUnsub := f.clientReconnected.Subscribe(event.AtLeastOnceGuarantee)
	defer onClientReconnectedUnsub()

	for {
		select {
		case <-onClientReconnected:
			f.lock.Lock()
			f.createdOrRecoveredAt = time.Now()
			expireTimer.Reset(flowExpiry)
			actualExpirationTimer.Reset(flowExpiry + flowExpiryTolerance)
			f.lock.Unlock()
		case <-expireTimer.C:
			f.expired.Notify(true)
		case <-actualExpirationTimer.C:
			return
		case <-ctx.Done():
			return
		case paymentArgs := <-onPaymentReceived:
			func() {
				f.lock.Lock()
				defer f.lock.Unlock()
				pointsAmount, err := convertPointsFn(ctx, f.user, f.sessionPointsTotal, paymentArgs)
				if err != nil {
					log.Println(stacktrace.Propagate(err, "failed to convert points for user %s, payment %+v", f.user.Address(), paymentArgs))
					return
				}

				f.sessionBananoTotal = paymentArgs.Balance
				f.sessionPointsTotal += pointsAmount

				f.converted.Notify(BananoConvertedEventArgs{
					BananoAmount:       paymentArgs.Amount,
					SessionBananoTotal: paymentArgs.Balance,
					PointsAmount:       pointsAmount,
					SessionPointsTotal: f.sessionPointsTotal,
				}, true)
			}()
		}
	}
}
