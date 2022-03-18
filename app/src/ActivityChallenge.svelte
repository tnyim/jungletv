<script lang="ts">
    import { apiClient } from "./api_client";
    import { fly } from "svelte/transition";
    import type { ActivityChallenge } from "./proto/jungletv_pb";
    import { onMount } from "svelte";
    import { modal } from "./stores";
    import Segcha from "./Segcha.svelte";

    export let activityChallenge: ActivityChallenge;
    export let challengesDone: number;

    let clicked = false;
    let trusted = false;
    let top = 0;
    let container: HTMLElement;

    function checkShadowRootIntegrity(): boolean {
        "use strict";
        let rootNode = container.getRootNode() as ShadowRoot;

        let valuesThatMustBeTrue = [
            () => rootNode.mode === "closed",
            () => typeof Object.getOwnPropertyDescriptor(rootNode, "mode") === "undefined",
            () => typeof Function.prototype.toString.prototype === "undefined",
            () => Function.prototype.toString.toString().startsWith("function toString"),
            () => Function.prototype.toString.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
            () => Node.prototype.getRootNode.toString === Function.prototype.toString,
            () => Node.prototype.getRootNode.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
            () => typeof Object.getOwnPropertyDescriptor.prototype === "undefined",
            () => Object.getOwnPropertyDescriptor.toString().startsWith("function getOwnPropertyDescriptor"),
            () => typeof Node.prototype.getRootNode.prototype === "undefined",
            () => Node.prototype.getRootNode.toString().startsWith("function getRootNode"),
            () => Object.getOwnPropertyDescriptor.toString === Function.prototype.toString,
            () => Object.getOwnPropertyDescriptor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
            () =>
                Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode")
                    .get.toString()
                    .replace(/\s+/g, "")
                    .indexOf("[nativecode]") >= 0,
            () => typeof Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode").get == "function",
            () => function getOwnPropertyDescriptor(a, b) {}.toString().replace(/\s+/g, "").indexOf("[nativecode]") < 0,
            () => document.body.attachShadow === Element.prototype.attachShadow,
            () => Element.prototype.attachShadow.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
            () => Element.prototype.attachShadow.toString().startsWith("function attachShadow"),
            () => Element.prototype.attachShadow.toString === Function.prototype.toString,
            () => typeof Element.prototype.attachShadow.prototype === "undefined",
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof Object.getOwnPropertyDescriptor(window.speechSynthesis, "getVoices") === "undefined",
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof SpeechSynthesis === "undefined" ||
                SpeechSynthesis.prototype.getVoices.toString === Function.prototype.toString,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                window.speechSynthesis.getVoices.toString === Function.prototype.toString,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof Object.getOwnPropertyDescriptor(window.speechSynthesis, "speak") === "undefined",
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof SpeechSynthesis === "undefined" ||
                SpeechSynthesis.prototype.speak.toString === Function.prototype.toString,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                window.speechSynthesis.speak.toString === Function.prototype.toString,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                SpeechSynthesisUtterance.prototype.constructor.toString == Function.prototype.toString,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof SpeechSynthesis === "undefined" ||
                SpeechSynthesis.prototype.getVoices.toString().startsWith("function getVoices"),
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof SpeechSynthesis === "undefined" ||
                SpeechSynthesis.prototype.speak.toString().startsWith("function speak"),
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof SpeechSynthesis === "undefined" ||
                SpeechSynthesisUtterance.prototype.constructor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >=
                    0,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof SpeechSynthesis === "undefined" ||
                SpeechSynthesis.prototype.getVoices.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                typeof SpeechSynthesis === "undefined" ||
                SpeechSynthesis.prototype.speak.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                SpeechSynthesisUtterance.constructor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                SpeechSynthesisUtterance.constructor.toString === Function.prototype.toString,
            () =>
                typeof window.speechSynthesis === "undefined" ||
                SpeechSynthesisUtterance.constructor.toString().startsWith("function Function"),
        ];

        // shuffle array so checks are not always carried out in the same order
        // avoid calling out to Math.random so we have one less function to check, the quality of this randomness doesn't need to be good
        let id = activityChallenge.getId();
        let j = 0;
        for (let i = valuesThatMustBeTrue.length - 1; i > 0; i--) {
            j = (id.charCodeAt(i % id.length) * 3405983 + j) % valuesThatMustBeTrue.length;
            [valuesThatMustBeTrue[i], valuesThatMustBeTrue[j]] = [valuesThatMustBeTrue[j], valuesThatMustBeTrue[i]];
        }

        for (let f of valuesThatMustBeTrue) {
            if (!f()) {
                return false;
            }
        }
        return true;
    }

    async function submitChallenge(captchaResponse: string) {
        try {
            let result = await apiClient.submitActivityChallenge(activityChallenge.getId(), captchaResponse, trusted);
            if (!trusted && !result.getSkippedClientIntegrityChecks()) {
                alert(
                    "Client integrity checks failed. " +
                        "Please disable any extensions that may be interfering with the JungleTV page. " +
                        "You will not receive rewards until this situation is corrected.\n\n" +
                        "Contact the JungleTV team for more information."
                );
            }
        } catch {
            if (activityChallenge?.getType() == "moderating") {
                // the challenge had already expired and the user marked as not moderating
                await apiClient.markAsActivelyModerating();
                activityChallenge = null;
                return;
            }
            if (captchaResponse != "") {
                alert(
                    "An error occurred when submitting the captcha solution. The page will now reload so you can retry."
                );
            } else {
                alert(
                    "An error occurred when submitting the activity challenge. The page will now reload so you can retry."
                );
            }
            location.reload();
        }
        activityChallenge = null;
    }

    async function stillWatching(event: MouseEvent) {
        clicked = true;
        let sig = ((Document.prototype as any).__lookupGetter__("hidden") + "").replace(/\s+/g, "");
        trusted =
            event.isTrusted &&
            !document.hidden &&
            checkShadowRootIntegrity() &&
            (sig == "functiongethidden(){[nativecode]}" || sig == "functionhidden(){[nativecode]}");
        if (activityChallenge.getType() == "segcha") {
            await executeSegcha();
        } else {
            await submitChallenge("");
        }
    }

    async function activityCaptchaOnSubmit(token: string) {
        await submitChallenge(token);
    }

    onMount(() => {
        top = (0.25 + Math.random() / 2) * 100;
    });

    async function executeSegcha() {
        try {
            let challenge = await apiClient.produceSegchaChallenge();
            modal.set({
                component: Segcha,
                props: { challenge: challenge, successCallback: onSegchaComplete },
                options: {
                    closeButton: false,
                    closeOnEsc: false,
                    closeOnOuterClick: false,
                },
            });
        } catch {
            alert("An error occurred when loading the captcha. The page will now reload.");
            location.reload();
        }
    }

    async function onSegchaComplete(answer: string) {
        modal.set(null);
        activityCaptchaOnSubmit(answer);
    }

    async function dismissStillModeratingChallenge() {
        activityChallenge = null;
        await apiClient.stopActivelyModerating();
    }
