// package: jungletv
// file: jungletv.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";

export class PaginationParameters extends jspb.Message {
  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaginationParameters.AsObject;
  static toObject(includeInstance: boolean, msg: PaginationParameters): PaginationParameters.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PaginationParameters, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaginationParameters;
  static deserializeBinaryFromReader(message: PaginationParameters, reader: jspb.BinaryReader): PaginationParameters;
}

export namespace PaginationParameters {
  export type AsObject = {
    offset: number,
    limit: number,
  }
}

export class SignInRequest extends jspb.Message {
  getRewardAddress(): string;
  setRewardAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignInRequest): SignInRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInRequest;
  static deserializeBinaryFromReader(message: SignInRequest, reader: jspb.BinaryReader): SignInRequest;
}

export namespace SignInRequest {
  export type AsObject = {
    rewardAddress: string,
  }
}

export class SignInProgress extends jspb.Message {
  hasVerification(): boolean;
  clearVerification(): void;
  getVerification(): SignInVerification | undefined;
  setVerification(value?: SignInVerification): void;

  hasResponse(): boolean;
  clearResponse(): void;
  getResponse(): SignInResponse | undefined;
  setResponse(value?: SignInResponse): void;

  hasExpired(): boolean;
  clearExpired(): void;
  getExpired(): SignInVerificationExpired | undefined;
  setExpired(value?: SignInVerificationExpired): void;

  hasAccountUnopened(): boolean;
  clearAccountUnopened(): void;
  getAccountUnopened(): SignInAccountUnopened | undefined;
  setAccountUnopened(value?: SignInAccountUnopened): void;

  getStepCase(): SignInProgress.StepCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInProgress.AsObject;
  static toObject(includeInstance: boolean, msg: SignInProgress): SignInProgress.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInProgress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInProgress;
  static deserializeBinaryFromReader(message: SignInProgress, reader: jspb.BinaryReader): SignInProgress;
}

export namespace SignInProgress {
  export type AsObject = {
    verification?: SignInVerification.AsObject,
    response?: SignInResponse.AsObject,
    expired?: SignInVerificationExpired.AsObject,
    accountUnopened?: SignInAccountUnopened.AsObject,
  }

  export enum StepCase {
    STEP_NOT_SET = 0,
    VERIFICATION = 1,
    RESPONSE = 2,
    EXPIRED = 3,
    ACCOUNT_UNOPENED = 4,
  }
}

export class SignInVerification extends jspb.Message {
  getVerificationRepresentativeAddress(): string;
  setVerificationRepresentativeAddress(value: string): void;

  hasExpiration(): boolean;
  clearExpiration(): void;
  getExpiration(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiration(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInVerification.AsObject;
  static toObject(includeInstance: boolean, msg: SignInVerification): SignInVerification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInVerification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInVerification;
  static deserializeBinaryFromReader(message: SignInVerification, reader: jspb.BinaryReader): SignInVerification;
}

export namespace SignInVerification {
  export type AsObject = {
    verificationRepresentativeAddress: string,
    expiration?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class SignInAccountUnopened extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInAccountUnopened.AsObject;
  static toObject(includeInstance: boolean, msg: SignInAccountUnopened): SignInAccountUnopened.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInAccountUnopened, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInAccountUnopened;
  static deserializeBinaryFromReader(message: SignInAccountUnopened, reader: jspb.BinaryReader): SignInAccountUnopened;
}

export namespace SignInAccountUnopened {
  export type AsObject = {
  }
}

export class SignInResponse extends jspb.Message {
  getAuthToken(): string;
  setAuthToken(value: string): void;

  hasTokenExpiration(): boolean;
  clearTokenExpiration(): void;
  getTokenExpiration(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTokenExpiration(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SignInResponse): SignInResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInResponse;
  static deserializeBinaryFromReader(message: SignInResponse, reader: jspb.BinaryReader): SignInResponse;
}

export namespace SignInResponse {
  export type AsObject = {
    authToken: string,
    tokenExpiration?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class SignInVerificationExpired extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInVerificationExpired.AsObject;
  static toObject(includeInstance: boolean, msg: SignInVerificationExpired): SignInVerificationExpired.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInVerificationExpired, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInVerificationExpired;
  static deserializeBinaryFromReader(message: SignInVerificationExpired, reader: jspb.BinaryReader): SignInVerificationExpired;
}

export namespace SignInVerificationExpired {
  export type AsObject = {
  }
}

export class EnqueueYouTubeVideoData extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueYouTubeVideoData.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueYouTubeVideoData): EnqueueYouTubeVideoData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueYouTubeVideoData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueYouTubeVideoData;
  static deserializeBinaryFromReader(message: EnqueueYouTubeVideoData, reader: jspb.BinaryReader): EnqueueYouTubeVideoData;
}

export namespace EnqueueYouTubeVideoData {
  export type AsObject = {
    id: string,
  }
}

export class EnqueueStubData extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueStubData.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueStubData): EnqueueStubData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueStubData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueStubData;
  static deserializeBinaryFromReader(message: EnqueueStubData, reader: jspb.BinaryReader): EnqueueStubData;
}

export namespace EnqueueStubData {
  export type AsObject = {
  }
}

export class EnqueueMediaRequest extends jspb.Message {
  getUnskippable(): boolean;
  setUnskippable(value: boolean): void;

  hasStubData(): boolean;
  clearStubData(): void;
  getStubData(): EnqueueStubData | undefined;
  setStubData(value?: EnqueueStubData): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): EnqueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: EnqueueYouTubeVideoData): void;

  getMediaInfoCase(): EnqueueMediaRequest.MediaInfoCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueMediaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueMediaRequest): EnqueueMediaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueMediaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueMediaRequest;
  static deserializeBinaryFromReader(message: EnqueueMediaRequest, reader: jspb.BinaryReader): EnqueueMediaRequest;
}

