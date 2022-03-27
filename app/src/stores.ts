import { writable } from 'svelte/store';
import { ActivityChallenge, PermissionLevel, PermissionLevelMap } from './proto/jungletv_pb';

type valueof<T> = T[keyof T];

export const playerConnected = writable(false);
export const playerCurrentTime = writable(0);
export const playerVolume = writable(0);
export const rewardAddress = writable("");
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
export const permissionLevel = writable(PermissionLevel.UNAUTHENTICATED as valueof<PermissionLevelMap>);
export const darkMode = writable((() => {
    return localStorage.darkMode == 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
})());
export const blockedUsers = writable(new Set<string>());

export type chatEmote = {
    id: string,
    shortcode: string,
    animated: boolean,
};
export const chatEmotes = writable([] as chatEmote[]);
export const chatMessageDraft = writable("");
export const chatMessageDraftSelectionJSON = writable("");

type modalInfo = {
    component: any,
    props?: any,
    options?: any,
    callbacks?: any,
};

export const modal = writable(null as modalInfo);

type featureFlags = {
    version: number,
    useCM6ChatComposition: boolean,
};

const defaultFeatureFlags: featureFlags = {
    version: 2,
    // make CM6 chat composition the default everywhere except on Firefox for Android due to contenteditable bug in shadow DOM
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1496769
    useCM6ChatComposition: !(navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && navigator.platform.toLowerCase().indexOf("android") > -1),
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