import { writable } from 'svelte/store';
import { ActivityChallenge, PermissionLevel, PermissionLevelMap } from './proto/jungletv_pb';

type valueof<T> = T[keyof T];

export const playerConnected = writable(false);
export const rewardAddress = writable("");
export const rewardBalance = writable("");
export const rewardReceived = writable("");
export const badRepresentative = writable(false);
export const activityChallengeReceived = writable(null as ActivityChallenge);
export const currentlyWatching = writable(0);
export const sidebarMode = writable("queue");
export const permissionLevel = writable(PermissionLevel.UNAUTHENTICATED as valueof<PermissionLevelMap>);
export const darkMode = writable((() => {
    return localStorage.darkMode == 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
})());

