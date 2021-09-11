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

type JungleTVRemoveOwnQueueEntry = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveOwnQueueEntryRequest;
  readonly responseType: typeof jungletv_pb.RemoveOwnQueueEntryResponse;
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

type JungleTVUserPermissionLevel = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserPermissionLevelRequest;
  readonly responseType: typeof jungletv_pb.UserPermissionLevelResponse;
};

type JungleTVGetDocument = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.GetDocumentRequest;
  readonly responseType: typeof jungletv_pb.Document;
};

type JungleTVSetChatNickname = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetChatNicknameRequest;
  readonly responseType: typeof jungletv_pb.SetChatNicknameResponse;
};

type JungleTVWithdraw = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.WithdrawRequest;
  readonly responseType: typeof jungletv_pb.WithdrawResponse;
};

type JungleTVLeaderboards = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.LeaderboardsRequest;
  readonly responseType: typeof jungletv_pb.LeaderboardsResponse;
};

type JungleTVRewardHistory = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RewardHistoryRequest;
  readonly responseType: typeof jungletv_pb.RewardHistoryResponse;
};

type JungleTVWithdrawalHistory = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.WithdrawalHistoryRequest;
  readonly responseType: typeof jungletv_pb.WithdrawalHistoryResponse;
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

type JungleTVUserChatMessages = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserChatMessagesRequest;
  readonly responseType: typeof jungletv_pb.UserChatMessagesResponse;
};

type JungleTVDisallowedVideos = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.DisallowedVideosRequest;
  readonly responseType: typeof jungletv_pb.DisallowedVideosResponse;
};

type JungleTVAddDisallowedVideo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.AddDisallowedVideoRequest;
  readonly responseType: typeof jungletv_pb.AddDisallowedVideoResponse;
};

type JungleTVRemoveDisallowedVideo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveDisallowedVideoRequest;
  readonly responseType: typeof jungletv_pb.RemoveDisallowedVideoResponse;
};

type JungleTVUpdateDocument = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.Document;
  readonly responseType: typeof jungletv_pb.UpdateDocumentResponse;
};

type JungleTVSetUserChatNickname = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetUserChatNicknameRequest;
  readonly responseType: typeof jungletv_pb.SetUserChatNicknameResponse;
};

type JungleTVSetPricesMultiplier = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetPricesMultiplierRequest;
  readonly responseType: typeof jungletv_pb.SetPricesMultiplierResponse;
};

