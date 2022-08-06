import type { EventMethod } from './types/Method';
import type { GetterMethod, Method } from './types/Method';

export abstract class Invoker {
    abstract iframe: HTMLIFrameElement;
    abstract invokeTimeout: number;

    protected _invoke = (method: GetterMethod | Method, value?: any) => {
        const data = JSON.stringify({ method, value: value || null });
        const origin = (
            this.iframe.getAttribute('src')?.split('?')[0] ||
            'https://w.soundcloud.com'
        ).replace(/https?:\/\/(w|wt).soundcloud.com/, 'https://$1.soundcloud.com');

        this.iframe.contentWindow?.postMessage(data, origin);
    };

    protected _assertMessageEvent = <T>(
        evt: MessageEvent,
    ): { method: Method | GetterMethod | EventMethod; value: T } | null => {
        if (this.iframe.contentWindow !== evt.source) return null;

        try {
            return JSON.parse(evt.data);
        } catch {
            return null;
        }
    };

    protected _invokeGetter = <T>(
        method: GetterMethod,
        value?: any,
    ): Promise<T> => {
        return new Promise((res, rej) => {
            const that = this;

            let timeout: ReturnType<typeof setTimeout>;

            function onMessage(evt: MessageEvent) {
                const data = that._assertMessageEvent<T>(evt);
                if (data === null) return;

                if (method !== data.method) return;

                clearTimeout(timeout);
                window.removeEventListener('message', onMessage);
                res(data.value);
            }

            window.addEventListener('message', onMessage);
            timeout = setTimeout(() => {
                window.removeEventListener('message', onMessage);
                rej(new Error('iframe is not responding'));
            }, this.invokeTimeout);

            this._invoke(method, value);
        });
    };

    protected _addEventListener = (method: EventMethod) => {
        this._invoke('addEventListener', method);
    };

    protected _removeEventListener = (method: EventMethod) => {
        this._invoke('removeEventListener', method);
    };
}
