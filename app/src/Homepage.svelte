<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
    import { fly, scale } from "svelte/transition";
    import watchMedia from "svelte-media";
    import { activityChallengeReceived, playerVolume } from "./stores";
    import { cubicOut } from "svelte/easing";
    import ActivityChallenge from "./ActivityChallenge.svelte";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    let largeScreen = false;
    const media = watchMedia({ large: "(min-width: 1024px)" });
    const mediaUnsubscribe = media.subscribe((obj: any) => (largeScreen = obj.large));
    onDestroy(mediaUnsubscribe);

    const sidebarOpenCloseAnimDuration = 400;

    const dispatch = createEventDispatcher();

    function sidebarCollapseStart() {
        if (!largeScreen) return;
        dispatch("sidebarCollapseStart");
    }
    function sidebarCollapseEnd() {
        if (!largeScreen) return;
        dispatch("sidebarCollapseEnd");
    }
    function sidebarOpenStart() {
        if (!largeScreen) return;
        dispatch("sidebarOpenStart");
    }
    function sidebarOpenEnd() {
        if (!largeScreen) return;
        dispatch("sidebarOpenEnd");
    }

    let sidebarExpanded = true;
    export let playerContainer: HTMLElement;
    export let playerContainerWidth: number;
    export let playerContainerHeight: number;

    let showCaptcha = false;
    let hasChallenge = false;
    let challengesDone = 0;
    onMount(() => {
        document.addEventListener("visibilitychange", checkShowCaptcha);
    });

    const activityChallengeReceivedUnsubscribe = activityChallengeReceived.subscribe((c) => {
        if (c == null) {
            hasChallenge = false;
            showCaptcha = false;
            challengesDone++;
            return;
        }
        hasChallenge = true;
        checkShowCaptcha();
        if (document.hidden && c.getType() != "moderating") {
            captchaAudioAlert($playerVolume);
        }
    });
    onDestroy(activityChallengeReceivedUnsubscribe);

    onDestroy(() => {
        document.removeEventListener("visibilitychange", checkShowCaptcha);
    });

    function checkShowCaptcha() {
        if (!document.hidden && hasChallenge) {
            showCaptcha = true;
        }
    }

    function captchaAudioAlert(volume: number) {
        if (volume == 0 || typeof(window.speechSynthesis) === 'undefined') {
            return;
        }
        let speechSynth = window.speechSynthesis;
        let voices = speechSynth.getVoices();
        let usableVoice: SpeechSynthesisVoice = null;
        for (let voice of voices) {
            if (voice.lang === "en" || voice.lang.startsWith("en-")) {
                usableVoice = voice;
                break;
            }
        }
        if (usableVoice == null) {
            return;
        }

        let utterance = new SpeechSynthesisUtterance("Hey, are you still listening to Jungle TV?");
        utterance.voice = usableVoice;
        utterance.volume = volume;
        utterance.lang = "en-US";
        speechSynth.speak(utterance);
    }
</script>

<div class="flex flex-col lg:flex-row lg-screen-height-minus-top-padding w-full overflow-x-hidden">
    <div
        class="lg:flex-1 player-container relative"
        bind:this={playerContainer}
        bind:clientWidth={playerContainerWidth}
        bind:clientHeight={playerContainerHeight}
    >
        {#if showCaptcha}
            <ActivityChallenge bind:activityChallenge={$activityChallengeReceived} bind:challengesDone />
        {/if}
    </div>
    {#if sidebarExpanded || !largeScreen}
        <div
            class="flex flex-col overflow-hidden lg:shadow-xl bg-white dark:bg-gray-900 dark:text-white lg:w-96 lg:z-40"
            transition:fly|local={{ x: 384, duration: sidebarOpenCloseAnimDuration, easing: cubicOut }}
            on:introstart={sidebarOpenStart}
            on:introend={sidebarOpenEnd}
            on:outrostart={sidebarCollapseStart}
            on:outroend={sidebarCollapseEnd}
        >
            <Sidebar on:collapseSidebar={() => (sidebarExpanded = false)} />
        </div>
    {:else}
        <div
            transition:scale|local={{ duration: sidebarOpenCloseAnimDuration, start: 8, opacity: 1 }}
            class="hidden right-0 fixed top-16 shadow-xl opacity-50 hover:bg-gray-700 hover:opacity-75 text-white w-10 h-10 z-40 cursor-pointer text-xl text-center md:flex flex-row place-content-center items-center ease-linear transition-all duration-150"
            on:click={() => (sidebarExpanded = true)}
        >
            <i class="fas fa-th-list" />
        </div>
    {/if}
</div>

<style>
    .player-container {
        height: 56.25vw; /* make player 16:9 */
    }
    @media (min-width: 1024px) {
        .lg-screen-height-minus-top-padding {
            height: calc(100vh - 4rem);
        }
        .player-container {
            height: auto;
            min-height: 100%;
        }
    }
</style>