export class JungleTV {
  static readonly serviceName: string;
  static readonly SignIn: JungleTVSignIn;
  static readonly EnqueueMedia: JungleTVEnqueueMedia;
  static readonly RemoveOwnQueueEntry: JungleTVRemoveOwnQueueEntry;
  static readonly MonitorTicket: JungleTVMonitorTicket;
  static readonly ConsumeMedia: JungleTVConsumeMedia;
  static readonly MonitorQueue: JungleTVMonitorQueue;
  static readonly RewardInfo: JungleTVRewardInfo;
  static readonly SubmitActivityChallenge: JungleTVSubmitActivityChallenge;
  static readonly ConsumeChat: JungleTVConsumeChat;
  static readonly SendChatMessage: JungleTVSendChatMessage;
  static readonly UserPermissionLevel: JungleTVUserPermissionLevel;
  static readonly GetDocument: JungleTVGetDocument;
  static readonly SetChatNickname: JungleTVSetChatNickname;
  static readonly Withdraw: JungleTVWithdraw;
  static readonly Leaderboards: JungleTVLeaderboards;
  static readonly RewardHistory: JungleTVRewardHistory;
  static readonly WithdrawalHistory: JungleTVWithdrawalHistory;
  static readonly ForciblyEnqueueTicket: JungleTVForciblyEnqueueTicket;
  static readonly RemoveQueueEntry: JungleTVRemoveQueueEntry;
  static readonly RemoveChatMessage: JungleTVRemoveChatMessage;
  static readonly SetChatSettings: JungleTVSetChatSettings;
  static readonly SetVideoEnqueuingEnabled: JungleTVSetVideoEnqueuingEnabled;
  static readonly BanUser: JungleTVBanUser;
  static readonly RemoveBan: JungleTVRemoveBan;
  static readonly UserChatMessages: JungleTVUserChatMessages;
  static readonly DisallowedVideos: JungleTVDisallowedVideos;
  static readonly AddDisallowedVideo: JungleTVAddDisallowedVideo;
  static readonly RemoveDisallowedVideo: JungleTVRemoveDisallowedVideo;
  static readonly UpdateDocument: JungleTVUpdateDocument;
  static readonly SetUserChatNickname: JungleTVSetUserChatNickname;
  static readonly SetPricesMultiplier: JungleTVSetPricesMultiplier;
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
  removeOwnQueueEntry(
    requestMessage: jungletv_pb.RemoveOwnQueueEntryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveOwnQueueEntryResponse|null) => void
  ): UnaryResponse;
  removeOwnQueueEntry(
    requestMessage: jungletv_pb.RemoveOwnQueueEntryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveOwnQueueEntryResponse|null) => void
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
  userPermissionLevel(
    requestMessage: jungletv_pb.UserPermissionLevelRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserPermissionLevelResponse|null) => void
  ): UnaryResponse;
  userPermissionLevel(
    requestMessage: jungletv_pb.UserPermissionLevelRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserPermissionLevelResponse|null) => void
  ): UnaryResponse;
  getDocument(
    requestMessage: jungletv_pb.GetDocumentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.Document|null) => void
  ): UnaryResponse;
  getDocument(
    requestMessage: jungletv_pb.GetDocumentRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.Document|null) => void
  ): UnaryResponse;
  setChatNickname(
    requestMessage: jungletv_pb.SetChatNicknameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatNicknameResponse|null) => void
  ): UnaryResponse;
  setChatNickname(
    requestMessage: jungletv_pb.SetChatNicknameRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatNicknameResponse|null) => void
  ): UnaryResponse;
  withdraw(
    requestMessage: jungletv_pb.WithdrawRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawResponse|null) => void
  ): UnaryResponse;
  withdraw(
    requestMessage: jungletv_pb.WithdrawRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawResponse|null) => void
  ): UnaryResponse;
  leaderboards(
    requestMessage: jungletv_pb.LeaderboardsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.LeaderboardsResponse|null) => void
  ): UnaryResponse;
  leaderboards(
    requestMessage: jungletv_pb.LeaderboardsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.LeaderboardsResponse|null) => void
  ): UnaryResponse;
  rewardHistory(
    requestMessage: jungletv_pb.RewardHistoryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardHistoryResponse|null) => void
  ): UnaryResponse;
  rewardHistory(
    requestMessage: jungletv_pb.RewardHistoryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardHistoryResponse|null) => void
  ): UnaryResponse;
  withdrawalHistory(
    requestMessage: jungletv_pb.WithdrawalHistoryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawalHistoryResponse|null) => void
  ): UnaryResponse;
  withdrawalHistory(
    requestMessage: jungletv_pb.WithdrawalHistoryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawalHistoryResponse|null) => void
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
  userChatMessages(
    requestMessage: jungletv_pb.UserChatMessagesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserChatMessagesResponse|null) => void
  ): UnaryResponse;
  userChatMessages(
    requestMessage: jungletv_pb.UserChatMessagesRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserChatMessagesResponse|null) => void
  ): UnaryResponse;
  disallowedVideos(
    requestMessage: jungletv_pb.DisallowedVideosRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.DisallowedVideosResponse|null) => void
  ): UnaryResponse;
  disallowedVideos(
    requestMessage: jungletv_pb.DisallowedVideosRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.DisallowedVideosResponse|null) => void
  ): UnaryResponse;
  addDisallowedVideo(
    requestMessage: jungletv_pb.AddDisallowedVideoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.AddDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  addDisallowedVideo(
    requestMessage: jungletv_pb.AddDisallowedVideoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.AddDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  removeDisallowedVideo(
    requestMessage: jungletv_pb.RemoveDisallowedVideoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  removeDisallowedVideo(
    requestMessage: jungletv_pb.RemoveDisallowedVideoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  updateDocument(
    requestMessage: jungletv_pb.Document,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UpdateDocumentResponse|null) => void
  ): UnaryResponse;
  updateDocument(
    requestMessage: jungletv_pb.Document,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UpdateDocumentResponse|null) => void
  ): UnaryResponse;
  setUserChatNickname(
    requestMessage: jungletv_pb.SetUserChatNicknameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetUserChatNicknameResponse|null) => void
  ): UnaryResponse;
  setUserChatNickname(
    requestMessage: jungletv_pb.SetUserChatNicknameRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetUserChatNicknameResponse|null) => void
  ): UnaryResponse;
  setPricesMultiplier(
    requestMessage: jungletv_pb.SetPricesMultiplierRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetPricesMultiplierResponse|null) => void
  ): UnaryResponse;
  setPricesMultiplier(
    requestMessage: jungletv_pb.SetPricesMultiplierRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetPricesMultiplierResponse|null) => void
  ): UnaryResponse;
}

