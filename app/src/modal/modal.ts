import type { Close, Context, Open } from "svelte-simple-modal";
import { get, writable, type Unsubscriber } from "svelte/store";
import ModalAlert from "./ModalAlert.svelte";
import ModalCloseButton from "./ModalCloseButton.svelte";
import ModalConfirm from "./ModalConfirm.svelte";
import ModalPrompt from "./ModalPrompt.svelte";

export type ModalData = {
    component: Parameters<Open>[0],
    props?: Parameters<Open>[1],
    options?: Parameters<Open>[2],
    callbacks?: Parameters<Open>[3],
};

export type ModalResult<ResponseType> = {
    result: "response" | "abort";
    response?: ResponseType;
}

let modalOpen: Open;
let modalClose: Close;
let modalCurrentlyActuallyClosed = false;
let deferredModalOpeningQueue: ModalData[] = [];
const currentModal = writable(null as ModalData);

export function modalSetContext<T>(key: any, context: T): T {
    modalOpen = (context as Context).open;
    modalClose = (context as Context).close;
    modalCurrentlyActuallyClosed = true;
    processModalQueue();
    return context;
}

/**
 * Adds a modal to the queue of modals to be opened.
 * The modal may not be opened immediately if a modal is presently being displayed.
 */
export function openModal(mi: ModalData) {
    deferredModalOpeningQueue = [...deferredModalOpeningQueue, mi];
    processModalQueue();
}

let currentModalClosePromiseResolve: () => void;

/**
 * closeModal closes the modal that is presently being displayed.
 * @returns true if a modal was closed
 */
export async function closeModal(): Promise<boolean> {
    const p = new Promise<void>(resolve => currentModalClosePromiseResolve = resolve);
    let hadModal = get(currentModal) !== null;
    if (modalClose !== undefined) {
        modalClose(); // and later on, onModalClosed gets called when it finishes closing, and modalCurrentlyActuallyClosed is set to true in there
        if (hadModal) {
            await p;
        }
        return hadModal;
    }
    return false;
}

export function onModalClosed() {
    if (currentModalClosePromiseResolve !== undefined) {
        currentModalClosePromiseResolve();
        currentModalClosePromiseResolve = undefined;
    }
    modalCurrentlyActuallyClosed = true;
    processModalQueue();
}

function processModalQueue() {
    if (!modalCurrentlyActuallyClosed) {
        return;
    }
    if (deferredModalOpeningQueue.length > 0) {
        modalCurrentlyActuallyClosed = false;
        // this delay is an attempt to fix a bug where a modal will end up showing above another, i.e. taking the screen space above another one
        setTimeout(() => {
            const p = deferredModalOpeningQueue.pop();
            if (p.options?.closeButton === true) {
                p.options.closeButton = ModalCloseButton;
            }
            modalOpen(p.component, p.props, p.options, p.callbacks);
            currentModal.set(p);
        }, 100);
    } else {
        currentModal.set(null);
    }
}


export const getModalResult = async function <ResponseType>(mi: ModalData): Promise<ModalResult<ResponseType>> {
    return new Promise<ModalResult<ResponseType>>((resolve, _) => {
        let unsubscriber: Unsubscriber;
        let opened = false;
        if (typeof mi.options === "undefined") {
            mi.options = {
                closeButton: false,
                closeOnEsc: true,
                closeOnOuterClick: true,
                styleContent: {
                    padding: "0",
                },
            };
        }
        const resultCallback = function (r: ResponseType) {
            unsubscriber();
            opened = false;
            closeModal();
            resolve({
                result: "response",
                response: r,
            });
        };
        const info = {
            ...mi,
            props: {
                ...mi.props,
                resultCallback,
            }
        }
        unsubscriber = currentModal.subscribe((v) => {
            if (v === info) {
                opened = true;
            } else if (opened) {
                // modal was closed/changed before we got a response
                unsubscriber();
                resolve({
                    result: "abort",
                });
            }
        });
        openModal(info);
    });
}

export const modalAlert = async function (message: string, title: string = "", buttonLabel: string = "OK"): Promise<void> {
    await getModalResult<void>({
        component: ModalAlert,
        props: {
            message,
            title,
            buttonLabel,
        },
    });
}

export const modalConfirm = async function (question: string, title: string = "", positiveAnswerLabel: string = "Yes", negativeAnswerLabel: string = "No"): Promise<boolean> {
    let result = await getModalResult<boolean>({
        component: ModalConfirm,
        props: {
            question,
            title,
            positiveAnswerLabel,
            negativeAnswerLabel,
        },
    });
    return result.result == "response" && result.response;
}

export const modalPrompt = async function (question: string,
    title: string = "",
    placeholder: string = "",
    initialValue: string = "",
    positiveAnswerLabel: string = "OK",
    negativeAnswerLabel: string = "Cancel"): Promise<string> {
    let result = await getModalResult<[string, boolean]>({
        component: ModalPrompt,
        props: {
            question: question,
            title: title,
            placeholder,
            value: initialValue,
            positiveAnswerLabel,
            negativeAnswerLabel,
        },
    });
    if (result.result == "response" && result.response[1]) {
        return result.response[0];
    }
    return null;
}