package server

import (
	"context"
	"math/rand"
	"time"

	"github.com/hectorchu/gonano/util"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type addressVerificationProcess struct {
	accountIndex  uint32
	remoteAddress string
	completed     bool
}

func (s *grpcServer) SignIn(r *proto.SignInRequest, stream proto.JungleTV_SignInServer) error {
	ctx := stream.Context()
	remoteAddress := auth.RemoteAddressFromContext(ctx)
	_, _, _, ok, err := s.signInRateLimiter.Take(ctx, remoteAddress)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	if !ok {
		return status.Errorf(codes.ResourceExhausted, "rate limit reached")
	}

	// validate reward address
	_, err = util.AddressToPubkey(r.RewardsAddress)
	if err != nil || r.RewardsAddress[:4] != "ban_" { // we must check for ban since AddressToPubkey accepts nano too
		return status.Errorf(codes.InvalidArgument, "invalid reward address")
	}

	user := auth.UserClaimsFromContext(ctx)
	var jwtToken string
	expiry := time.Now().Add(180 * 24 * time.Hour)
	if user != nil && UserPermissionLevelIsAtLeast(user, auth.UserPermissionLevel) {
		// keep permissions of authenticated user
		jwtToken, err = s.jwtManager.Generate(r.RewardsAddress, user.PermLevel, user.Username, expiry)
	} else {
		jwtToken, err = s.jwtManager.Generate(r.RewardsAddress, auth.UserPermissionLevel, "", expiry)
	}
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	process := &addressVerificationProcess{
		accountIndex:  uint32(rand.Int31()),
		remoteAddress: remoteAddress,
	}
	procIface, expiration, hadExistingProcess := s.verificationProcesses.GetWithExpiration(r.RewardsAddress)
	if hadExistingProcess {
		p := procIface.(*addressVerificationProcess)
		if p.remoteAddress == remoteAddress {
			process = p
		} else {
			hadExistingProcess = false
		}
	}

	verifRep, err := s.wallet.NewAccount(&process.accountIndex)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if !hadExistingProcess {
		expiration = time.Now().Add(5 * time.Minute)
		s.verificationProcesses.Set(r.RewardsAddress, process, 5*time.Minute)
	}

	accountOpened := true
	_, err = s.wallet.RPC.AccountRepresentative(r.RewardsAddress)
	if err != nil {
		if err.Error() == "Account not found" {
			accountOpened = false
		} else {
			return stacktrace.Propagate(err, "")
		}
	}

	sendVerification := func() error {
		return stream.Send(&proto.SignInProgress{Step: &proto.SignInProgress_Verification{Verification: &proto.SignInVerification{
			VerificationRepresentativeAddress: verifRep.Address(),
			Expiration:                        timestamppb.New(expiration),
		}}})
	}
	sendAccountUnopened := func() error {
		return stream.Send(&proto.SignInProgress{Step: &proto.SignInProgress_AccountUnopened{AccountUnopened: &proto.SignInAccountUnopened{}}})
	}
	sendCompleted := func() error {
		return stream.Send(&proto.SignInProgress{
			Step: &proto.SignInProgress_Response{
				Response: &proto.SignInResponse{
					AuthToken:       jwtToken,
					TokenExpiration: timestamppb.New(expiry),
				},
			},
		})
	}

	if process.completed {
		err = sendCompleted()
	} else if accountOpened {
		err = sendVerification()
	} else {
		err = sendAccountUnopened()
	}

	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	for {
		time.Sleep(s.ticketCheckPeriod)
		if time.Now().After(expiration) {
			err := stream.Send(&proto.SignInProgress{
				Step: &proto.SignInProgress_Expired{
					Expired: &proto.SignInVerificationExpired{},
				},
			})
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			return nil
		}
		representative, err := s.wallet.RPC.AccountRepresentative(r.RewardsAddress)
		if err != nil {
			if err.Error() == "Account not found" {
				err = sendAccountUnopened()
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				continue
			}
			return stacktrace.Propagate(err, "")
		}

		if representative == verifRep.Address() {
			process.completed = true
			// verified!
			err = sendCompleted()
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			return nil
		}
		err = sendVerification()
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

}

func (s *grpcServer) UserPermissionLevel(ctx context.Context, r *proto.UserPermissionLevelRequest) (*proto.UserPermissionLevelResponse, error) {
	user := auth.UserClaimsFromContext(ctx)
	level := proto.PermissionLevel_UNAUTHENTICATED
	if user != nil {
		switch user.PermissionLevel() {
		case auth.UserPermissionLevel:
			level = proto.PermissionLevel_USER
		case auth.AdminPermissionLevel:
			level = proto.PermissionLevel_ADMIN
		}
	}
	return &proto.UserPermissionLevelResponse{
		PermissionLevel: level,
	}, nil
}
