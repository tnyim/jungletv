// package: jungletv
// file: common.proto

import * as jspb from "google-protobuf";

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

  getStatus(): UserStatusMap[keyof UserStatusMap];
  setStatus(value: UserStatusMap[keyof UserStatusMap]): void;

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
    status: UserStatusMap[keyof UserStatusMap],
  }
}

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

export interface UserRoleMap {
  MODERATOR: 0;
  TIER_1_REQUESTER: 1;
  TIER_2_REQUESTER: 2;
  TIER_3_REQUESTER: 3;
  CURRENT_ENTRY_REQUESTER: 4;
  VIP: 5;
  APPLICATION: 6;
}

export const UserRole: UserRoleMap;

export interface UserStatusMap {
  USER_STATUS_OFFLINE: 0;
  USER_STATUS_WATCHING: 1;
  USER_STATUS_AWAY: 2;
}

export const UserStatus: UserStatusMap;

