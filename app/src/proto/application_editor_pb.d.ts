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