export namespace EnqueueMediaRequest {
  export type AsObject = {
    unskippable: boolean,
    stubData?: EnqueueStubData.AsObject,
    youtubeVideoData?: EnqueueYouTubeVideoData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    STUB_DATA = 2,
    YOUTUBE_VIDEO_DATA = 3,
  }
}

export class EnqueueMediaResponse extends jspb.Message {
  hasTicket(): boolean;
  clearTicket(): void;
  getTicket(): EnqueueMediaTicket | undefined;
  setTicket(value?: EnqueueMediaTicket): void;

  hasFailure(): boolean;
  clearFailure(): void;
  getFailure(): EnqueueMediaFailure | undefined;
  setFailure(value?: EnqueueMediaFailure): void;

  getEnqueueResponseCase(): EnqueueMediaResponse.EnqueueResponseCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueMediaResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueMediaResponse): EnqueueMediaResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueMediaResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueMediaResponse;
  static deserializeBinaryFromReader(message: EnqueueMediaResponse, reader: jspb.BinaryReader): EnqueueMediaResponse;
}

export namespace EnqueueMediaResponse {
  export type AsObject = {
    ticket?: EnqueueMediaTicket.AsObject,
    failure?: EnqueueMediaFailure.AsObject,
  }

  export enum EnqueueResponseCase {
    ENQUEUE_RESPONSE_NOT_SET = 0,
    TICKET = 1,
    FAILURE = 2,
  }
}

export class EnqueueMediaFailure extends jspb.Message {
  getFailureReason(): string;
  setFailureReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueMediaFailure.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueMediaFailure): EnqueueMediaFailure.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueMediaFailure, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueMediaFailure;
  static deserializeBinaryFromReader(message: EnqueueMediaFailure, reader: jspb.BinaryReader): EnqueueMediaFailure;
}

export namespace EnqueueMediaFailure {
  export type AsObject = {
    failureReason: string,
  }
}

export class EnqueueMediaTicket extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getStatus(): EnqueueMediaTicketStatusMap[keyof EnqueueMediaTicketStatusMap];
  setStatus(value: EnqueueMediaTicketStatusMap[keyof EnqueueMediaTicketStatusMap]): void;

  getPaymentAddress(): string;
  setPaymentAddress(value: string): void;

  getEnqueuePrice(): string;
  setEnqueuePrice(value: string): void;

  getPlayNextPrice(): string;
  setPlayNextPrice(value: string): void;

  getPlayNowPrice(): string;
  setPlayNowPrice(value: string): void;

  hasExpiration(): boolean;
  clearExpiration(): void;
  getExpiration(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiration(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getUnskippable(): boolean;
  setUnskippable(value: boolean): void;

  getCurrentlyPlayingIsUnskippable(): boolean;
  setCurrentlyPlayingIsUnskippable(value: boolean): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): QueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: QueueYouTubeVideoData): void;

  getMediaInfoCase(): EnqueueMediaTicket.MediaInfoCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueMediaTicket.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueMediaTicket): EnqueueMediaTicket.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueMediaTicket, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueMediaTicket;
  static deserializeBinaryFromReader(message: EnqueueMediaTicket, reader: jspb.BinaryReader): EnqueueMediaTicket;
}

export namespace EnqueueMediaTicket {
  export type AsObject = {
    id: string,
    status: EnqueueMediaTicketStatusMap[keyof EnqueueMediaTicketStatusMap],
    paymentAddress: string,
    enqueuePrice: string,
    playNextPrice: string,
    playNowPrice: string,
    expiration?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    unskippable: boolean,
    currentlyPlayingIsUnskippable: boolean,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 10,
  }
}

export class MonitorTicketRequest extends jspb.Message {
  getTicketId(): string;
  setTicketId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonitorTicketRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MonitorTicketRequest): MonitorTicketRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MonitorTicketRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonitorTicketRequest;
  static deserializeBinaryFromReader(message: MonitorTicketRequest, reader: jspb.BinaryReader): MonitorTicketRequest;
}

export namespace MonitorTicketRequest {
  export type AsObject = {
    ticketId: string,
  }
}

export class ConsumeMediaRequest extends jspb.Message {
  getParticipateInPow(): boolean;
  setParticipateInPow(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsumeMediaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConsumeMediaRequest): ConsumeMediaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsumeMediaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsumeMediaRequest;
  static deserializeBinaryFromReader(message: ConsumeMediaRequest, reader: jspb.BinaryReader): ConsumeMediaRequest;
}

export namespace ConsumeMediaRequest {
  export type AsObject = {
    participateInPow: boolean,
  }
}

export class NowPlayingStubData extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NowPlayingStubData.AsObject;
  static toObject(includeInstance: boolean, msg: NowPlayingStubData): NowPlayingStubData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NowPlayingStubData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NowPlayingStubData;
  static deserializeBinaryFromReader(message: NowPlayingStubData, reader: jspb.BinaryReader): NowPlayingStubData;
}

export namespace NowPlayingStubData {
  export type AsObject = {
  }
}

export class NowPlayingYouTubeVideoData extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NowPlayingYouTubeVideoData.AsObject;
  static toObject(includeInstance: boolean, msg: NowPlayingYouTubeVideoData): NowPlayingYouTubeVideoData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NowPlayingYouTubeVideoData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NowPlayingYouTubeVideoData;
  static deserializeBinaryFromReader(message: NowPlayingYouTubeVideoData, reader: jspb.BinaryReader): NowPlayingYouTubeVideoData;
}

export namespace NowPlayingYouTubeVideoData {
  export type AsObject = {
    id: string,
  }
}

export class MediaConsumptionCheckpoint extends jspb.Message {
  getMediaPresent(): boolean;
  setMediaPresent(value: boolean): void;

  hasCurrentPosition(): boolean;
  clearCurrentPosition(): void;
  getCurrentPosition(): google_protobuf_duration_pb.Duration | undefined;
  setCurrentPosition(value?: google_protobuf_duration_pb.Duration): void;

