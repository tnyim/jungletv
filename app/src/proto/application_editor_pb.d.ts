// package: jungletv
// file: application_editor.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as common_pb from "./common_pb";

export class ApplicationsRequest extends jspb.Message {
  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationsRequest): ApplicationsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationsRequest;
  static deserializeBinaryFromReader(message: ApplicationsRequest, reader: jspb.BinaryReader): ApplicationsRequest;
}

export namespace ApplicationsRequest {
  export type AsObject = {
    paginationParams?: common_pb.PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class ApplicationsResponse extends jspb.Message {
  clearApplicationsList(): void;
  getApplicationsList(): Array<Application>;
  setApplicationsList(value: Array<Application>): void;
  addApplications(value?: Application, index?: number): Application;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationsResponse): ApplicationsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationsResponse;
  static deserializeBinaryFromReader(message: ApplicationsResponse, reader: jspb.BinaryReader): ApplicationsResponse;
}

export namespace ApplicationsResponse {
  export type AsObject = {
    applicationsList: Array<Application.AsObject>,
    offset: number,
    total: number,
  }
}

export class GetApplicationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetApplicationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetApplicationRequest): GetApplicationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetApplicationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetApplicationRequest;
  static deserializeBinaryFromReader(message: GetApplicationRequest, reader: jspb.BinaryReader): GetApplicationRequest;
}

export namespace GetApplicationRequest {
  export type AsObject = {
    id: string,
  }
}

export class Application extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasUpdatedAt(): boolean;
  clearUpdatedAt(): void;
  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasUpdatedBy(): boolean;
  clearUpdatedBy(): void;
  getUpdatedBy(): common_pb.User | undefined;
  setUpdatedBy(value?: common_pb.User): void;

  getEditMessage(): string;
  setEditMessage(value: string): void;

  getAllowLaunching(): boolean;
  setAllowLaunching(value: boolean): void;

  getAllowFileEditing(): boolean;
  setAllowFileEditing(value: boolean): void;

  getAutorun(): boolean;
  setAutorun(value: boolean): void;

  getRuntimeVersion(): number;
  setRuntimeVersion(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Application.AsObject;
  static toObject(includeInstance: boolean, msg: Application): Application.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Application, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Application;
  static deserializeBinaryFromReader(message: Application, reader: jspb.BinaryReader): Application;
}

export namespace Application {
  export type AsObject = {
    id: string,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedBy?: common_pb.User.AsObject,
    editMessage: string,
    allowLaunching: boolean,
    allowFileEditing: boolean,
    autorun: boolean,
    runtimeVersion: number,
  }
}

export class UpdateApplicationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateApplicationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateApplicationResponse): UpdateApplicationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateApplicationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateApplicationResponse;
  static deserializeBinaryFromReader(message: UpdateApplicationResponse, reader: jspb.BinaryReader): UpdateApplicationResponse;
}

export namespace UpdateApplicationResponse {
  export type AsObject = {
  }
}

export class CloneApplicationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getDestinationId(): string;
  setDestinationId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CloneApplicationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CloneApplicationRequest): CloneApplicationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CloneApplicationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CloneApplicationRequest;
  static deserializeBinaryFromReader(message: CloneApplicationRequest, reader: jspb.BinaryReader): CloneApplicationRequest;
}

export namespace CloneApplicationRequest {
  export type AsObject = {
    id: string,
    destinationId: string,
  }
}

export class CloneApplicationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CloneApplicationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CloneApplicationResponse): CloneApplicationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CloneApplicationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CloneApplicationResponse;
  static deserializeBinaryFromReader(message: CloneApplicationResponse, reader: jspb.BinaryReader): CloneApplicationResponse;
}

export namespace CloneApplicationResponse {
  export type AsObject = {
  }
}

export class DeleteApplicationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteApplicationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteApplicationRequest): DeleteApplicationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteApplicationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteApplicationRequest;
  static deserializeBinaryFromReader(message: DeleteApplicationRequest, reader: jspb.BinaryReader): DeleteApplicationRequest;
}

export namespace DeleteApplicationRequest {
  export type AsObject = {
    id: string,
  }
}

export class DeleteApplicationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteApplicationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteApplicationResponse): DeleteApplicationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteApplicationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteApplicationResponse;
  static deserializeBinaryFromReader(message: DeleteApplicationResponse, reader: jspb.BinaryReader): DeleteApplicationResponse;
}

export namespace DeleteApplicationResponse {
  export type AsObject = {
  }
}

export class ApplicationFilesRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  hasPaginationParams(): boolean;
  clearPaginationParams(): void;
  getPaginationParams(): common_pb.PaginationParameters | undefined;
  setPaginationParams(value?: common_pb.PaginationParameters): void;

  getSearchQuery(): string;
  setSearchQuery(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationFilesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationFilesRequest): ApplicationFilesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationFilesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationFilesRequest;
  static deserializeBinaryFromReader(message: ApplicationFilesRequest, reader: jspb.BinaryReader): ApplicationFilesRequest;
}

