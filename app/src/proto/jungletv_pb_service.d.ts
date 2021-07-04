// package: jungletv
// file: jungletv.proto

import * as jungletv_pb from "./jungletv_pb";
import {grpc} from "@improbable-eng/grpc-web";

type JungleTVSignIn = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.SignInRequest;
  readonly responseType: typeof jungletv_pb.SignInProgress;
};

type JungleTVEnqueueMedia = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.EnqueueMediaRequest;
  readonly responseType: typeof jungletv_pb.EnqueueMediaResponse;
};

type JungleTVMonitorTicket = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.MonitorTicketRequest;
  readonly responseType: typeof jungletv_pb.EnqueueMediaTicket;
};

type JungleTVConsumeMedia = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.ConsumeMediaRequest;
  readonly responseType: typeof jungletv_pb.MediaConsumptionCheckpoint;
};

type JungleTVMonitorQueue = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.MonitorQueueRequest;
  readonly responseType: typeof jungletv_pb.Queue;
};

type JungleTVRewardInfo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RewardInfoRequest;
  readonly responseType: typeof jungletv_pb.RewardInfoResponse;
};

type JungleTVSubmitActivityChallenge = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SubmitActivityChallengeRequest;
  readonly responseType: typeof jungletv_pb.SubmitActivityChallengeResponse;
};

type JungleTVConsumeChat = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.ConsumeChatRequest;
  readonly responseType: typeof jungletv_pb.ChatUpdate;
};

type JungleTVSendChatMessage = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SendChatMessageRequest;
  readonly responseType: typeof jungletv_pb.SendChatMessageResponse;
};

type JungleTVSubmitProofOfWork = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SubmitProofOfWorkRequest;
  readonly responseType: typeof jungletv_pb.SubmitProofOfWorkResponse;
};

type JungleTVUserPermissionLevel = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserPermissionLevelRequest;
  readonly responseType: typeof jungletv_pb.UserPermissionLevelResponse;
};

type JungleTVForciblyEnqueueTicket = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ForciblyEnqueueTicketRequest;
  readonly responseType: typeof jungletv_pb.ForciblyEnqueueTicketResponse;
};

type JungleTVRemoveQueueEntry = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveQueueEntryRequest;
  readonly responseType: typeof jungletv_pb.RemoveQueueEntryResponse;
};

type JungleTVRemoveChatMessage = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveChatMessageRequest;
  readonly responseType: typeof jungletv_pb.RemoveChatMessageResponse;
};

type JungleTVSetChatSettings = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetChatSettingsRequest;
  readonly responseType: typeof jungletv_pb.SetChatSettingsResponse;
};

type JungleTVSetVideoEnqueuingEnabled = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetVideoEnqueuingEnabledRequest;
  readonly responseType: typeof jungletv_pb.SetVideoEnqueuingEnabledResponse;
};

type JungleTVBanUser = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.BanUserRequest;
  readonly responseType: typeof jungletv_pb.BanUserResponse;
};

type JungleTVRemoveBan = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveBanRequest;
  readonly responseType: typeof jungletv_pb.RemoveBanResponse;
};

