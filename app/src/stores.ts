import { writable } from 'svelte/store';

export const playerConnected = writable(false);
export const rewardAddress = writable("");
export const rewardReceived = writable("");
export const currentlyWatching = writable(0);