export namespace ApplicationFilesRequest {
  export type AsObject = {
    applicationId: string,
    paginationParams?: common_pb.PaginationParameters.AsObject,
    searchQuery: string,
  }
}

export class ApplicationFilesResponse extends jspb.Message {
  clearFilesList(): void;
  getFilesList(): Array<ApplicationFile>;
  setFilesList(value: Array<ApplicationFile>): void;
  addFiles(value?: ApplicationFile, index?: number): ApplicationFile;

  getOffset(): number;
  setOffset(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationFilesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationFilesResponse): ApplicationFilesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationFilesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationFilesResponse;
  static deserializeBinaryFromReader(message: ApplicationFilesResponse, reader: jspb.BinaryReader): ApplicationFilesResponse;
}

export namespace ApplicationFilesResponse {
  export type AsObject = {
    filesList: Array<ApplicationFile.AsObject>,
    offset: number,
    total: number,
  }
}

export class ApplicationFile extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getName(): string;
  setName(value: string): void;

  hasUpdatedAt(): boolean;
  clearUpdatedAt(): void;
  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasUpdatedBy(): boolean;
  clearUpdatedBy(): void;
  getUpdatedBy(): common_pb.User | undefined;
  setUpdatedBy(value?: common_pb.User): void;

  getEditMessage(): string;
  setEditMessage(value: string): void;

  getPublic(): boolean;
  setPublic(value: boolean): void;

  getType(): string;
  setType(value: string): void;

  hasContent(): boolean;
  clearContent(): void;
  getContent(): Uint8Array | string;
  getContent_asU8(): Uint8Array;
  getContent_asB64(): string;
  setContent(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationFile.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationFile): ApplicationFile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationFile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationFile;
  static deserializeBinaryFromReader(message: ApplicationFile, reader: jspb.BinaryReader): ApplicationFile;
}

export namespace ApplicationFile {
  export type AsObject = {
    applicationId: string,
    name: string,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedBy?: common_pb.User.AsObject,
    editMessage: string,
    pb_public: boolean,
    type: string,
    content: Uint8Array | string,
  }
}

export class GetApplicationFileRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetApplicationFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetApplicationFileRequest): GetApplicationFileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetApplicationFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetApplicationFileRequest;
  static deserializeBinaryFromReader(message: GetApplicationFileRequest, reader: jspb.BinaryReader): GetApplicationFileRequest;
}

export namespace GetApplicationFileRequest {
  export type AsObject = {
    applicationId: string,
    name: string,
  }
}

export class UpdateApplicationFileResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateApplicationFileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateApplicationFileResponse): UpdateApplicationFileResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateApplicationFileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateApplicationFileResponse;
  static deserializeBinaryFromReader(message: UpdateApplicationFileResponse, reader: jspb.BinaryReader): UpdateApplicationFileResponse;
}

export namespace UpdateApplicationFileResponse {
  export type AsObject = {
  }
}

export class CloneApplicationFileRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getDestinationApplicationId(): string;
  setDestinationApplicationId(value: string): void;

  getDestinationName(): string;
  setDestinationName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CloneApplicationFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CloneApplicationFileRequest): CloneApplicationFileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CloneApplicationFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CloneApplicationFileRequest;
  static deserializeBinaryFromReader(message: CloneApplicationFileRequest, reader: jspb.BinaryReader): CloneApplicationFileRequest;
}

export namespace CloneApplicationFileRequest {
  export type AsObject = {
    applicationId: string,
    name: string,
    destinationApplicationId: string,
    destinationName: string,
  }
}

export class CloneApplicationFileResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CloneApplicationFileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CloneApplicationFileResponse): CloneApplicationFileResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CloneApplicationFileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CloneApplicationFileResponse;
  static deserializeBinaryFromReader(message: CloneApplicationFileResponse, reader: jspb.BinaryReader): CloneApplicationFileResponse;
}

export namespace CloneApplicationFileResponse {
  export type AsObject = {
  }
}

export class DeleteApplicationFileRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteApplicationFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteApplicationFileRequest): DeleteApplicationFileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteApplicationFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteApplicationFileRequest;
  static deserializeBinaryFromReader(message: DeleteApplicationFileRequest, reader: jspb.BinaryReader): DeleteApplicationFileRequest;
}

export namespace DeleteApplicationFileRequest {
  export type AsObject = {
    applicationId: string,
    name: string,
  }
}

export class DeleteApplicationFileResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteApplicationFileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteApplicationFileResponse): DeleteApplicationFileResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteApplicationFileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteApplicationFileResponse;
  static deserializeBinaryFromReader(message: DeleteApplicationFileResponse, reader: jspb.BinaryReader): DeleteApplicationFileResponse;
}

export namespace DeleteApplicationFileResponse {
  export type AsObject = {
  }
}

