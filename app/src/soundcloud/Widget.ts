import camelCasify from './camelCasify';
import { Invoker } from './Invoker';
import type { Metadata } from './types/Metadata';
import type { EventMethod, EventObject } from './types/Method';

export interface WidgetOptions {
    iframe: HTMLIFrameElement;
    invokeTimeout: number;
    useDefaultStyle: boolean;
    initialVolume: number;
}

export class Widget extends Invoker {
    invokeTimeout: number;
    iframe: HTMLIFrameElement;
    initialVolume: number;

    constructor({
        iframe,
        invokeTimeout,
        useDefaultStyle,
        initialVolume,
    }: Partial<WidgetOptions> = {}) {
        super();

        if (typeof iframe !== 'undefined') {
            if (iframe.nodeName.toLocaleLowerCase() !== 'iframe') {
                throw new TypeError('specified element is not an iframe');
            }
            this.iframe = iframe;
        } else {
            this.iframe = document.createElement('iframe');
            this.iframe.setAttribute('frameborder', 'no');
            this.iframe.setAttribute('allow', 'autoplay');
            this.iframe.setAttribute('scrolling', 'no');
            if (useDefaultStyle) {
                this.iframe.style.minHeight = '166px';
                this.iframe.style.width = '100%';
            }
        }

        this.invokeTimeout = invokeTimeout || 5e3;
        window.addEventListener('message', this._onMessage);
        this.initialVolume = initialVolume;
    }

    protected _onMessage = (evt: MessageEvent) => {
        const data = this._assertMessageEvent<EventObject>(evt);

        if (data === null) return;

        switch (data.method as EventMethod) {
            case 'ready': {
                this._addEventListener('play');
                this._addEventListener('pause');
                this._addEventListener('seek');
                this._addEventListener('finish');
                this._refreshMetadata();
                this.setVolume(this.initialVolume);
                break;
            }

            case 'finish': {
                this.isPaused = true;
                break;
            }

            case 'seek': {
                this._refreshTime(data.value);
                break;
            }
            case 'play': {
                this.isPaused = false;
                this._refreshTime(data.value);
                break;
            }
            case 'pause': {
                this.isPaused = true;
                this._refreshTime(data.value);
                break;
            }
        }
    };

    protected _refreshMetadata = async () => {
        this.metadata = camelCasify<Metadata>(
            await this._invokeGetter<object>('getCurrentSound'),
        );
    };

    metadata?: Metadata;

    isPaused = true;
    get duration() {
        return this.metadata?.duration || 0;
    }

    protected _currentTime = 0;
    protected _currentTimeLast = 0;

    get currentTime() {
        if (this.isPaused) return this._currentTime;
        return this._currentTime + Date.now() - this._currentTimeLast;
    }

    set currentTime(value) {
        this._invoke('seekTo', value);
    }

    protected _refreshTime = (data: EventObject) => {
        this._currentTimeLast = Date.now();
        this._currentTime = data.currentPosition;
        if (this.metadata?.id !== data.soundId) this._refreshMetadata();
    };

    async getVolume(): Promise<number> {
        return await this._invokeGetter<number>('getVolume');
    }

    async setVolume(value: number) {
        await this._invoke('setVolume', value);
    }

    loadFromURI = (url: string, opts?: Partial<LoadOptions>) => {
        this.isPaused = true;
        this._currentTime = 0;
        this._currentTimeLast = 0;

        const query = Object.entries({ ...opts, url })
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(
                        LOAD_OPTIONS_MAPPING[key as keyof LoadOptions] || key,
                    )}=${encodeURIComponent(value)}`,
            )
            .join('&');
        this.iframe.src = `https://w.soundcloud.com/player/?${query}`;
    };

    play = () => {
        this._invoke('play');
    };

    pause = () => {
        this._invoke('pause');
    };
}

export interface LoadOptions {
    autoPlay: boolean;
    color: string;
    buying: boolean;
    sharing: boolean;
    download: boolean;
    showArtwork: boolean;
    showPlayCount: boolean;
    showUser: boolean;
    startTrack: number;
    singleActive: boolean;
    visual: boolean;
    showComments: boolean;
}

export const LOAD_OPTIONS_MAPPING = {
    autoPlay: 'auto_play',
    color: 'color',
    buying: 'buying',
    sharing: 'sharing',
    download: 'download',
    showArtwork: 'show_artwork',
    showPlayCount: 'show_playcount',
    showUser: 'show_user',
    startTrack: 'start_track',
    singleActive: 'single_active',
};
