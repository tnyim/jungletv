<script lang="ts">
    import { apiClient } from "./api_client";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";

    export let activityChallenge = "";

    let captchaWidgetID: string;

    async function stillWatching() {
        (window as any).hcaptcha.execute(captchaWidgetID);
    }

    (window as any).activityCaptchaOnSubmit = async function (token: string) {
        await apiClient.submitActivityChallenge(activityChallenge, token);
        activityChallenge = "";
    };

    onMount(() => {
        captchaWidgetID = (window as any).hcaptcha.render("activity-captcha", {});
    });
</script>

<div
    class="absolute left-0 top-3/4 bg-white dark:bg-gray-900 flex flex-col p-2 rounded-r"
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
            class="inline-flex w-20 float-right items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
            on:click={stillWatching}
        >
            Still watching
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
    <div
        id="activity-captcha"
        class="h-captcha"
        data-callback="activityCaptchaOnSubmit"
        data-size="invisible"
        data-sitekey="2b033fe2-e4ae-402d-a6cb-23094e84876d"
    />
</div>
