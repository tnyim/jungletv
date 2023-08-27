// package: jungletv
// file: jungletv.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";
import * as common_pb from "./common_pb";
import * as application_editor_pb from "./application_editor_pb";
import * as application_runtime_pb from "./application_runtime_pb";

export class SignInRequest extends jspb.Message {
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  getViaSignature(): boolean;
  setViaSignature(value: boolean): void;

  hasOngoingProcessId(): boolean;
  clearOngoingProcessId(): void;
  getOngoingProcessId(): string;
  setOngoingProcessId(value: string): void;

  hasLabSignInOptions(): boolean;
  clearLabSignInOptions(): void;
  getLabSignInOptions(): LabSignInOptions | undefined;
  setLabSignInOptions(value?: LabSignInOptions): void;

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
    viaSignature: boolean,
    ongoingProcessId: string,
    labSignInOptions?: LabSignInOptions.AsObject,
  }
}

export class LabSignInOptions extends jspb.Message {
  getDesiredPermissionLevel(): PermissionLevelMap[keyof PermissionLevelMap];
  setDesiredPermissionLevel(value: PermissionLevelMap[keyof PermissionLevelMap]): void;

  hasCredential(): boolean;
  clearCredential(): void;
  getCredential(): string;
  setCredential(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LabSignInOptions.AsObject;
  static toObject(includeInstance: boolean, msg: LabSignInOptions): LabSignInOptions.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LabSignInOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LabSignInOptions;
  static deserializeBinaryFromReader(message: LabSignInOptions, reader: jspb.BinaryReader): LabSignInOptions;
}

export namespace LabSignInOptions {
  export type AsObject = {
    desiredPermissionLevel: PermissionLevelMap[keyof PermissionLevelMap],
    credential: string,
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

  hasMessageToSign(): boolean;
  clearMessageToSign(): void;
  getMessageToSign(): SignInMessageToSign | undefined;
  setMessageToSign(value?: SignInMessageToSign): void;

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
    messageToSign?: SignInMessageToSign.AsObject,
  }

  export enum StepCase {
    STEP_NOT_SET = 0,
    VERIFICATION = 1,
    RESPONSE = 2,
    EXPIRED = 3,
    ACCOUNT_UNOPENED = 4,
    MESSAGE_TO_SIGN = 5,
  }
}

export class SignInVerification extends jspb.Message {
  getProcessId(): string;
  setProcessId(value: string): void;

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
    processId: string,
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

export class SignInMessageToSign extends jspb.Message {
  getProcessId(): string;
  setProcessId(value: string): void;

  getSubmissionUrl(): string;
  setSubmissionUrl(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  hasExpiration(): boolean;
  clearExpiration(): void;
  getExpiration(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiration(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInMessageToSign.AsObject;
  static toObject(includeInstance: boolean, msg: SignInMessageToSign): SignInMessageToSign.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInMessageToSign, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInMessageToSign;
  static deserializeBinaryFromReader(message: SignInMessageToSign, reader: jspb.BinaryReader): SignInMessageToSign;
}

export namespace SignInMessageToSign {
  export type AsObject = {
    processId: string,
    submissionUrl: string,
    message: string,
    expiration?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class VerifySignInSignatureRequest extends jspb.Message {
  getProcessId(): string;
  setProcessId(value: string): void;

  getSignatureHex(): string;
  setSignatureHex(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifySignInSignatureRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VerifySignInSignatureRequest): VerifySignInSignatureRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifySignInSignatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifySignInSignatureRequest;
  static deserializeBinaryFromReader(message: VerifySignInSignatureRequest, reader: jspb.BinaryReader): VerifySignInSignatureRequest;
}

export namespace VerifySignInSignatureRequest {
  export type AsObject = {
    processId: string,
    signatureHex: string,
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

export class EnqueueSoundCloudTrackData extends jspb.Message {
  getPermalink(): string;
  setPermalink(value: string): void;

  hasStartOffset(): boolean;
  clearStartOffset(): void;
  getStartOffset(): google_protobuf_duration_pb.Duration | undefined;
  setStartOffset(value?: google_protobuf_duration_pb.Duration): void;

  hasEndOffset(): boolean;
  clearEndOffset(): void;
  getEndOffset(): google_protobuf_duration_pb.Duration | undefined;
  setEndOffset(value?: google_protobuf_duration_pb.Duration): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueSoundCloudTrackData.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueSoundCloudTrackData): EnqueueSoundCloudTrackData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueSoundCloudTrackData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueSoundCloudTrackData;
  static deserializeBinaryFromReader(message: EnqueueSoundCloudTrackData, reader: jspb.BinaryReader): EnqueueSoundCloudTrackData;
}

export namespace EnqueueSoundCloudTrackData {
  export type AsObject = {
    permalink: string,
    startOffset?: google_protobuf_duration_pb.Duration.AsObject,
    endOffset?: google_protobuf_duration_pb.Duration.AsObject,
  }
}

export class EnqueueDocumentData extends jspb.Message {
  getDocumentId(): string;
  setDocumentId(value: string): void;

  hasDuration(): boolean;
  clearDuration(): void;
  getDuration(): google_protobuf_duration_pb.Duration | undefined;
  setDuration(value?: google_protobuf_duration_pb.Duration): void;

  getTitle(): string;
  setTitle(value: string): void;

  hasEnqueueType(): boolean;
  clearEnqueueType(): void;
  getEnqueueType(): ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap];
  setEnqueueType(value: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnqueueDocumentData.AsObject;
  static toObject(includeInstance: boolean, msg: EnqueueDocumentData): EnqueueDocumentData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnqueueDocumentData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnqueueDocumentData;
  static deserializeBinaryFromReader(message: EnqueueDocumentData, reader: jspb.BinaryReader): EnqueueDocumentData;
}

export namespace EnqueueDocumentData {
  export type AsObject = {
    documentId: string,
    duration?: google_protobuf_duration_pb.Duration.AsObject,
    title: string,
    enqueueType: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap],
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

  getConcealed(): boolean;
  setConcealed(value: boolean): void;

  getAnonymous(): boolean;
  setAnonymous(value: boolean): void;

  hasPassword(): boolean;
  clearPassword(): void;
  getPassword(): string;
  setPassword(value: string): void;

  hasStubData(): boolean;
  clearStubData(): void;
  getStubData(): EnqueueStubData | undefined;
  setStubData(value?: EnqueueStubData): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): EnqueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: EnqueueYouTubeVideoData): void;

  hasSoundcloudTrackData(): boolean;
  clearSoundcloudTrackData(): void;
  getSoundcloudTrackData(): EnqueueSoundCloudTrackData | undefined;
  setSoundcloudTrackData(value?: EnqueueSoundCloudTrackData): void;

  hasDocumentData(): boolean;
  clearDocumentData(): void;
  getDocumentData(): EnqueueDocumentData | undefined;
  setDocumentData(value?: EnqueueDocumentData): void;

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
    concealed: boolean,
    anonymous: boolean,
    password: string,
    stubData?: EnqueueStubData.AsObject,
    youtubeVideoData?: EnqueueYouTubeVideoData.AsObject,
    soundcloudTrackData?: EnqueueSoundCloudTrackData.AsObject,
    documentData?: EnqueueDocumentData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    STUB_DATA = 5,
    YOUTUBE_VIDEO_DATA = 6,
    SOUNDCLOUD_TRACK_DATA = 7,
    DOCUMENT_DATA = 8,
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

  getConcealed(): boolean;
  setConcealed(value: boolean): void;

  getCurrentlyPlayingIsUnskippable(): boolean;
  setCurrentlyPlayingIsUnskippable(value: boolean): void;

  hasLength(): boolean;
  clearLength(): void;
  getLength(): google_protobuf_duration_pb.Duration | undefined;
  setLength(value?: google_protobuf_duration_pb.Duration): void;

  hasOffset(): boolean;
  clearOffset(): void;
  getOffset(): google_protobuf_duration_pb.Duration | undefined;
  setOffset(value?: google_protobuf_duration_pb.Duration): void;

  clearExtraCurrencyPaymentDataList(): void;
  getExtraCurrencyPaymentDataList(): Array<ExtraCurrencyPaymentData>;
  setExtraCurrencyPaymentDataList(value: Array<ExtraCurrencyPaymentData>): void;
  addExtraCurrencyPaymentData(value?: ExtraCurrencyPaymentData, index?: number): ExtraCurrencyPaymentData;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): QueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: QueueYouTubeVideoData): void;

  hasSoundcloudTrackData(): boolean;
  clearSoundcloudTrackData(): void;
  getSoundcloudTrackData(): QueueSoundCloudTrackData | undefined;
  setSoundcloudTrackData(value?: QueueSoundCloudTrackData): void;

  hasDocumentData(): boolean;
  clearDocumentData(): void;
  getDocumentData(): QueueDocumentData | undefined;
  setDocumentData(value?: QueueDocumentData): void;

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
    concealed: boolean,
    currentlyPlayingIsUnskippable: boolean,
    length?: google_protobuf_duration_pb.Duration.AsObject,
    offset?: google_protobuf_duration_pb.Duration.AsObject,
    extraCurrencyPaymentDataList: Array<ExtraCurrencyPaymentData.AsObject>,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
    soundcloudTrackData?: QueueSoundCloudTrackData.AsObject,
    documentData?: QueueDocumentData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 14,
    SOUNDCLOUD_TRACK_DATA = 15,
    DOCUMENT_DATA = 16,
  }
}

export class ExtraCurrencyPaymentData extends jspb.Message {
  getCurrencyTicker(): string;
  setCurrencyTicker(value: string): void;

  getSwapOrderId(): string;
  setSwapOrderId(value: string): void;

  getPaymentAddress(): string;
  setPaymentAddress(value: string): void;

  getEnqueuePrice(): string;
  setEnqueuePrice(value: string): void;

  getPlayNextPrice(): string;
  setPlayNextPrice(value: string): void;

  getPlayNowPrice(): string;
  setPlayNowPrice(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtraCurrencyPaymentData.AsObject;
  static toObject(includeInstance: boolean, msg: ExtraCurrencyPaymentData): ExtraCurrencyPaymentData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtraCurrencyPaymentData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtraCurrencyPaymentData;
  static deserializeBinaryFromReader(message: ExtraCurrencyPaymentData, reader: jspb.BinaryReader): ExtraCurrencyPaymentData;
}

export namespace ExtraCurrencyPaymentData {
  export type AsObject = {
    currencyTicker: string,
    swapOrderId: string,
    paymentAddress: string,
    enqueuePrice: string,
    playNextPrice: string,
    playNowPrice: string,
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

export class MoveQueueEntryRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getDirection(): QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap];
  setDirection(value: QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveQueueEntryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MoveQueueEntryRequest): MoveQueueEntryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MoveQueueEntryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveQueueEntryRequest;
  static deserializeBinaryFromReader(message: MoveQueueEntryRequest, reader: jspb.BinaryReader): MoveQueueEntryRequest;
}

export namespace MoveQueueEntryRequest {
  export type AsObject = {
    id: string,
    direction: QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap],
  }
}

export class MoveQueueEntryResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveQueueEntryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MoveQueueEntryResponse): MoveQueueEntryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MoveQueueEntryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveQueueEntryResponse;
  static deserializeBinaryFromReader(message: MoveQueueEntryResponse, reader: jspb.BinaryReader): MoveQueueEntryResponse;
}

export namespace MoveQueueEntryResponse {
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

export class NowPlayingSoundCloudTrackData extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NowPlayingSoundCloudTrackData.AsObject;
  static toObject(includeInstance: boolean, msg: NowPlayingSoundCloudTrackData): NowPlayingSoundCloudTrackData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NowPlayingSoundCloudTrackData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NowPlayingSoundCloudTrackData;
  static deserializeBinaryFromReader(message: NowPlayingSoundCloudTrackData, reader: jspb.BinaryReader): NowPlayingSoundCloudTrackData;
}

export namespace NowPlayingSoundCloudTrackData {
  export type AsObject = {
    id: string,
  }
}

export class NowPlayingDocumentData extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasUpdatedAt(): boolean;
  clearUpdatedAt(): void;
  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasDocument(): boolean;
  clearDocument(): void;
  getDocument(): Document | undefined;
  setDocument(value?: Document): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NowPlayingDocumentData.AsObject;
  static toObject(includeInstance: boolean, msg: NowPlayingDocumentData): NowPlayingDocumentData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NowPlayingDocumentData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NowPlayingDocumentData;
  static deserializeBinaryFromReader(message: NowPlayingDocumentData, reader: jspb.BinaryReader): NowPlayingDocumentData;
}

export namespace NowPlayingDocumentData {
  export type AsObject = {
    id: string,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    document?: Document.AsObject,
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
  getRequestedBy(): common_pb.User | undefined;
  setRequestedBy(value?: common_pb.User): void;

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

  hasSoundcloudTrackData(): boolean;
  clearSoundcloudTrackData(): void;
  getSoundcloudTrackData(): NowPlayingSoundCloudTrackData | undefined;
  setSoundcloudTrackData(value?: NowPlayingSoundCloudTrackData): void;

  hasDocumentData(): boolean;
  clearDocumentData(): void;
  getDocumentData(): NowPlayingDocumentData | undefined;
  setDocumentData(value?: NowPlayingDocumentData): void;

  hasLatestAnnouncement(): boolean;
  clearLatestAnnouncement(): void;
  getLatestAnnouncement(): number;
  setLatestAnnouncement(value: number): void;

  hasHasChatMention(): boolean;
  clearHasChatMention(): void;
  getHasChatMention(): boolean;
  setHasChatMention(value: boolean): void;

  hasMediaTitle(): boolean;
  clearMediaTitle(): void;
  getMediaTitle(): string;
  setMediaTitle(value: string): void;

  clearConfigurationChangesList(): void;
  getConfigurationChangesList(): Array<ConfigurationChange>;
  setConfigurationChangesList(value: Array<ConfigurationChange>): void;
  addConfigurationChanges(value?: ConfigurationChange, index?: number): ConfigurationChange;

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
    requestedBy?: common_pb.User.AsObject,
    requestCost: string,
    currentlyWatching: number,
    reward: string,
    rewardBalance: string,
    activityChallenge?: ActivityChallenge.AsObject,
    stubData?: NowPlayingStubData.AsObject,
    youtubeVideoData?: NowPlayingYouTubeVideoData.AsObject,
    soundcloudTrackData?: NowPlayingSoundCloudTrackData.AsObject,
    documentData?: NowPlayingDocumentData.AsObject,
    latestAnnouncement: number,
    hasChatMention: boolean,
    mediaTitle: string,
    configurationChangesList: Array<ConfigurationChange.AsObject>,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    STUB_DATA = 10,
    YOUTUBE_VIDEO_DATA = 11,
    SOUNDCLOUD_TRACK_DATA = 12,
    DOCUMENT_DATA = 13,
  }
}

