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
        if (curStep >= numSteps - 1) {
            successCallback(challenge.getChallengeId() + "," + answers.join(","));
        } else {
            curStep++;
        }
    }

    function onChoiceKeydown(e: KeyboardEvent, choice: number): boolean {
        if (e.key == "Enter" || e.key == " ") {
            onChoiceSelect(choice);
            return false;
        }
        return true;
    }
</script>

<div class="flex flex-col justify-center">
    <div class="flex flex-row mb-4 items-center">
        <p class="text-xl font-semibold flex-grow">Prove that you are human</p>
        <p class="text-lg"><span class="text-3xl font-semibold">{curStep + 1}</span> / {numSteps}</p>
    </div>
    <div class="relative inline-block image-container">
        <img src={imageSrc} alt="Non-accessible captcha challenge" />
        <div class="absolute" style="top: 7.69%; width: 100%; height: calc(100% - 7.69%);">
            <div class="relative" style="width: 100%; height: 100%;">
                <div
                    tabindex="0"
                    class="absolute top-left cursor-pointer hover:bg-white focus:bg-white opacity-40"
                    on:click={() => onChoiceSelect(0)}
                    on:keydown={(e) => onChoiceKeydown(e, 0)}
                />
                <div
                    tabindex="0"
                    class="absolute top-right cursor-pointer hover:bg-white focus:bg-white opacity-40"
                    on:click={() => onChoiceSelect(1)}
                    on:keydown={(e) => onChoiceKeydown(e, 1)}
                />
                <div
                    tabindex="0"
                    class="absolute bottom-left cursor-pointer hover:bg-white focus:bg-white opacity-40"
                    on:click={() => onChoiceSelect(2)}
                    on:keydown={(e) => onChoiceKeydown(e, 2)}
                />
                <div
                    tabindex="0"
                    class="absolute bottom-right cursor-pointer right-0 w-6/12 h-6/12 hover:bg-white focus:bg-white opacity-40"
                    on:click={() => onChoiceSelect(3)}
                    on:keydown={(e) => onChoiceKeydown(e, 3)}
                />
            </div>
        </div>
    </div>
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
