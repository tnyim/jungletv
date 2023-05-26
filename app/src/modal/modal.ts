import type { Unsubscriber } from "svelte/store";
import { currentModal, modal, ModalData } from "../stores";
import ModalAlert from "./ModalAlert.svelte";
import ModalConfirm from "./ModalConfirm.svelte";
import ModalPrompt from "./ModalPrompt.svelte";

export type ModalResult<ResponseType> = {
    result: "response" | "abort";
    response?: ResponseType;
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
        let resultCallback = function (r: ResponseType) {
            unsubscriber();
            opened = false;
            modal.set(null);
            resolve({
                result: "response",
                response: r,
            });
        };
        let info = {
            ...mi,
            props: {
                ...mi.props,
                resultCallback: resultCallback,
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
        modal.set(info);
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

export const modalConfirm = async function (question: string, title: string, positiveAnswerLabel: string = "Yes", negativeAnswerLabel: string = "No"): Promise<boolean> {
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
    title: string,
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