  hasRequestedBy(): boolean;
  clearRequestedBy(): void;
  getRequestedBy(): User | undefined;
  setRequestedBy(value?: User): void;

  getRequestCost(): string;
  setRequestCost(value: string): void;

  getCurrentlyWatching(): number;
  setCurrentlyWatching(value: number): void;

  hasReward(): boolean;
  clearReward(): void;
  getReward(): string;
  setReward(value: string): void;

  hasActivityChallenge(): boolean;
  clearActivityChallenge(): void;
  getActivityChallenge(): ActivityChallenge | undefined;
  setActivityChallenge(value?: ActivityChallenge): void;

  hasPowTask(): boolean;
  clearPowTask(): void;
  getPowTask(): ProofOfWorkTask | undefined;
  setPowTask(value?: ProofOfWorkTask): void;

  hasStubData(): boolean;
  clearStubData(): void;
  getStubData(): NowPlayingStubData | undefined;
  setStubData(value?: NowPlayingStubData): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): NowPlayingYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: NowPlayingYouTubeVideoData): void;

  getMediaInfoCase(): MediaConsumptionCheckpoint.MediaInfoCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MediaConsumptionCheckpoint.AsObject;
  static toObject(includeInstance: boolean, msg: MediaConsumptionCheckpoint): MediaConsumptionCheckpoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MediaConsumptionCheckpoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MediaConsumptionCheckpoint;
  static deserializeBinaryFromReader(message: MediaConsumptionCheckpoint, reader: jspb.BinaryReader): MediaConsumptionCheckpoint;
}

export namespace MediaConsumptionCheckpoint {
  export type AsObject = {
    mediaPresent: boolean,
    currentPosition?: google_protobuf_duration_pb.Duration.AsObject,
    requestedBy?: User.AsObject,
    requestCost: string,
    currentlyWatching: number,
    reward: string,
    activityChallenge?: ActivityChallenge.AsObject,
    powTask?: ProofOfWorkTask.AsObject,
    stubData?: NowPlayingStubData.AsObject,
    youtubeVideoData?: NowPlayingYouTubeVideoData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    STUB_DATA = 9,
    YOUTUBE_VIDEO_DATA = 10,
  }
}

export class ActivityChallenge extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getType(): string;
  setType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivityChallenge.AsObject;
  static toObject(includeInstance: boolean, msg: ActivityChallenge): ActivityChallenge.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ActivityChallenge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivityChallenge;
  static deserializeBinaryFromReader(message: ActivityChallenge, reader: jspb.BinaryReader): ActivityChallenge;
}

export namespace ActivityChallenge {
  export type AsObject = {
    id: string,
    type: string,
  }
}

export class ProofOfWorkTask extends jspb.Message {
  getTarget(): Uint8Array | string;
  getTarget_asU8(): Uint8Array;
  getTarget_asB64(): string;
  setTarget(value: Uint8Array | string): void;

  getPrevious(): Uint8Array | string;
  getPrevious_asU8(): Uint8Array;
  getPrevious_asB64(): string;
  setPrevious(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProofOfWorkTask.AsObject;
  static toObject(includeInstance: boolean, msg: ProofOfWorkTask): ProofOfWorkTask.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProofOfWorkTask, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProofOfWorkTask;
  static deserializeBinaryFromReader(message: ProofOfWorkTask, reader: jspb.BinaryReader): ProofOfWorkTask;
}

export namespace ProofOfWorkTask {
  export type AsObject = {
    target: Uint8Array | string,
    previous: Uint8Array | string,
  }
}

export class MonitorQueueRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonitorQueueRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MonitorQueueRequest): MonitorQueueRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MonitorQueueRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonitorQueueRequest;
  static deserializeBinaryFromReader(message: MonitorQueueRequest, reader: jspb.BinaryReader): MonitorQueueRequest;
}

export namespace MonitorQueueRequest {
  export type AsObject = {
  }
}

export class Queue extends jspb.Message {
  clearEntriesList(): void;
  getEntriesList(): Array<QueueEntry>;
  setEntriesList(value: Array<QueueEntry>): void;
  addEntries(value?: QueueEntry, index?: number): QueueEntry;

  getIsHeartbeat(): boolean;
  setIsHeartbeat(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Queue.AsObject;
  static toObject(includeInstance: boolean, msg: Queue): Queue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Queue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Queue;
  static deserializeBinaryFromReader(message: Queue, reader: jspb.BinaryReader): Queue;
}

export namespace Queue {
  export type AsObject = {
    entriesList: Array<QueueEntry.AsObject>,
    isHeartbeat: boolean,
  }
}

export class QueueYouTubeVideoData extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getThumbnailUrl(): string;
  setThumbnailUrl(value: string): void;

  getChannelTitle(): string;
  setChannelTitle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueueYouTubeVideoData.AsObject;
  static toObject(includeInstance: boolean, msg: QueueYouTubeVideoData): QueueYouTubeVideoData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QueueYouTubeVideoData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueueYouTubeVideoData;
  static deserializeBinaryFromReader(message: QueueYouTubeVideoData, reader: jspb.BinaryReader): QueueYouTubeVideoData;
}

export namespace QueueYouTubeVideoData {
  export type AsObject = {
    id: string,
    title: string,
    thumbnailUrl: string,
    channelTitle: string,
  }
}

export class QueueEntry extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasRequestedBy(): boolean;
  clearRequestedBy(): void;
  getRequestedBy(): User | undefined;
  setRequestedBy(value?: User): void;

  getRequestCost(): string;
  setRequestCost(value: string): void;

  hasLength(): boolean;
  clearLength(): void;
  getLength(): google_protobuf_duration_pb.Duration | undefined;
  setLength(value?: google_protobuf_duration_pb.Duration): void;

  getUnskippable(): boolean;
  setUnskippable(value: boolean): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): QueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: QueueYouTubeVideoData): void;

  getMediaInfoCase(): QueueEntry.MediaInfoCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueueEntry.AsObject;
  static toObject(includeInstance: boolean, msg: QueueEntry): QueueEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QueueEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueueEntry;
  static deserializeBinaryFromReader(message: QueueEntry, reader: jspb.BinaryReader): QueueEntry;
}

