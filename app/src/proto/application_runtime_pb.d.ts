// package: jungletv
// file: application_runtime.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class ResolveApplicationPageRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getPageId(): string;
  setPageId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveApplicationPageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveApplicationPageRequest): ResolveApplicationPageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolveApplicationPageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveApplicationPageRequest;
  static deserializeBinaryFromReader(message: ResolveApplicationPageRequest, reader: jspb.BinaryReader): ResolveApplicationPageRequest;
}

export namespace ResolveApplicationPageRequest {
  export type AsObject = {
    applicationId: string,
    pageId: string,
  }
}

export class ResolveApplicationPageResponse extends jspb.Message {
  getApplicationFileName(): string;
  setApplicationFileName(value: string): void;

  getPageTitle(): string;
  setPageTitle(value: string): void;

  hasApplicationVersion(): boolean;
  clearApplicationVersion(): void;
  getApplicationVersion(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setApplicationVersion(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveApplicationPageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveApplicationPageResponse): ResolveApplicationPageResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolveApplicationPageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveApplicationPageResponse;
  static deserializeBinaryFromReader(message: ResolveApplicationPageResponse, reader: jspb.BinaryReader): ResolveApplicationPageResponse;
}

export namespace ResolveApplicationPageResponse {
  export type AsObject = {
    applicationFileName: string,
    pageTitle: string,
    applicationVersion?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

