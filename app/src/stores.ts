import type { CustomEmoji } from 'emoji-picker-element/shared';
import type { Callbacks, Component, Options } from 'svelte-simple-modal/types/Modal.svelte';
import { writable } from 'svelte/store';
import type { ActivityChallenge, ChatGifSearchResult, PermissionLevelMap, SubscriptionDetails } from './proto/jungletv_pb';

type valueof<T> = T[keyof T];

export const playerConnected = writable(false);
export const playerCurrentTime = writable(0);
export const playerVolume = writable(((): number => {
    if (!('playerVolume' in localStorage)) {
        return 1;
    }
    return parseFloat(localStorage.playerVolume);
})());
export const rewardAddress = writable(null);
export const rewardBalance = writable("");
export const rewardReceived = writable("");
export const badRepresentative = writable(false);
export const activityChallengeReceived = writable(null as ActivityChallenge);
export const currentlyWatching = writable(0);
export const unreadAnnouncement = writable(false);
export const unreadChatMention = writable(false);
export const mostRecentAnnouncement = writable((() => parseInt(localStorage.getItem("lastSeenAnnouncement") ?? "-1"))());
export const sidebarMode = writable(((): string => {
    if (!('sidebarMode' in localStorage)) {
        return "queue";
    }
    return localStorage.sidebarMode;
})());
export const chatMediaPickerMode = writable(((): "emoji" | "gifs" | "settings" => {
    if (!('chatMediaPickerMode' in localStorage)) {
        return "emoji";
    }
    return localStorage.chatMediaPickerMode;
})());
export const permissionLevel = writable(null as valueof<PermissionLevelMap>);
export const darkMode = writable((() => {
    return localStorage.darkMode == 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
})());
export const collapseGifs = writable((() => localStorage.collapseGifs == 'true')());
export const convertEmoticons = writable((() => !('convertEmoticons' in localStorage) || localStorage.convertEmoticons == 'true')());
export const autoCloseMediaPickerOnInsert = writable((() => !('autoCloseMediaPickerOnInsert' in localStorage) || localStorage.autoCloseMediaPickerOnInsert == 'true')());
export const autoCloseMediaPickerOnSend = writable((() => !('autoCloseMediaPickerOnSend' in localStorage) || localStorage.autoCloseMediaPickerOnSend == 'true')());
export const blockedUsers = writable(new Set<string>());
export const currentSubscription = writable<SubscriptionDetails>(null);

export type chatEmote = {
    id: string,
    shortcode: string,
    animated: boolean,
    requiresSubscription: boolean,
};
export const chatEmotes = writable([] as chatEmote[]);
export const chatEmotesAsCustomEmoji = writable([] as CustomEmoji[]);
export const chatMessageDraft = writable("");
export const chatMessageDraftTenorGif = writable<ChatGifSearchResult>();
export const chatMessageDraftSelectionJSON = writable("");
export const activityChallengesDone = writable(0);
export const subscriptionUpsoldAfterSegcha = writable(false);

export type ModalData = {
    component: Component,
    props?: Record<string, any>,
    options?: Partial<Options>,
    callbacks?: Partial<Callbacks>,
};

export const modal = writable(null as ModalData);
// always use modal to open/close modals, use currentModal to see what is the currently visible modal
export const currentModal = writable(null as ModalData);

type featureFlags = {
    version: number,
};

const defaultFeatureFlags: featureFlags = {
    version: 3,
}

export const featureFlags = writable<featureFlags>(((): featureFlags => {
    if (!('featureFlags' in localStorage)) {
        return defaultFeatureFlags;
    }
    let curFlags = (JSON.parse(localStorage.featureFlags) as featureFlags);
    if (curFlags.version != defaultFeatureFlags.version) {
        return defaultFeatureFlags;
    }
    return curFlags;
})());

export const enqueuingPassword = writable(((): string => {
    if (!('enqueuingPassword' in localStorage)) {
        return undefined;
    }
    return localStorage.enqueuingPassword;
})());
enqueuingPassword.subscribe(v => localStorage.setItem("enqueuingPassword", v))
export const enqueuingPasswordEdition = writable(((): string => {
    if (!('enqueuingPasswordEdition' in localStorage)) {
        return undefined;
    }
    return localStorage.enqueuingPasswordEdition;
})());
enqueuingPasswordEdition.subscribe(v => localStorage.setItem("enqueuingPasswordEdition", v))