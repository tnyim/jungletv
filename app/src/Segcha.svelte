<script lang="ts">
    import type { ProduceSegchaChallengeResponse } from "./proto/jungletv_pb";

    export let challenge: ProduceSegchaChallengeResponse;
    export let successCallback: (answer: string) => void;

    let curStep = 0;
    let numSteps = 0;
    let imageSrc = "";
    let answers: number[] = [];

    $: getImage(challenge, curStep);
    $: numSteps = challenge.getStepsList().length;

    function getImage(challenge: ProduceSegchaChallengeResponse, curStep: number) {
        let step = challenge.getStepsList()[curStep];

        imageSrc = "data:image/jpeg;base64," + step.getImage_asB64();
    }

    function onChoiceSelect(choice: number) {
        answers.push(choice);
        if (curStep >= numSteps-1) {
            successCallback(challenge.getChallengeId() + "," + answers.join(","));
        } else {
            curStep++;
        }
    }
</script>

<div class="flex flex-row mb-4 items-center">
    <p class="text-xl font-semibold flex-grow">Prove that you are human</p>
    <p class="text-lg"><span class="text-3xl font-semibold">{curStep + 1}</span> / {numSteps}</p>
</div>
<div class="relative">
    <img src={imageSrc} alt="Non-accessible captcha challenge" />
    <div class="absolute" style="top: 7.69%; width: 100%; height: calc(100% - 7.69%);">
        <div class="relative" style="width: 100%; height: 100%;">
            <div class="absolute top-left cursor-pointer hover:bg-white hover:opacity-40" on:click="{() => onChoiceSelect(0)}" />
            <div class="absolute top-right cursor-pointer hover:bg-white hover:opacity-40" on:click="{() => onChoiceSelect(1)}" />
            <div class="absolute bottom-left cursor-pointer hover:bg-white hover:opacity-40" on:click="{() => onChoiceSelect(2)}" />
            <div class="absolute bottom-right cursor-pointer right-0 w-6/12 h-6/12 hover:bg-white hover:opacity-40" on:click="{() => onChoiceSelect(3)}" />
        </div>
    </div>
</div>

<style>
    img {
        max-width: 90vw;
        width: 100%;
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
