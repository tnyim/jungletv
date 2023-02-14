<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { Turnstile } from "svelte-turnstile";
    import type { ActivityChallenge, ProduceSegchaChallengeResponse } from "./proto/jungletv_pb";

    export let activityChallenge: ActivityChallenge;
    export let segchaChallenge: ProduceSegchaChallengeResponse;
    export let successCallback: (answers: string[]) => void;

    let curStep = 0;
    let numSteps = 0;
    let imageSrc = "";
    let segchaAnswers: number[] = [];
    let segchaAnswer = "";
    let turnstileAnswer = "";
    let container: HTMLElement;
    $: showSegcha = segchaAnswer === "" && activityChallenge?.getTypesList().includes("segcha");

    $: getImage(segchaChallenge, curStep);
    $: numSteps = segchaChallenge.getStepsList().length;

    function getImage(challenge: ProduceSegchaChallengeResponse, curStep: number) {
        let step = challenge.getStepsList()[curStep];

        imageSrc = "data:image/jpeg;base64," + step.getImage_asB64();
    }

    function onChoiceSelect(e: KeyboardEvent | MouseEvent, choice: number) {
        if (e.target instanceof HTMLElement) {
            e.target.blur();
        }
        segchaAnswers.push(choice);
        if (curStep >= numSteps - 1) {
            segchaAnswer = segchaChallenge.getChallengeId() + "," + segchaAnswers.join(",");
            callbackIfComplete();
        } else {
            curStep++;
        }
    }

    function onTurnstileCallback(token: string) {
        turnstileAnswer = token;
        callbackIfComplete();
    }

    function callbackIfComplete() {
        let answers: string[] = [];
        for (let type of activityChallenge.getTypesList()) {
            switch (type) {
                case "segcha":
                    answers.push(segchaAnswer);
                    break;
                case "turnstile":
                    answers.push(turnstileAnswer);
                    break;
            }
        }
        if (!answers.includes("")) {
            successCallback(answers);
        }
    }

    // Turnstile insists on using document.getElementById to find elements of its widget,
    // but we are in a shadow root and that won't work (thanks Cloudflare!)
    // temporarily hijack document.getElementById to return elements within our shadow root when it looks like it's looking for Turnstile elements
    let origGetElementById = undefined;
    let origQuerySelector = undefined;
    onMount(() => {
        if (activityChallenge.getTypesList().includes("turnstile")) {
            origGetElementById = document.getElementById;
            document.getElementById = function (elementId: string): HTMLElement {
                if (elementId.startsWith("cf-chl-widget")) {
                    return (container.getRootNode() as ShadowRoot).getElementById(elementId);
                }
                return origGetElementById.call(document, elementId);
            };

            origQuerySelector = document.querySelector;
            document.querySelector = function (selectors: string): any {
                return (
                    origQuerySelector.call(document, selectors) ??
                    (container.getRootNode() as ShadowRoot).querySelector(selectors)
                );
            };
        }
    });
    onDestroy(() => {
        if (typeof origGetElementById !== "undefined") {
            document.getElementById = origGetElementById;
        }
        if (typeof origQuerySelector !== "undefined") {
            document.querySelector = origQuerySelector;
        }
    });
</script>

<div class="flex flex-col justify-center" bind:this={container}>
    {#if showSegcha}
        <div class="flex flex-row mb-4 items-center">
            <p class="text-xl font-semibold flex-grow">Prove that you are human</p>
            <p class="text-lg"><span class="text-3xl font-semibold">{curStep + 1}</span> / {numSteps}</p>
        </div>
        <div class="relative inline-block image-container">
            <img src={imageSrc} alt="Non-accessible captcha challenge" />
            <div class="absolute" style="top: 7.69%; width: 100%; height: calc(100% - 7.69%);">
                <div class="relative" style="width: 100%; height: 100%;">
                    <button
                        class="absolute top-left cursor-pointer hover:bg-white focus:bg-white opacity-40"
                        on:click={(e) => onChoiceSelect(e, 0)}
                    />
                    <button
                        class="absolute top-right cursor-pointer hover:bg-white focus:bg-white opacity-40"
                        on:click={(e) => onChoiceSelect(e, 1)}
                    />
                    <button
                        class="absolute bottom-left cursor-pointer hover:bg-white focus:bg-white opacity-40"
                        on:click={(e) => onChoiceSelect(e, 2)}
                    />
                    <button
                        class="absolute bottom-right cursor-pointer right-0 w-6/12 h-6/12 hover:bg-white focus:bg-white opacity-40"
                        on:click={(e) => onChoiceSelect(e, 3)}
                    />
                </div>
            </div>
        </div>
    {/if}
    {#if activityChallenge.getTypesList().includes("turnstile")}
        <div class="{showSegcha ? 'mt-4' : ''} flex justify-center">
            <!-- theme is always light because the modal is always light -->
            <Turnstile
                siteKey="0x4AAAAAAAB4n-Vlnqu2Fxk6"
                theme={"light"}
                cData={activityChallenge.getId()}
                forms={false}
                on:turnstile-callback={(e) => onTurnstileCallback(e.detail.token)}
            />
        </div>
    {/if}
</div>

<style>
    img,
    .image-container {
        max-height: calc(100vh - 160px);
        min-height: 300px;
        margin: auto;
    }

    .top-left {
        top: 0;
        left: 0;
        width: 50%;
        height: 50%;
    }

    .top-right {
        top: 0;
        right: 0;
        width: 50%;
        height: 50%;
    }

    .bottom-left {
        bottom: 0;
        left: 0;
        width: 50%;
        height: 50%;
    }

    .bottom-right {
        bottom: 0;
        right: 0;
        width: 50%;
        height: 50%;
    }
</style>
