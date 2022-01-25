<script lang="ts">
    import { apiClient } from "./api_client";
    import { fly } from "svelte/transition";
    import type { ActivityChallenge } from "./proto/jungletv_pb";
    import { afterUpdate, onMount } from "svelte";
    import { darkMode, modal } from "./stores";
    import Segcha from "./Segcha.svelte";

    export let activityChallenge: ActivityChallenge;
    export let challengesDone: number;

    let captchaWidgetID: string;
    let clicked = false;
    let trusted = false;
    let top = 0;
    let container: HTMLElement;

    function checkShadowRootIntegrity(): boolean {
        "use strict";
        let order = activityChallenge.getId()[0] < "A";
        let rootNode = container.getRootNode() as ShadowRoot;
        if (order) {
            return (
                rootNode.mode === "closed" &&
                typeof Object.getOwnPropertyDescriptor(rootNode, "mode") === "undefined" &&
                typeof Function.prototype.toString.prototype === "undefined" &&
                Function.prototype.toString.toString().startsWith("function toString") &&
                Node.prototype.getRootNode.toString === Function.prototype.toString &&
                Node.prototype.getRootNode.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0 &&
                typeof Object.getOwnPropertyDescriptor.prototype === "undefined" &&
                Object.getOwnPropertyDescriptor.toString().startsWith("function getOwnPropertyDescriptor") &&
                typeof Node.prototype.getRootNode.prototype === "undefined" &&
                Node.prototype.getRootNode.toString().startsWith("function getRootNode") &&
                Object.getOwnPropertyDescriptor.toString === Function.prototype.toString &&
                Object.getOwnPropertyDescriptor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0 &&
                Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode")
                    .get.toString()
                    .replace(/\s+/g, "")
                    .indexOf("[nativecode]") >= 0 &&
                typeof Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode").get == "function" &&
                function getOwnPropertyDescriptor(a, b) {}.toString().replace(/\s+/g, "").indexOf("[nativecode]") < 0 &&
                document.body.attachShadow === Element.prototype.attachShadow &&
                Element.prototype.attachShadow.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0 &&
                Element.prototype.attachShadow.toString().startsWith("function attachShadow") &&
                Element.prototype.attachShadow.toString === Function.prototype.toString &&
                typeof Element.prototype.attachShadow.prototype === "undefined"
            );
        } else {
            return (
                Object.getOwnPropertyDescriptor.toString === Function.prototype.toString &&
                function getOwnPropertyDescriptor(a, b) {}.toString().replace(/\s+/g, "").indexOf("[nativecode]") < 0 &&
                typeof Object.getOwnPropertyDescriptor.prototype === "undefined" &&
                Node.prototype.getRootNode.toString().startsWith("function getRootNode") &&
                document.body.attachShadow === Element.prototype.attachShadow &&
                Node.prototype.getRootNode.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0 &&
                typeof Node.prototype.getRootNode.prototype === "undefined" &&
                Element.prototype.attachShadow.toString().startsWith("function attachShadow") &&
                Object.getOwnPropertyDescriptor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0 &&
                typeof Function.prototype.toString.prototype === "undefined" &&
                Node.prototype.getRootNode.toString === Function.prototype.toString &&
                Element.prototype.attachShadow.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0 &&
                typeof Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode").get == "function" &&
                Function.prototype.toString.toString().startsWith("function toString") &&
                rootNode.mode === "closed" &&
                Object.getOwnPropertyDescriptor.toString().startsWith("function getOwnPropertyDescriptor") &&
                Element.prototype.attachShadow.toString === Function.prototype.toString &&
                typeof Object.getOwnPropertyDescriptor(rootNode, "mode") === "undefined" &&
                Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode")
                    .get.toString()
                    .replace(/\s+/g, "")
                    .indexOf("[nativecode]") >= 0
            );
        }
    }

    async function stillWatching(event: MouseEvent) {
        clicked = true;
        let sig = ((Document.prototype as any).__lookupGetter__("hidden") + "").replace(/\s+/g, "");
        trusted =
            event.isTrusted &&
            !document.hidden &&
            checkShadowRootIntegrity() &&
            (sig == "functiongethidden(){[nativecode]}" || sig == "functionhidden(){[nativecode]}");
        if (activityChallenge.getType() == "hCaptcha") {
            executehCaptcha();
        } else if (activityChallenge.getType() == "segcha") {
            await executeSegcha();
        } else {
            try {
                await apiClient.submitActivityChallenge(activityChallenge.getId(), "", trusted);
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
    }

    async function activityCaptchaOnError(message: string) {
        console.log("Captcha errored:", message);
        renderhCaptcha();
        executehCaptcha();
    }

    async function activityCaptchaOnClose() {
        clicked = false;
    }

    onMount(() => {
        top = (0.25 + Math.random() / 2) * 100;
    });

    afterUpdate(() => {
        if (captchaWidgetID === undefined && activityChallenge !== null && activityChallenge.getType() == "hCaptcha") {
            renderhCaptcha();
        }
    });

    function renderhCaptcha() {
        try {
            captchaWidgetID = (window as any).hcaptcha.render("activity-captcha", {
                callback: activityCaptchaOnSubmit,
                "error-callback": activityCaptchaOnError,
                "close-callback": activityCaptchaOnClose,
                "chalexpired-callback": activityCaptchaOnClose,
                theme: $darkMode ? "dark" : "light",
            });
        } catch {
            alert("An error occurred when preparing the captcha. The page will now reload so you can retry.");
            location.reload();
        }
    }

    function executehCaptcha() {
        try {
            (window as any).hcaptcha.execute(captchaWidgetID);
        } catch {
            alert("An error occurred when loading the captcha. The page will now reload.");
            location.reload();
        }
    }

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
</script>

<div
    class="absolute left-0 bg-white dark:bg-gray-900 flex flex-col p-2 rounded-r z-50"
    style="top: {top}%"
    transition:fly|local={{ x: -384, duration: 400 }}
    bind:this={container}
>
    <div class="flex flex-row space-x-2">
        <div>
            {#if challengesDone > 1}
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
            {:else if challengesDone > 1}
                Still watching
            {:else}
                I am human
            {/if}
        </button>
    </div>
    {#if activityChallenge != null && activityChallenge.getType() == "hCaptcha"}
        <div class="text-xs text-gray-600 dark:text-gray-400 text-right mt-1">
            Protected by hCaptcha ●
            <a target="_blank" rel="noopener" href="https://hcaptcha.com/privacy">Privacy</a>
            ●
            <a target="_blank" rel="noopener" href="https://hcaptcha.com/terms">Terms</a>
        </div>
        <div
            id="activity-captcha"
            class="h-captcha"
            data-size="invisible"
            data-sitekey="2b033fe2-e4ae-402d-a6cb-23094e84876d"
        />
    {/if}
</div>
