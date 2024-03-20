// package: jungletv
// file: common.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";

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

export class Notification extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  hasExpiration(): boolean;
  clearExpiration(): void;
  getExpiration(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiration(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasChatMention(): boolean;
  clearChatMention(): void;
  getChatMention(): ChatMentionNotification | undefined;
  setChatMention(value?: ChatMentionNotification): void;

  hasAnnouncementsUpdated(): boolean;
  clearAnnouncementsUpdated(): void;
  getAnnouncementsUpdated(): AnnouncementsUpdatedNotification | undefined;
  setAnnouncementsUpdated(value?: AnnouncementsUpdatedNotification): void;

  hasRewardBalanceUpdated(): boolean;
  clearRewardBalanceUpdated(): void;
  getRewardBalanceUpdated(): RewardBalanceUpdatedNotification | undefined;
  setRewardBalanceUpdated(value?: RewardBalanceUpdatedNotification): void;

  hasSidebarTabHighlighted(): boolean;
  clearSidebarTabHighlighted(): void;
  getSidebarTabHighlighted(): SidebarTabHighlightedNotification | undefined;
  setSidebarTabHighlighted(value?: SidebarTabHighlightedNotification): void;

  hasNavigationDestinationHighlighted(): boolean;
  clearNavigationDestinationHighlighted(): void;
  getNavigationDestinationHighlighted(): NavigationDestinationHighlightedNotification | undefined;
  setNavigationDestinationHighlighted(value?: NavigationDestinationHighlightedNotification): void;

  hasToast(): boolean;
  clearToast(): void;
  getToast(): ToastNotification | undefined;
  setToast(value?: ToastNotification): void;

  getNotificationDataCase(): Notification.NotificationDataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Notification.AsObject;
  static toObject(includeInstance: boolean, msg: Notification): Notification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Notification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Notification;
  static deserializeBinaryFromReader(message: Notification, reader: jspb.BinaryReader): Notification;
}

export namespace Notification {
  export type AsObject = {
    id: string,
    key: string,
    expiration?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    chatMention?: ChatMentionNotification.AsObject,
    announcementsUpdated?: AnnouncementsUpdatedNotification.AsObject,
    rewardBalanceUpdated?: RewardBalanceUpdatedNotification.AsObject,
    sidebarTabHighlighted?: SidebarTabHighlightedNotification.AsObject,
    navigationDestinationHighlighted?: NavigationDestinationHighlightedNotification.AsObject,
    toast?: ToastNotification.AsObject,
  }

  export enum NotificationDataCase {
    NOTIFICATION_DATA_NOT_SET = 0,
    CHAT_MENTION = 4,
    ANNOUNCEMENTS_UPDATED = 5,
    REWARD_BALANCE_UPDATED = 6,
    SIDEBAR_TAB_HIGHLIGHTED = 7,
    NAVIGATION_DESTINATION_HIGHLIGHTED = 8,
    TOAST = 9,
  }
}

export class ChatMentionNotification extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMentionNotification.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMentionNotification): ChatMentionNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMentionNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMentionNotification;
  static deserializeBinaryFromReader(message: ChatMentionNotification, reader: jspb.BinaryReader): ChatMentionNotification;
}

export namespace ChatMentionNotification {
  export type AsObject = {
    messageId: string,
  }
}

export class AnnouncementsUpdatedNotification extends jspb.Message {
  getNotificationCounter(): number;
  setNotificationCounter(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnnouncementsUpdatedNotification.AsObject;
  static toObject(includeInstance: boolean, msg: AnnouncementsUpdatedNotification): AnnouncementsUpdatedNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AnnouncementsUpdatedNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnnouncementsUpdatedNotification;
  static deserializeBinaryFromReader(message: AnnouncementsUpdatedNotification, reader: jspb.BinaryReader): AnnouncementsUpdatedNotification;
}

export namespace AnnouncementsUpdatedNotification {
  export type AsObject = {
    notificationCounter: number,
  }
}

export class RewardBalanceUpdatedNotification extends jspb.Message {
  getRewardBalance(): string;
  setRewardBalance(value: string): void;

  getDifference(): string;
  setDifference(value: string): void;