export namespace QueueEntry {
  export type AsObject = {
    id: string,
    requestedBy?: User.AsObject,
    requestCost: string,
    length?: google_protobuf_duration_pb.Duration.AsObject,
    unskippable: boolean,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 6,
  }
}

export class User extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  clearRolesList(): void;
  getRolesList(): Array<UserRoleMap[keyof UserRoleMap]>;
  setRolesList(value: Array<UserRoleMap[keyof UserRoleMap]>): void;
  addRoles(value: UserRoleMap[keyof UserRoleMap], index?: number): UserRoleMap[keyof UserRoleMap];

  hasNickname(): boolean;
  clearNickname(): void;
  getNickname(): string;
  setNickname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    address: string,
    rolesList: Array<UserRoleMap[keyof UserRoleMap]>,
    nickname: string,
  }
}

export class RewardInfoRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RewardInfoRequest): RewardInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RewardInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardInfoRequest;
  static deserializeBinaryFromReader(message: RewardInfoRequest, reader: jspb.BinaryReader): RewardInfoRequest;
}

export namespace RewardInfoRequest {
  export type AsObject = {
  }
}

export class RewardInfoResponse extends jspb.Message {
  getRewardAddress(): string;
  setRewardAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RewardInfoResponse): RewardInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RewardInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardInfoResponse;
  static deserializeBinaryFromReader(message: RewardInfoResponse, reader: jspb.BinaryReader): RewardInfoResponse;
}

export namespace RewardInfoResponse {
  export type AsObject = {
    rewardAddress: string,
  }
}

export class RemoveQueueEntryRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveQueueEntryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveQueueEntryRequest): RemoveQueueEntryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveQueueEntryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveQueueEntryRequest;
  static deserializeBinaryFromReader(message: RemoveQueueEntryRequest, reader: jspb.BinaryReader): RemoveQueueEntryRequest;
}

export namespace RemoveQueueEntryRequest {
  export type AsObject = {
    id: string,
  }
}

export class RemoveQueueEntryResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveQueueEntryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveQueueEntryResponse): RemoveQueueEntryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveQueueEntryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveQueueEntryResponse;
  static deserializeBinaryFromReader(message: RemoveQueueEntryResponse, reader: jspb.BinaryReader): RemoveQueueEntryResponse;
}

export namespace RemoveQueueEntryResponse {
  export type AsObject = {
  }
}

export class ForciblyEnqueueTicketRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getEnqueueType(): ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap];
  setEnqueueType(value: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ForciblyEnqueueTicketRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ForciblyEnqueueTicketRequest): ForciblyEnqueueTicketRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ForciblyEnqueueTicketRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ForciblyEnqueueTicketRequest;
  static deserializeBinaryFromReader(message: ForciblyEnqueueTicketRequest, reader: jspb.BinaryReader): ForciblyEnqueueTicketRequest;
}

export namespace ForciblyEnqueueTicketRequest {
  export type AsObject = {
    id: string,
    enqueueType: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap],
  }
}

export class ForciblyEnqueueTicketResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ForciblyEnqueueTicketResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ForciblyEnqueueTicketResponse): ForciblyEnqueueTicketResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ForciblyEnqueueTicketResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ForciblyEnqueueTicketResponse;
  static deserializeBinaryFromReader(message: ForciblyEnqueueTicketResponse, reader: jspb.BinaryReader): ForciblyEnqueueTicketResponse;
}

export namespace ForciblyEnqueueTicketResponse {
  export type AsObject = {
  }
}

export class SubmitActivityChallengeRequest extends jspb.Message {
  getChallenge(): string;
  setChallenge(value: string): void;

  getCaptchaResponse(): string;
  setCaptchaResponse(value: string): void;

  getTrusted(): boolean;
  setTrusted(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitActivityChallengeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitActivityChallengeRequest): SubmitActivityChallengeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitActivityChallengeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitActivityChallengeRequest;
  static deserializeBinaryFromReader(message: SubmitActivityChallengeRequest, reader: jspb.BinaryReader): SubmitActivityChallengeRequest;
}

export namespace SubmitActivityChallengeRequest {
  export type AsObject = {
    challenge: string,
    captchaResponse: string,
    trusted: boolean,
  }
}

export class SubmitActivityChallengeResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitActivityChallengeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitActivityChallengeResponse): SubmitActivityChallengeResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitActivityChallengeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitActivityChallengeResponse;
  static deserializeBinaryFromReader(message: SubmitActivityChallengeResponse, reader: jspb.BinaryReader): SubmitActivityChallengeResponse;
}

export namespace SubmitActivityChallengeResponse {
  export type AsObject = {
  }
}

export class ConsumeChatRequest extends jspb.Message {
  getInitialHistorySize(): number;
  setInitialHistorySize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsumeChatRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConsumeChatRequest): ConsumeChatRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsumeChatRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsumeChatRequest;
  static deserializeBinaryFromReader(message: ConsumeChatRequest, reader: jspb.BinaryReader): ConsumeChatRequest;
}

export namespace ConsumeChatRequest {
  export type AsObject = {
    initialHistorySize: number,
  }
}

export class ChatUpdate extends jspb.Message {
  hasDisabled(): boolean;
  clearDisabled(): void;
  getDisabled(): ChatDisabledEvent | undefined;
  setDisabled(value?: ChatDisabledEvent): void;

  hasEnabled(): boolean;
  clearEnabled(): void;
  getEnabled(): ChatEnabledEvent | undefined;
  setEnabled(value?: ChatEnabledEvent): void;

