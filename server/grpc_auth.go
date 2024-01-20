package server

import (
	"context"
	cryptorand "crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/hectorchu/gonano/util"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/bananomessagesigning"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type signInProcess struct {
	id             string
	signatureBased bool

	rewardsAddress string
	remoteAddress  string
	completed      bool
	jwtToken       string
	tokenExpiry    time.Time
	tokenSeason    int

	// used exclusively in rep changing flow:
	accountIndex uint32

	// used exclusively in signature changing flow:
	messageToSign string
	verified      event.NoArgEvent
}

func (s *grpcServer) SignIn(r *proto.SignInRequest, stream proto.JungleTV_SignInServer) error {
	ctx := stream.Context()
	process, processExpiry, err := s.getProcessForSignInRequest(ctx, r)
	if err != nil {
		if status.Code(err) == codes.Unknown {
			return stacktrace.Propagate(err, "")
		}
		return err
	}

	if process.signatureBased {
		err = s.signInViaSignature(r, stream, process, processExpiry)
	} else {
		err = s.signInViaRepresentativeChange(ctx, r, stream, process, processExpiry)
	}
	return stacktrace.Propagate(err, "")
}

func (s *grpcServer) signInViaRepresentativeChange(ctx context.Context, r *proto.SignInRequest, stream proto.JungleTV_SignInServer, process *signInProcess, processExpiry time.Time) error {
	verifRep, err := s.wallet.NewAccount(&process.accountIndex)
	if err != nil {
		return stacktrace.Propagate(err, "")
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
			Expiration:                        timestamppb.New(processExpiry),
			ProcessId:                         process.id,
		}}})
	}
	sendAccountUnopened := func() error {
		return stream.Send(&proto.SignInProgress{Step: &proto.SignInProgress_AccountUnopened{AccountUnopened: &proto.SignInAccountUnopened{}}})
	}
	sendCompleted := func() error {
		return stream.Send(&proto.SignInProgress{
			Step: &proto.SignInProgress_Response{
				Response: &proto.SignInResponse{
					AuthToken:       process.jwtToken,
					TokenExpiration: timestamppb.New(process.tokenExpiry),
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
		if time.Now().After(processExpiry) {
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
			err = auth.RecordAuthEvent(ctx, process.rewardsAddress, types.AuthReasonSignIn, struct {
				ProcessID     string `json:"process_id"`
				RemoteAddress string `json:"remote_address"`
				ClaimsSeason  int    `json:"claims_season"`
			}{
				ProcessID:     process.id,
				RemoteAddress: process.remoteAddress,
				ClaimsSeason:  process.tokenSeason,
			}, types.AuthMethodRepresentativeChange, struct {
				Representative string `json:"representative"`
			}{
				Representative: verifRep.Address(),
			})
			if err != nil {
				return stacktrace.Propagate(err, "")
			}

			process.completed = true
			// verified!
			s.log.Println(r.RewardsAddress, "completed SignIn process via representative change with remote address", process.remoteAddress)
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

func (s *grpcServer) signInViaSignature(r *proto.SignInRequest, stream proto.JungleTV_SignInServer, process *signInProcess, processExpiry time.Time) error {
	sendMessageToSign := func() error {
		return stream.Send(&proto.SignInProgress{Step: &proto.SignInProgress_MessageToSign{MessageToSign: &proto.SignInMessageToSign{
			Message:       process.messageToSign,
			SubmissionUrl: fmt.Sprintf("%s/verifysignature/%s", s.websiteURL, process.id),
			Expiration:    timestamppb.New(processExpiry),
			ProcessId:     process.id,
		}}})
	}
	sendCompleted := func() error {
		return stream.Send(&proto.SignInProgress{
			Step: &proto.SignInProgress_Response{
				Response: &proto.SignInResponse{
					AuthToken:       process.jwtToken,
					TokenExpiration: timestamppb.New(process.tokenExpiry),
				},
			},
		})
	}

	if process.completed {
		return stacktrace.Propagate(sendCompleted(), "")
	}

	err := sendMessageToSign()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	expiry := time.NewTimer(time.Until(processExpiry))
	defer expiry.Stop()

	onVerified, verifiedU := process.verified.Subscribe(event.BufferFirst)
	defer verifiedU()

	for {
		select {
		case <-heartbeat.C:
			err = sendMessageToSign()
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-expiry.C:
			err := stream.Send(&proto.SignInProgress{
				Step: &proto.SignInProgress_Expired{
					Expired: &proto.SignInVerificationExpired{},
				},
			})
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			return nil
		case <-onVerified:
			err = sendCompleted()
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			return nil
		case <-stream.Context().Done():
			return nil
		}
	}
}

func (s *grpcServer) VerifySignInSignature(ctx context.Context, r *proto.VerifySignInSignatureRequest) (*proto.SignInResponse, error) {
	signatureBytes, err := hex.DecodeString(r.SignatureHex)
	if err != nil || len(signatureBytes) == 0 {
		return nil, status.Error(codes.InvalidArgument, "invalid signature")
	}

	process, ok := s.signInProcesses.Get(r.ProcessId)
	if !ok {
		return nil, status.Error(codes.NotFound, "process not found")
	}

	err = s.verifySignature(ctx, process, signatureBytes, "grpc_method")
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.SignInResponse{
		AuthToken:       process.jwtToken,
		TokenExpiration: timestamppb.New(process.tokenExpiry),
	}, nil
}

func (s *grpcServer) VerifySignature(ctx context.Context, processID string, signature []byte, submissionMethod string) error {
	process, ok := s.signInProcesses.Get(processID)
	if !ok {
		return stacktrace.NewError("process not found")
	}

	err := s.verifySignature(ctx, process, signature, submissionMethod)
	return stacktrace.Propagate(err, "")
}

func (s *grpcServer) verifySignature(ctxCtx context.Context, process *signInProcess, signature []byte, submissionMethod string) error {
	valid, err := bananomessagesigning.VerifyMessage(process.rewardsAddress, []byte(process.messageToSign), signature)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	if !valid {
		return stacktrace.NewError("invalid signature")
	}

	err = auth.RecordAuthEvent(ctxCtx, process.rewardsAddress, types.AuthReasonSignIn, struct {
		ProcessID     string `json:"process_id"`
		RemoteAddress string `json:"remote_address"`
		ClaimsSeason  int    `json:"claims_season"`
	}{
		ProcessID:     process.id,
		RemoteAddress: process.remoteAddress,
		ClaimsSeason:  process.tokenSeason,
	}, types.AuthMethodAccountSignature, struct {
		SignedMessage    string `json:"signed_message"`
		Signature        string `json:"signature"`
		SubmissionMethod string `json:"submission_method"`
	}{
		SignedMessage:    process.messageToSign,
		Signature:        hex.EncodeToString(signature),
		SubmissionMethod: submissionMethod,
	})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	process.completed = true
	process.verified.Notify(false)

	s.log.Println(process.rewardsAddress, "completed SignIn process via message signing with remote address", process.remoteAddress)
	return nil
}

func (s *grpcServer) getProcessForSignInRequest(ctx context.Context, r *proto.SignInRequest) (*signInProcess, time.Time, error) {
	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)

	if r.OngoingProcessId != nil {
		existingProcess, processExpiry, hadExistingProcess := s.signInProcesses.GetWithExpiration(*r.OngoingProcessId)
		if hadExistingProcess && existingProcess.remoteAddress == remoteAddress && existingProcess.signatureBased == r.ViaSignature {
			return existingProcess, processExpiry, nil
		}
	}

	_, _, _, ok, err := s.signInRateLimiter.Take(ctx, remoteAddress)
	if err != nil {
		return nil, time.Time{}, stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, time.Time{}, status.Errorf(codes.ResourceExhausted, "rate limit reached")
	}

	// validate reward address
	_, err = util.AddressToPubkey(r.RewardsAddress)
	if err != nil || r.RewardsAddress[:4] != "ban_" { // we must check for ban since AddressToPubkey accepts nano too
		return nil, time.Time{}, status.Errorf(codes.InvalidArgument, "invalid reward address")
	}

	process := &signInProcess{
		id:             uuid.NewV4().String(),
		remoteAddress:  remoteAddress,
		rewardsAddress: r.RewardsAddress,
		verified:       event.NewNoArg(),
	}

	finalPermissionLevel := auth.UserPermissionLevel
	overridingPermissionLevelForLab := false
	var moderatorName string
	if buildconfig.LAB {
		if r.LabSignInOptions == nil {
			return nil, time.Time{}, status.Errorf(codes.InvalidArgument, "missing lab sign in options in lab environment")
		}

		desiredLevel := auth.ParseAPIPermissionLevel(r.LabSignInOptions.DesiredPermissionLevel)
		if auth.PermissionLevelOrder[desiredLevel] < auth.PermissionLevelOrder[auth.UserPermissionLevel] {
			return nil, time.Time{}, status.Errorf(codes.InvalidArgument, "invalid desired permission level")
		}

		if auth.PermissionLevelOrder[desiredLevel] > auth.PermissionLevelOrder[auth.UserPermissionLevel] {
			if r.LabSignInOptions.Credential == nil || *r.LabSignInOptions.Credential != s.privilegedLabUserSecretKey {
				return nil, time.Time{}, status.Errorf(codes.PermissionDenied, "incorrect credential")
			}

			finalPermissionLevel = desiredLevel
			moderatorName = r.RewardsAddress[:14]
			overridingPermissionLevelForLab = true
		}
	} else if r.LabSignInOptions != nil {
		return nil, time.Time{}, status.Errorf(codes.InvalidArgument, "lab sign in options specified in non-lab environment")
	}

	user := authinterceptor.UserClaimsFromContext(ctx)
	if user != nil && auth.UserPermissionLevelIsAtLeast(user, auth.UserPermissionLevel) && !overridingPermissionLevelForLab {
		// keep permissions of authenticated user
		finalPermissionLevel = user.PermissionLevel()
		moderatorName = user.ModeratorName()
	}

	process.jwtToken, process.tokenExpiry, process.tokenSeason, err = s.jwtManager.Generate(ctx, r.RewardsAddress, finalPermissionLevel, moderatorName)
	if err != nil {
		return nil, time.Time{}, stacktrace.Propagate(err, "")
	}

	if r.ViaSignature {
		process.signatureBased = true
		process.messageToSign, err = s.produceMessageToSignForAuth(ctx, process.id, r.RewardsAddress)
		if err != nil {
			return nil, time.Time{}, stacktrace.Propagate(err, "")
		}
	} else {
		process.accountIndex = uint32(rand.Int31())
	}

	processExpiry := time.Now().Add(5 * time.Minute)
	s.signInProcesses.Set(process.id, process, 5*time.Minute)

	return process, processExpiry, nil
}

var escaper = strings.NewReplacer("9", "99", "-", "90", "_", "91")

func (s *grpcServer) produceMessageToSignForAuth(ctx context.Context, processID, rewardsAddress string) (string, error) {
	b := make([]byte, 16)
	_, err := cryptorand.Read(b)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	// we don't really use the nonce since auth processes are ephemeral, there is no way to use this message to replay anything
	// once the signature is submitted to JungleTV, an attacker has a 5 minute window where they might be able to use the process ID to obtain the auth token
	// however, obtaining the process ID requires a compromised wallet or browser (one which exfiltrates the "Request ID" in the signed message),
	// or a MITM between the user and JungleTV or between the user and the wallet,
	// at which point the attacker can likely simply obtain the auth token by sniffing the connection at the moment the token is delivered to the legitimate user.
	// after the 5 minutes pass, JungleTV doesn't recognize the process ID anymore, making the message plaintext and the signature worthless.
	// in short, preventing nonce reuse does not offer any relevant additional protection and it is present in the signed message just to comply with our approximation of EIP-4361.
	nonce := escaper.Replace(base64.RawURLEncoding.EncodeToString(b))[:12]
	issuedAt := time.Now().UTC().Round(time.Second).Format(time.RFC3339)
	return fmt.Sprintf(`%[1]s wants you to sign in with your Banano account:
%[2]s

I want to use this address to receive rewards and participate in JungleTV.
I agree to abide by the JungleTV Guidelines: %[1]s/guidelines

URI: %[1]s
Version: 1
Chain ID: 1919
Nonce: %[3]s
Issued At: %[4]s
Request ID: %[5]s`,
		s.websiteURL,
		rewardsAddress,
		nonce,
		issuedAt,
		processID), nil
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
		err := process.Consent(ctx, user, authinterceptor.RemoteAddressFromContext(ctx))
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	} else {
		process.Dissent()
	}

	return &proto.ConsentOrDissentToAuthorizationResponse{}, nil
}