export class ActivityChallenge extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  clearTypesList(): void;
  getTypesList(): Array<string>;
  setTypesList(value: Array<string>): void;
  addTypes(value: string, index?: number): string;

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
    typesList: Array<string>,
    challengedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ConfigurationChange extends jspb.Message {
  hasApplicationName(): boolean;
  clearApplicationName(): void;
  getApplicationName(): string;
  setApplicationName(value: string): void;

  hasLogoUrl(): boolean;
  clearLogoUrl(): void;
  getLogoUrl(): string;
  setLogoUrl(value: string): void;

  hasFaviconUrl(): boolean;
  clearFaviconUrl(): void;
  getFaviconUrl(): string;
  setFaviconUrl(value: string): void;

  hasOpenSidebarTab(): boolean;
  clearOpenSidebarTab(): void;
  getOpenSidebarTab(): ConfigurationChangeSidebarTabOpen | undefined;
  setOpenSidebarTab(value?: ConfigurationChangeSidebarTabOpen): void;

  hasCloseSidebarTab(): boolean;
  clearCloseSidebarTab(): void;
  getCloseSidebarTab(): string;
  setCloseSidebarTab(value: string): void;

  getConfigurationChangeCase(): ConfigurationChange.ConfigurationChangeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfigurationChange.AsObject;
  static toObject(includeInstance: boolean, msg: ConfigurationChange): ConfigurationChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConfigurationChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfigurationChange;
  static deserializeBinaryFromReader(message: ConfigurationChange, reader: jspb.BinaryReader): ConfigurationChange;
}

export namespace ConfigurationChange {
  export type AsObject = {
    applicationName: string,
    logoUrl: string,
    faviconUrl: string,
    openSidebarTab?: ConfigurationChangeSidebarTabOpen.AsObject,
    closeSidebarTab: string,
  }

  export enum ConfigurationChangeCase {
    CONFIGURATION_CHANGE_NOT_SET = 0,
    APPLICATION_NAME = 1,
    LOGO_URL = 2,
    FAVICON_URL = 3,
    OPEN_SIDEBAR_TAB = 4,
    CLOSE_SIDEBAR_TAB = 5,
  }
}

export class ConfigurationChangeSidebarTabOpen extends jspb.Message {
  getTabId(): string;
  setTabId(value: string): void;

  getApplicationId(): string;
  setApplicationId(value: string): void;

  getPageId(): string;
  setPageId(value: string): void;

  getTabTitle(): string;
  setTabTitle(value: string): void;

  getBeforeTabId(): string;
  setBeforeTabId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfigurationChangeSidebarTabOpen.AsObject;
  static toObject(includeInstance: boolean, msg: ConfigurationChangeSidebarTabOpen): ConfigurationChangeSidebarTabOpen.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConfigurationChangeSidebarTabOpen, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfigurationChangeSidebarTabOpen;
  static deserializeBinaryFromReader(message: ConfigurationChangeSidebarTabOpen, reader: jspb.BinaryReader): ConfigurationChangeSidebarTabOpen;
}

export namespace ConfigurationChangeSidebarTabOpen {
  export type AsObject = {
    tabId: string,
    applicationId: string,
    pageId: string,
    tabTitle: string,
    beforeTabId: string,
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

  hasInsertCursor(): boolean;
  clearInsertCursor(): void;
  getInsertCursor(): string;
  setInsertCursor(value: string): void;

  hasPlayingSince(): boolean;
  clearPlayingSince(): void;
  getPlayingSince(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPlayingSince(value?: google_protobuf_timestamp_pb.Timestamp): void;

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
    insertCursor: string,
    playingSince?: google_protobuf_timestamp_pb.Timestamp.AsObject,
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

export class QueueSoundCloudTrackData extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getThumbnailUrl(): string;
  setThumbnailUrl(value: string): void;

  getUploader(): string;
  setUploader(value: string): void;

  getArtist(): string;
  setArtist(value: string): void;

  getPermalink(): string;
  setPermalink(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueueSoundCloudTrackData.AsObject;
  static toObject(includeInstance: boolean, msg: QueueSoundCloudTrackData): QueueSoundCloudTrackData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QueueSoundCloudTrackData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueueSoundCloudTrackData;
  static deserializeBinaryFromReader(message: QueueSoundCloudTrackData, reader: jspb.BinaryReader): QueueSoundCloudTrackData;
}

export namespace QueueSoundCloudTrackData {
  export type AsObject = {
    id: string,
    title: string,
    thumbnailUrl: string,
    uploader: string,
    artist: string,
    permalink: string,
  }
}

export class QueueDocumentData extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueueDocumentData.AsObject;
  static toObject(includeInstance: boolean, msg: QueueDocumentData): QueueDocumentData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QueueDocumentData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueueDocumentData;
  static deserializeBinaryFromReader(message: QueueDocumentData, reader: jspb.BinaryReader): QueueDocumentData;
}

export namespace QueueDocumentData {
  export type AsObject = {
    id: string,
    title: string,
  }
}

export class QueueConcealedData extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueueConcealedData.AsObject;
  static toObject(includeInstance: boolean, msg: QueueConcealedData): QueueConcealedData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QueueConcealedData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueueConcealedData;
  static deserializeBinaryFromReader(message: QueueConcealedData, reader: jspb.BinaryReader): QueueConcealedData;
}

export namespace QueueConcealedData {
  export type AsObject = {
  }
}

export class QueueEntry extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasRequestedBy(): boolean;
  clearRequestedBy(): void;
  getRequestedBy(): common_pb.User | undefined;
  setRequestedBy(value?: common_pb.User): void;

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

  getConcealed(): boolean;
  setConcealed(value: boolean): void;

  getCanMoveUp(): boolean;
  setCanMoveUp(value: boolean): void;

  getCanMoveDown(): boolean;
  setCanMoveDown(value: boolean): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): QueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: QueueYouTubeVideoData): void;

  hasSoundcloudTrackData(): boolean;
  clearSoundcloudTrackData(): void;
  getSoundcloudTrackData(): QueueSoundCloudTrackData | undefined;
  setSoundcloudTrackData(value?: QueueSoundCloudTrackData): void;

  hasDocumentData(): boolean;
  clearDocumentData(): void;
  getDocumentData(): QueueDocumentData | undefined;
  setDocumentData(value?: QueueDocumentData): void;

  hasConcealedData(): boolean;
  clearConcealedData(): void;
  getConcealedData(): QueueConcealedData | undefined;
  setConcealedData(value?: QueueConcealedData): void;

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
    requestedBy?: common_pb.User.AsObject,
    requestCost: string,
    requestedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    length?: google_protobuf_duration_pb.Duration.AsObject,
    offset?: google_protobuf_duration_pb.Duration.AsObject,
    unskippable: boolean,
    concealed: boolean,
    canMoveUp: boolean,
    canMoveDown: boolean,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
    soundcloudTrackData?: QueueSoundCloudTrackData.AsObject,
    documentData?: QueueDocumentData.AsObject,
    concealedData?: QueueConcealedData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 11,
    SOUNDCLOUD_TRACK_DATA = 12,
    DOCUMENT_DATA = 13,
    CONCEALED_DATA = 14,
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

  getSkipThresholdReducible(): boolean;
  setSkipThresholdReducible(value: boolean): void;

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
    skipThresholdReducible: boolean,
    rainAddress: string,
    rainBalance: string,
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

  clearResponsesList(): void;
  getResponsesList(): Array<string>;
  setResponsesList(value: Array<string>): void;
  addResponses(value: string, index?: number): string;

  getTrusted(): boolean;
  setTrusted(value: boolean): void;

  getClientVersion(): string;
  setClientVersion(value: string): void;

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
    responsesList: Array<string>,
    trusted: boolean,
    clientVersion: string,
  }
}

export class SubmitActivityChallengeResponse extends jspb.Message {
  getSkippedClientIntegrityChecks(): boolean;
  setSkippedClientIntegrityChecks(value: boolean): void;

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
    skippedClientIntegrityChecks: boolean,
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
  clearEventsList(): void;
  getEventsList(): Array<ChatUpdateEvent>;
  setEventsList(value: Array<ChatUpdateEvent>): void;
  addEvents(value?: ChatUpdateEvent, index?: number): ChatUpdateEvent;

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
    eventsList: Array<ChatUpdateEvent.AsObject>,
  }
}

export class ChatUpdateEvent extends jspb.Message {
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

  hasBlockedUserCreated(): boolean;
  clearBlockedUserCreated(): void;
  getBlockedUserCreated(): ChatBlockedUserCreatedEvent | undefined;
  setBlockedUserCreated(value?: ChatBlockedUserCreatedEvent): void;

  hasBlockedUserDeleted(): boolean;
  clearBlockedUserDeleted(): void;
  getBlockedUserDeleted(): ChatBlockedUserDeletedEvent | undefined;
  setBlockedUserDeleted(value?: ChatBlockedUserDeletedEvent): void;

  hasEmoteCreated(): boolean;
  clearEmoteCreated(): void;
  getEmoteCreated(): ChatEmoteCreatedEvent | undefined;
  setEmoteCreated(value?: ChatEmoteCreatedEvent): void;

  getEventCase(): ChatUpdateEvent.EventCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatUpdateEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatUpdateEvent): ChatUpdateEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatUpdateEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatUpdateEvent;
  static deserializeBinaryFromReader(message: ChatUpdateEvent, reader: jspb.BinaryReader): ChatUpdateEvent;
}

export namespace ChatUpdateEvent {
  export type AsObject = {
    disabled?: ChatDisabledEvent.AsObject,
    enabled?: ChatEnabledEvent.AsObject,
    messageCreated?: ChatMessageCreatedEvent.AsObject,
    messageDeleted?: ChatMessageDeletedEvent.AsObject,
    heartbeat?: ChatHeartbeatEvent.AsObject,
    blockedUserCreated?: ChatBlockedUserCreatedEvent.AsObject,
    blockedUserDeleted?: ChatBlockedUserDeletedEvent.AsObject,
    emoteCreated?: ChatEmoteCreatedEvent.AsObject,
  }

  export enum EventCase {
    EVENT_NOT_SET = 0,
    DISABLED = 1,
    ENABLED = 2,
    MESSAGE_CREATED = 3,
    MESSAGE_DELETED = 4,
    HEARTBEAT = 5,
    BLOCKED_USER_CREATED = 6,
    BLOCKED_USER_DELETED = 7,
    EMOTE_CREATED = 8,
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

  clearAttachmentsList(): void;
  getAttachmentsList(): Array<ChatMessageAttachment>;
  setAttachmentsList(value: Array<ChatMessageAttachment>): void;
  addAttachments(value?: ChatMessageAttachment, index?: number): ChatMessageAttachment;

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
    attachmentsList: Array<ChatMessageAttachment.AsObject>,
  }

  export enum MessageCase {
    MESSAGE_NOT_SET = 0,
    USER_MESSAGE = 3,
    SYSTEM_MESSAGE = 4,
  }
}

export class ChatMessageAttachment extends jspb.Message {
  hasTenorGif(): boolean;
  clearTenorGif(): void;
  getTenorGif(): ChatMessageTenorGifAttachment | undefined;
  setTenorGif(value?: ChatMessageTenorGifAttachment): void;

  hasApplicationPage(): boolean;
  clearApplicationPage(): void;
  getApplicationPage(): ChatMessageApplicationPageAttachment | undefined;
  setApplicationPage(value?: ChatMessageApplicationPageAttachment): void;

  getAttachmentCase(): ChatMessageAttachment.AttachmentCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessageAttachment.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessageAttachment): ChatMessageAttachment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessageAttachment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessageAttachment;
  static deserializeBinaryFromReader(message: ChatMessageAttachment, reader: jspb.BinaryReader): ChatMessageAttachment;
}

export namespace ChatMessageAttachment {
  export type AsObject = {
    tenorGif?: ChatMessageTenorGifAttachment.AsObject,
    applicationPage?: ChatMessageApplicationPageAttachment.AsObject,
  }

  export enum AttachmentCase {
    ATTACHMENT_NOT_SET = 0,
    TENOR_GIF = 1,
    APPLICATION_PAGE = 2,
  }
}

export class ChatMessageTenorGifAttachment extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getVideoUrl(): string;
  setVideoUrl(value: string): void;

  getVideoFallbackUrl(): string;
  setVideoFallbackUrl(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getWidth(): number;
  setWidth(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessageTenorGifAttachment.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessageTenorGifAttachment): ChatMessageTenorGifAttachment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessageTenorGifAttachment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessageTenorGifAttachment;
  static deserializeBinaryFromReader(message: ChatMessageTenorGifAttachment, reader: jspb.BinaryReader): ChatMessageTenorGifAttachment;
}

export namespace ChatMessageTenorGifAttachment {
  export type AsObject = {
    id: string,
    videoUrl: string,
    videoFallbackUrl: string,
    title: string,
    width: number,
    height: number,
  }
}

export class ChatMessageApplicationPageAttachment extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getPageId(): string;
  setPageId(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  hasPageInfo(): boolean;
  clearPageInfo(): void;
  getPageInfo(): application_runtime_pb.ResolveApplicationPageResponse | undefined;
  setPageInfo(value?: application_runtime_pb.ResolveApplicationPageResponse): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessageApplicationPageAttachment.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessageApplicationPageAttachment): ChatMessageApplicationPageAttachment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessageApplicationPageAttachment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessageApplicationPageAttachment;
  static deserializeBinaryFromReader(message: ChatMessageApplicationPageAttachment, reader: jspb.BinaryReader): ChatMessageApplicationPageAttachment;
}

