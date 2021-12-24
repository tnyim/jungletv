package server

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/oauth2"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) Connections(ctxCtx context.Context, r *proto.ConnectionsRequest) (*proto.ConnectionsResponse, error) {
	user := auth.UserClaimsFromContext(ctxCtx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	connections, err := types.GetConnectionsForRewardsAddress(ctx, user.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	protoConnections := make([]*proto.Connection, len(connections))

	for i := range connections {
		protoConnections[i] = &proto.Connection{
			Id:        connections[i].ID,
			Name:      connections[i].Name,
			CreatedAt: timestamppb.New(connections[i].CreatedAt),
		}
		switch connections[i].Service {
		case types.ConnectionServiceCryptomonKeys:
			protoConnections[i].Service = proto.ConnectionService_CRYPTOMONKEYS
		}
	}

	protoServiceInfos := make([]*proto.ServiceInfo, len(types.ConnectionServices))
	for i, service := range types.ConnectionServices {
		protoServiceInfos[i] = &proto.ServiceInfo{}
		switch service {
		case types.ConnectionServiceCryptomonKeys:
			protoServiceInfos[i].Service = proto.ConnectionService_CRYPTOMONKEYS
		}
		if max, hasMax := types.MaxConnectionsPerService[service]; hasMax {
			m := int32(max)
			protoServiceInfos[i].MaxConnections = &m
		}
	}

	return &proto.ConnectionsResponse{
		Connections:  protoConnections,
		ServiceInfos: protoServiceInfos,
	}, nil
}

type oauthStateData struct {
	Service    types.ConnectionService
	OnCallback func(context.Context, *oauth2.Token, *types.Connection) error
	User       User
}

func (s *grpcServer) CreateConnection(ctxCtx context.Context, r *proto.CreateConnectionRequest) (*proto.CreateConnectionResponse, error) {
	user := auth.UserClaimsFromContext(ctxCtx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	var service types.ConnectionService
	switch r.Service {
	case proto.ConnectionService_CRYPTOMONKEYS:
		service = types.ConnectionServiceCryptomonKeys
	default:
		return nil, status.Error(codes.InvalidArgument, "unknown service")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	existingConnections, err := types.GetConnectionsForServiceAndRewardsAddress(ctx, service, user.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if max, hasMax := types.MaxConnectionsPerService[service]; hasMax && len(existingConnections) >= max {
		return nil, status.Error(codes.FailedPrecondition, "maximum number of connections to this service reached")
	}

	oauthConfig, ok := s.oauthConfigs[service]
	if !ok {
		return nil, stacktrace.NewError("oauth config missing for specified service")
	}

	oauthState := uuid.NewV4().String()

	s.oauthStates.SetDefault(oauthState, oauthStateData{
		Service:    service,
		OnCallback: s.onCryptomonKeysCallback,
		User:       user,
	})

	return &proto.CreateConnectionResponse{
		AuthUrl: oauthConfig.AuthCodeURL(oauthState),
	}, nil
}

func (s *grpcServer) onCryptomonKeysCallback(ctx context.Context, token *oauth2.Token, connection *types.Connection) error {
	ctx, cancelFn := context.WithTimeout(ctx, 10*time.Second)
	defer cancelFn()

	req, err := http.NewRequest(http.MethodGet, "https://connect.cryptomonkeys.cc/accounts/api/v1/username/", nil)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	req = req.WithContext(ctx)
	req.Header.Add("Authorization", "Bearer "+token.AccessToken)

	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if response.StatusCode != http.StatusOK {
		return stacktrace.NewError("non-200 response when obtaining username")
	}

	defer response.Body.Close()

	type responseType struct {
		Success bool   `json:"success"`
		UID     int    `json:"uid"`
		User    string `json:"user"`
	}
	var responseData responseType
	err = json.NewDecoder(response.Body).Decode(&responseData)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if !responseData.Success {
		return stacktrace.NewError("non-success response when obtaining username")
	}

	connection.Name = responseData.User
	return nil
}

func (s *grpcServer) RemoveConnection(ctxCtx context.Context, r *proto.RemoveConnectionRequest) (*proto.RemoveConnectionResponse, error) {
	user := auth.UserClaimsFromContext(ctxCtx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	connections, err := types.GetConnectionWithIDs(ctx, []string{r.Id})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	connection, ok := connections[r.Id]
	if !ok || connection.RewardsAddress != user.Address() {
		return nil, status.Error(codes.NotFound, "connection not found")
	}

	err = connection.Delete(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.RemoveConnectionResponse{}, stacktrace.Propagate(ctx.Commit(), "")
}
