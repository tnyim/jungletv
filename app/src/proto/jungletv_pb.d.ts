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
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

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
    rewardsAddress: string,
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

  hasStartOffset(): boolean;
  clearStartOffset(): void;
  getStartOffset(): google_protobuf_duration_pb.Duration | undefined;
  setStartOffset(value?: google_protobuf_duration_pb.Duration): void;

  hasEndOffset(): boolean;
  clearEndOffset(): void;
  getEndOffset(): google_protobuf_duration_pb.Duration | undefined;
  setEndOffset(value?: google_protobuf_duration_pb.Duration): void;

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
    startOffset?: google_protobuf_duration_pb.Duration.AsObject,
    endOffset?: google_protobuf_duration_pb.Duration.AsObject,
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

  hasMediaLength(): boolean;
  clearMediaLength(): void;
  getMediaLength(): google_protobuf_duration_pb.Duration | undefined;
  setMediaLength(value?: google_protobuf_duration_pb.Duration): void;

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
    mediaLength?: google_protobuf_duration_pb.Duration.AsObject,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 11,
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

export class RemoveOwnQueueEntryRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveOwnQueueEntryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveOwnQueueEntryRequest): RemoveOwnQueueEntryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveOwnQueueEntryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveOwnQueueEntryRequest;
  static deserializeBinaryFromReader(message: RemoveOwnQueueEntryRequest, reader: jspb.BinaryReader): RemoveOwnQueueEntryRequest;
}

export namespace RemoveOwnQueueEntryRequest {
  export type AsObject = {
    id: string,
  }
}

export class RemoveOwnQueueEntryResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveOwnQueueEntryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveOwnQueueEntryResponse): RemoveOwnQueueEntryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveOwnQueueEntryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveOwnQueueEntryResponse;
  static deserializeBinaryFromReader(message: RemoveOwnQueueEntryResponse, reader: jspb.BinaryReader): RemoveOwnQueueEntryResponse;
}

export namespace RemoveOwnQueueEntryResponse {
  export type AsObject = {
  }
}

export class ConsumeMediaRequest extends jspb.Message {
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

  getLiveBroadcast(): boolean;
  setLiveBroadcast(value: boolean): void;

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

  hasRewardBalance(): boolean;
  clearRewardBalance(): void;
  getRewardBalance(): string;
  setRewardBalance(value: string): void;

  hasActivityChallenge(): boolean;
  clearActivityChallenge(): void;
  getActivityChallenge(): ActivityChallenge | undefined;
  setActivityChallenge(value?: ActivityChallenge): void;

  hasStubData(): boolean;
  clearStubData(): void;
  getStubData(): NowPlayingStubData | undefined;
  setStubData(value?: NowPlayingStubData): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): NowPlayingYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: NowPlayingYouTubeVideoData): void;

  hasLatestAnnouncement(): boolean;
  clearLatestAnnouncement(): void;
  getLatestAnnouncement(): number;
  setLatestAnnouncement(value: number): void;

  hasHasChatMention(): boolean;
  clearHasChatMention(): void;
  getHasChatMention(): boolean;
  setHasChatMention(value: boolean): void;

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
    liveBroadcast: boolean,
    requestedBy?: User.AsObject,
    requestCost: string,
    currentlyWatching: number,
    reward: string,
    rewardBalance: string,
    activityChallenge?: ActivityChallenge.AsObject,
    stubData?: NowPlayingStubData.AsObject,
    youtubeVideoData?: NowPlayingYouTubeVideoData.AsObject,
    latestAnnouncement: number,
    hasChatMention: boolean,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    STUB_DATA = 10,
    YOUTUBE_VIDEO_DATA = 11,
  }
}

export class ActivityChallenge extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getType(): string;
  setType(value: string): void;

  hasChallengedAt(): boolean;
  clearChallengedAt(): void;
  getChallengedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setChallengedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

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
    challengedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
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

  getOwnEntryRemovalEnabled(): boolean;
  setOwnEntryRemovalEnabled(value: boolean): void;

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
    ownEntryRemovalEnabled: boolean,
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

  getLiveBroadcast(): boolean;
  setLiveBroadcast(value: boolean): void;

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
    liveBroadcast: boolean,
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

  hasRequestedAt(): boolean;
  clearRequestedAt(): void;
  getRequestedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setRequestedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasLength(): boolean;
  clearLength(): void;
  getLength(): google_protobuf_duration_pb.Duration | undefined;
  setLength(value?: google_protobuf_duration_pb.Duration): void;

  hasOffset(): boolean;
  clearOffset(): void;
  getOffset(): google_protobuf_duration_pb.Duration | undefined;
  setOffset(value?: google_protobuf_duration_pb.Duration): void;

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
    requestedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    length?: google_protobuf_duration_pb.Duration.AsObject,
    offset?: google_protobuf_duration_pb.Duration.AsObject,
    unskippable: boolean,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 8,
  }
}