export namespace ChatMessageApplicationPageAttachment {
  export type AsObject = {
    applicationId: string,
    pageId: string,
    height: number,
    pageInfo?: application_runtime_pb.ResolveApplicationPageResponse.AsObject,
  }
}

export class UserChatMessage extends jspb.Message {
  hasAuthor(): boolean;
  clearAuthor(): void;
  getAuthor(): common_pb.User | undefined;
  setAuthor(value?: common_pb.User): void;

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
    author?: common_pb.User.AsObject,
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

export class ChatBlockedUserCreatedEvent extends jspb.Message {
  getBlockedUserAddress(): string;
  setBlockedUserAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatBlockedUserCreatedEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatBlockedUserCreatedEvent): ChatBlockedUserCreatedEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatBlockedUserCreatedEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatBlockedUserCreatedEvent;
  static deserializeBinaryFromReader(message: ChatBlockedUserCreatedEvent, reader: jspb.BinaryReader): ChatBlockedUserCreatedEvent;
}

export namespace ChatBlockedUserCreatedEvent {
  export type AsObject = {
    blockedUserAddress: string,
  }
}

export class ChatBlockedUserDeletedEvent extends jspb.Message {
  getBlockedUserAddress(): string;
  setBlockedUserAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatBlockedUserDeletedEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatBlockedUserDeletedEvent): ChatBlockedUserDeletedEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatBlockedUserDeletedEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatBlockedUserDeletedEvent;
  static deserializeBinaryFromReader(message: ChatBlockedUserDeletedEvent, reader: jspb.BinaryReader): ChatBlockedUserDeletedEvent;
}

export namespace ChatBlockedUserDeletedEvent {
  export type AsObject = {
    blockedUserAddress: string,
  }
}

export class ChatEmoteCreatedEvent extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getShortcode(): string;
  setShortcode(value: string): void;

  getAnimated(): boolean;
  setAnimated(value: boolean): void;

  getRequiresSubscription(): boolean;
  setRequiresSubscription(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatEmoteCreatedEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatEmoteCreatedEvent): ChatEmoteCreatedEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatEmoteCreatedEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatEmoteCreatedEvent;
  static deserializeBinaryFromReader(message: ChatEmoteCreatedEvent, reader: jspb.BinaryReader): ChatEmoteCreatedEvent;
}

export namespace ChatEmoteCreatedEvent {
  export type AsObject = {
    id: string,
    shortcode: string,
    animated: boolean,
    requiresSubscription: boolean,
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

  hasTenorGifAttachment(): boolean;
  clearTenorGifAttachment(): void;
  getTenorGifAttachment(): string;
  setTenorGifAttachment(value: string): void;

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
    tenorGifAttachment: string,
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
  getBannedBy(): common_pb.User | undefined;
  setBannedBy(value?: common_pb.User): void;

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
    bannedBy?: common_pb.User.AsObject,
  }
}

export class UserBansRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

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
    paginationParams?: common_pb.PaginationParameters.AsObject,
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

export class VerifyUserRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getSkipClientIntegrityChecks(): boolean;
  setSkipClientIntegrityChecks(value: boolean): void;

  getSkipIpAddressReputationChecks(): boolean;
  setSkipIpAddressReputationChecks(value: boolean): void;

  getReduceHardChallengeFrequency(): boolean;
  setReduceHardChallengeFrequency(value: boolean): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyUserRequest): VerifyUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyUserRequest;
  static deserializeBinaryFromReader(message: VerifyUserRequest, reader: jspb.BinaryReader): VerifyUserRequest;
}

export namespace VerifyUserRequest {
  export type AsObject = {
    address: string,
    skipClientIntegrityChecks: boolean,
    skipIpAddressReputationChecks: boolean,
    reduceHardChallengeFrequency: boolean,
    reason: string,
  }
}

export class VerifyUserResponse extends jspb.Message {
  getVerificationId(): string;
  setVerificationId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyUserResponse): VerifyUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyUserResponse;
  static deserializeBinaryFromReader(message: VerifyUserResponse, reader: jspb.BinaryReader): VerifyUserResponse;
}

export namespace VerifyUserResponse {
  export type AsObject = {
    verificationId: string,
  }
}

export class RemoveUserVerificationRequest extends jspb.Message {
  getVerificationId(): string;
  setVerificationId(value: string): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveUserVerificationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveUserVerificationRequest): RemoveUserVerificationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveUserVerificationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveUserVerificationRequest;
  static deserializeBinaryFromReader(message: RemoveUserVerificationRequest, reader: jspb.BinaryReader): RemoveUserVerificationRequest;
}

export namespace RemoveUserVerificationRequest {
  export type AsObject = {
    verificationId: string,
    reason: string,
  }
}

export class RemoveUserVerificationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveUserVerificationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveUserVerificationResponse): RemoveUserVerificationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveUserVerificationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveUserVerificationResponse;
  static deserializeBinaryFromReader(message: RemoveUserVerificationResponse, reader: jspb.BinaryReader): RemoveUserVerificationResponse;
}

export namespace RemoveUserVerificationResponse {
  export type AsObject = {
  }
}

export class UserVerification extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getAddress(): string;
  setAddress(value: string): void;

  getSkipClientIntegrityChecks(): boolean;
  setSkipClientIntegrityChecks(value: boolean): void;

  getSkipIpAddressReputationChecks(): boolean;
  setSkipIpAddressReputationChecks(value: boolean): void;

  getReduceHardChallengeFrequency(): boolean;
  setReduceHardChallengeFrequency(value: boolean): void;

  getReason(): string;
  setReason(value: string): void;

  hasVerifiedBy(): boolean;
  clearVerifiedBy(): void;
  getVerifiedBy(): common_pb.User | undefined;
  setVerifiedBy(value?: common_pb.User): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserVerification.AsObject;
  static toObject(includeInstance: boolean, msg: UserVerification): UserVerification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserVerification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserVerification;
  static deserializeBinaryFromReader(message: UserVerification, reader: jspb.BinaryReader): UserVerification;
}

export namespace UserVerification {
  export type AsObject = {
    id: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    address: string,
    skipClientIntegrityChecks: boolean,
    skipIpAddressReputationChecks: boolean,
    reduceHardChallengeFrequency: boolean,
    reason: string,
    verifiedBy?: common_pb.User.AsObject,
  }
}

export class UserVerificationsRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserVerificationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserVerificationsRequest): UserVerificationsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserVerificationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserVerificationsRequest;
  static deserializeBinaryFromReader(message: UserVerificationsRequest, reader: jspb.BinaryReader): UserVerificationsRequest;
}

export namespace UserVerificationsRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class UserVerificationsResponse extends jspb.Message {
  clearUserVerificationsList(): void;
  getUserVerificationsList(): Array<UserVerification>;
  setUserVerificationsList(value: Array<UserVerification>): void;
  addUserVerifications(value?: UserVerification, index?: number): UserVerification;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserVerificationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserVerificationsResponse): UserVerificationsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserVerificationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserVerificationsResponse;
  static deserializeBinaryFromReader(message: UserVerificationsResponse, reader: jspb.BinaryReader): UserVerificationsResponse;
}

export namespace UserVerificationsResponse {
  export type AsObject = {
    userVerificationsList: Array<UserVerification.AsObject>,
    offset: number,
    total: number,
  }
}

export class SetMediaEnqueuingEnabledRequest extends jspb.Message {
  getAllowed(): AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap];
  setAllowed(value: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap]): void;

  hasEnqueuingPassword(): boolean;
  clearEnqueuingPassword(): void;
  getEnqueuingPassword(): string;
  setEnqueuingPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMediaEnqueuingEnabledRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetMediaEnqueuingEnabledRequest): SetMediaEnqueuingEnabledRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMediaEnqueuingEnabledRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMediaEnqueuingEnabledRequest;
  static deserializeBinaryFromReader(message: SetMediaEnqueuingEnabledRequest, reader: jspb.BinaryReader): SetMediaEnqueuingEnabledRequest;
}

export namespace SetMediaEnqueuingEnabledRequest {
  export type AsObject = {
    allowed: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap],
    enqueuingPassword: string,
  }
}

export class SetMediaEnqueuingEnabledResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMediaEnqueuingEnabledResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetMediaEnqueuingEnabledResponse): SetMediaEnqueuingEnabledResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMediaEnqueuingEnabledResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMediaEnqueuingEnabledResponse;
  static deserializeBinaryFromReader(message: SetMediaEnqueuingEnabledResponse, reader: jspb.BinaryReader): SetMediaEnqueuingEnabledResponse;
}

export namespace SetMediaEnqueuingEnabledResponse {
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

export class DisallowedMediaRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedMediaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedMediaRequest): DisallowedMediaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedMediaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedMediaRequest;
  static deserializeBinaryFromReader(message: DisallowedMediaRequest, reader: jspb.BinaryReader): DisallowedMediaRequest;
}

export namespace DisallowedMediaRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class DisallowedMedia extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasDisallowedBy(): boolean;
  clearDisallowedBy(): void;
  getDisallowedBy(): common_pb.User | undefined;
  setDisallowedBy(value?: common_pb.User): void;

  hasDisallowedAt(): boolean;
  clearDisallowedAt(): void;
  getDisallowedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDisallowedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getMediaType(): DisallowedMediaTypeMap[keyof DisallowedMediaTypeMap];
  setMediaType(value: DisallowedMediaTypeMap[keyof DisallowedMediaTypeMap]): void;

  getMediaId(): string;
  setMediaId(value: string): void;

  getMediaTitle(): string;
  setMediaTitle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedMedia.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedMedia): DisallowedMedia.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedMedia, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedMedia;
  static deserializeBinaryFromReader(message: DisallowedMedia, reader: jspb.BinaryReader): DisallowedMedia;
}

export namespace DisallowedMedia {
  export type AsObject = {
    id: string,
    disallowedBy?: common_pb.User.AsObject,
    disallowedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    mediaType: DisallowedMediaTypeMap[keyof DisallowedMediaTypeMap],
    mediaId: string,
    mediaTitle: string,
  }
}

export class DisallowedMediaResponse extends jspb.Message {
  clearDisallowedMediaList(): void;
  getDisallowedMediaList(): Array<DisallowedMedia>;
  setDisallowedMediaList(value: Array<DisallowedMedia>): void;
  addDisallowedMedia(value?: DisallowedMedia, index?: number): DisallowedMedia;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedMediaResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedMediaResponse): DisallowedMediaResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedMediaResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedMediaResponse;
  static deserializeBinaryFromReader(message: DisallowedMediaResponse, reader: jspb.BinaryReader): DisallowedMediaResponse;
}

export namespace DisallowedMediaResponse {
  export type AsObject = {
    disallowedMediaList: Array<DisallowedMedia.AsObject>,
    offset: number,
    total: number,
  }
}

export class AddDisallowedMediaRequest extends jspb.Message {
  hasDisallowedMediaRequest(): boolean;
  clearDisallowedMediaRequest(): void;
  getDisallowedMediaRequest(): EnqueueMediaRequest | undefined;
  setDisallowedMediaRequest(value?: EnqueueMediaRequest): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDisallowedMediaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddDisallowedMediaRequest): AddDisallowedMediaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDisallowedMediaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDisallowedMediaRequest;
  static deserializeBinaryFromReader(message: AddDisallowedMediaRequest, reader: jspb.BinaryReader): AddDisallowedMediaRequest;
}

export namespace AddDisallowedMediaRequest {
  export type AsObject = {
    disallowedMediaRequest?: EnqueueMediaRequest.AsObject,
  }
}

export class AddDisallowedMediaResponse extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDisallowedMediaResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddDisallowedMediaResponse): AddDisallowedMediaResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDisallowedMediaResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDisallowedMediaResponse;
  static deserializeBinaryFromReader(message: AddDisallowedMediaResponse, reader: jspb.BinaryReader): AddDisallowedMediaResponse;
}

export namespace AddDisallowedMediaResponse {
  export type AsObject = {
    id: string,
  }
}

export class RemoveDisallowedMediaRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDisallowedMediaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDisallowedMediaRequest): RemoveDisallowedMediaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDisallowedMediaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDisallowedMediaRequest;
  static deserializeBinaryFromReader(message: RemoveDisallowedMediaRequest, reader: jspb.BinaryReader): RemoveDisallowedMediaRequest;
}

export namespace RemoveDisallowedMediaRequest {
  export type AsObject = {
    id: string,
  }
}

export class RemoveDisallowedMediaResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDisallowedMediaResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDisallowedMediaResponse): RemoveDisallowedMediaResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDisallowedMediaResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDisallowedMediaResponse;
  static deserializeBinaryFromReader(message: RemoveDisallowedMediaResponse, reader: jspb.BinaryReader): RemoveDisallowedMediaResponse;
}

export namespace RemoveDisallowedMediaResponse {
  export type AsObject = {
  }
}

export class DisallowedMediaCollectionsRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedMediaCollectionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedMediaCollectionsRequest): DisallowedMediaCollectionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedMediaCollectionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedMediaCollectionsRequest;
  static deserializeBinaryFromReader(message: DisallowedMediaCollectionsRequest, reader: jspb.BinaryReader): DisallowedMediaCollectionsRequest;
}

export namespace DisallowedMediaCollectionsRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class DisallowedMediaCollection extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasDisallowedBy(): boolean;
  clearDisallowedBy(): void;
  getDisallowedBy(): common_pb.User | undefined;
  setDisallowedBy(value?: common_pb.User): void;

  hasDisallowedAt(): boolean;
  clearDisallowedAt(): void;
  getDisallowedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDisallowedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getCollectionType(): DisallowedMediaCollectionTypeMap[keyof DisallowedMediaCollectionTypeMap];
  setCollectionType(value: DisallowedMediaCollectionTypeMap[keyof DisallowedMediaCollectionTypeMap]): void;

  getCollectionId(): string;
  setCollectionId(value: string): void;

  getCollectionTitle(): string;
  setCollectionTitle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedMediaCollection.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedMediaCollection): DisallowedMediaCollection.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedMediaCollection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedMediaCollection;
  static deserializeBinaryFromReader(message: DisallowedMediaCollection, reader: jspb.BinaryReader): DisallowedMediaCollection;
}