  getReason(): RewardBalanceUpdateReasonMap[keyof RewardBalanceUpdateReasonMap];
  setReason(value: RewardBalanceUpdateReasonMap[keyof RewardBalanceUpdateReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardBalanceUpdatedNotification.AsObject;
  static toObject(includeInstance: boolean, msg: RewardBalanceUpdatedNotification): RewardBalanceUpdatedNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RewardBalanceUpdatedNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardBalanceUpdatedNotification;
  static deserializeBinaryFromReader(message: RewardBalanceUpdatedNotification, reader: jspb.BinaryReader): RewardBalanceUpdatedNotification;
}

export namespace RewardBalanceUpdatedNotification {
  export type AsObject = {
    rewardBalance: string,
    difference: string,
    reason: RewardBalanceUpdateReasonMap[keyof RewardBalanceUpdateReasonMap],
  }
}

export class SidebarTabHighlightedNotification extends jspb.Message {
  getTabId(): string;
  setTabId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SidebarTabHighlightedNotification.AsObject;
  static toObject(includeInstance: boolean, msg: SidebarTabHighlightedNotification): SidebarTabHighlightedNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SidebarTabHighlightedNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SidebarTabHighlightedNotification;
  static deserializeBinaryFromReader(message: SidebarTabHighlightedNotification, reader: jspb.BinaryReader): SidebarTabHighlightedNotification;
}

export namespace SidebarTabHighlightedNotification {
  export type AsObject = {
    tabId: string,
  }
}

export class NavigationDestinationHighlightedNotification extends jspb.Message {
  getDestinationId(): string;
  setDestinationId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NavigationDestinationHighlightedNotification.AsObject;
  static toObject(includeInstance: boolean, msg: NavigationDestinationHighlightedNotification): NavigationDestinationHighlightedNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NavigationDestinationHighlightedNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NavigationDestinationHighlightedNotification;
  static deserializeBinaryFromReader(message: NavigationDestinationHighlightedNotification, reader: jspb.BinaryReader): NavigationDestinationHighlightedNotification;
}

export namespace NavigationDestinationHighlightedNotification {
  export type AsObject = {
    destinationId: string,
  }
}

export class ToastNotification extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getHref(): string;
  setHref(value: string): void;

  hasDuration(): boolean;
  clearDuration(): void;
  getDuration(): google_protobuf_duration_pb.Duration | undefined;
  setDuration(value?: google_protobuf_duration_pb.Duration): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ToastNotification.AsObject;
  static toObject(includeInstance: boolean, msg: ToastNotification): ToastNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ToastNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ToastNotification;
  static deserializeBinaryFromReader(message: ToastNotification, reader: jspb.BinaryReader): ToastNotification;
}

export namespace ToastNotification {
  export type AsObject = {
    message: string,
    href: string,
    duration?: google_protobuf_duration_pb.Duration.AsObject,
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

  hasAddNavigationDestination(): boolean;
  clearAddNavigationDestination(): void;
  getAddNavigationDestination(): ConfigurationChangeAddNavigationDestination | undefined;
  setAddNavigationDestination(value?: ConfigurationChangeAddNavigationDestination): void;

  hasRemoveNavigationDestination(): boolean;
  clearRemoveNavigationDestination(): void;
  getRemoveNavigationDestination(): string;
  setRemoveNavigationDestination(value: string): void;

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
    addNavigationDestination?: ConfigurationChangeAddNavigationDestination.AsObject,
    removeNavigationDestination: string,
  }

  export enum ConfigurationChangeCase {
    CONFIGURATION_CHANGE_NOT_SET = 0,
    APPLICATION_NAME = 1,
    LOGO_URL = 2,
    FAVICON_URL = 3,
    OPEN_SIDEBAR_TAB = 4,
    CLOSE_SIDEBAR_TAB = 5,
    ADD_NAVIGATION_DESTINATION = 6,
    REMOVE_NAVIGATION_DESTINATION = 7,
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

export class ConfigurationChangeAddNavigationDestination extends jspb.Message {
  getDestinationId(): string;
  setDestinationId(value: string): void;

  getLabel(): string;
  setLabel(value: string): void;

  getIcon(): string;
  setIcon(value: string): void;

  getHref(): string;
  setHref(value: string): void;

  getColor(): string;
  setColor(value: string): void;

  getBeforeDestinationId(): string;
  setBeforeDestinationId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfigurationChangeAddNavigationDestination.AsObject;
  static toObject(includeInstance: boolean, msg: ConfigurationChangeAddNavigationDestination): ConfigurationChangeAddNavigationDestination.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConfigurationChangeAddNavigationDestination, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfigurationChangeAddNavigationDestination;
  static deserializeBinaryFromReader(message: ConfigurationChangeAddNavigationDestination, reader: jspb.BinaryReader): ConfigurationChangeAddNavigationDestination;
}

export namespace ConfigurationChangeAddNavigationDestination {
  export type AsObject = {
    destinationId: string,
    label: string,
    icon: string,
    href: string,
    color: string,
    beforeDestinationId: string,
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

export interface RewardBalanceUpdateReasonMap {
  REWARD_BALANCE_UPDATE_REASON_UNKNOWN: 0;
  REWARD_BALANCE_UPDATE_REASON_REWARD_RECEIVED: 1;
  REWARD_BALANCE_UPDATE_REASON_WITHDRAW: 2;
}

export const RewardBalanceUpdateReason: RewardBalanceUpdateReasonMap;