export class MonitorSkipAndTipRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonitorSkipAndTipRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MonitorSkipAndTipRequest): MonitorSkipAndTipRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MonitorSkipAndTipRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonitorSkipAndTipRequest;
  static deserializeBinaryFromReader(message: MonitorSkipAndTipRequest, reader: jspb.BinaryReader): MonitorSkipAndTipRequest;
}

export namespace MonitorSkipAndTipRequest {
  export type AsObject = {
  }
}

export class SkipAndTipStatus extends jspb.Message {
  getSkipStatus(): SkipStatusMap[keyof SkipStatusMap];
  setSkipStatus(value: SkipStatusMap[keyof SkipStatusMap]): void;

  getSkipAddress(): string;
  setSkipAddress(value: string): void;

  getSkipBalance(): string;
  setSkipBalance(value: string): void;

  getSkipThreshold(): string;
  setSkipThreshold(value: string): void;

  getRainAddress(): string;
  setRainAddress(value: string): void;

  getRainBalance(): string;
  setRainBalance(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SkipAndTipStatus.AsObject;
  static toObject(includeInstance: boolean, msg: SkipAndTipStatus): SkipAndTipStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SkipAndTipStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SkipAndTipStatus;
  static deserializeBinaryFromReader(message: SkipAndTipStatus, reader: jspb.BinaryReader): SkipAndTipStatus;
}

export namespace SkipAndTipStatus {
  export type AsObject = {
    skipStatus: SkipStatusMap[keyof SkipStatusMap],
    skipAddress: string,
    skipBalance: string,
    skipThreshold: string,
    rainAddress: string,
    rainBalance: string,
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
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  getRewardBalance(): string;
  setRewardBalance(value: string): void;

  getWithdrawalPending(): boolean;
  setWithdrawalPending(value: boolean): void;

  getBadRepresentative(): boolean;
  setBadRepresentative(value: boolean): void;

  hasWithdrawalPositionInQueue(): boolean;
  clearWithdrawalPositionInQueue(): void;
  getWithdrawalPositionInQueue(): number;
  setWithdrawalPositionInQueue(value: number): void;

  hasWithdrawalsInQueue(): boolean;
  clearWithdrawalsInQueue(): void;
  getWithdrawalsInQueue(): number;
  setWithdrawalsInQueue(value: number): void;

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
    rewardsAddress: string,
    rewardBalance: string,
    withdrawalPending: boolean,
    badRepresentative: boolean,
    withdrawalPositionInQueue: number,
    withdrawalsInQueue: number,
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

  hasDuration(): boolean;
  clearDuration(): void;
  getDuration(): google_protobuf_duration_pb.Duration | undefined;
  setDuration(value?: google_protobuf_duration_pb.Duration): void;

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
    duration?: google_protobuf_duration_pb.Duration.AsObject,
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

export class UserBan extends jspb.Message {
  getBanId(): string;
  setBanId(value: string): void;

  hasBannedAt(): boolean;
  clearBannedAt(): void;
  getBannedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setBannedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasBannedUntil(): boolean;
  clearBannedUntil(): void;
  getBannedUntil(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setBannedUntil(value?: google_protobuf_timestamp_pb.Timestamp): void;

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

  hasUnbanReason(): boolean;
  clearUnbanReason(): void;
  getUnbanReason(): string;
  setUnbanReason(value: string): void;

  hasBannedBy(): boolean;
  clearBannedBy(): void;
  getBannedBy(): User | undefined;
  setBannedBy(value?: User): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserBan.AsObject;
  static toObject(includeInstance: boolean, msg: UserBan): UserBan.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserBan, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserBan;
  static deserializeBinaryFromReader(message: UserBan, reader: jspb.BinaryReader): UserBan;
}

export namespace UserBan {
  export type AsObject = {
    banId: string,
    bannedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    bannedUntil?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    address: string,
    remoteAddress: string,
    chatBanned: boolean,
    enqueuingBanned: boolean,
    rewardsBanned: boolean,
    reason: string,
    unbanReason: string,
    bannedBy?: User.AsObject,
  }
}

export class UserBansRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): PaginationParameters | undefined;
  setPaginationParams(value?: PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  getActiveOnly(): boolean;
  setActiveOnly(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserBansRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserBansRequest): UserBansRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserBansRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserBansRequest;
  static deserializeBinaryFromReader(message: UserBansRequest, reader: jspb.BinaryReader): UserBansRequest;
}

export namespace UserBansRequest {
  export type AsObject = {
    paginationParams?: PaginationParameters.AsObject,
    searchQuery: string,
    activeOnly: boolean,
  }
}

export class UserBansResponse extends jspb.Message {
  clearUserBansList(): void;
  getUserBansList(): Array<UserBan>;
  setUserBansList(value: Array<UserBan>): void;
  addUserBans(value?: UserBan, index?: number): UserBan;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserBansResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserBansResponse): UserBansResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserBansResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserBansResponse;
  static deserializeBinaryFromReader(message: UserBansResponse, reader: jspb.BinaryReader): UserBansResponse;
}

export namespace UserBansResponse {
  export type AsObject = {
    userBansList: Array<UserBan.AsObject>,
    offset: number,
    total: number,
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

export class SetPricesMultiplierRequest extends jspb.Message {
  getMultiplier(): number;
  setMultiplier(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetPricesMultiplierRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetPricesMultiplierRequest): SetPricesMultiplierRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetPricesMultiplierRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetPricesMultiplierRequest;
  static deserializeBinaryFromReader(message: SetPricesMultiplierRequest, reader: jspb.BinaryReader): SetPricesMultiplierRequest;
}

export namespace SetPricesMultiplierRequest {
  export type AsObject = {
    multiplier: number,
  }
}

export class SetPricesMultiplierResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetPricesMultiplierResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetPricesMultiplierResponse): SetPricesMultiplierResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetPricesMultiplierResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetPricesMultiplierResponse;
  static deserializeBinaryFromReader(message: SetPricesMultiplierResponse, reader: jspb.BinaryReader): SetPricesMultiplierResponse;
}

export namespace SetPricesMultiplierResponse {
  export type AsObject = {
  }
}

export class WithdrawRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawRequest): WithdrawRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WithdrawRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawRequest;
  static deserializeBinaryFromReader(message: WithdrawRequest, reader: jspb.BinaryReader): WithdrawRequest;
}