export namespace DisallowedMediaCollection {
  export type AsObject = {
    id: string,
    disallowedBy?: common_pb.User.AsObject,
    disallowedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    collectionType: DisallowedMediaCollectionTypeMap[keyof DisallowedMediaCollectionTypeMap],
    collectionId: string,
    collectionTitle: string,
  }
}

export class DisallowedMediaCollectionsResponse extends jspb.Message {
  clearDisallowedMediaCollectionsList(): void;
  getDisallowedMediaCollectionsList(): Array<DisallowedMediaCollection>;
  setDisallowedMediaCollectionsList(value: Array<DisallowedMediaCollection>): void;
  addDisallowedMediaCollections(value?: DisallowedMediaCollection, index?: number): DisallowedMediaCollection;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisallowedMediaCollectionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DisallowedMediaCollectionsResponse): DisallowedMediaCollectionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisallowedMediaCollectionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisallowedMediaCollectionsResponse;
  static deserializeBinaryFromReader(message: DisallowedMediaCollectionsResponse, reader: jspb.BinaryReader): DisallowedMediaCollectionsResponse;
}

export namespace DisallowedMediaCollectionsResponse {
  export type AsObject = {
    disallowedMediaCollectionsList: Array<DisallowedMediaCollection.AsObject>,
    offset: number,
    total: number,
  }
}

export class AddDisallowedMediaCollectionRequest extends jspb.Message {
  hasDisallowedMediaRequest(): boolean;
  clearDisallowedMediaRequest(): void;
  getDisallowedMediaRequest(): EnqueueMediaRequest | undefined;
  setDisallowedMediaRequest(value?: EnqueueMediaRequest): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDisallowedMediaCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddDisallowedMediaCollectionRequest): AddDisallowedMediaCollectionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDisallowedMediaCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDisallowedMediaCollectionRequest;
  static deserializeBinaryFromReader(message: AddDisallowedMediaCollectionRequest, reader: jspb.BinaryReader): AddDisallowedMediaCollectionRequest;
}

export namespace AddDisallowedMediaCollectionRequest {
  export type AsObject = {
    disallowedMediaRequest?: EnqueueMediaRequest.AsObject,
  }
}

export class AddDisallowedMediaCollectionResponse extends jspb.Message {
  clearIdsList(): void;
  getIdsList(): Array<string>;
  setIdsList(value: Array<string>): void;
  addIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDisallowedMediaCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddDisallowedMediaCollectionResponse): AddDisallowedMediaCollectionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDisallowedMediaCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDisallowedMediaCollectionResponse;
  static deserializeBinaryFromReader(message: AddDisallowedMediaCollectionResponse, reader: jspb.BinaryReader): AddDisallowedMediaCollectionResponse;
}

export namespace AddDisallowedMediaCollectionResponse {
  export type AsObject = {
    idsList: Array<string>,
  }
}

export class RemoveDisallowedMediaCollectionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDisallowedMediaCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDisallowedMediaCollectionRequest): RemoveDisallowedMediaCollectionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDisallowedMediaCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDisallowedMediaCollectionRequest;
  static deserializeBinaryFromReader(message: RemoveDisallowedMediaCollectionRequest, reader: jspb.BinaryReader): RemoveDisallowedMediaCollectionRequest;
}

export namespace RemoveDisallowedMediaCollectionRequest {
  export type AsObject = {
    id: string,
  }
}

export class RemoveDisallowedMediaCollectionResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDisallowedMediaCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDisallowedMediaCollectionResponse): RemoveDisallowedMediaCollectionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDisallowedMediaCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDisallowedMediaCollectionResponse;
  static deserializeBinaryFromReader(message: RemoveDisallowedMediaCollectionResponse, reader: jspb.BinaryReader): RemoveDisallowedMediaCollectionResponse;
}

export namespace RemoveDisallowedMediaCollectionResponse {
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

  hasUpdatedAt(): boolean;
  clearUpdatedAt(): void;
  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

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
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
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

export class DocumentsRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentsRequest): DocumentsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentsRequest;
  static deserializeBinaryFromReader(message: DocumentsRequest, reader: jspb.BinaryReader): DocumentsRequest;
}

export namespace DocumentsRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class DocumentHeader extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getFormat(): string;
  setFormat(value: string): void;

  hasUpdatedAt(): boolean;
  clearUpdatedAt(): void;
  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasUpdatedBy(): boolean;
  clearUpdatedBy(): void;
  getUpdatedBy(): common_pb.User | undefined;
  setUpdatedBy(value?: common_pb.User): void;

  getPublic(): boolean;
  setPublic(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentHeader.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentHeader): DocumentHeader.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentHeader, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentHeader;
  static deserializeBinaryFromReader(message: DocumentHeader, reader: jspb.BinaryReader): DocumentHeader;
}

export namespace DocumentHeader {
  export type AsObject = {
    id: string,
    format: string,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedBy?: common_pb.User.AsObject,
    pb_public: boolean,
  }
}

export class DocumentsResponse extends jspb.Message {
  clearDocumentsList(): void;
  getDocumentsList(): Array<DocumentHeader>;
  setDocumentsList(value: Array<DocumentHeader>): void;
  addDocuments(value?: DocumentHeader, index?: number): DocumentHeader;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentsResponse): DocumentsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentsResponse;
  static deserializeBinaryFromReader(message: DocumentsResponse, reader: jspb.BinaryReader): DocumentsResponse;
}

export namespace DocumentsResponse {
  export type AsObject = {
    documentsList: Array<DocumentHeader.AsObject>,
    offset: number,
    total: number,
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

export class SetMinimumPricesMultiplierRequest extends jspb.Message {
  getMultiplier(): number;
  setMultiplier(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMinimumPricesMultiplierRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetMinimumPricesMultiplierRequest): SetMinimumPricesMultiplierRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMinimumPricesMultiplierRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMinimumPricesMultiplierRequest;
  static deserializeBinaryFromReader(message: SetMinimumPricesMultiplierRequest, reader: jspb.BinaryReader): SetMinimumPricesMultiplierRequest;
}

export namespace SetMinimumPricesMultiplierRequest {
  export type AsObject = {
    multiplier: number,
  }
}

export class SetMinimumPricesMultiplierResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMinimumPricesMultiplierResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetMinimumPricesMultiplierResponse): SetMinimumPricesMultiplierResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMinimumPricesMultiplierResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMinimumPricesMultiplierResponse;
  static deserializeBinaryFromReader(message: SetMinimumPricesMultiplierResponse, reader: jspb.BinaryReader): SetMinimumPricesMultiplierResponse;
}

export namespace SetMinimumPricesMultiplierResponse {
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
  getPeriod(): LeaderboardPeriodMap[keyof LeaderboardPeriodMap];
  setPeriod(value: LeaderboardPeriodMap[keyof LeaderboardPeriodMap]): void;

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
    period: LeaderboardPeriodMap[keyof LeaderboardPeriodMap],
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
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

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
    paginationParams?: common_pb.PaginationParameters.AsObject,
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

  hasSoundcloudTrackData(): boolean;
  clearSoundcloudTrackData(): void;
  getSoundcloudTrackData(): QueueSoundCloudTrackData | undefined;
  setSoundcloudTrackData(value?: QueueSoundCloudTrackData): void;

  hasDocumentData(): boolean;
  clearDocumentData(): void;
  getDocumentData(): QueueDocumentData | undefined;
  setDocumentData(value?: QueueDocumentData): void;

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
    soundcloudTrackData?: QueueSoundCloudTrackData.AsObject,
    documentData?: QueueDocumentData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 6,
    SOUNDCLOUD_TRACK_DATA = 7,
    DOCUMENT_DATA = 8,
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
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

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
    paginationParams?: common_pb.PaginationParameters.AsObject,
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

export class RaffleDrawing extends jspb.Message {
  getRaffleId(): string;
  setRaffleId(value: string): void;

  getDrawingNumber(): number;
  setDrawingNumber(value: number): void;

  hasPeriodStart(): boolean;
  clearPeriodStart(): void;
  getPeriodStart(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPeriodStart(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasPeriodEnd(): boolean;
  clearPeriodEnd(): void;
  getPeriodEnd(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPeriodEnd(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getStatus(): RaffleDrawingStatusMap[keyof RaffleDrawingStatusMap];
  setStatus(value: RaffleDrawingStatusMap[keyof RaffleDrawingStatusMap]): void;

  getReason(): string;
  setReason(value: string): void;

  hasWinningTicketNumber(): boolean;
  clearWinningTicketNumber(): void;
  getWinningTicketNumber(): number;
  setWinningTicketNumber(value: number): void;

  hasWinner(): boolean;
  clearWinner(): void;
  getWinner(): common_pb.User | undefined;
  setWinner(value?: common_pb.User): void;

  hasPrizeTxHash(): boolean;
  clearPrizeTxHash(): void;
  getPrizeTxHash(): string;
  setPrizeTxHash(value: string): void;

  getEntriesUrl(): string;
  setEntriesUrl(value: string): void;

  getInfoUrl(): string;
  setInfoUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RaffleDrawing.AsObject;
  static toObject(includeInstance: boolean, msg: RaffleDrawing): RaffleDrawing.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RaffleDrawing, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RaffleDrawing;
  static deserializeBinaryFromReader(message: RaffleDrawing, reader: jspb.BinaryReader): RaffleDrawing;
}

export namespace RaffleDrawing {
  export type AsObject = {
    raffleId: string,
    drawingNumber: number,
    periodStart?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    periodEnd?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    status: RaffleDrawingStatusMap[keyof RaffleDrawingStatusMap],
    reason: string,
    winningTicketNumber: number,
    winner?: common_pb.User.AsObject,
    prizeTxHash: string,
    entriesUrl: string,
    infoUrl: string,
  }
}

export class RaffleDrawingsRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RaffleDrawingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RaffleDrawingsRequest): RaffleDrawingsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RaffleDrawingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RaffleDrawingsRequest;
  static deserializeBinaryFromReader(message: RaffleDrawingsRequest, reader: jspb.BinaryReader): RaffleDrawingsRequest;
}

export namespace RaffleDrawingsRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
  }
}

export class RaffleDrawingsResponse extends jspb.Message {
  clearRaffleDrawingsList(): void;
  getRaffleDrawingsList(): Array<RaffleDrawing>;
  setRaffleDrawingsList(value: Array<RaffleDrawing>): void;
  addRaffleDrawings(value?: RaffleDrawing, index?: number): RaffleDrawing;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RaffleDrawingsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RaffleDrawingsResponse): RaffleDrawingsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RaffleDrawingsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RaffleDrawingsResponse;
  static deserializeBinaryFromReader(message: RaffleDrawingsResponse, reader: jspb.BinaryReader): RaffleDrawingsResponse;
}

export namespace RaffleDrawingsResponse {
  export type AsObject = {
    raffleDrawingsList: Array<RaffleDrawing.AsObject>,
    offset: number,
    total: number,
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

  getRemoteAddressHasGoodReputation(): boolean;
  setRemoteAddressHasGoodReputation(value: boolean): void;

  getRemoteAddressBannedFromRewards(): boolean;
  setRemoteAddressBannedFromRewards(value: boolean): void;

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

  getClientIntegrityChecksSkipped(): boolean;
  setClientIntegrityChecksSkipped(value: boolean): void;

  getIpAddressReputationChecksSkipped(): boolean;
  setIpAddressReputationChecksSkipped(value: boolean): void;

  getHardChallengeFrequencyReduced(): boolean;
  setHardChallengeFrequencyReduced(value: boolean): void;

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
    remoteAddressHasGoodReputation: boolean,
    remoteAddressBannedFromRewards: boolean,
    legitimate: boolean,
    notLegitimateSince?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    stoppedWatchingAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    activityChallenge?: ActivityChallenge.AsObject,
    clientIntegrityChecksSkipped: boolean,
    ipAddressReputationChecksSkipped: boolean,
    hardChallengeFrequencyReduced: boolean,
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

export class MonitorModerationStatusRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonitorModerationStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MonitorModerationStatusRequest): MonitorModerationStatusRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MonitorModerationStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonitorModerationStatusRequest;
  static deserializeBinaryFromReader(message: MonitorModerationStatusRequest, reader: jspb.BinaryReader): MonitorModerationStatusRequest;
}

export namespace MonitorModerationStatusRequest {
  export type AsObject = {
  }
}

export class ModerationStatusOverview extends jspb.Message {
  getAllowedMediaEnqueuing(): AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap];
  setAllowedMediaEnqueuing(value: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap]): void;

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

  hasQueueInsertCursor(): boolean;
  clearQueueInsertCursor(): void;
  getQueueInsertCursor(): string;
  setQueueInsertCursor(value: string): void;

  getMinimumPricesMultiplier(): number;
  setMinimumPricesMultiplier(value: number): void;

  clearActivelyModeratingList(): void;
  getActivelyModeratingList(): Array<common_pb.User>;
  setActivelyModeratingList(value: Array<common_pb.User>): void;
  addActivelyModerating(value?: common_pb.User, index?: number): common_pb.User;

  getAllowEntryReordering(): boolean;
  setAllowEntryReordering(value: boolean): void;

  clearVipUsersList(): void;
  getVipUsersList(): Array<common_pb.User>;
  setVipUsersList(value: Array<common_pb.User>): void;
  addVipUsers(value?: common_pb.User, index?: number): common_pb.User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModerationStatusOverview.AsObject;
  static toObject(includeInstance: boolean, msg: ModerationStatusOverview): ModerationStatusOverview.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ModerationStatusOverview, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModerationStatusOverview;
  static deserializeBinaryFromReader(message: ModerationStatusOverview, reader: jspb.BinaryReader): ModerationStatusOverview;
}

export namespace ModerationStatusOverview {
  export type AsObject = {
    allowedMediaEnqueuing: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap],
    enqueuingPricesMultiplier: number,
    crowdfundedSkippingEnabled: boolean,
    crowdfundedSkippingPricesMultiplier: number,
    newEntriesAlwaysUnskippable: boolean,
    ownEntryRemovalEnabled: boolean,
    allSkippingEnabled: boolean,
    queueInsertCursor: string,
    minimumPricesMultiplier: number,
    activelyModeratingList: Array<common_pb.User.AsObject>,
    allowEntryReordering: boolean,
    vipUsersList: Array<common_pb.User.AsObject>,
  }
}

