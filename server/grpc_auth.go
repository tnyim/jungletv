package server

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/hectorchu/gonano/util"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/utils/event"
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
	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)
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

	user := authinterceptor.UserClaimsFromContext(ctx)
	var jwtToken string
	var tokenExpiry time.Time
	if user != nil && auth.UserPermissionLevelIsAtLeast(user, auth.UserPermissionLevel) {
		// keep permissions of authenticated user
		jwtToken, tokenExpiry, err = s.jwtManager.Generate(ctx, r.RewardsAddress, user.PermissionLevel(), user.ModeratorName())
	} else {
		jwtToken, tokenExpiry, err = s.jwtManager.Generate(ctx, r.RewardsAddress, auth.UserPermissionLevel, "")
	}
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	process := &addressVerificationProcess{
		accountIndex:  uint32(rand.Int31()),
		remoteAddress: remoteAddress,
	}
	existingProcess, expiration, hadExistingProcess := s.verificationProcesses.GetWithExpiration(r.RewardsAddress)
	if hadExistingProcess {
		if existingProcess.remoteAddress == remoteAddress {
			process = existingProcess
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
		s.log.Println(r.RewardsAddress, "completed SignIn process with remote address", remoteAddress)
		return stream.Send(&proto.SignInProgress{
			Step: &proto.SignInProgress_Response{
				Response: &proto.SignInResponse{
					AuthToken:       jwtToken,
					TokenExpiration: timestamppb.New(tokenExpiry),
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

func (s *grpcServer) InvalidateAuthTokens(ctx context.Context, r *proto.InvalidateAuthTokensRequest) (*proto.InvalidateAuthTokensResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	err := s.jwtManager.InvalidateUserAuthTokens(ctx, user)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.InvalidateAuthTokensResponse{}, nil
}

func (s *grpcServer) UserPermissionLevel(ctx context.Context, r *proto.UserPermissionLevelRequest) (*proto.UserPermissionLevelResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	level := proto.PermissionLevel_UNAUTHENTICATED
	if user != nil {
		level = user.PermissionLevel().SerializeForAPI()
	}
	return &proto.UserPermissionLevelResponse{
		PermissionLevel: level,
	}, nil
}

func (s *grpcServer) AuthorizeApplication(r *proto.AuthorizeApplicationRequest, stream proto.JungleTV_AuthorizeApplicationServer) error {
	if !buildconfig.LAB && !buildconfig.DEBUG {
		return status.Error(codes.Unimplemented, "application authorization not available in production environments")
	}

	if r.DesiredPermissionLevel == proto.PermissionLevel_UNAUTHENTICATED {
		return status.Error(codes.InvalidArgument, "can't request to be authenticated at the unauthenticated permission level")
	}

	process := s.thirdPartyAuthorizer.BeginProcess(r.ApplicationName, auth.ParseAPIPermissionLevel(r.DesiredPermissionLevel), r.Reason)

	err := stream.Send(&proto.AuthorizeApplicationEvent{
		Event: &proto.AuthorizeApplicationEvent_AuthorizationUrl{
			AuthorizationUrl: &proto.AuthorizeApplicationAuthorizationURLEvent{
				AuthorizationUrl: fmt.Sprintf("%s/authorize/%s", s.websiteURL, process.ID),
			},
		},
	})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	heartbeatTicker := time.NewTicker(3 * time.Second)
	defer heartbeatTicker.Stop()

	onDissented, dissentedU := process.UserDissented.Subscribe(event.BufferFirst)
	defer dissentedU()

	onConsented, consentedU := process.UserConsented.Subscribe(event.BufferFirst)
	defer consentedU()

	for {
		select {
		case <-heartbeatTicker.C:
			err := stream.Send(&proto.AuthorizeApplicationEvent{
				Event: &proto.AuthorizeApplicationEvent_Heartbeat{
					Heartbeat: &proto.AuthorizeApplicationHeartbeatEvent{},
				},
			})
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case data := <-onConsented:
			err := stream.Send(&proto.AuthorizeApplicationEvent{
				Event: &proto.AuthorizeApplicationEvent_Approved{
					Approved: &proto.AuthorizeApplicationApprovedEvent{
						AuthToken:       data.AuthToken,
						TokenExpiration: timestamppb.New(data.Expiry),
					},
				},
			})
			return stacktrace.Propagate(err, "")
		case <-onDissented:
			return nil
		case <-stream.Context().Done():
			process.Dissent()
			return nil
		}
	}
}

func (s *grpcServer) AuthorizationProcessData(ctx context.Context, r *proto.AuthorizationProcessDataRequest) (*proto.AuthorizationProcessDataResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	process, ok := s.thirdPartyAuthorizer.GetProcess(r.ProcessId)
	if !ok {
		return nil, status.Error(codes.NotFound, "process not found")
	}

	if !auth.UserPermissionLevelIsAtLeast(user, process.PermissionLevel) {
		return nil, status.Error(codes.PermissionDenied, "authentication process requests permissions above the current permission level")
	}

	return &proto.AuthorizationProcessDataResponse{
		ApplicationName:        process.ApplicationName,
		DesiredPermissionLevel: process.PermissionLevel.SerializeForAPI(),
		Reason:                 process.Reason,
	}, nil
}

func (s *grpcServer) ConsentOrDissentToAuthorization(ctx context.Context, r *proto.ConsentOrDissentToAuthorizationRequest) (*proto.ConsentOrDissentToAuthorizationResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	process, ok := s.thirdPartyAuthorizer.GetProcess(r.ProcessId)
	if !ok {
		return nil, status.Error(codes.NotFound, "process not found")
	}

	if r.Consent {
		err := process.Consent(ctx, user)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	} else {
		process.Dissent()
	}

	return &proto.ConsentOrDissentToAuthorizationResponse{}, nil
}