export namespace WithdrawRequest {
  export type AsObject = {
  }
}

export class WithdrawResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawResponse): WithdrawResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WithdrawResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawResponse;
  static deserializeBinaryFromReader(message: WithdrawResponse, reader: jspb.BinaryReader): WithdrawResponse;
}

export namespace WithdrawResponse {
  export type AsObject = {
  }
}

export class LeaderboardsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LeaderboardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LeaderboardsRequest): LeaderboardsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LeaderboardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LeaderboardsRequest;
  static deserializeBinaryFromReader(message: LeaderboardsRequest, reader: jspb.BinaryReader): LeaderboardsRequest;
}

export namespace LeaderboardsRequest {
  export type AsObject = {
  }
}

export class LeaderboardsResponse extends jspb.Message {
  clearLeaderboardsList(): void;
  getLeaderboardsList(): Array<Leaderboard>;
  setLeaderboardsList(value: Array<Leaderboard>): void;
  addLeaderboards(value?: Leaderboard, index?: number): Leaderboard;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LeaderboardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LeaderboardsResponse): LeaderboardsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LeaderboardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LeaderboardsResponse;
  static deserializeBinaryFromReader(message: LeaderboardsResponse, reader: jspb.BinaryReader): LeaderboardsResponse;
}

export namespace LeaderboardsResponse {
  export type AsObject = {
    leaderboardsList: Array<Leaderboard.AsObject>,
  }
}

export class Leaderboard extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  clearValueTitlesList(): void;
  getValueTitlesList(): Array<string>;
  setValueTitlesList(value: Array<string>): void;
  addValueTitles(value: string, index?: number): string;

  clearRowsList(): void;
  getRowsList(): Array<LeaderboardRow>;
  setRowsList(value: Array<LeaderboardRow>): void;
  addRows(value?: LeaderboardRow, index?: number): LeaderboardRow;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Leaderboard.AsObject;
  static toObject(includeInstance: boolean, msg: Leaderboard): Leaderboard.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Leaderboard, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Leaderboard;
  static deserializeBinaryFromReader(message: Leaderboard, reader: jspb.BinaryReader): Leaderboard;
}

export namespace Leaderboard {
  export type AsObject = {
    title: string,
    valueTitlesList: Array<string>,
    rowsList: Array<LeaderboardRow.AsObject>,
  }
}

export class LeaderboardRow extends jspb.Message {
  getRowNum(): number;
  setRowNum(value: number): void;

  getPosition(): number;
  setPosition(value: number): void;

  getAddress(): string;
  setAddress(value: string): void;

  hasNickname(): boolean;
  clearNickname(): void;
  getNickname(): string;
  setNickname(value: string): void;

  clearValuesList(): void;
  getValuesList(): Array<LeaderboardValue>;
  setValuesList(value: Array<LeaderboardValue>): void;
  addValues(value?: LeaderboardValue, index?: number): LeaderboardValue;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LeaderboardRow.AsObject;
  static toObject(includeInstance: boolean, msg: LeaderboardRow): LeaderboardRow.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LeaderboardRow, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LeaderboardRow;
  static deserializeBinaryFromReader(message: LeaderboardRow, reader: jspb.BinaryReader): LeaderboardRow;
}

export namespace LeaderboardRow {
  export type AsObject = {
    rowNum: number,
    position: number,
    address: string,
    nickname: string,
    valuesList: Array<LeaderboardValue.AsObject>,
  }
}

export class LeaderboardValue extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): string;
  setAmount(value: string): void;

  getValueCase(): LeaderboardValue.ValueCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LeaderboardValue.AsObject;
  static toObject(includeInstance: boolean, msg: LeaderboardValue): LeaderboardValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LeaderboardValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LeaderboardValue;
  static deserializeBinaryFromReader(message: LeaderboardValue, reader: jspb.BinaryReader): LeaderboardValue;
}

