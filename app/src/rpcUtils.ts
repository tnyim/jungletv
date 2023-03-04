import type { grpc } from "@improbable-eng/grpc-web";
import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
import { onDestroy, onMount } from "svelte";

type RequestBuilder<T> = (onUpdate: (update: T) => void, onEnd: (code: grpc.Code, msg: string) => void) => Request;

export interface StreamRequestController {
    rebuildAndReconnect: () => void;
    disconnect: () => void;
}
export const consumeStreamRPC = function <T>(
    keepaliveInterval: number,
    reconnectionInterval: number,
    requestBuilder: RequestBuilder<T>, onUpdate: (arg: T) => void,
    onStatusChanged: (connected: boolean) => void = () => { }): StreamRequestController {
    let request: Request;
    let keepaliveTimeoutHandle: number = null;
    let reconnectionTimeoutHandle: number = null;
    let connected = true; // true makes us call statusChangedListener as soon as we get mounted

    function clearTimeouts() {
        if (keepaliveTimeoutHandle != null) {
            clearTimeout(keepaliveTimeoutHandle);
        }
        if (reconnectionTimeoutHandle != null) {
            clearTimeout(reconnectionTimeoutHandle);
        }
    }

    function makeRequest() {
        disconnect();
        request = requestBuilder(handleUpdate, handleClose);
    }

    function disconnect() {
        if (connected) {
            connected = false;
            onStatusChanged(connected);
        }
        if (request !== undefined) {
            request.close();
            request = undefined;
        }
        clearTimeouts();
    }

    function handleUpdate(update: T) {
        if (!connected) {
            connected = true;
            onStatusChanged(connected);
        }
        if (keepaliveTimeoutHandle != null) {
            clearTimeout(keepaliveTimeoutHandle);
        }
        keepaliveTimeoutHandle = setTimeout(makeRequest, keepaliveInterval);
        onUpdate(update);
    }

    function handleClose(code: grpc.Code, message: string) {
        request = undefined;
        // ideally this should use exponential backoff
        reconnectionTimeoutHandle = setTimeout(makeRequest, reconnectionInterval);
    }

    return {
        rebuildAndReconnect: makeRequest,
        disconnect
    };
}


export const consumeStreamRPCFromSvelteComponent = function <T>(
    keepaliveInterval: number,
    reconnectionInterval: number,
    requestBuilder: RequestBuilder<T>, onUpdate: (arg: T) => void,
    onStatusChanged: (connected: boolean) => void = () => { }): StreamRequestController {
    let controller = consumeStreamRPC(keepaliveInterval, reconnectionInterval, requestBuilder, onUpdate, onStatusChanged);

    onMount(controller.rebuildAndReconnect);
    onDestroy(controller.disconnect);
    return controller;
}