  hasMessageCreated(): boolean;
  clearMessageCreated(): void;
  getMessageCreated(): ChatMessageCreatedEvent | undefined;
  setMessageCreated(value?: ChatMessageCreatedEvent): void;

  hasMessageDeleted(): boolean;
  clearMessageDeleted(): void;
  getMessageDeleted(): ChatMessageDeletedEvent | undefined;
  setMessageDeleted(value?: ChatMessageDeletedEvent): void;

  hasHeartbeat(): boolean;
  clearHeartbeat(): void;
  getHeartbeat(): ChatHeartbeatEvent | undefined;
  setHeartbeat(value?: ChatHeartbeatEvent): void;

  getEventCase(): ChatUpdate.EventCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: ChatUpdate): ChatUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatUpdate;
  static deserializeBinaryFromReader(message: ChatUpdate, reader: jspb.BinaryReader): ChatUpdate;
}

export namespace ChatUpdate {
  export type AsObject = {
    disabled?: ChatDisabledEvent.AsObject,
    enabled?: ChatEnabledEvent.AsObject,
    messageCreated?: ChatMessageCreatedEvent.AsObject,
    messageDeleted?: ChatMessageDeletedEvent.AsObject,
    heartbeat?: ChatHeartbeatEvent.AsObject,
  }

  export enum EventCase {
    EVENT_NOT_SET = 0,
    DISABLED = 1,
    ENABLED = 2,
    MESSAGE_CREATED = 3,
    MESSAGE_DELETED = 4,
    HEARTBEAT = 5,
  }
}

export class ChatMessage extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasUserMessage(): boolean;
  clearUserMessage(): void;
  getUserMessage(): UserChatMessage | undefined;
  setUserMessage(value?: UserChatMessage): void;

  hasSystemMessage(): boolean;
  clearSystemMessage(): void;
  getSystemMessage(): SystemChatMessage | undefined;
  setSystemMessage(value?: SystemChatMessage): void;

  hasReference(): boolean;
  clearReference(): void;
  getReference(): ChatMessage | undefined;
  setReference(value?: ChatMessage): void;

  getMessageCase(): ChatMessage.MessageCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessage): ChatMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessage;
  static deserializeBinaryFromReader(message: ChatMessage, reader: jspb.BinaryReader): ChatMessage;
}

export namespace ChatMessage {
  export type AsObject = {
    id: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    userMessage?: UserChatMessage.AsObject,
    systemMessage?: SystemChatMessage.AsObject,
    reference?: ChatMessage.AsObject,
  }

  export enum MessageCase {
    MESSAGE_NOT_SET = 0,
    USER_MESSAGE = 3,
    SYSTEM_MESSAGE = 4,
  }
}

export class UserChatMessage extends jspb.Message {
  hasAuthor(): boolean;
  clearAuthor(): void;
  getAuthor(): User | undefined;
  setAuthor(value?: User): void;

  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserChatMessage.AsObject;
  static toObject(includeInstance: boolean, msg: UserChatMessage): UserChatMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserChatMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserChatMessage;
  static deserializeBinaryFromReader(message: UserChatMessage, reader: jspb.BinaryReader): UserChatMessage;
}

export namespace UserChatMessage {
  export type AsObject = {
    author?: User.AsObject,
    content: string,
  }
}

export class SystemChatMessage extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemChatMessage.AsObject;
  static toObject(includeInstance: boolean, msg: SystemChatMessage): SystemChatMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SystemChatMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemChatMessage;
  static deserializeBinaryFromReader(message: SystemChatMessage, reader: jspb.BinaryReader): SystemChatMessage;
}

export namespace SystemChatMessage {
  export type AsObject = {
    content: string,
  }
}

export class ChatDisabledEvent extends jspb.Message {
  getReason(): ChatDisabledReasonMap[keyof ChatDisabledReasonMap];
  setReason(value: ChatDisabledReasonMap[keyof ChatDisabledReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatDisabledEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatDisabledEvent): ChatDisabledEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatDisabledEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatDisabledEvent;
  static deserializeBinaryFromReader(message: ChatDisabledEvent, reader: jspb.BinaryReader): ChatDisabledEvent;
}

export namespace ChatDisabledEvent {
  export type AsObject = {
    reason: ChatDisabledReasonMap[keyof ChatDisabledReasonMap],
  }
}

export class ChatEnabledEvent extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatEnabledEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatEnabledEvent): ChatEnabledEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatEnabledEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatEnabledEvent;
  static deserializeBinaryFromReader(message: ChatEnabledEvent, reader: jspb.BinaryReader): ChatEnabledEvent;
}

export namespace ChatEnabledEvent {
  export type AsObject = {
  }
}

export class ChatMessageCreatedEvent extends jspb.Message {
  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): ChatMessage | undefined;
  setMessage(value?: ChatMessage): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessageCreatedEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessageCreatedEvent): ChatMessageCreatedEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessageCreatedEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessageCreatedEvent;
  static deserializeBinaryFromReader(message: ChatMessageCreatedEvent, reader: jspb.BinaryReader): ChatMessageCreatedEvent;
}

export namespace ChatMessageCreatedEvent {
  export type AsObject = {
    message?: ChatMessage.AsObject,
  }
}

export class ChatMessageDeletedEvent extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessageDeletedEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessageDeletedEvent): ChatMessageDeletedEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessageDeletedEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessageDeletedEvent;
  static deserializeBinaryFromReader(message: ChatMessageDeletedEvent, reader: jspb.BinaryReader): ChatMessageDeletedEvent;
}

export namespace ChatMessageDeletedEvent {
  export type AsObject = {
    id: string,
  }
}

export class ChatHeartbeatEvent extends jspb.Message {
  getSequence(): number;
  setSequence(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatHeartbeatEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatHeartbeatEvent): ChatHeartbeatEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatHeartbeatEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatHeartbeatEvent;
  static deserializeBinaryFromReader(message: ChatHeartbeatEvent, reader: jspb.BinaryReader): ChatHeartbeatEvent;
}

