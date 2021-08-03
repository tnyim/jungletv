import { writable } from 'svelte/store';
import type { ActivityChallenge } from './proto/jungletv_pb';

export const playerConnected = writable(false);
export const rewardAddress = writable("");
export const rewardBalance = writable("");
export const rewardReceived = writable("");
export const badRepresentative = writable(false);
export const activityChallengeReceived = writable(null as ActivityChallenge);
export const currentlyWatching = writable(0);
export const sidebarMode = writable("queue");
export const darkMode = writable((() => {
    return localStorage.darkMode == 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
})());