export class SetQueueEntryReorderingAllowedRequest extends jspb.Message {
  getAllowed(): boolean;
  setAllowed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetQueueEntryReorderingAllowedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetQueueEntryReorderingAllowedRequest): SetQueueEntryReorderingAllowedRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetQueueEntryReorderingAllowedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetQueueEntryReorderingAllowedRequest;
  static deserializeBinaryFromReader(message: SetQueueEntryReorderingAllowedRequest, reader: jspb.BinaryReader): SetQueueEntryReorderingAllowedRequest;
}

export namespace SetQueueEntryReorderingAllowedRequest {
  export type AsObject = {
    allowed: boolean,
  }
}

export class SetQueueEntryReorderingAllowedResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetQueueEntryReorderingAllowedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetQueueEntryReorderingAllowedResponse): SetQueueEntryReorderingAllowedResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetQueueEntryReorderingAllowedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetQueueEntryReorderingAllowedResponse;
  static deserializeBinaryFromReader(message: SetQueueEntryReorderingAllowedResponse, reader: jspb.BinaryReader): SetQueueEntryReorderingAllowedResponse;
}

export namespace SetQueueEntryReorderingAllowedResponse {
  export type AsObject = {
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

export class ConnectionsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConnectionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConnectionsRequest): ConnectionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConnectionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConnectionsRequest;
  static deserializeBinaryFromReader(message: ConnectionsRequest, reader: jspb.BinaryReader): ConnectionsRequest;
}

export namespace ConnectionsRequest {
  export type AsObject = {
  }
}

export class Connection extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getService(): ConnectionServiceMap[keyof ConnectionServiceMap];
  setService(value: ConnectionServiceMap[keyof ConnectionServiceMap]): void;

  getName(): string;
  setName(value: string): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Connection.AsObject;
  static toObject(includeInstance: boolean, msg: Connection): Connection.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Connection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Connection;
  static deserializeBinaryFromReader(message: Connection, reader: jspb.BinaryReader): Connection;
}

export namespace Connection {
  export type AsObject = {
    id: string,
    service: ConnectionServiceMap[keyof ConnectionServiceMap],
    name: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ServiceInfo extends jspb.Message {
  getService(): ConnectionServiceMap[keyof ConnectionServiceMap];
  setService(value: ConnectionServiceMap[keyof ConnectionServiceMap]): void;

  hasMaxConnections(): boolean;
  clearMaxConnections(): void;
  getMaxConnections(): number;
  setMaxConnections(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceInfo): ServiceInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceInfo;
  static deserializeBinaryFromReader(message: ServiceInfo, reader: jspb.BinaryReader): ServiceInfo;
}

export namespace ServiceInfo {
  export type AsObject = {
    service: ConnectionServiceMap[keyof ConnectionServiceMap],
    maxConnections: number,
  }
}

export class ConnectionsResponse extends jspb.Message {
  clearConnectionsList(): void;
  getConnectionsList(): Array<Connection>;
  setConnectionsList(value: Array<Connection>): void;
  addConnections(value?: Connection, index?: number): Connection;

  clearServiceInfosList(): void;
  getServiceInfosList(): Array<ServiceInfo>;
  setServiceInfosList(value: Array<ServiceInfo>): void;
  addServiceInfos(value?: ServiceInfo, index?: number): ServiceInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConnectionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ConnectionsResponse): ConnectionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConnectionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConnectionsResponse;
  static deserializeBinaryFromReader(message: ConnectionsResponse, reader: jspb.BinaryReader): ConnectionsResponse;
}

export namespace ConnectionsResponse {
  export type AsObject = {
    connectionsList: Array<Connection.AsObject>,
    serviceInfosList: Array<ServiceInfo.AsObject>,
  }
}

export class CreateConnectionRequest extends jspb.Message {
  getService(): ConnectionServiceMap[keyof ConnectionServiceMap];
  setService(value: ConnectionServiceMap[keyof ConnectionServiceMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateConnectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateConnectionRequest): CreateConnectionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateConnectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateConnectionRequest;
  static deserializeBinaryFromReader(message: CreateConnectionRequest, reader: jspb.BinaryReader): CreateConnectionRequest;
}

export namespace CreateConnectionRequest {
  export type AsObject = {
    service: ConnectionServiceMap[keyof ConnectionServiceMap],
  }
}

export class CreateConnectionResponse extends jspb.Message {
  getAuthUrl(): string;
  setAuthUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateConnectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateConnectionResponse): CreateConnectionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateConnectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateConnectionResponse;
  static deserializeBinaryFromReader(message: CreateConnectionResponse, reader: jspb.BinaryReader): CreateConnectionResponse;
}

export namespace CreateConnectionResponse {
  export type AsObject = {
    authUrl: string,
  }
}

export class RemoveConnectionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveConnectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveConnectionRequest): RemoveConnectionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveConnectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveConnectionRequest;
  static deserializeBinaryFromReader(message: RemoveConnectionRequest, reader: jspb.BinaryReader): RemoveConnectionRequest;
}

export namespace RemoveConnectionRequest {
  export type AsObject = {
    id: string,
  }
}

export class RemoveConnectionResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveConnectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveConnectionResponse): RemoveConnectionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveConnectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveConnectionResponse;
  static deserializeBinaryFromReader(message: RemoveConnectionResponse, reader: jspb.BinaryReader): RemoveConnectionResponse;
}

export namespace RemoveConnectionResponse {
  export type AsObject = {
  }
}

export class SetQueueInsertCursorRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetQueueInsertCursorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetQueueInsertCursorRequest): SetQueueInsertCursorRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetQueueInsertCursorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetQueueInsertCursorRequest;
  static deserializeBinaryFromReader(message: SetQueueInsertCursorRequest, reader: jspb.BinaryReader): SetQueueInsertCursorRequest;
}

export namespace SetQueueInsertCursorRequest {
  export type AsObject = {
    id: string,
  }
}

export class SetQueueInsertCursorResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetQueueInsertCursorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetQueueInsertCursorResponse): SetQueueInsertCursorResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetQueueInsertCursorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetQueueInsertCursorResponse;
  static deserializeBinaryFromReader(message: SetQueueInsertCursorResponse, reader: jspb.BinaryReader): SetQueueInsertCursorResponse;
}

export namespace SetQueueInsertCursorResponse {
  export type AsObject = {
  }
}

export class ClearQueueInsertCursorRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClearQueueInsertCursorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClearQueueInsertCursorRequest): ClearQueueInsertCursorRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClearQueueInsertCursorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClearQueueInsertCursorRequest;
  static deserializeBinaryFromReader(message: ClearQueueInsertCursorRequest, reader: jspb.BinaryReader): ClearQueueInsertCursorRequest;
}

export namespace ClearQueueInsertCursorRequest {
  export type AsObject = {
  }
}

export class ClearQueueInsertCursorResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClearQueueInsertCursorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClearQueueInsertCursorResponse): ClearQueueInsertCursorResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClearQueueInsertCursorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClearQueueInsertCursorResponse;
  static deserializeBinaryFromReader(message: ClearQueueInsertCursorResponse, reader: jspb.BinaryReader): ClearQueueInsertCursorResponse;
}

export namespace ClearQueueInsertCursorResponse {
  export type AsObject = {
  }
}

export class UserProfileRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserProfileRequest): UserProfileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserProfileRequest;
  static deserializeBinaryFromReader(message: UserProfileRequest, reader: jspb.BinaryReader): UserProfileRequest;
}

export namespace UserProfileRequest {
  export type AsObject = {
    address: string,
  }
}

export class UserProfileResponse extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): common_pb.User | undefined;
  setUser(value?: common_pb.User): void;

  clearRecentlyPlayedRequestsList(): void;
  getRecentlyPlayedRequestsList(): Array<PlayedMedia>;
  setRecentlyPlayedRequestsList(value: Array<PlayedMedia>): void;
  addRecentlyPlayedRequests(value?: PlayedMedia, index?: number): PlayedMedia;

  getBiography(): string;
  setBiography(value: string): void;

  hasCurrentSubscription(): boolean;
  clearCurrentSubscription(): void;
  getCurrentSubscription(): SubscriptionDetails | undefined;
  setCurrentSubscription(value?: SubscriptionDetails): void;

  hasYoutubeVideoData(): boolean;
  clearYoutubeVideoData(): void;
  getYoutubeVideoData(): QueueYouTubeVideoData | undefined;
  setYoutubeVideoData(value?: QueueYouTubeVideoData): void;

  hasSoundcloudTrackData(): boolean;
  clearSoundcloudTrackData(): void;
  getSoundcloudTrackData(): QueueSoundCloudTrackData | undefined;
  setSoundcloudTrackData(value?: QueueSoundCloudTrackData): void;

  hasDocumentData(): boolean;
  clearDocumentData(): void;
  getDocumentData(): QueueDocumentData | undefined;
  setDocumentData(value?: QueueDocumentData): void;

  getFeaturedMediaCase(): UserProfileResponse.FeaturedMediaCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserProfileResponse): UserProfileResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserProfileResponse;
  static deserializeBinaryFromReader(message: UserProfileResponse, reader: jspb.BinaryReader): UserProfileResponse;
}

export namespace UserProfileResponse {
  export type AsObject = {
    user?: common_pb.User.AsObject,
    recentlyPlayedRequestsList: Array<PlayedMedia.AsObject>,
    biography: string,
    currentSubscription?: SubscriptionDetails.AsObject,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
    soundcloudTrackData?: QueueSoundCloudTrackData.AsObject,
    documentData?: QueueDocumentData.AsObject,
  }

  export enum FeaturedMediaCase {
    FEATURED_MEDIA_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 5,
    SOUNDCLOUD_TRACK_DATA = 6,
    DOCUMENT_DATA = 7,
  }
}

export class UserStatsRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserStatsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserStatsRequest): UserStatsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserStatsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserStatsRequest;
  static deserializeBinaryFromReader(message: UserStatsRequest, reader: jspb.BinaryReader): UserStatsRequest;
}

export namespace UserStatsRequest {
  export type AsObject = {
    address: string,
  }
}

export class UserStatsForPeriod extends jspb.Message {
  getTotalSpent(): string;
  setTotalSpent(value: string): void;

  getTotalWithdrawn(): string;
  setTotalWithdrawn(value: string): void;

  getRequestedMediaCount(): number;
  setRequestedMediaCount(value: number): void;

  hasRequestedMediaPlayTime(): boolean;
  clearRequestedMediaPlayTime(): void;
  getRequestedMediaPlayTime(): google_protobuf_duration_pb.Duration | undefined;
  setRequestedMediaPlayTime(value?: google_protobuf_duration_pb.Duration): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserStatsForPeriod.AsObject;
  static toObject(includeInstance: boolean, msg: UserStatsForPeriod): UserStatsForPeriod.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserStatsForPeriod, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserStatsForPeriod;
  static deserializeBinaryFromReader(message: UserStatsForPeriod, reader: jspb.BinaryReader): UserStatsForPeriod;
}

export namespace UserStatsForPeriod {
  export type AsObject = {
    totalSpent: string,
    totalWithdrawn: string,
    requestedMediaCount: number,
    requestedMediaPlayTime?: google_protobuf_duration_pb.Duration.AsObject,
  }
}

export class UserStatsResponse extends jspb.Message {
  hasStatsAllTime(): boolean;
  clearStatsAllTime(): void;
  getStatsAllTime(): UserStatsForPeriod | undefined;
  setStatsAllTime(value?: UserStatsForPeriod): void;

  hasStats30Days(): boolean;
  clearStats30Days(): void;
  getStats30Days(): UserStatsForPeriod | undefined;
  setStats30Days(value?: UserStatsForPeriod): void;

  hasStats7Days(): boolean;
  clearStats7Days(): void;
  getStats7Days(): UserStatsForPeriod | undefined;
  setStats7Days(value?: UserStatsForPeriod): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserStatsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserStatsResponse): UserStatsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserStatsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserStatsResponse;
  static deserializeBinaryFromReader(message: UserStatsResponse, reader: jspb.BinaryReader): UserStatsResponse;
}

export namespace UserStatsResponse {
  export type AsObject = {
    statsAllTime?: UserStatsForPeriod.AsObject,
    stats30Days?: UserStatsForPeriod.AsObject,
    stats7Days?: UserStatsForPeriod.AsObject,
  }
}

export class PlayedMedia extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasRequestedBy(): boolean;
  clearRequestedBy(): void;
  getRequestedBy(): common_pb.User | undefined;
  setRequestedBy(value?: common_pb.User): void;

  getRequestCost(): string;
  setRequestCost(value: string): void;

  hasEnqueuedAt(): boolean;
  clearEnqueuedAt(): void;
  getEnqueuedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEnqueuedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasStartedAt(): boolean;
  clearStartedAt(): void;
  getStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasEndedAt(): boolean;
  clearEndedAt(): void;
  getEndedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

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

  hasSoundcloudTrackData(): boolean;
  clearSoundcloudTrackData(): void;
  getSoundcloudTrackData(): QueueSoundCloudTrackData | undefined;
  setSoundcloudTrackData(value?: QueueSoundCloudTrackData): void;

  hasDocumentData(): boolean;
  clearDocumentData(): void;
  getDocumentData(): QueueDocumentData | undefined;
  setDocumentData(value?: QueueDocumentData): void;

  getMediaInfoCase(): PlayedMedia.MediaInfoCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayedMedia.AsObject;
  static toObject(includeInstance: boolean, msg: PlayedMedia): PlayedMedia.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayedMedia, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayedMedia;
  static deserializeBinaryFromReader(message: PlayedMedia, reader: jspb.BinaryReader): PlayedMedia;
}

export namespace PlayedMedia {
  export type AsObject = {
    id: string,
    requestedBy?: common_pb.User.AsObject,
    requestCost: string,
    enqueuedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    startedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    length?: google_protobuf_duration_pb.Duration.AsObject,
    offset?: google_protobuf_duration_pb.Duration.AsObject,
    unskippable: boolean,
    youtubeVideoData?: QueueYouTubeVideoData.AsObject,
    soundcloudTrackData?: QueueSoundCloudTrackData.AsObject,
    documentData?: QueueDocumentData.AsObject,
  }