export namespace ChatHeartbeatEvent {
  export type AsObject = {
    sequence: number,
  }
}

export class SendChatMessageRequest extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  getTrusted(): boolean;
  setTrusted(value: boolean): void;

  hasReplyReferenceId(): boolean;
  clearReplyReferenceId(): void;
  getReplyReferenceId(): string;
  setReplyReferenceId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendChatMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendChatMessageRequest): SendChatMessageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendChatMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendChatMessageRequest;
  static deserializeBinaryFromReader(message: SendChatMessageRequest, reader: jspb.BinaryReader): SendChatMessageRequest;
}

export namespace SendChatMessageRequest {
  export type AsObject = {
    content: string,
    trusted: boolean,
    replyReferenceId: string,
  }
}

export class SendChatMessageResponse extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendChatMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendChatMessageResponse): SendChatMessageResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendChatMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendChatMessageResponse;
  static deserializeBinaryFromReader(message: SendChatMessageResponse, reader: jspb.BinaryReader): SendChatMessageResponse;
}

export namespace SendChatMessageResponse {
  export type AsObject = {
    id: number,
  }
}

export class RemoveChatMessageRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveChatMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveChatMessageRequest): RemoveChatMessageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveChatMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveChatMessageRequest;
  static deserializeBinaryFromReader(message: RemoveChatMessageRequest, reader: jspb.BinaryReader): RemoveChatMessageRequest;
}

export namespace RemoveChatMessageRequest {
  export type AsObject = {
    id: string,
  }
}

export class RemoveChatMessageResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveChatMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveChatMessageResponse): RemoveChatMessageResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveChatMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveChatMessageResponse;
  static deserializeBinaryFromReader(message: RemoveChatMessageResponse, reader: jspb.BinaryReader): RemoveChatMessageResponse;
}

export namespace RemoveChatMessageResponse {
  export type AsObject = {
  }
}

export class SetChatSettingsRequest extends jspb.Message {
  getEnabled(): boolean;
  setEnabled(value: boolean): void;

  getSlowmode(): boolean;
  setSlowmode(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetChatSettingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetChatSettingsRequest): SetChatSettingsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetChatSettingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetChatSettingsRequest;
  static deserializeBinaryFromReader(message: SetChatSettingsRequest, reader: jspb.BinaryReader): SetChatSettingsRequest;
}

export namespace SetChatSettingsRequest {
  export type AsObject = {
    enabled: boolean,
    slowmode: boolean,
  }
}

export class SetChatSettingsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetChatSettingsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetChatSettingsResponse): SetChatSettingsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetChatSettingsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetChatSettingsResponse;
  static deserializeBinaryFromReader(message: SetChatSettingsResponse, reader: jspb.BinaryReader): SetChatSettingsResponse;
}

export namespace SetChatSettingsResponse {
  export type AsObject = {
  }
}

export class BanUserRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getRemoteAddress(): string;
  setRemoteAddress(value: string): void;

  getChatBanned(): boolean;
  setChatBanned(value: boolean): void;

  getEnqueuingBanned(): boolean;
  setEnqueuingBanned(value: boolean): void;

  getRewardsBanned(): boolean;
  setRewardsBanned(value: boolean): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BanUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BanUserRequest): BanUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BanUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BanUserRequest;
  static deserializeBinaryFromReader(message: BanUserRequest, reader: jspb.BinaryReader): BanUserRequest;
}

export namespace BanUserRequest {
  export type AsObject = {
    address: string,
    remoteAddress: string,
    chatBanned: boolean,
    enqueuingBanned: boolean,
    rewardsBanned: boolean,
    reason: string,
  }
}

export class BanUserResponse extends jspb.Message {
  clearBanIdsList(): void;
  getBanIdsList(): Array<string>;
  setBanIdsList(value: Array<string>): void;
  addBanIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BanUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BanUserResponse): BanUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BanUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BanUserResponse;
  static deserializeBinaryFromReader(message: BanUserResponse, reader: jspb.BinaryReader): BanUserResponse;
}

export namespace BanUserResponse {
  export type AsObject = {
    banIdsList: Array<string>,
  }
}

export class RemoveBanRequest extends jspb.Message {
  getBanId(): string;
  setBanId(value: string): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveBanRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveBanRequest): RemoveBanRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveBanRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveBanRequest;
  static deserializeBinaryFromReader(message: RemoveBanRequest, reader: jspb.BinaryReader): RemoveBanRequest;
}

export namespace RemoveBanRequest {
  export type AsObject = {
    banId: string,
    reason: string,
  }
}

export class RemoveBanResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveBanResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveBanResponse): RemoveBanResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveBanResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveBanResponse;
  static deserializeBinaryFromReader(message: RemoveBanResponse, reader: jspb.BinaryReader): RemoveBanResponse;
}

export namespace RemoveBanResponse {
  export type AsObject = {
  }
}

export class SetVideoEnqueuingEnabledRequest extends jspb.Message {
  getAllowed(): AllowedVideoEnqueuingTypeMap[keyof AllowedVideoEnqueuingTypeMap];
  setAllowed(value: AllowedVideoEnqueuingTypeMap[keyof AllowedVideoEnqueuingTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetVideoEnqueuingEnabledRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetVideoEnqueuingEnabledRequest): SetVideoEnqueuingEnabledRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetVideoEnqueuingEnabledRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetVideoEnqueuingEnabledRequest;
  static deserializeBinaryFromReader(message: SetVideoEnqueuingEnabledRequest, reader: jspb.BinaryReader): SetVideoEnqueuingEnabledRequest;
}

export namespace SetVideoEnqueuingEnabledRequest {
  export type AsObject = {
    allowed: AllowedVideoEnqueuingTypeMap[keyof AllowedVideoEnqueuingTypeMap],
  }
}

export class SetVideoEnqueuingEnabledResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetVideoEnqueuingEnabledResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetVideoEnqueuingEnabledResponse): SetVideoEnqueuingEnabledResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetVideoEnqueuingEnabledResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetVideoEnqueuingEnabledResponse;
  static deserializeBinaryFromReader(message: SetVideoEnqueuingEnabledResponse, reader: jspb.BinaryReader): SetVideoEnqueuingEnabledResponse;
}

