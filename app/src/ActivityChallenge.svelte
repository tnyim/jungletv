<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { apiClient } from "./api_client";
    import type { ActivityChallenge } from "./proto/jungletv_pb";
    import Segcha from "./Segcha.svelte";
    import { modal } from "./stores";
    import { checkShadowRootIntegrity } from "./utils";

    export let activityChallenge: ActivityChallenge;
    export let challengesDone: number;

    let clicked = false;
    let trusted = false;
    let top = 0;
    let container: HTMLElement;

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
            checkShadowRootIntegrity(container, activityChallenge.getId()) &&
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
