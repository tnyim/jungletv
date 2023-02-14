<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import watchMedia from "svelte-media";
    import { cubicOut } from "svelte/easing";
    import { fly, scale } from "svelte/transition";
    import ActivityChallenge from "./ActivityChallenge.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { activityChallengeReceived, activityChallengesDone, playerVolume } from "./stores";
    import { ttsAudioAlert } from "./utils";

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
    onMount(() => {
        document.addEventListener("visibilitychange", checkShowCaptcha);
    });

    const activityChallengeReceivedUnsubscribe = activityChallengeReceived.subscribe((c) => {
        if (c == null) {
            hasChallenge = false;
            showCaptcha = false;
            activityChallengesDone.update((n) => n + 1);
            return;
        }
        hasChallenge = true;
        checkShowCaptcha();
        if (
            (document.hidden || document.fullscreenElement != null) &&
            !c.getTypesList().includes("moderating") &&
            $playerVolume > 0
        ) {
            ttsAudioAlert("Hey, are you still listening to Jungle TV?");
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
</script>

<div class="flex flex-col lg:flex-row lg-screen-height-minus-top-padding w-full overflow-x-hidden">
    <div
        class="lg:flex-1 player-container relative"
        bind:this={playerContainer}
        bind:clientWidth={playerContainerWidth}
        bind:clientHeight={playerContainerHeight}
    >
        {#if showCaptcha}
            <ActivityChallenge bind:activityChallenge={$activityChallengeReceived} />
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
        <button
            type="button"
            transition:scale|local={{ duration: sidebarOpenCloseAnimDuration, start: 8, opacity: 1 }}
            class="hidden right-0 fixed top-16 shadow-xl opacity-50 hover:bg-gray-700 hover:opacity-75 text-white w-10 h-10 z-40 cursor-pointer text-xl text-center md:flex flex-row place-content-center items-center ease-linear transition-all duration-150"
            on:click={() => (sidebarExpanded = true)}
        >
            <i class="fas fa-th-list" />
        </button>
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
