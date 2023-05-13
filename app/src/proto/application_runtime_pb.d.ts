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
    pageTitle: string,
    applicationVersion?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ConsumeApplicationEventsRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getPageId(): string;
  setPageId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsumeApplicationEventsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConsumeApplicationEventsRequest): ConsumeApplicationEventsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsumeApplicationEventsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsumeApplicationEventsRequest;
  static deserializeBinaryFromReader(message: ConsumeApplicationEventsRequest, reader: jspb.BinaryReader): ConsumeApplicationEventsRequest;
}

export namespace ConsumeApplicationEventsRequest {
  export type AsObject = {
    applicationId: string,
    pageId: string,
  }
}

export class ApplicationEventUpdate extends jspb.Message {
  hasHeartbeat(): boolean;
  clearHeartbeat(): void;
  getHeartbeat(): ApplicationHeartbeatEvent | undefined;
  setHeartbeat(value?: ApplicationHeartbeatEvent): void;

  hasApplicationEvent(): boolean;
  clearApplicationEvent(): void;
  getApplicationEvent(): ApplicationServerEvent | undefined;
  setApplicationEvent(value?: ApplicationServerEvent): void;

  getTypeCase(): ApplicationEventUpdate.TypeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationEventUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationEventUpdate): ApplicationEventUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationEventUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationEventUpdate;
  static deserializeBinaryFromReader(message: ApplicationEventUpdate, reader: jspb.BinaryReader): ApplicationEventUpdate;
}

export namespace ApplicationEventUpdate {
  export type AsObject = {
    heartbeat?: ApplicationHeartbeatEvent.AsObject,
    applicationEvent?: ApplicationServerEvent.AsObject,
  }

  export enum TypeCase {
    TYPE_NOT_SET = 0,
    HEARTBEAT = 1,
    APPLICATION_EVENT = 2,
  }
}

export class ApplicationHeartbeatEvent extends jspb.Message {
  getSequence(): number;
  setSequence(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationHeartbeatEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationHeartbeatEvent): ApplicationHeartbeatEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationHeartbeatEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationHeartbeatEvent;
  static deserializeBinaryFromReader(message: ApplicationHeartbeatEvent, reader: jspb.BinaryReader): ApplicationHeartbeatEvent;
}

export namespace ApplicationHeartbeatEvent {
  export type AsObject = {
    sequence: number,
  }
}

export class ApplicationServerEvent extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<string>;
  setArgumentsList(value: Array<string>): void;
  addArguments(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationServerEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationServerEvent): ApplicationServerEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationServerEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationServerEvent;
  static deserializeBinaryFromReader(message: ApplicationServerEvent, reader: jspb.BinaryReader): ApplicationServerEvent;
}

export namespace ApplicationServerEvent {
  export type AsObject = {
    name: string,
    argumentsList: Array<string>,
  }
}

export class ApplicationServerMethodRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getPageId(): string;
  setPageId(value: string): void;

  getMethod(): string;
  setMethod(value: string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<string>;
  setArgumentsList(value: Array<string>): void;
  addArguments(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationServerMethodRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationServerMethodRequest): ApplicationServerMethodRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationServerMethodRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationServerMethodRequest;
  static deserializeBinaryFromReader(message: ApplicationServerMethodRequest, reader: jspb.BinaryReader): ApplicationServerMethodRequest;
}

export namespace ApplicationServerMethodRequest {
  export type AsObject = {
    applicationId: string,
    pageId: string,
    method: string,
    argumentsList: Array<string>,
  }
}

export class ApplicationServerMethodResponse extends jspb.Message {
  getResult(): string;
  setResult(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplicationServerMethodResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ApplicationServerMethodResponse): ApplicationServerMethodResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApplicationServerMethodResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplicationServerMethodResponse;
  static deserializeBinaryFromReader(message: ApplicationServerMethodResponse, reader: jspb.BinaryReader): ApplicationServerMethodResponse;
}

export namespace ApplicationServerMethodResponse {
  export type AsObject = {
    result: string,
  }
}

export class TriggerApplicationEventRequest extends jspb.Message {
  getApplicationId(): string;
  setApplicationId(value: string): void;

  getPageId(): string;
  setPageId(value: string): void;

  getName(): string;
  setName(value: string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<string>;
  setArgumentsList(value: Array<string>): void;
  addArguments(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerApplicationEventRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerApplicationEventRequest): TriggerApplicationEventRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerApplicationEventRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerApplicationEventRequest;
  static deserializeBinaryFromReader(message: TriggerApplicationEventRequest, reader: jspb.BinaryReader): TriggerApplicationEventRequest;
}

export namespace TriggerApplicationEventRequest {
  export type AsObject = {
    applicationId: string,
    pageId: string,
    name: string,
    argumentsList: Array<string>,
  }
}

export class TriggerApplicationEventResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerApplicationEventResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerApplicationEventResponse): TriggerApplicationEventResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerApplicationEventResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerApplicationEventResponse;
  static deserializeBinaryFromReader(message: TriggerApplicationEventResponse, reader: jspb.BinaryReader): TriggerApplicationEventResponse;
}

export namespace TriggerApplicationEventResponse {
  export type AsObject = {
  }
}