export class JungleTV {
  static readonly serviceName: string;
  static readonly SignIn: JungleTVSignIn;
  static readonly EnqueueMedia: JungleTVEnqueueMedia;
  static readonly MonitorTicket: JungleTVMonitorTicket;
  static readonly ConsumeMedia: JungleTVConsumeMedia;
  static readonly MonitorQueue: JungleTVMonitorQueue;
  static readonly RewardInfo: JungleTVRewardInfo;
  static readonly SubmitActivityChallenge: JungleTVSubmitActivityChallenge;
  static readonly ConsumeChat: JungleTVConsumeChat;
  static readonly SendChatMessage: JungleTVSendChatMessage;
  static readonly SubmitProofOfWork: JungleTVSubmitProofOfWork;
  static readonly UserPermissionLevel: JungleTVUserPermissionLevel;
  static readonly ForciblyEnqueueTicket: JungleTVForciblyEnqueueTicket;
  static readonly RemoveQueueEntry: JungleTVRemoveQueueEntry;
  static readonly RemoveChatMessage: JungleTVRemoveChatMessage;
  static readonly SetChatSettings: JungleTVSetChatSettings;
  static readonly SetVideoEnqueuingEnabled: JungleTVSetVideoEnqueuingEnabled;
  static readonly BanUser: JungleTVBanUser;
  static readonly RemoveBan: JungleTVRemoveBan;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class JungleTVClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  signIn(requestMessage: jungletv_pb.SignInRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.SignInProgress>;
  enqueueMedia(
    requestMessage: jungletv_pb.EnqueueMediaRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.EnqueueMediaResponse|null) => void
  ): UnaryResponse;
  enqueueMedia(
    requestMessage: jungletv_pb.EnqueueMediaRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.EnqueueMediaResponse|null) => void
  ): UnaryResponse;
  monitorTicket(requestMessage: jungletv_pb.MonitorTicketRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.EnqueueMediaTicket>;
  consumeMedia(requestMessage: jungletv_pb.ConsumeMediaRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.MediaConsumptionCheckpoint>;
  monitorQueue(requestMessage: jungletv_pb.MonitorQueueRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.Queue>;
  rewardInfo(
    requestMessage: jungletv_pb.RewardInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardInfoResponse|null) => void
  ): UnaryResponse;
  rewardInfo(
    requestMessage: jungletv_pb.RewardInfoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardInfoResponse|null) => void
  ): UnaryResponse;
  submitActivityChallenge(
    requestMessage: jungletv_pb.SubmitActivityChallengeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SubmitActivityChallengeResponse|null) => void
  ): UnaryResponse;
  submitActivityChallenge(
    requestMessage: jungletv_pb.SubmitActivityChallengeRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SubmitActivityChallengeResponse|null) => void
  ): UnaryResponse;
  consumeChat(requestMessage: jungletv_pb.ConsumeChatRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.ChatUpdate>;
  sendChatMessage(
    requestMessage: jungletv_pb.SendChatMessageRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SendChatMessageResponse|null) => void
  ): UnaryResponse;
  sendChatMessage(
    requestMessage: jungletv_pb.SendChatMessageRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SendChatMessageResponse|null) => void
  ): UnaryResponse;
  submitProofOfWork(
    requestMessage: jungletv_pb.SubmitProofOfWorkRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SubmitProofOfWorkResponse|null) => void
  ): UnaryResponse;
  submitProofOfWork(
    requestMessage: jungletv_pb.SubmitProofOfWorkRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SubmitProofOfWorkResponse|null) => void
  ): UnaryResponse;
  userPermissionLevel(
    requestMessage: jungletv_pb.UserPermissionLevelRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserPermissionLevelResponse|null) => void
  ): UnaryResponse;
  userPermissionLevel(
    requestMessage: jungletv_pb.UserPermissionLevelRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserPermissionLevelResponse|null) => void
  ): UnaryResponse;
  forciblyEnqueueTicket(
    requestMessage: jungletv_pb.ForciblyEnqueueTicketRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ForciblyEnqueueTicketResponse|null) => void
  ): UnaryResponse;
  forciblyEnqueueTicket(
    requestMessage: jungletv_pb.ForciblyEnqueueTicketRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ForciblyEnqueueTicketResponse|null) => void
  ): UnaryResponse;
  removeQueueEntry(
    requestMessage: jungletv_pb.RemoveQueueEntryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveQueueEntryResponse|null) => void
  ): UnaryResponse;
  removeQueueEntry(
    requestMessage: jungletv_pb.RemoveQueueEntryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveQueueEntryResponse|null) => void
  ): UnaryResponse;
  removeChatMessage(
    requestMessage: jungletv_pb.RemoveChatMessageRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveChatMessageResponse|null) => void
  ): UnaryResponse;
  removeChatMessage(
    requestMessage: jungletv_pb.RemoveChatMessageRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveChatMessageResponse|null) => void
  ): UnaryResponse;
  setChatSettings(
    requestMessage: jungletv_pb.SetChatSettingsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatSettingsResponse|null) => void
  ): UnaryResponse;
  setChatSettings(
    requestMessage: jungletv_pb.SetChatSettingsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatSettingsResponse|null) => void
  ): UnaryResponse;
  setVideoEnqueuingEnabled(
    requestMessage: jungletv_pb.SetVideoEnqueuingEnabledRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetVideoEnqueuingEnabledResponse|null) => void
  ): UnaryResponse;
  setVideoEnqueuingEnabled(
    requestMessage: jungletv_pb.SetVideoEnqueuingEnabledRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetVideoEnqueuingEnabledResponse|null) => void
  ): UnaryResponse;
  banUser(
    requestMessage: jungletv_pb.BanUserRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BanUserResponse|null) => void
  ): UnaryResponse;
  banUser(
    requestMessage: jungletv_pb.BanUserRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BanUserResponse|null) => void
  ): UnaryResponse;
  removeBan(
    requestMessage: jungletv_pb.RemoveBanRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveBanResponse|null) => void
  ): UnaryResponse;
  removeBan(
    requestMessage: jungletv_pb.RemoveBanRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveBanResponse|null) => void
  ): UnaryResponse;
}