export class LaunchApplicationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LaunchApplicationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LaunchApplicationRequest): LaunchApplicationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LaunchApplicationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LaunchApplicationRequest;
  static deserializeBinaryFromReader(message: LaunchApplicationRequest, reader: jspb.BinaryReader): LaunchApplicationRequest;
}

export namespace LaunchApplicationRequest {
  export type AsObject = {
    id: string,
  }
}

export class LaunchApplicationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LaunchApplicationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LaunchApplicationResponse): LaunchApplicationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LaunchApplicationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LaunchApplicationResponse;
  static deserializeBinaryFromReader(message: LaunchApplicationResponse, reader: jspb.BinaryReader): LaunchApplicationResponse;
}

export namespace LaunchApplicationResponse {
  export type AsObject = {
  }
}

export class StopApplicationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StopApplicationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StopApplicationRequest): StopApplicationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StopApplicationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StopApplicationRequest;
  static deserializeBinaryFromReader(message: StopApplicationRequest, reader: jspb.BinaryReader): StopApplicationRequest;
}

export namespace StopApplicationRequest {
  export type AsObject = {
    id: string,
  }
}

export class StopApplicationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StopApplicationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StopApplicationResponse): StopApplicationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StopApplicationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StopApplicationResponse;
  static deserializeBinaryFromReader(message: StopApplicationResponse, reader: jspb.BinaryReader): StopApplicationResponse;
}

export namespace StopApplicationResponse {
  export type AsObject = {
  }
}

export class ApplicationLogRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  clearLevelsList(): void;
  getLevelsList(): Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>;
  setLevelsList(value: Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>): void;
  addLevels(value: ApplicationLogLevelMap[keyof ApplicationLogLevelMap], index?: number): ApplicationLogLevelMap[keyof ApplicationLogLevelMap];

  hasOffset(): boolean;
  clearOffset(): void;
  getOffset(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setOffset(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationLogRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationLogRequest): ApplicationLogRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationLogRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationLogRequest;
  static deserializeBinaryFromReader(message: ApplicationLogRequest, reader: jspb.BinaryReader): ApplicationLogRequest;
}

export namespace ApplicationLogRequest {
  export type AsObject = {
    applicationId: string,
    levelsList: Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>,
    offset?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    limit: number,
  }
}

export class ApplicationLogEntry extends jspb.Message {
  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getLevel(): ApplicationLogLevelMap[keyof ApplicationLogLevelMap];
  setLevel(value: ApplicationLogLevelMap[keyof ApplicationLogLevelMap]): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationLogEntry.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationLogEntry): ApplicationLogEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationLogEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationLogEntry;
  static deserializeBinaryFromReader(message: ApplicationLogEntry, reader: jspb.BinaryReader): ApplicationLogEntry;
}

export namespace ApplicationLogEntry {
  export type AsObject = {
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    level: ApplicationLogLevelMap[keyof ApplicationLogLevelMap],
    message: string,
  }
}

export class ApplicationLogResponse extends jspb.Message {
  clearEntriesList(): void;
  getEntriesList(): Array<ApplicationLogEntry>;
  setEntriesList(value: Array<ApplicationLogEntry>): void;
  addEntries(value?: ApplicationLogEntry, index?: number): ApplicationLogEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationLogResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationLogResponse): ApplicationLogResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationLogResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationLogResponse;
  static deserializeBinaryFromReader(message: ApplicationLogResponse, reader: jspb.BinaryReader): ApplicationLogResponse;
}

export namespace ApplicationLogResponse {
  export type AsObject = {
    entriesList: Array<ApplicationLogEntry.AsObject>,
  }
}

export class ConsumeApplicationLogRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  clearLevelsList(): void;
  getLevelsList(): Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>;
  setLevelsList(value: Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>): void;
  addLevels(value: ApplicationLogLevelMap[keyof ApplicationLogLevelMap], index?: number): ApplicationLogLevelMap[keyof ApplicationLogLevelMap];

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsumeApplicationLogRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConsumeApplicationLogRequest): ConsumeApplicationLogRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsumeApplicationLogRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsumeApplicationLogRequest;
  static deserializeBinaryFromReader(message: ConsumeApplicationLogRequest, reader: jspb.BinaryReader): ConsumeApplicationLogRequest;
}

export namespace ConsumeApplicationLogRequest {
  export type AsObject = {
    applicationId: string,
    levelsList: Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>,
  }
}

export interface ApplicationLogLevelMap {
  UNKNOWN_APPLICATION_LOG_LEVEL: 0;
  APPLICATION_LOG_LEVEL_JS_LOG: 1;
  APPLICATION_LOG_LEVEL_JS_WARN: 2;
  APPLICATION_LOG_LEVEL_JS_ERROR: 3;
  APPLICATION_LOG_LEVEL_RUNTIME_LOG: 4;
  APPLICATION_LOG_LEVEL_RUNTIME_ERROR: 5;
}

export const ApplicationLogLevel: ApplicationLogLevelMap;

