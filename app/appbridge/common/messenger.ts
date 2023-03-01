import type { Messenger } from 'post-me';


const acceptableMessageEvent = (
    event: MessageEvent,
    remoteWindow: Window,
    acceptedOrigin: string
) => {
    const { source, origin } = event;

    if (source !== remoteWindow) {
        return false;
    }

    if (origin !== acceptedOrigin && acceptedOrigin !== '*') {
        return false;
    }

    return true;
};


type MessageListener = (event: MessageEvent) => void;
type ListenerRemover = () => void;
export class JungleTVWindowMessenger implements Messenger {
    postMessage: (message: any, transfer?: Transferable[]) => void;
    addMessageListener: (listener: MessageListener) => ListenerRemover;

    constructor({
        localWindow,
        remoteWindow,
        remoteOrigin,
    }: {
        localWindow?: Window;
        remoteWindow: Window;
        remoteOrigin: string;
    }) {
        localWindow = localWindow || window;

        this.postMessage = (message, transfer) => {
            remoteWindow.postMessage(message, remoteOrigin === "null" ? "*" : remoteOrigin, transfer);
        };

        this.addMessageListener = (listener) => {
            const outerListener = (event: MessageEvent) => {
                if (acceptableMessageEvent(event, remoteWindow, remoteOrigin)) {
                    listener(event);
                }
            };

            localWindow!.addEventListener('message', outerListener);

            const removeListener = () => {
                localWindow!.removeEventListener('message', outerListener);
            };

            return removeListener;
        };
    }
}