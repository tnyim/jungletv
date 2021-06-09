// package: jungletv
// file: jungletv.proto

import * as jungletv_pb from "./jungletv_pb";
import {grpc} from "@improbable-eng/grpc-web";

type JungleTVSignIn = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SignInRequest;
  readonly responseType: typeof jungletv_pb.SignInResponse;
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

export class JungleTV {
  static readonly serviceName: string;
  static readonly SignIn: JungleTVSignIn;
  static readonly EnqueueMedia: JungleTVEnqueueMedia;
  static readonly MonitorTicket: JungleTVMonitorTicket;
  static readonly ConsumeMedia: JungleTVConsumeMedia;
  static readonly MonitorQueue: JungleTVMonitorQueue;
  static readonly RewardInfo: JungleTVRewardInfo;
  static readonly ForciblyEnqueueTicket: JungleTVForciblyEnqueueTicket;
  static readonly RemoveQueueEntry: JungleTVRemoveQueueEntry;
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
  signIn(
    requestMessage: jungletv_pb.SignInRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SignInResponse|null) => void
  ): UnaryResponse;
  signIn(
    requestMessage: jungletv_pb.SignInRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SignInResponse|null) => void
  ): UnaryResponse;
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
}