export namespace LeaderboardValue {
  export type AsObject = {
    amount: string,
  }

  export enum ValueCase {
    VALUE_NOT_SET = 0,
    AMOUNT = 1,
  }
}

export class RewardHistoryRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): PaginationParameters | undefined;
  setPaginationParams(value?: PaginationParameters): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RewardHistoryRequest): RewardHistoryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RewardHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardHistoryRequest;
  static deserializeBinaryFromReader(message: RewardHistoryRequest, reader: jspb.BinaryReader): RewardHistoryRequest;
}

export namespace RewardHistoryRequest {
  export type AsObject = {
    paginationParams?: PaginationParameters.AsObject,
  }
}

export class ReceivedReward extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  hasReceivedAt(): boolean;
  clearReceivedAt(): void;
  getReceivedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setReceivedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getMediaId(): string;
  setMediaId(value: string): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): QueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: QueueYouTubeVideoData): void;

  getMediaInfoCase(): ReceivedReward.MediaInfoCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReceivedReward.AsObject;
  static toObject(includeInstance: boolean, msg: ReceivedReward): ReceivedReward.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReceivedReward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReceivedReward;
  static deserializeBinaryFromReader(message: ReceivedReward, reader: jspb.BinaryReader): ReceivedReward;
}

export namespace ReceivedReward {
  export type AsObject = {
    id: string,
    rewardsAddress: string,
    amount: string,
    receivedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    mediaId: string,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 6,
  }
}

export class RewardHistoryResponse extends jspb.Message {
  clearReceivedRewardsList(): void;
  getReceivedRewardsList(): Array<ReceivedReward>;
  setReceivedRewardsList(value: Array<ReceivedReward>): void;
  addReceivedRewards(value?: ReceivedReward, index?: number): ReceivedReward;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RewardHistoryResponse): RewardHistoryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RewardHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardHistoryResponse;
  static deserializeBinaryFromReader(message: RewardHistoryResponse, reader: jspb.BinaryReader): RewardHistoryResponse;
}

export namespace RewardHistoryResponse {
  export type AsObject = {
    receivedRewardsList: Array<ReceivedReward.AsObject>,
    offset: number,
    total: number,
  }
}

export class WithdrawalHistoryRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): PaginationParameters | undefined;
  setPaginationParams(value?: PaginationParameters): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawalHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawalHistoryRequest): WithdrawalHistoryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WithdrawalHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawalHistoryRequest;
  static deserializeBinaryFromReader(message: WithdrawalHistoryRequest, reader: jspb.BinaryReader): WithdrawalHistoryRequest;
}

export namespace WithdrawalHistoryRequest {
  export type AsObject = {
    paginationParams?: PaginationParameters.AsObject,
  }
}

export class Withdrawal extends jspb.Message {
  getTxHash(): string;
  setTxHash(value: string): void;

  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  hasStartedAt(): boolean;
  clearStartedAt(): void;
  getStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasCompletedAt(): boolean;
  clearCompletedAt(): void;
  getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Withdrawal.AsObject;
  static toObject(includeInstance: boolean, msg: Withdrawal): Withdrawal.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Withdrawal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Withdrawal;
  static deserializeBinaryFromReader(message: Withdrawal, reader: jspb.BinaryReader): Withdrawal;
}

export namespace Withdrawal {
  export type AsObject = {
    txHash: string,
    rewardsAddress: string,
    amount: string,
    startedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class WithdrawalHistoryResponse extends jspb.Message {
  clearWithdrawalsList(): void;
  getWithdrawalsList(): Array<Withdrawal>;
  setWithdrawalsList(value: Array<Withdrawal>): void;
  addWithdrawals(value?: Withdrawal, index?: number): Withdrawal;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawalHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawalHistoryResponse): WithdrawalHistoryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WithdrawalHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawalHistoryResponse;
  static deserializeBinaryFromReader(message: WithdrawalHistoryResponse, reader: jspb.BinaryReader): WithdrawalHistoryResponse;
}

export namespace WithdrawalHistoryResponse {
  export type AsObject = {
    withdrawalsList: Array<Withdrawal.AsObject>,
    offset: number,
    total: number,
  }
}

export class SetCrowdfundedSkippingEnabledRequest extends jspb.Message {
  getEnabled(): boolean;
  setEnabled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetCrowdfundedSkippingEnabledRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetCrowdfundedSkippingEnabledRequest): SetCrowdfundedSkippingEnabledRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetCrowdfundedSkippingEnabledRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetCrowdfundedSkippingEnabledRequest;
  static deserializeBinaryFromReader(message: SetCrowdfundedSkippingEnabledRequest, reader: jspb.BinaryReader): SetCrowdfundedSkippingEnabledRequest;
}

export namespace SetCrowdfundedSkippingEnabledRequest {
  export type AsObject = {
    enabled: boolean,
  }
}

export class SetCrowdfundedSkippingEnabledResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetCrowdfundedSkippingEnabledResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetCrowdfundedSkippingEnabledResponse): SetCrowdfundedSkippingEnabledResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetCrowdfundedSkippingEnabledResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetCrowdfundedSkippingEnabledResponse;
  static deserializeBinaryFromReader(message: SetCrowdfundedSkippingEnabledResponse, reader: jspb.BinaryReader): SetCrowdfundedSkippingEnabledResponse;
}

