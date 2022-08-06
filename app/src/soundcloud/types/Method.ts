export const METHODS = [
  'play',
  'pause',
  'toggle',
  'seekTo',
  'setVolume',
  'next',
  'prev',
  'skip',

  'addEventListener',
  'removeEventListener',
] as const;

export const GETTER_METHODS = [
  'getVolume',
  'getDuration',
  'getPosition',
  'getSounds',
  'getCurrentSound',
  'getCurrentSoundIndex',
  'isPaused',
] as const;

export const EVENT_METHODS = [
  'loadProgress',
  'playProgress',
  'play',
  'pause',
  'finish',
  'seek',
  'ready',
  'sharePanelOpened',
  'downloadClicked',
  'buyClicked',
  'error',
] as const;

export type Method = typeof METHODS[number];
export type GetterMethod = typeof GETTER_METHODS[number];
export type EventMethod = typeof EVENT_METHODS[number];
export interface EventObject {
  soundId: number;
  loadedProgress: number;
  currentPosition: number;
  relativePosition: number;
}