  export enum MediaInfoCase {
    MEDIA_INFO_NOT_SET = 0,
    YOUTUBE_VIDEO_DATA = 10,
    SOUNDCLOUD_TRACK_DATA = 11,
    DOCUMENT_DATA = 12,
  }
}

export class SetProfileBiographyRequest extends jspb.Message {
  getBiography(): string;
  setBiography(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetProfileBiographyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetProfileBiographyRequest): SetProfileBiographyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetProfileBiographyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetProfileBiographyRequest;
  static deserializeBinaryFromReader(message: SetProfileBiographyRequest, reader: jspb.BinaryReader): SetProfileBiographyRequest;
}

export namespace SetProfileBiographyRequest {
  export type AsObject = {
    biography: string,
  }
}

export class SetProfileBiographyResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetProfileBiographyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetProfileBiographyResponse): SetProfileBiographyResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetProfileBiographyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetProfileBiographyResponse;
  static deserializeBinaryFromReader(message: SetProfileBiographyResponse, reader: jspb.BinaryReader): SetProfileBiographyResponse;
}

export namespace SetProfileBiographyResponse {
  export type AsObject = {
  }
}

export class SetProfileFeaturedMediaRequest extends jspb.Message {
  hasMediaId(): boolean;
  clearMediaId(): void;
  getMediaId(): string;
  setMediaId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetProfileFeaturedMediaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetProfileFeaturedMediaRequest): SetProfileFeaturedMediaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetProfileFeaturedMediaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetProfileFeaturedMediaRequest;
  static deserializeBinaryFromReader(message: SetProfileFeaturedMediaRequest, reader: jspb.BinaryReader): SetProfileFeaturedMediaRequest;
}

export namespace SetProfileFeaturedMediaRequest {
  export type AsObject = {
    mediaId: string,
  }
}

export class SetProfileFeaturedMediaResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetProfileFeaturedMediaResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetProfileFeaturedMediaResponse): SetProfileFeaturedMediaResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetProfileFeaturedMediaResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetProfileFeaturedMediaResponse;
  static deserializeBinaryFromReader(message: SetProfileFeaturedMediaResponse, reader: jspb.BinaryReader): SetProfileFeaturedMediaResponse;
}

export namespace SetProfileFeaturedMediaResponse {
  export type AsObject = {
  }
}

export class ClearUserProfileRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClearUserProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClearUserProfileRequest): ClearUserProfileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClearUserProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClearUserProfileRequest;
  static deserializeBinaryFromReader(message: ClearUserProfileRequest, reader: jspb.BinaryReader): ClearUserProfileRequest;
}

export namespace ClearUserProfileRequest {
  export type AsObject = {
    address: string,
  }
}

export class ClearUserProfileResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClearUserProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClearUserProfileResponse): ClearUserProfileResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClearUserProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClearUserProfileResponse;
  static deserializeBinaryFromReader(message: ClearUserProfileResponse, reader: jspb.BinaryReader): ClearUserProfileResponse;
}

export namespace ClearUserProfileResponse {
  export type AsObject = {
  }
}

export class PlayedMediaHistoryRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayedMediaHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlayedMediaHistoryRequest): PlayedMediaHistoryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayedMediaHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayedMediaHistoryRequest;
  static deserializeBinaryFromReader(message: PlayedMediaHistoryRequest, reader: jspb.BinaryReader): PlayedMediaHistoryRequest;
}

export namespace PlayedMediaHistoryRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class PlayedMediaHistoryResponse extends jspb.Message {
  clearPlayedMediaList(): void;
  getPlayedMediaList(): Array<PlayedMedia>;
  setPlayedMediaList(value: Array<PlayedMedia>): void;
  addPlayedMedia(value?: PlayedMedia, index?: number): PlayedMedia;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayedMediaHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PlayedMediaHistoryResponse): PlayedMediaHistoryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayedMediaHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayedMediaHistoryResponse;
  static deserializeBinaryFromReader(message: PlayedMediaHistoryResponse, reader: jspb.BinaryReader): PlayedMediaHistoryResponse;
}

export namespace PlayedMediaHistoryResponse {
  export type AsObject = {
    playedMediaList: Array<PlayedMedia.AsObject>,
    offset: number,
    total: number,
  }
}

export class BlockUserRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BlockUserRequest): BlockUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockUserRequest;
  static deserializeBinaryFromReader(message: BlockUserRequest, reader: jspb.BinaryReader): BlockUserRequest;
}

export namespace BlockUserRequest {
  export type AsObject = {
    address: string,
  }
}

export class BlockUserResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BlockUserResponse): BlockUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockUserResponse;
  static deserializeBinaryFromReader(message: BlockUserResponse, reader: jspb.BinaryReader): BlockUserResponse;
}

export namespace BlockUserResponse {
  export type AsObject = {
  }
}

export class UnblockUserRequest extends jspb.Message {
  hasBlockId(): boolean;
  clearBlockId(): void;
  getBlockId(): string;
  setBlockId(value: string): void;

  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): string;
  setAddress(value: string): void;

  getBlockIdentificationCase(): UnblockUserRequest.BlockIdentificationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnblockUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnblockUserRequest): UnblockUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnblockUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnblockUserRequest;
  static deserializeBinaryFromReader(message: UnblockUserRequest, reader: jspb.BinaryReader): UnblockUserRequest;
}

export namespace UnblockUserRequest {
  export type AsObject = {
    blockId: string,
    address: string,
  }

  export enum BlockIdentificationCase {
    BLOCK_IDENTIFICATION_NOT_SET = 0,
    BLOCK_ID = 1,
    ADDRESS = 2,
  }
}

export class UnblockUserResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnblockUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnblockUserResponse): UnblockUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnblockUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnblockUserResponse;
  static deserializeBinaryFromReader(message: UnblockUserResponse, reader: jspb.BinaryReader): UnblockUserResponse;
}

export namespace UnblockUserResponse {
  export type AsObject = {
  }
}

export class BlockedUsersRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockedUsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BlockedUsersRequest): BlockedUsersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockedUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockedUsersRequest;
  static deserializeBinaryFromReader(message: BlockedUsersRequest, reader: jspb.BinaryReader): BlockedUsersRequest;
}

export namespace BlockedUsersRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
  }
}

export class BlockedUser extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasBlockedUser(): boolean;
  clearBlockedUser(): void;
  getBlockedUser(): common_pb.User | undefined;
  setBlockedUser(value?: common_pb.User): void;

  hasBlockedBy(): boolean;
  clearBlockedBy(): void;
  getBlockedBy(): common_pb.User | undefined;
  setBlockedBy(value?: common_pb.User): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockedUser.AsObject;
  static toObject(includeInstance: boolean, msg: BlockedUser): BlockedUser.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockedUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockedUser;
  static deserializeBinaryFromReader(message: BlockedUser, reader: jspb.BinaryReader): BlockedUser;
}

export namespace BlockedUser {
  export type AsObject = {
    id: string,
    blockedUser?: common_pb.User.AsObject,
    blockedBy?: common_pb.User.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class BlockedUsersResponse extends jspb.Message {
  clearBlockedUsersList(): void;
  getBlockedUsersList(): Array<BlockedUser>;
  setBlockedUsersList(value: Array<BlockedUser>): void;
  addBlockedUsers(value?: BlockedUser, index?: number): BlockedUser;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockedUsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BlockedUsersResponse): BlockedUsersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockedUsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockedUsersResponse;
  static deserializeBinaryFromReader(message: BlockedUsersResponse, reader: jspb.BinaryReader): BlockedUsersResponse;
}

export namespace BlockedUsersResponse {
  export type AsObject = {
    blockedUsersList: Array<BlockedUser.AsObject>,
    offset: number,
    total: number,
  }
}

export class MarkAsActivelyModeratingRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkAsActivelyModeratingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MarkAsActivelyModeratingRequest): MarkAsActivelyModeratingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MarkAsActivelyModeratingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkAsActivelyModeratingRequest;
  static deserializeBinaryFromReader(message: MarkAsActivelyModeratingRequest, reader: jspb.BinaryReader): MarkAsActivelyModeratingRequest;
}

export namespace MarkAsActivelyModeratingRequest {
  export type AsObject = {
  }
}

export class MarkAsActivelyModeratingResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkAsActivelyModeratingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MarkAsActivelyModeratingResponse): MarkAsActivelyModeratingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MarkAsActivelyModeratingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkAsActivelyModeratingResponse;
  static deserializeBinaryFromReader(message: MarkAsActivelyModeratingResponse, reader: jspb.BinaryReader): MarkAsActivelyModeratingResponse;
}

export namespace MarkAsActivelyModeratingResponse {
  export type AsObject = {
  }
}

export class StopActivelyModeratingRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StopActivelyModeratingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StopActivelyModeratingRequest): StopActivelyModeratingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StopActivelyModeratingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StopActivelyModeratingRequest;
  static deserializeBinaryFromReader(message: StopActivelyModeratingRequest, reader: jspb.BinaryReader): StopActivelyModeratingRequest;
}

export namespace StopActivelyModeratingRequest {
  export type AsObject = {
  }
}

export class StopActivelyModeratingResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StopActivelyModeratingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StopActivelyModeratingResponse): StopActivelyModeratingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StopActivelyModeratingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StopActivelyModeratingResponse;
  static deserializeBinaryFromReader(message: StopActivelyModeratingResponse, reader: jspb.BinaryReader): StopActivelyModeratingResponse;
}

export namespace StopActivelyModeratingResponse {
  export type AsObject = {
  }
}

export class PointsInfoRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PointsInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PointsInfoRequest): PointsInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PointsInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PointsInfoRequest;
  static deserializeBinaryFromReader(message: PointsInfoRequest, reader: jspb.BinaryReader): PointsInfoRequest;
}

export namespace PointsInfoRequest {
  export type AsObject = {
  }
}

export class PointsInfoResponse extends jspb.Message {
  getBalance(): number;
  setBalance(value: number): void;

  hasCurrentSubscription(): boolean;
  clearCurrentSubscription(): void;
  getCurrentSubscription(): SubscriptionDetails | undefined;
  setCurrentSubscription(value?: SubscriptionDetails): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PointsInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PointsInfoResponse): PointsInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PointsInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PointsInfoResponse;
  static deserializeBinaryFromReader(message: PointsInfoResponse, reader: jspb.BinaryReader): PointsInfoResponse;
}

export namespace PointsInfoResponse {
  export type AsObject = {
    balance: number,
    currentSubscription?: SubscriptionDetails.AsObject,
  }
}

export class SubscriptionDetails extends jspb.Message {
  hasSubscribedAt(): boolean;
  clearSubscribedAt(): void;
  getSubscribedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setSubscribedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasSubscribedUntil(): boolean;
  clearSubscribedUntil(): void;
  getSubscribedUntil(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setSubscribedUntil(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscriptionDetails.AsObject;
  static toObject(includeInstance: boolean, msg: SubscriptionDetails): SubscriptionDetails.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscriptionDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscriptionDetails;
  static deserializeBinaryFromReader(message: SubscriptionDetails, reader: jspb.BinaryReader): SubscriptionDetails;
}

export namespace SubscriptionDetails {
  export type AsObject = {
    subscribedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    subscribedUntil?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class PointsTransactionsRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PointsTransactionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PointsTransactionsRequest): PointsTransactionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PointsTransactionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PointsTransactionsRequest;
  static deserializeBinaryFromReader(message: PointsTransactionsRequest, reader: jspb.BinaryReader): PointsTransactionsRequest;
}

export namespace PointsTransactionsRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
  }
}

export class PointsTransactionsResponse extends jspb.Message {
  clearTransactionsList(): void;
  getTransactionsList(): Array<PointsTransaction>;
  setTransactionsList(value: Array<PointsTransaction>): void;
  addTransactions(value?: PointsTransaction, index?: number): PointsTransaction;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PointsTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PointsTransactionsResponse): PointsTransactionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PointsTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PointsTransactionsResponse;
  static deserializeBinaryFromReader(message: PointsTransactionsResponse, reader: jspb.BinaryReader): PointsTransactionsResponse;
}

export namespace PointsTransactionsResponse {
  export type AsObject = {
    transactionsList: Array<PointsTransaction.AsObject>,
    offset: number,
    total: number,
  }
}

export class PointsTransaction extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasUpdatedAt(): boolean;
  clearUpdatedAt(): void;
  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getValue(): number;
  setValue(value: number): void;

  getType(): PointsTransactionTypeMap[keyof PointsTransactionTypeMap];
  setType(value: PointsTransactionTypeMap[keyof PointsTransactionTypeMap]): void;

  getExtraMap(): jspb.Map<string, string>;
  clearExtraMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PointsTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: PointsTransaction): PointsTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PointsTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PointsTransaction;
  static deserializeBinaryFromReader(message: PointsTransaction, reader: jspb.BinaryReader): PointsTransaction;
}

export namespace PointsTransaction {
  export type AsObject = {
    id: string,
    rewardsAddress: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    value: number,
    type: PointsTransactionTypeMap[keyof PointsTransactionTypeMap],
    extraMap: Array<[string, string]>,
  }
}

export class ChatGifSearchRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): void;

  getCursor(): string;
  setCursor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatGifSearchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChatGifSearchRequest): ChatGifSearchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatGifSearchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatGifSearchRequest;
  static deserializeBinaryFromReader(message: ChatGifSearchRequest, reader: jspb.BinaryReader): ChatGifSearchRequest;
}

export namespace ChatGifSearchRequest {
  export type AsObject = {
    query: string,
    cursor: string,
  }
}

export class ChatGifSearchResponse extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<ChatGifSearchResult>;
  setResultsList(value: Array<ChatGifSearchResult>): void;
  addResults(value?: ChatGifSearchResult, index?: number): ChatGifSearchResult;

  getNextCursor(): string;
  setNextCursor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatGifSearchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ChatGifSearchResponse): ChatGifSearchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatGifSearchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatGifSearchResponse;
  static deserializeBinaryFromReader(message: ChatGifSearchResponse, reader: jspb.BinaryReader): ChatGifSearchResponse;
}