export namespace SetCrowdfundedSkippingEnabledResponse {
  export type AsObject = {
  }
}

export class SetSkipPriceMultiplierRequest extends jspb.Message {
  getMultiplier(): number;
  setMultiplier(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSkipPriceMultiplierRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetSkipPriceMultiplierRequest): SetSkipPriceMultiplierRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetSkipPriceMultiplierRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSkipPriceMultiplierRequest;
  static deserializeBinaryFromReader(message: SetSkipPriceMultiplierRequest, reader: jspb.BinaryReader): SetSkipPriceMultiplierRequest;
}

export namespace SetSkipPriceMultiplierRequest {
  export type AsObject = {
    multiplier: number,
  }
}

export class SetSkipPriceMultiplierResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSkipPriceMultiplierResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetSkipPriceMultiplierResponse): SetSkipPriceMultiplierResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetSkipPriceMultiplierResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSkipPriceMultiplierResponse;
  static deserializeBinaryFromReader(message: SetSkipPriceMultiplierResponse, reader: jspb.BinaryReader): SetSkipPriceMultiplierResponse;
}

export namespace SetSkipPriceMultiplierResponse {
  export type AsObject = {
  }
}

export class ProduceSegchaChallengeRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProduceSegchaChallengeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ProduceSegchaChallengeRequest): ProduceSegchaChallengeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProduceSegchaChallengeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProduceSegchaChallengeRequest;
  static deserializeBinaryFromReader(message: ProduceSegchaChallengeRequest, reader: jspb.BinaryReader): ProduceSegchaChallengeRequest;
}

export namespace ProduceSegchaChallengeRequest {
  export type AsObject = {
  }
}

export class ProduceSegchaChallengeResponse extends jspb.Message {
  getChallengeId(): string;
  setChallengeId(value: string): void;

  clearStepsList(): void;
  getStepsList(): Array<SegchaChallengeStep>;
  setStepsList(value: Array<SegchaChallengeStep>): void;
  addSteps(value?: SegchaChallengeStep, index?: number): SegchaChallengeStep;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProduceSegchaChallengeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ProduceSegchaChallengeResponse): ProduceSegchaChallengeResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProduceSegchaChallengeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProduceSegchaChallengeResponse;
  static deserializeBinaryFromReader(message: ProduceSegchaChallengeResponse, reader: jspb.BinaryReader): ProduceSegchaChallengeResponse;
}

export namespace ProduceSegchaChallengeResponse {
  export type AsObject = {
    challengeId: string,
    stepsList: Array<SegchaChallengeStep.AsObject>,
  }
}

export class SegchaChallengeStep extends jspb.Message {
  getImage(): Uint8Array | string;
  getImage_asU8(): Uint8Array;
  getImage_asB64(): string;
  setImage(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SegchaChallengeStep.AsObject;
  static toObject(includeInstance: boolean, msg: SegchaChallengeStep): SegchaChallengeStep.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SegchaChallengeStep, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SegchaChallengeStep;
  static deserializeBinaryFromReader(message: SegchaChallengeStep, reader: jspb.BinaryReader): SegchaChallengeStep;
}

export namespace SegchaChallengeStep {
  export type AsObject = {
    image: Uint8Array | string,
  }
}

export class ConfirmRaffleWinnerRequest extends jspb.Message {
  getRaffleId(): string;
  setRaffleId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfirmRaffleWinnerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConfirmRaffleWinnerRequest): ConfirmRaffleWinnerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConfirmRaffleWinnerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfirmRaffleWinnerRequest;
  static deserializeBinaryFromReader(message: ConfirmRaffleWinnerRequest, reader: jspb.BinaryReader): ConfirmRaffleWinnerRequest;
}

export namespace ConfirmRaffleWinnerRequest {
  export type AsObject = {
    raffleId: string,
  }
}

export class ConfirmRaffleWinnerResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfirmRaffleWinnerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ConfirmRaffleWinnerResponse): ConfirmRaffleWinnerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConfirmRaffleWinnerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfirmRaffleWinnerResponse;
  static deserializeBinaryFromReader(message: ConfirmRaffleWinnerResponse, reader: jspb.BinaryReader): ConfirmRaffleWinnerResponse;
}

export namespace ConfirmRaffleWinnerResponse {
  export type AsObject = {
  }
}

export class CompleteRaffleRequest extends jspb.Message {
  getRaffleId(): string;
  setRaffleId(value: string): void;

  getPrizeTxHash(): string;
  setPrizeTxHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteRaffleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteRaffleRequest): CompleteRaffleRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompleteRaffleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteRaffleRequest;
  static deserializeBinaryFromReader(message: CompleteRaffleRequest, reader: jspb.BinaryReader): CompleteRaffleRequest;
}

export namespace CompleteRaffleRequest {
  export type AsObject = {
    raffleId: string,
    prizeTxHash: string,
  }
}