</script>

<div
    class="absolute left-0 bg-white dark:bg-gray-900 flex flex-col p-2 rounded-r z-50"
    style="top: {top}%"
    transition:fly|local={{ x: -384, duration: 400 }}
    bind:this={container}
>
    <div class="flex flex-row space-x-2">
        <div>
            {#if activityChallenge?.getType() == "moderating"}
                <h3>Are you still moderating?</h3>
                <button
                    class="text-xs text-blue-600 dark:text-blue-400 w-40"
                    on:click={dismissStillModeratingChallenge}
                >
                    No, dismiss this message.
                </button>
            {:else if challengesDone > 1}
                <h3>Are you still watching?</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 w-40">
                    To receive rewards, confirm you're still watching.
                </p>
            {:else}
                <h3>Are you human?</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 w-40">
                    To receive rewards, confirm that you are human.
                </p>
            {/if}
        </div>
        <button
            type="submit"
            class="inline-flex w-20 float-right items-center justify-center py-2 px-4
            border border-transparent shadow-sm text-sm font-medium rounded-md text-white
            {clicked
                ? 'animate-pulse bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'}
            focus:outline-none focus:ring-2 focus:ring-offset-2  hover:shadow ease-linear transition-all duration-150"
            on:click={stillWatching}
        >
            {#if clicked}
                Awaiting captcha...
            {:else if activityChallenge?.getType() == "moderating"}
                Still moderating
            {:else if challengesDone > 1}
                Still watching
            {:else}
                I am human
            {/if}
        </button>
    </div>
</div>
