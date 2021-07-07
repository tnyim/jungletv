<script lang="ts">
    import { apiClient } from "./api_client";
    import { fly } from "svelte/transition";
    import type { ActivityChallenge } from "./proto/jungletv_pb";
    import { afterUpdate, onMount } from "svelte";
import { darkMode } from "./stores";

    export let activityChallenge: ActivityChallenge;

    let captchaWidgetID: string;
    let clicked = false;
    let trusted = false;
    let top = 0;

    async function stillWatching(event: MouseEvent) {
        clicked = true;
        trusted = event.isTrusted;
        if (activityChallenge.getType() == "hCaptcha") {
            try {
                (window as any).hcaptcha.execute(captchaWidgetID);
            } catch {
                alert("An error occurred when loading the captcha. The page will now reload.");
                location.reload();
            }
        } else {
            try {
                await apiClient.submitActivityChallenge(activityChallenge.getId(), "", event.isTrusted);
            } catch {}
            activityChallenge = null;
        }
    }

    async function activityCaptchaOnSubmit(token: string) {
        try {
            await apiClient.submitActivityChallenge(activityChallenge.getId(), token, trusted);
        } catch {
            alert("An error occurred when submitting the captcha solution. The page will now reload so you can retry.");
            location.reload();
        }
        activityChallenge = null;
    };

    async function activityCaptchaOnError(message: string) {
        alert("An error occurred when solving the captcha (" + message + "). The page will now reload.");
        location.reload();
    };

    async function activityCaptchaOnClose() {
        clicked = false;
    };

    onMount(() => {
        top = (0.25 + Math.random() / 2) * 100;
    });

    afterUpdate(() => {
        if (captchaWidgetID === undefined && activityChallenge !== null && activityChallenge.getType() == "hCaptcha") {
            try {
                captchaWidgetID = (window as any).hcaptcha.render("activity-captcha", {
                    "callback": activityCaptchaOnSubmit,
                    "error-callback": activityCaptchaOnError,
                    "close-callback": activityCaptchaOnClose,
                    "chalexpired-callback": activityCaptchaOnClose,
                    "theme": $darkMode ? "dark" : "light",
                });
            } catch {
                alert("An error occurred when preparing the captcha. The page will now reload so you can retry.");
                location.reload();
            }
        }
    });
</script>

<div
    class="absolute left-0 bg-white dark:bg-gray-900 flex flex-col p-2 rounded-r"
    style="top: {top}%"
    transition:fly|local={{ x: -384, duration: 400 }}
>
    <div class="flex flex-row space-x-2">
        <div>
            <h3>Are you still watching?</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 w-40">
                To receive rewards, confirm you're still watching.
            </p>
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
            {:else}
                Still watching
            {/if}
        </button>
    </div>
    <div class="text-xs text-gray-600 dark:text-gray-400 text-right mt-1">
        Protected by hCaptcha ●
        <a target="_blank" rel="noopener" class="text-blue-600 hover:underline" href="https://hcaptcha.com/privacy"
            >Privacy</a
        >
        ●
        <a target="_blank" rel="noopener" class="text-blue-600 hover:underline" href="https://hcaptcha.com/terms"
            >Terms</a
        >
    </div>
    {#if activityChallenge != null && activityChallenge.getType() == "hCaptcha"}
        <div
            id="activity-captcha"
            class="h-captcha"
            data-size="invisible"
            data-sitekey="2b033fe2-e4ae-402d-a6cb-23094e84876d"
        />
    {/if}
</div>