export class CompleteRaffleResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteRaffleResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteRaffleResponse): CompleteRaffleResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompleteRaffleResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteRaffleResponse;
  static deserializeBinaryFromReader(message: CompleteRaffleResponse, reader: jspb.BinaryReader): CompleteRaffleResponse;
}

export namespace CompleteRaffleResponse {
  export type AsObject = {
  }
}

export class RedrawRaffleRequest extends jspb.Message {
  getRaffleId(): string;
  setRaffleId(value: string): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RedrawRaffleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RedrawRaffleRequest): RedrawRaffleRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RedrawRaffleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RedrawRaffleRequest;
  static deserializeBinaryFromReader(message: RedrawRaffleRequest, reader: jspb.BinaryReader): RedrawRaffleRequest;
}

export namespace RedrawRaffleRequest {
  export type AsObject = {
    raffleId: string,
    reason: string,
  }
}

export class RedrawRaffleResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RedrawRaffleResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RedrawRaffleResponse): RedrawRaffleResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RedrawRaffleResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RedrawRaffleResponse;
  static deserializeBinaryFromReader(message: RedrawRaffleResponse, reader: jspb.BinaryReader): RedrawRaffleResponse;
}

export namespace RedrawRaffleResponse {
  export type AsObject = {
  }
}

export class OngoingRaffleInfoRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OngoingRaffleInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: OngoingRaffleInfoRequest): OngoingRaffleInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OngoingRaffleInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OngoingRaffleInfoRequest;
  static deserializeBinaryFromReader(message: OngoingRaffleInfoRequest, reader: jspb.BinaryReader): OngoingRaffleInfoRequest;
}

export namespace OngoingRaffleInfoRequest {
  export type AsObject = {
  }
}

export class OngoingRaffleInfoResponse extends jspb.Message {
  hasRaffleInfo(): boolean;
  clearRaffleInfo(): void;
  getRaffleInfo(): OngoingRaffleInfo | undefined;
  setRaffleInfo(value?: OngoingRaffleInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OngoingRaffleInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OngoingRaffleInfoResponse): OngoingRaffleInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OngoingRaffleInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OngoingRaffleInfoResponse;
  static deserializeBinaryFromReader(message: OngoingRaffleInfoResponse, reader: jspb.BinaryReader): OngoingRaffleInfoResponse;
}

export namespace OngoingRaffleInfoResponse {
  export type AsObject = {
    raffleInfo?: OngoingRaffleInfo.AsObject,
  }
}

export class OngoingRaffleInfo extends jspb.Message {
  getRaffleId(): string;
  setRaffleId(value: string): void;

  getEntriesUrl(): string;
  setEntriesUrl(value: string): void;

  getInfoUrl(): string;
  setInfoUrl(value: string): void;

  hasPeriodStart(): boolean;
  clearPeriodStart(): void;
  getPeriodStart(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPeriodStart(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasPeriodEnd(): boolean;
  clearPeriodEnd(): void;
  getPeriodEnd(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPeriodEnd(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getTotalTickets(): number;
  setTotalTickets(value: number): void;

  hasUserTickets(): boolean;
  clearUserTickets(): void;
  getUserTickets(): number;
  setUserTickets(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OngoingRaffleInfo.AsObject;
  static toObject(includeInstance: boolean, msg: OngoingRaffleInfo): OngoingRaffleInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OngoingRaffleInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OngoingRaffleInfo;
  static deserializeBinaryFromReader(message: OngoingRaffleInfo, reader: jspb.BinaryReader): OngoingRaffleInfo;
}

export namespace OngoingRaffleInfo {
  export type AsObject = {
    raffleId: string,
    entriesUrl: string,
    infoUrl: string,
    periodStart?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    periodEnd?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    totalTickets: number,
    userTickets: number,
  }
}

export class TriggerAnnouncementsNotificationRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerAnnouncementsNotificationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerAnnouncementsNotificationRequest): TriggerAnnouncementsNotificationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerAnnouncementsNotificationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerAnnouncementsNotificationRequest;
  static deserializeBinaryFromReader(message: TriggerAnnouncementsNotificationRequest, reader: jspb.BinaryReader): TriggerAnnouncementsNotificationRequest;
}

export namespace TriggerAnnouncementsNotificationRequest {
  export type AsObject = {
  }
}

export class TriggerAnnouncementsNotificationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerAnnouncementsNotificationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerAnnouncementsNotificationResponse): TriggerAnnouncementsNotificationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerAnnouncementsNotificationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerAnnouncementsNotificationResponse;
  static deserializeBinaryFromReader(message: TriggerAnnouncementsNotificationResponse, reader: jspb.BinaryReader): TriggerAnnouncementsNotificationResponse;
}

export namespace TriggerAnnouncementsNotificationResponse {
  export type AsObject = {
  }
}

export class SpectatorInfoRequest extends jspb.Message {
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpectatorInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SpectatorInfoRequest): SpectatorInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpectatorInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpectatorInfoRequest;
  static deserializeBinaryFromReader(message: SpectatorInfoRequest, reader: jspb.BinaryReader): SpectatorInfoRequest;
}