export namespace SetVideoEnqueuingEnabledResponse {
  export type AsObject = {
  }
}

export class UserChatMessagesRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getNumMessages(): number;
  setNumMessages(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserChatMessagesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserChatMessagesRequest): UserChatMessagesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserChatMessagesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserChatMessagesRequest;
  static deserializeBinaryFromReader(message: UserChatMessagesRequest, reader: jspb.BinaryReader): UserChatMessagesRequest;
}

export namespace UserChatMessagesRequest {
  export type AsObject = {
    address: string,
    numMessages: number,
  }
}

export class UserChatMessagesResponse extends jspb.Message {
  clearMessagesList(): void;
  getMessagesList(): Array<ChatMessage>;
  setMessagesList(value: Array<ChatMessage>): void;
  addMessages(value?: ChatMessage, index?: number): ChatMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserChatMessagesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserChatMessagesResponse): UserChatMessagesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserChatMessagesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserChatMessagesResponse;
  static deserializeBinaryFromReader(message: UserChatMessagesResponse, reader: jspb.BinaryReader): UserChatMessagesResponse;
}

export namespace UserChatMessagesResponse {
  export type AsObject = {
    messagesList: Array<ChatMessage.AsObject>,
  }
}

export class SubmitProofOfWorkRequest extends jspb.Message {
  getPrevious(): Uint8Array | string;
  getPrevious_asU8(): Uint8Array;
  getPrevious_asB64(): string;
  setPrevious(value: Uint8Array | string): void;

  getWork(): Uint8Array | string;
  getWork_asU8(): Uint8Array;
  getWork_asB64(): string;
  setWork(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitProofOfWorkRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitProofOfWorkRequest): SubmitProofOfWorkRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitProofOfWorkRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitProofOfWorkRequest;
  static deserializeBinaryFromReader(message: SubmitProofOfWorkRequest, reader: jspb.BinaryReader): SubmitProofOfWorkRequest;
}

export namespace SubmitProofOfWorkRequest {
  export type AsObject = {
    previous: Uint8Array | string,
    work: Uint8Array | string,
  }
}

export class SubmitProofOfWorkResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitProofOfWorkResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitProofOfWorkResponse): SubmitProofOfWorkResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitProofOfWorkResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitProofOfWorkResponse;
  static deserializeBinaryFromReader(message: SubmitProofOfWorkResponse, reader: jspb.BinaryReader): SubmitProofOfWorkResponse;
}

export namespace SubmitProofOfWorkResponse {
  export type AsObject = {
  }
}

export class UserPermissionLevelRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserPermissionLevelRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserPermissionLevelRequest): UserPermissionLevelRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserPermissionLevelRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserPermissionLevelRequest;
  static deserializeBinaryFromReader(message: UserPermissionLevelRequest, reader: jspb.BinaryReader): UserPermissionLevelRequest;
}

export namespace UserPermissionLevelRequest {
  export type AsObject = {
  }
}

export class UserPermissionLevelResponse extends jspb.Message {
  getPermissionLevel(): PermissionLevelMap[keyof PermissionLevelMap];
  setPermissionLevel(value: PermissionLevelMap[keyof PermissionLevelMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserPermissionLevelResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserPermissionLevelResponse): UserPermissionLevelResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserPermissionLevelResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserPermissionLevelResponse;
  static deserializeBinaryFromReader(message: UserPermissionLevelResponse, reader: jspb.BinaryReader): UserPermissionLevelResponse;
}

export namespace UserPermissionLevelResponse {
  export type AsObject = {
    permissionLevel: PermissionLevelMap[keyof PermissionLevelMap],
  }
}

export class DisallowedVideosRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): PaginationParameters | undefined;
  setPaginationParams(value?: PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedVideosRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedVideosRequest): DisallowedVideosRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedVideosRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedVideosRequest;
  static deserializeBinaryFromReader(message: DisallowedVideosRequest, reader: jspb.BinaryReader): DisallowedVideosRequest;
}

export namespace DisallowedVideosRequest {
  export type AsObject = {
    paginationParams?: PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class DisallowedVideo extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getDisallowedBy(): string;
  setDisallowedBy(value: string): void;

  hasDisallowedAt(): boolean;
  clearDisallowedAt(): void;
  getDisallowedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDisallowedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getYtVideoId(): string;
  setYtVideoId(value: string): void;

  getYtVideoTitle(): string;
  setYtVideoTitle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedVideo.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedVideo): DisallowedVideo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedVideo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedVideo;
  static deserializeBinaryFromReader(message: DisallowedVideo, reader: jspb.BinaryReader): DisallowedVideo;
}

export namespace DisallowedVideo {
  export type AsObject = {
    id: string,
    disallowedBy: string,
    disallowedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    ytVideoId: string,
    ytVideoTitle: string,
  }
}

export class DisallowedVideosResponse extends jspb.Message {
  clearDisallowedVideosList(): void;
  getDisallowedVideosList(): Array<DisallowedVideo>;
  setDisallowedVideosList(value: Array<DisallowedVideo>): void;
  addDisallowedVideos(value?: DisallowedVideo, index?: number): DisallowedVideo;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedVideosResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedVideosResponse): DisallowedVideosResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedVideosResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedVideosResponse;
  static deserializeBinaryFromReader(message: DisallowedVideosResponse, reader: jspb.BinaryReader): DisallowedVideosResponse;
}

export namespace DisallowedVideosResponse {
  export type AsObject = {
    disallowedVideosList: Array<DisallowedVideo.AsObject>,
    offset: number,
    total: number,
  }
}

