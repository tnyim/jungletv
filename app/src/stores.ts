import { writable } from 'svelte/store';

export const playerConnected = writable(false);
export const rewardAddress = writable("");
export const rewardReceived = writable("");
export const activityChallengeReceived = writable("");
export const currentlyWatching = writable(0);
export const sidebarMode = writable("queue");
export const darkMode = writable((() => {
    return localStorage.darkMode == 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
})());