export namespace SpectatorInfoRequest {
  export type AsObject = {
    rewardsAddress: string,
  }
}

export class Spectator extends jspb.Message {
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  getNumConnections(): number;
  setNumConnections(value: number): void;

  getNumSpectatorsWithSameRemoteAddress(): number;
  setNumSpectatorsWithSameRemoteAddress(value: number): void;

  hasWatchingSince(): boolean;
  clearWatchingSince(): void;
  getWatchingSince(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setWatchingSince(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getRemoteAddressCanReceiveRewards(): boolean;
  setRemoteAddressCanReceiveRewards(value: boolean): void;

  getLegitimate(): boolean;
  setLegitimate(value: boolean): void;

  hasNotLegitimateSince(): boolean;
  clearNotLegitimateSince(): void;
  getNotLegitimateSince(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setNotLegitimateSince(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasStoppedWatchingAt(): boolean;
  clearStoppedWatchingAt(): void;
  getStoppedWatchingAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStoppedWatchingAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasActivityChallenge(): boolean;
  clearActivityChallenge(): void;
  getActivityChallenge(): ActivityChallenge | undefined;
  setActivityChallenge(value?: ActivityChallenge): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Spectator.AsObject;
  static toObject(includeInstance: boolean, msg: Spectator): Spectator.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Spectator, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Spectator;
  static deserializeBinaryFromReader(message: Spectator, reader: jspb.BinaryReader): Spectator;
}

export namespace Spectator {
  export type AsObject = {
    rewardsAddress: string,
    numConnections: number,
    numSpectatorsWithSameRemoteAddress: number,
    watchingSince?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    remoteAddressCanReceiveRewards: boolean,
    legitimate: boolean,
    notLegitimateSince?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    stoppedWatchingAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    activityChallenge?: ActivityChallenge.AsObject,
  }
}

export class ResetSpectatorStatusRequest extends jspb.Message {
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResetSpectatorStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ResetSpectatorStatusRequest): ResetSpectatorStatusRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResetSpectatorStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResetSpectatorStatusRequest;
  static deserializeBinaryFromReader(message: ResetSpectatorStatusRequest, reader: jspb.BinaryReader): ResetSpectatorStatusRequest;
}

export namespace ResetSpectatorStatusRequest {
  export type AsObject = {
    rewardsAddress: string,
  }
}

export class ResetSpectatorStatusResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResetSpectatorStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ResetSpectatorStatusResponse): ResetSpectatorStatusResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResetSpectatorStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResetSpectatorStatusResponse;
  static deserializeBinaryFromReader(message: ResetSpectatorStatusResponse, reader: jspb.BinaryReader): ResetSpectatorStatusResponse;
}

export namespace ResetSpectatorStatusResponse {
  export type AsObject = {
  }
}

export class MonitorModerationSettingsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonitorModerationSettingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MonitorModerationSettingsRequest): MonitorModerationSettingsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MonitorModerationSettingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonitorModerationSettingsRequest;
  static deserializeBinaryFromReader(message: MonitorModerationSettingsRequest, reader: jspb.BinaryReader): MonitorModerationSettingsRequest;
}

export namespace MonitorModerationSettingsRequest {
  export type AsObject = {
  }
}

export class ModerationSettingsOverview extends jspb.Message {
  getAllowedVideoEnqueuing(): AllowedVideoEnqueuingTypeMap[keyof AllowedVideoEnqueuingTypeMap];
  setAllowedVideoEnqueuing(value: AllowedVideoEnqueuingTypeMap[keyof AllowedVideoEnqueuingTypeMap]): void;

  getEnqueuingPricesMultiplier(): number;
  setEnqueuingPricesMultiplier(value: number): void;

  getCrowdfundedSkippingEnabled(): boolean;
  setCrowdfundedSkippingEnabled(value: boolean): void;

  getCrowdfundedSkippingPricesMultiplier(): number;
  setCrowdfundedSkippingPricesMultiplier(value: number): void;

  getNewEntriesAlwaysUnskippable(): boolean;
  setNewEntriesAlwaysUnskippable(value: boolean): void;

  getOwnEntryRemovalEnabled(): boolean;
  setOwnEntryRemovalEnabled(value: boolean): void;

  getAllSkippingEnabled(): boolean;
  setAllSkippingEnabled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModerationSettingsOverview.AsObject;
  static toObject(includeInstance: boolean, msg: ModerationSettingsOverview): ModerationSettingsOverview.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ModerationSettingsOverview, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModerationSettingsOverview;
  static deserializeBinaryFromReader(message: ModerationSettingsOverview, reader: jspb.BinaryReader): ModerationSettingsOverview;
}

export namespace ModerationSettingsOverview {
  export type AsObject = {
    allowedVideoEnqueuing: AllowedVideoEnqueuingTypeMap[keyof AllowedVideoEnqueuingTypeMap],
    enqueuingPricesMultiplier: number,
    crowdfundedSkippingEnabled: boolean,
    crowdfundedSkippingPricesMultiplier: number,
    newEntriesAlwaysUnskippable: boolean,
    ownEntryRemovalEnabled: boolean,
    allSkippingEnabled: boolean,
  }
}