export namespace ChatGifSearchResponse {
  export type AsObject = {
    resultsList: Array<ChatGifSearchResult.AsObject>,
    nextCursor: string,
  }
}

export class ChatGifSearchResult extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getPreviewUrl(): string;
  setPreviewUrl(value: string): void;

  getPreviewFallbackUrl(): string;
  setPreviewFallbackUrl(value: string): void;

  getWidth(): number;
  setWidth(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  getPointsCost(): number;
  setPointsCost(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatGifSearchResult.AsObject;
  static toObject(includeInstance: boolean, msg: ChatGifSearchResult): ChatGifSearchResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatGifSearchResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatGifSearchResult;
  static deserializeBinaryFromReader(message: ChatGifSearchResult, reader: jspb.BinaryReader): ChatGifSearchResult;
}

export namespace ChatGifSearchResult {
  export type AsObject = {
    id: string,
    title: string,
    previewUrl: string,
    previewFallbackUrl: string,
    width: number,
    height: number,
    pointsCost: number,
  }
}

export class AdjustPointsBalanceRequest extends jspb.Message {
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  getValue(): number;
  setValue(value: number): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdjustPointsBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AdjustPointsBalanceRequest): AdjustPointsBalanceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AdjustPointsBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdjustPointsBalanceRequest;
  static deserializeBinaryFromReader(message: AdjustPointsBalanceRequest, reader: jspb.BinaryReader): AdjustPointsBalanceRequest;
}

export namespace AdjustPointsBalanceRequest {
  export type AsObject = {
    rewardsAddress: string,
    value: number,
    reason: string,
  }
}

export class AdjustPointsBalanceResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdjustPointsBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AdjustPointsBalanceResponse): AdjustPointsBalanceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AdjustPointsBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdjustPointsBalanceResponse;
  static deserializeBinaryFromReader(message: AdjustPointsBalanceResponse, reader: jspb.BinaryReader): AdjustPointsBalanceResponse;
}

export namespace AdjustPointsBalanceResponse {
  export type AsObject = {
  }
}

export class ConvertBananoToPointsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConvertBananoToPointsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConvertBananoToPointsRequest): ConvertBananoToPointsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConvertBananoToPointsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConvertBananoToPointsRequest;
  static deserializeBinaryFromReader(message: ConvertBananoToPointsRequest, reader: jspb.BinaryReader): ConvertBananoToPointsRequest;
}

export namespace ConvertBananoToPointsRequest {
  export type AsObject = {
  }
}

export class ConvertBananoToPointsStatus extends jspb.Message {
  getPaymentAddress(): string;
  setPaymentAddress(value: string): void;

  getBananoConverted(): string;
  setBananoConverted(value: string): void;

  getPointsConverted(): number;
  setPointsConverted(value: number): void;

  hasExpiration(): boolean;
  clearExpiration(): void;
  getExpiration(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiration(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getExpired(): boolean;
  setExpired(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConvertBananoToPointsStatus.AsObject;
  static toObject(includeInstance: boolean, msg: ConvertBananoToPointsStatus): ConvertBananoToPointsStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConvertBananoToPointsStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConvertBananoToPointsStatus;
  static deserializeBinaryFromReader(message: ConvertBananoToPointsStatus, reader: jspb.BinaryReader): ConvertBananoToPointsStatus;
}

export namespace ConvertBananoToPointsStatus {
  export type AsObject = {
    paymentAddress: string,
    bananoConverted: string,
    pointsConverted: number,
    expiration?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    expired: boolean,
  }
}

export class StartOrExtendSubscriptionRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartOrExtendSubscriptionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StartOrExtendSubscriptionRequest): StartOrExtendSubscriptionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StartOrExtendSubscriptionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartOrExtendSubscriptionRequest;
  static deserializeBinaryFromReader(message: StartOrExtendSubscriptionRequest, reader: jspb.BinaryReader): StartOrExtendSubscriptionRequest;
}

export namespace StartOrExtendSubscriptionRequest {
  export type AsObject = {
  }
}

export class StartOrExtendSubscriptionResponse extends jspb.Message {
  hasSubscription(): boolean;
  clearSubscription(): void;
  getSubscription(): SubscriptionDetails | undefined;
  setSubscription(value?: SubscriptionDetails): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartOrExtendSubscriptionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StartOrExtendSubscriptionResponse): StartOrExtendSubscriptionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StartOrExtendSubscriptionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartOrExtendSubscriptionResponse;
  static deserializeBinaryFromReader(message: StartOrExtendSubscriptionResponse, reader: jspb.BinaryReader): StartOrExtendSubscriptionResponse;
}

export namespace StartOrExtendSubscriptionResponse {
  export type AsObject = {
    subscription?: SubscriptionDetails.AsObject,
  }
}

export class SoundCloudTrackDetailsRequest extends jspb.Message {
  getTrackUrl(): string;
  setTrackUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SoundCloudTrackDetailsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SoundCloudTrackDetailsRequest): SoundCloudTrackDetailsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SoundCloudTrackDetailsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SoundCloudTrackDetailsRequest;
  static deserializeBinaryFromReader(message: SoundCloudTrackDetailsRequest, reader: jspb.BinaryReader): SoundCloudTrackDetailsRequest;
}

export namespace SoundCloudTrackDetailsRequest {
  export type AsObject = {
    trackUrl: string,
  }
}

export class SoundCloudTrackDetailsResponse extends jspb.Message {
  hasLength(): boolean;
  clearLength(): void;
  getLength(): google_protobuf_duration_pb.Duration | undefined;
  setLength(value?: google_protobuf_duration_pb.Duration): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SoundCloudTrackDetailsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SoundCloudTrackDetailsResponse): SoundCloudTrackDetailsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SoundCloudTrackDetailsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SoundCloudTrackDetailsResponse;
  static deserializeBinaryFromReader(message: SoundCloudTrackDetailsResponse, reader: jspb.BinaryReader): SoundCloudTrackDetailsResponse;
}

export namespace SoundCloudTrackDetailsResponse {
  export type AsObject = {
    length?: google_protobuf_duration_pb.Duration.AsObject,
  }
}

export class AddVipUserRequest extends jspb.Message {
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  getAppearance(): VipUserAppearanceMap[keyof VipUserAppearanceMap];
  setAppearance(value: VipUserAppearanceMap[keyof VipUserAppearanceMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddVipUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddVipUserRequest): AddVipUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddVipUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddVipUserRequest;
  static deserializeBinaryFromReader(message: AddVipUserRequest, reader: jspb.BinaryReader): AddVipUserRequest;
}

export namespace AddVipUserRequest {
  export type AsObject = {
    rewardsAddress: string,
    appearance: VipUserAppearanceMap[keyof VipUserAppearanceMap],
  }
}

export class AddVipUserResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddVipUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddVipUserResponse): AddVipUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddVipUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddVipUserResponse;
  static deserializeBinaryFromReader(message: AddVipUserResponse, reader: jspb.BinaryReader): AddVipUserResponse;
}

export namespace AddVipUserResponse {
  export type AsObject = {
  }
}

export class RemoveVipUserRequest extends jspb.Message {
  getRewardsAddress(): string;
  setRewardsAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveVipUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveVipUserRequest): RemoveVipUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveVipUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveVipUserRequest;
  static deserializeBinaryFromReader(message: RemoveVipUserRequest, reader: jspb.BinaryReader): RemoveVipUserRequest;
}

export namespace RemoveVipUserRequest {
  export type AsObject = {
    rewardsAddress: string,
  }
}

export class RemoveVipUserResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveVipUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveVipUserResponse): RemoveVipUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveVipUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveVipUserResponse;
  static deserializeBinaryFromReader(message: RemoveVipUserResponse, reader: jspb.BinaryReader): RemoveVipUserResponse;
}

export namespace RemoveVipUserResponse {
  export type AsObject = {
  }
}

export class TriggerClientReloadRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerClientReloadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerClientReloadRequest): TriggerClientReloadRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerClientReloadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerClientReloadRequest;
  static deserializeBinaryFromReader(message: TriggerClientReloadRequest, reader: jspb.BinaryReader): TriggerClientReloadRequest;
}

export namespace TriggerClientReloadRequest {
  export type AsObject = {
  }
}

export class TriggerClientReloadResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerClientReloadResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerClientReloadResponse): TriggerClientReloadResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerClientReloadResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerClientReloadResponse;
  static deserializeBinaryFromReader(message: TriggerClientReloadResponse, reader: jspb.BinaryReader): TriggerClientReloadResponse;
}

export namespace TriggerClientReloadResponse {
  export type AsObject = {
  }
}

export class IncreaseOrReduceSkipThresholdRequest extends jspb.Message {
  getIncrease(): boolean;
  setIncrease(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IncreaseOrReduceSkipThresholdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IncreaseOrReduceSkipThresholdRequest): IncreaseOrReduceSkipThresholdRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IncreaseOrReduceSkipThresholdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IncreaseOrReduceSkipThresholdRequest;
  static deserializeBinaryFromReader(message: IncreaseOrReduceSkipThresholdRequest, reader: jspb.BinaryReader): IncreaseOrReduceSkipThresholdRequest;
}

export namespace IncreaseOrReduceSkipThresholdRequest {
  export type AsObject = {
    increase: boolean,
  }
}

export class IncreaseOrReduceSkipThresholdResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IncreaseOrReduceSkipThresholdResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IncreaseOrReduceSkipThresholdResponse): IncreaseOrReduceSkipThresholdResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IncreaseOrReduceSkipThresholdResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IncreaseOrReduceSkipThresholdResponse;
  static deserializeBinaryFromReader(message: IncreaseOrReduceSkipThresholdResponse, reader: jspb.BinaryReader): IncreaseOrReduceSkipThresholdResponse;
}

export namespace IncreaseOrReduceSkipThresholdResponse {
  export type AsObject = {
  }
}

export class SetMulticurrencyPaymentsEnabledRequest extends jspb.Message {
  getEnabled(): boolean;
  setEnabled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMulticurrencyPaymentsEnabledRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetMulticurrencyPaymentsEnabledRequest): SetMulticurrencyPaymentsEnabledRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMulticurrencyPaymentsEnabledRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMulticurrencyPaymentsEnabledRequest;
  static deserializeBinaryFromReader(message: SetMulticurrencyPaymentsEnabledRequest, reader: jspb.BinaryReader): SetMulticurrencyPaymentsEnabledRequest;
}

export namespace SetMulticurrencyPaymentsEnabledRequest {
  export type AsObject = {
    enabled: boolean,
  }
}

export class SetMulticurrencyPaymentsEnabledResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMulticurrencyPaymentsEnabledResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetMulticurrencyPaymentsEnabledResponse): SetMulticurrencyPaymentsEnabledResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMulticurrencyPaymentsEnabledResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMulticurrencyPaymentsEnabledResponse;
  static deserializeBinaryFromReader(message: SetMulticurrencyPaymentsEnabledResponse, reader: jspb.BinaryReader): SetMulticurrencyPaymentsEnabledResponse;
}

export namespace SetMulticurrencyPaymentsEnabledResponse {
  export type AsObject = {
  }
}

export class CheckMediaEnqueuingPasswordRequest extends jspb.Message {
  getPassword(): string;
  setPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckMediaEnqueuingPasswordRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckMediaEnqueuingPasswordRequest): CheckMediaEnqueuingPasswordRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckMediaEnqueuingPasswordRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckMediaEnqueuingPasswordRequest;
  static deserializeBinaryFromReader(message: CheckMediaEnqueuingPasswordRequest, reader: jspb.BinaryReader): CheckMediaEnqueuingPasswordRequest;
}

export namespace CheckMediaEnqueuingPasswordRequest {
  export type AsObject = {
    password: string,
  }
}

export class CheckMediaEnqueuingPasswordResponse extends jspb.Message {
  getPasswordEdition(): string;
  setPasswordEdition(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckMediaEnqueuingPasswordResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckMediaEnqueuingPasswordResponse): CheckMediaEnqueuingPasswordResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckMediaEnqueuingPasswordResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckMediaEnqueuingPasswordResponse;
  static deserializeBinaryFromReader(message: CheckMediaEnqueuingPasswordResponse, reader: jspb.BinaryReader): CheckMediaEnqueuingPasswordResponse;
}

export namespace CheckMediaEnqueuingPasswordResponse {
  export type AsObject = {
    passwordEdition: string,
  }
}

export class MonitorMediaEnqueuingPermissionRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonitorMediaEnqueuingPermissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MonitorMediaEnqueuingPermissionRequest): MonitorMediaEnqueuingPermissionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MonitorMediaEnqueuingPermissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonitorMediaEnqueuingPermissionRequest;
  static deserializeBinaryFromReader(message: MonitorMediaEnqueuingPermissionRequest, reader: jspb.BinaryReader): MonitorMediaEnqueuingPermissionRequest;
}

export namespace MonitorMediaEnqueuingPermissionRequest {
  export type AsObject = {
  }
}

export class MediaEnqueuingPermissionStatus extends jspb.Message {
  getAllowedMediaEnqueuing(): AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap];
  setAllowedMediaEnqueuing(value: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap]): void;

  getPasswordEdition(): string;
  setPasswordEdition(value: string): void;

  getPasswordIsNumeric(): boolean;
  setPasswordIsNumeric(value: boolean): void;

  getHasElevatedPrivileges(): boolean;
  setHasElevatedPrivileges(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MediaEnqueuingPermissionStatus.AsObject;
  static toObject(includeInstance: boolean, msg: MediaEnqueuingPermissionStatus): MediaEnqueuingPermissionStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MediaEnqueuingPermissionStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MediaEnqueuingPermissionStatus;
  static deserializeBinaryFromReader(message: MediaEnqueuingPermissionStatus, reader: jspb.BinaryReader): MediaEnqueuingPermissionStatus;
}

export namespace MediaEnqueuingPermissionStatus {
  export type AsObject = {
    allowedMediaEnqueuing: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap],
    passwordEdition: string,
    passwordIsNumeric: boolean,
    hasElevatedPrivileges: boolean,
  }
}