export class AddDisallowedVideoRequest extends jspb.Message {
  getYtVideoId(): string;
  setYtVideoId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDisallowedVideoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddDisallowedVideoRequest): AddDisallowedVideoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDisallowedVideoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDisallowedVideoRequest;
  static deserializeBinaryFromReader(message: AddDisallowedVideoRequest, reader: jspb.BinaryReader): AddDisallowedVideoRequest;
}

export namespace AddDisallowedVideoRequest {
  export type AsObject = {
    ytVideoId: string,
  }
}

export class AddDisallowedVideoResponse extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDisallowedVideoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddDisallowedVideoResponse): AddDisallowedVideoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDisallowedVideoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDisallowedVideoResponse;
  static deserializeBinaryFromReader(message: AddDisallowedVideoResponse, reader: jspb.BinaryReader): AddDisallowedVideoResponse;
}

export namespace AddDisallowedVideoResponse {
  export type AsObject = {
    id: string,
  }
}

export class RemoveDisallowedVideoRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDisallowedVideoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDisallowedVideoRequest): RemoveDisallowedVideoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDisallowedVideoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDisallowedVideoRequest;
  static deserializeBinaryFromReader(message: RemoveDisallowedVideoRequest, reader: jspb.BinaryReader): RemoveDisallowedVideoRequest;
}

export namespace RemoveDisallowedVideoRequest {
  export type AsObject = {
    id: string,
  }
}

export class RemoveDisallowedVideoResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDisallowedVideoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDisallowedVideoResponse): RemoveDisallowedVideoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDisallowedVideoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDisallowedVideoResponse;
  static deserializeBinaryFromReader(message: RemoveDisallowedVideoResponse, reader: jspb.BinaryReader): RemoveDisallowedVideoResponse;
}

export namespace RemoveDisallowedVideoResponse {
  export type AsObject = {
  }
}

export class GetDocumentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDocumentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDocumentRequest): GetDocumentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDocumentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDocumentRequest;
  static deserializeBinaryFromReader(message: GetDocumentRequest, reader: jspb.BinaryReader): GetDocumentRequest;
}

export namespace GetDocumentRequest {
  export type AsObject = {
    id: string,
  }
}

export class Document extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getFormat(): string;
  setFormat(value: string): void;

  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Document.AsObject;
  static toObject(includeInstance: boolean, msg: Document): Document.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Document, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Document;
  static deserializeBinaryFromReader(message: Document, reader: jspb.BinaryReader): Document;
}

export namespace Document {
  export type AsObject = {
    id: string,
    format: string,
    content: string,
  }
}

export class UpdateDocumentResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateDocumentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateDocumentResponse): UpdateDocumentResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateDocumentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateDocumentResponse;
  static deserializeBinaryFromReader(message: UpdateDocumentResponse, reader: jspb.BinaryReader): UpdateDocumentResponse;
}

export namespace UpdateDocumentResponse {
  export type AsObject = {
  }
}

export class SetChatNicknameRequest extends jspb.Message {
  getNickname(): string;
  setNickname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetChatNicknameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetChatNicknameRequest): SetChatNicknameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetChatNicknameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetChatNicknameRequest;
  static deserializeBinaryFromReader(message: SetChatNicknameRequest, reader: jspb.BinaryReader): SetChatNicknameRequest;
}

export namespace SetChatNicknameRequest {
  export type AsObject = {
    nickname: string,
  }
}

export class SetChatNicknameResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetChatNicknameResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetChatNicknameResponse): SetChatNicknameResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetChatNicknameResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetChatNicknameResponse;
  static deserializeBinaryFromReader(message: SetChatNicknameResponse, reader: jspb.BinaryReader): SetChatNicknameResponse;
}

export namespace SetChatNicknameResponse {
  export type AsObject = {
  }
}

export class SetUserChatNicknameRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getNickname(): string;
  setNickname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetUserChatNicknameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetUserChatNicknameRequest): SetUserChatNicknameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetUserChatNicknameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetUserChatNicknameRequest;
  static deserializeBinaryFromReader(message: SetUserChatNicknameRequest, reader: jspb.BinaryReader): SetUserChatNicknameRequest;
}

export namespace SetUserChatNicknameRequest {
  export type AsObject = {
    address: string,
    nickname: string,
  }
}

export class SetUserChatNicknameResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetUserChatNicknameResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetUserChatNicknameResponse): SetUserChatNicknameResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetUserChatNicknameResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetUserChatNicknameResponse;
  static deserializeBinaryFromReader(message: SetUserChatNicknameResponse, reader: jspb.BinaryReader): SetUserChatNicknameResponse;
}

export namespace SetUserChatNicknameResponse {
  export type AsObject = {
  }
}

export interface EnqueueMediaTicketStatusMap {
  ACTIVE: 0;
  PAID: 1;
  EXPIRED: 2;
}

export const EnqueueMediaTicketStatus: EnqueueMediaTicketStatusMap;

export interface UserRoleMap {
  MODERATOR: 0;
}

export const UserRole: UserRoleMap;

export interface ForcedTicketEnqueueTypeMap {
  ENQUEUE: 0;
  PLAY_NEXT: 1;
  PLAY_NOW: 2;
}

export const ForcedTicketEnqueueType: ForcedTicketEnqueueTypeMap;

export interface ChatDisabledReasonMap {
  UNSPECIFIED: 0;
  MODERATOR_NOT_PRESENT: 1;
}

export const ChatDisabledReason: ChatDisabledReasonMap;

export interface AllowedVideoEnqueuingTypeMap {
  DISABLED: 0;
  STAFF_ONLY: 1;
  ENABLED: 2;
}

export const AllowedVideoEnqueuingType: AllowedVideoEnqueuingTypeMap;

export interface PermissionLevelMap {
  UNAUTHENTICATED: 0;
  USER: 1;
  ADMIN: 2;
}

export const PermissionLevel: PermissionLevelMap;