export class SetOwnQueueEntryRemovalAllowedRequest extends jspb.Message {
  getAllowed(): boolean;
  setAllowed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetOwnQueueEntryRemovalAllowedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetOwnQueueEntryRemovalAllowedRequest): SetOwnQueueEntryRemovalAllowedRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetOwnQueueEntryRemovalAllowedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetOwnQueueEntryRemovalAllowedRequest;
  static deserializeBinaryFromReader(message: SetOwnQueueEntryRemovalAllowedRequest, reader: jspb.BinaryReader): SetOwnQueueEntryRemovalAllowedRequest;
}

export namespace SetOwnQueueEntryRemovalAllowedRequest {
  export type AsObject = {
    allowed: boolean,
  }
}

export class SetOwnQueueEntryRemovalAllowedResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetOwnQueueEntryRemovalAllowedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetOwnQueueEntryRemovalAllowedResponse): SetOwnQueueEntryRemovalAllowedResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetOwnQueueEntryRemovalAllowedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetOwnQueueEntryRemovalAllowedResponse;
  static deserializeBinaryFromReader(message: SetOwnQueueEntryRemovalAllowedResponse, reader: jspb.BinaryReader): SetOwnQueueEntryRemovalAllowedResponse;
}

export namespace SetOwnQueueEntryRemovalAllowedResponse {
  export type AsObject = {
  }
}

export class SetNewQueueEntriesAlwaysUnskippableRequest extends jspb.Message {
  getEnabled(): boolean;
  setEnabled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetNewQueueEntriesAlwaysUnskippableRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetNewQueueEntriesAlwaysUnskippableRequest): SetNewQueueEntriesAlwaysUnskippableRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetNewQueueEntriesAlwaysUnskippableRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetNewQueueEntriesAlwaysUnskippableRequest;
  static deserializeBinaryFromReader(message: SetNewQueueEntriesAlwaysUnskippableRequest, reader: jspb.BinaryReader): SetNewQueueEntriesAlwaysUnskippableRequest;
}

export namespace SetNewQueueEntriesAlwaysUnskippableRequest {
  export type AsObject = {
    enabled: boolean,
  }
}

export class SetNewQueueEntriesAlwaysUnskippableResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetNewQueueEntriesAlwaysUnskippableResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetNewQueueEntriesAlwaysUnskippableResponse): SetNewQueueEntriesAlwaysUnskippableResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetNewQueueEntriesAlwaysUnskippableResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetNewQueueEntriesAlwaysUnskippableResponse;
  static deserializeBinaryFromReader(message: SetNewQueueEntriesAlwaysUnskippableResponse, reader: jspb.BinaryReader): SetNewQueueEntriesAlwaysUnskippableResponse;
}

export namespace SetNewQueueEntriesAlwaysUnskippableResponse {
  export type AsObject = {
  }
}

export class SetSkippingEnabledRequest extends jspb.Message {
  getEnabled(): boolean;
  setEnabled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSkippingEnabledRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetSkippingEnabledRequest): SetSkippingEnabledRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetSkippingEnabledRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSkippingEnabledRequest;
  static deserializeBinaryFromReader(message: SetSkippingEnabledRequest, reader: jspb.BinaryReader): SetSkippingEnabledRequest;
}

export namespace SetSkippingEnabledRequest {
  export type AsObject = {
    enabled: boolean,
  }
}

export class SetSkippingEnabledResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSkippingEnabledResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetSkippingEnabledResponse): SetSkippingEnabledResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetSkippingEnabledResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSkippingEnabledResponse;
  static deserializeBinaryFromReader(message: SetSkippingEnabledResponse, reader: jspb.BinaryReader): SetSkippingEnabledResponse;
}

export namespace SetSkippingEnabledResponse {
  export type AsObject = {
  }
}

export interface EnqueueMediaTicketStatusMap {
  ACTIVE: 0;
  PAID: 1;
  EXPIRED: 2;
}

export const EnqueueMediaTicketStatus: EnqueueMediaTicketStatusMap;

export interface SkipStatusMap {
  SKIP_STATUS_ALLOWED: 0;
  SKIP_STATUS_UNSKIPPABLE: 1;
  SKIP_STATUS_END_OF_MEDIA_PERIOD: 2;
  SKIP_STATUS_NO_MEDIA: 3;
  SKIP_STATUS_UNAVAILABLE: 4;
  SKIP_STATUS_DISABLED: 5;
  SKIP_STATUS_START_OF_MEDIA_PERIOD: 6;
}

export const SkipStatus: SkipStatusMap;

export interface UserRoleMap {
  MODERATOR: 0;
  TIER_1_REQUESTER: 1;
  TIER_2_REQUESTER: 2;
  TIER_3_REQUESTER: 3;
  CURRENT_ENTRY_REQUESTER: 4;
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