export class InvalidateAuthTokensRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvalidateAuthTokensRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InvalidateAuthTokensRequest): InvalidateAuthTokensRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InvalidateAuthTokensRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvalidateAuthTokensRequest;
  static deserializeBinaryFromReader(message: InvalidateAuthTokensRequest, reader: jspb.BinaryReader): InvalidateAuthTokensRequest;
}

export namespace InvalidateAuthTokensRequest {
  export type AsObject = {
  }
}

export class InvalidateAuthTokensResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvalidateAuthTokensResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InvalidateAuthTokensResponse): InvalidateAuthTokensResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InvalidateAuthTokensResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvalidateAuthTokensResponse;
  static deserializeBinaryFromReader(message: InvalidateAuthTokensResponse, reader: jspb.BinaryReader): InvalidateAuthTokensResponse;
}

export namespace InvalidateAuthTokensResponse {
  export type AsObject = {
  }
}

export class InvalidateUserAuthTokensRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvalidateUserAuthTokensRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InvalidateUserAuthTokensRequest): InvalidateUserAuthTokensRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InvalidateUserAuthTokensRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvalidateUserAuthTokensRequest;
  static deserializeBinaryFromReader(message: InvalidateUserAuthTokensRequest, reader: jspb.BinaryReader): InvalidateUserAuthTokensRequest;
}

export namespace InvalidateUserAuthTokensRequest {
  export type AsObject = {
    address: string,
  }
}

export class InvalidateUserAuthTokensResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvalidateUserAuthTokensResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InvalidateUserAuthTokensResponse): InvalidateUserAuthTokensResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InvalidateUserAuthTokensResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvalidateUserAuthTokensResponse;
  static deserializeBinaryFromReader(message: InvalidateUserAuthTokensResponse, reader: jspb.BinaryReader): InvalidateUserAuthTokensResponse;
}

export namespace InvalidateUserAuthTokensResponse {
  export type AsObject = {
  }
}

export class AuthorizeApplicationRequest extends jspb.Message {
  getApplicationName(): string;
  setApplicationName(value: string): void;

  getDesiredPermissionLevel(): PermissionLevelMap[keyof PermissionLevelMap];
  setDesiredPermissionLevel(value: PermissionLevelMap[keyof PermissionLevelMap]): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthorizeApplicationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AuthorizeApplicationRequest): AuthorizeApplicationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthorizeApplicationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthorizeApplicationRequest;
  static deserializeBinaryFromReader(message: AuthorizeApplicationRequest, reader: jspb.BinaryReader): AuthorizeApplicationRequest;
}

export namespace AuthorizeApplicationRequest {
  export type AsObject = {
    applicationName: string,
    desiredPermissionLevel: PermissionLevelMap[keyof PermissionLevelMap],
    reason: string,
  }
}

export class AuthorizeApplicationEvent extends jspb.Message {
  hasHeartbeat(): boolean;
  clearHeartbeat(): void;
  getHeartbeat(): AuthorizeApplicationHeartbeatEvent | undefined;
  setHeartbeat(value?: AuthorizeApplicationHeartbeatEvent): void;

  hasAuthorizationUrl(): boolean;
  clearAuthorizationUrl(): void;
  getAuthorizationUrl(): AuthorizeApplicationAuthorizationURLEvent | undefined;
  setAuthorizationUrl(value?: AuthorizeApplicationAuthorizationURLEvent): void;

  hasApproved(): boolean;
  clearApproved(): void;
  getApproved(): AuthorizeApplicationApprovedEvent | undefined;
  setApproved(value?: AuthorizeApplicationApprovedEvent): void;

  getEventCase(): AuthorizeApplicationEvent.EventCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthorizeApplicationEvent.AsObject;
  static toObject(includeInstance: boolean, msg: AuthorizeApplicationEvent): AuthorizeApplicationEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthorizeApplicationEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthorizeApplicationEvent;
  static deserializeBinaryFromReader(message: AuthorizeApplicationEvent, reader: jspb.BinaryReader): AuthorizeApplicationEvent;
}

export namespace AuthorizeApplicationEvent {
  export type AsObject = {
    heartbeat?: AuthorizeApplicationHeartbeatEvent.AsObject,
    authorizationUrl?: AuthorizeApplicationAuthorizationURLEvent.AsObject,
    approved?: AuthorizeApplicationApprovedEvent.AsObject,
  }

  export enum EventCase {
    EVENT_NOT_SET = 0,
    HEARTBEAT = 1,
    AUTHORIZATION_URL = 2,
    APPROVED = 3,
  }
}

export class AuthorizeApplicationHeartbeatEvent extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthorizeApplicationHeartbeatEvent.AsObject;
  static toObject(includeInstance: boolean, msg: AuthorizeApplicationHeartbeatEvent): AuthorizeApplicationHeartbeatEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthorizeApplicationHeartbeatEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthorizeApplicationHeartbeatEvent;
  static deserializeBinaryFromReader(message: AuthorizeApplicationHeartbeatEvent, reader: jspb.BinaryReader): AuthorizeApplicationHeartbeatEvent;
}

export namespace AuthorizeApplicationHeartbeatEvent {
  export type AsObject = {
  }
}

export class AuthorizeApplicationAuthorizationURLEvent extends jspb.Message {
  getAuthorizationUrl(): string;
  setAuthorizationUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthorizeApplicationAuthorizationURLEvent.AsObject;
  static toObject(includeInstance: boolean, msg: AuthorizeApplicationAuthorizationURLEvent): AuthorizeApplicationAuthorizationURLEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthorizeApplicationAuthorizationURLEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthorizeApplicationAuthorizationURLEvent;
  static deserializeBinaryFromReader(message: AuthorizeApplicationAuthorizationURLEvent, reader: jspb.BinaryReader): AuthorizeApplicationAuthorizationURLEvent;
}

export namespace AuthorizeApplicationAuthorizationURLEvent {
  export type AsObject = {
    authorizationUrl: string,
  }
}

export class AuthorizeApplicationApprovedEvent extends jspb.Message {
  getAuthToken(): string;
  setAuthToken(value: string): void;

  hasTokenExpiration(): boolean;
  clearTokenExpiration(): void;
  getTokenExpiration(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTokenExpiration(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthorizeApplicationApprovedEvent.AsObject;
  static toObject(includeInstance: boolean, msg: AuthorizeApplicationApprovedEvent): AuthorizeApplicationApprovedEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthorizeApplicationApprovedEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthorizeApplicationApprovedEvent;
  static deserializeBinaryFromReader(message: AuthorizeApplicationApprovedEvent, reader: jspb.BinaryReader): AuthorizeApplicationApprovedEvent;
}

export namespace AuthorizeApplicationApprovedEvent {
  export type AsObject = {
    authToken: string,
    tokenExpiration?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class AuthorizationProcessDataRequest extends jspb.Message {
  getProcessId(): string;
  setProcessId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthorizationProcessDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AuthorizationProcessDataRequest): AuthorizationProcessDataRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthorizationProcessDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthorizationProcessDataRequest;
  static deserializeBinaryFromReader(message: AuthorizationProcessDataRequest, reader: jspb.BinaryReader): AuthorizationProcessDataRequest;
}

export namespace AuthorizationProcessDataRequest {
  export type AsObject = {
    processId: string,
  }
}

export class AuthorizationProcessDataResponse extends jspb.Message {
  getApplicationName(): string;
  setApplicationName(value: string): void;

  getDesiredPermissionLevel(): PermissionLevelMap[keyof PermissionLevelMap];
  setDesiredPermissionLevel(value: PermissionLevelMap[keyof PermissionLevelMap]): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthorizationProcessDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AuthorizationProcessDataResponse): AuthorizationProcessDataResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthorizationProcessDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthorizationProcessDataResponse;
  static deserializeBinaryFromReader(message: AuthorizationProcessDataResponse, reader: jspb.BinaryReader): AuthorizationProcessDataResponse;
}

export namespace AuthorizationProcessDataResponse {
  export type AsObject = {
    applicationName: string,
    desiredPermissionLevel: PermissionLevelMap[keyof PermissionLevelMap],
    reason: string,
  }
}

export class ConsentOrDissentToAuthorizationRequest extends jspb.Message {
  getProcessId(): string;
  setProcessId(value: string): void;

  getConsent(): boolean;
  setConsent(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsentOrDissentToAuthorizationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConsentOrDissentToAuthorizationRequest): ConsentOrDissentToAuthorizationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsentOrDissentToAuthorizationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsentOrDissentToAuthorizationRequest;
  static deserializeBinaryFromReader(message: ConsentOrDissentToAuthorizationRequest, reader: jspb.BinaryReader): ConsentOrDissentToAuthorizationRequest;
}

export namespace ConsentOrDissentToAuthorizationRequest {
  export type AsObject = {
    processId: string,
    consent: boolean,
  }
}

export class ConsentOrDissentToAuthorizationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsentOrDissentToAuthorizationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ConsentOrDissentToAuthorizationResponse): ConsentOrDissentToAuthorizationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsentOrDissentToAuthorizationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsentOrDissentToAuthorizationResponse;
  static deserializeBinaryFromReader(message: ConsentOrDissentToAuthorizationResponse, reader: jspb.BinaryReader): ConsentOrDissentToAuthorizationResponse;
}

export namespace ConsentOrDissentToAuthorizationResponse {
  export type AsObject = {
  }
}

export interface EnqueueMediaTicketStatusMap {
  ACTIVE: 0;
  PAID: 1;
  EXPIRED: 2;
  FAILED_INSUFFICIENT_POINTS: 3;
}

export const EnqueueMediaTicketStatus: EnqueueMediaTicketStatusMap;

export interface QueueEntryMovementDirectionMap {
  QUEUE_ENTRY_MOVEMENT_DIRECTION_UNKNOWN: 0;
  QUEUE_ENTRY_MOVEMENT_DIRECTION_DOWN: 1;
  QUEUE_ENTRY_MOVEMENT_DIRECTION_UP: 2;
}

export const QueueEntryMovementDirection: QueueEntryMovementDirectionMap;

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

export interface AllowedMediaEnqueuingTypeMap {
  DISABLED: 0;
  STAFF_ONLY: 1;
  ENABLED: 2;
  PASSWORD_REQUIRED: 3;
}

export const AllowedMediaEnqueuingType: AllowedMediaEnqueuingTypeMap;

export interface PermissionLevelMap {
  UNAUTHENTICATED: 0;
  USER: 1;
  APPEDITOR: 2;
  ADMIN: 3;
}

export const PermissionLevel: PermissionLevelMap;

export interface DisallowedMediaTypeMap {
  UNKNOWN_DISALLOWED_MEDIA_TYPE: 0;
  DISALLOWED_MEDIA_TYPE_YOUTUBE_VIDEO: 1;
  DISALLOWED_MEDIA_TYPE_SOUNDCLOUD_TRACK: 2;
}

export const DisallowedMediaType: DisallowedMediaTypeMap;

export interface DisallowedMediaCollectionTypeMap {
  UNKNOWN_DISALLOWED_MEDIA_COLLECTION_TYPE: 0;
  DISALLOWED_MEDIA_COLLECTION_TYPE_YOUTUBE_CHANNEL: 1;
  DISALLOWED_MEDIA_COLLECTION_TYPE_SOUNDCLOUD_USER: 2;
}

export const DisallowedMediaCollectionType: DisallowedMediaCollectionTypeMap;

export interface LeaderboardPeriodMap {
  UNKNOWN_LEADERBOARD_PERIOD: 0;
  LAST_24_HOURS: 1;
  LAST_7_DAYS: 2;
  LAST_30_DAYS: 3;
}

export const LeaderboardPeriod: LeaderboardPeriodMap;

export interface RaffleDrawingStatusMap {
  UNKNOWN_RAFFLE_DRAWING_STATUS: 0;
  RAFFLE_DRAWING_STATUS_ONGOING: 1;
  RAFFLE_DRAWING_STATUS_PENDING: 2;
  RAFFLE_DRAWING_STATUS_CONFIRMED: 3;
  RAFFLE_DRAWING_STATUS_VOIDED: 4;
  RAFFLE_DRAWING_STATUS_COMPLETE: 5;
}

export const RaffleDrawingStatus: RaffleDrawingStatusMap;

export interface ConnectionServiceMap {
  UNKNOWN_CONNECTION_SERVICE: 0;
  CRYPTOMONKEYS: 1;
}

export const ConnectionService: ConnectionServiceMap;

export interface PointsTransactionTypeMap {
  UNKNOWN_POINTS_TRANSACTION_TYPE: 0;
  POINTS_TRANSACTION_TYPE_ACTIVITY_CHALLENGE_REWARD: 1;
  POINTS_TRANSACTION_TYPE_CHAT_ACTIVITY_REWARD: 2;
  POINTS_TRANSACTION_TYPE_MEDIA_ENQUEUED_REWARD: 3;
  POINTS_TRANSACTION_TYPE_CHAT_GIF_ATTACHMENT: 4;
  POINTS_TRANSACTION_TYPE_MANUAL_ADJUSTMENT: 5;
  POINTS_TRANSACTION_TYPE_MEDIA_ENQUEUED_REWARD_REVERSAL: 6;
  POINTS_TRANSACTION_TYPE_CONVERSION_FROM_BANANO: 7;
  POINTS_TRANSACTION_TYPE_QUEUE_ENTRY_REORDERING: 8;
  POINTS_TRANSACTION_TYPE_MONTHLY_SUBSCRIPTION: 9;
  POINTS_TRANSACTION_TYPE_SKIP_THRESHOLD_REDUCTION: 10;
  POINTS_TRANSACTION_TYPE_SKIP_THRESHOLD_INCREASE: 11;
  POINTS_TRANSACTION_TYPE_CONCEALED_ENTRY_ENQUEUING: 12;
  POINTS_TRANSACTION_TYPE_APPLICATION_DEFINED: 13;
}

export const PointsTransactionType: PointsTransactionTypeMap;

export interface VipUserAppearanceMap {
  UNKNOWN_VIP_USER_APPEARANCE: 0;
  VIP_USER_APPEARANCE_NORMAL: 1;
  VIP_USER_APPEARANCE_MODERATOR: 2;
  VIP_USER_APPEARANCE_VIP: 3;
  VIP_USER_APPEARANCE_VIP_MODERATOR: 4;
}

export const VipUserAppearance: VipUserAppearanceMap;

