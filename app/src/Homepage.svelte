<script lang="ts">
    import Player from "./Player.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { fly, scale } from "svelte/transition";
    import watchMedia from "svelte-media";
    import { activityChallengeReceived } from "./stores";
    import { cubicOut } from "svelte/easing";
    import waitForElementTransition from "wait-for-element-transition";
    import ActivityChallenge from "./ActivityChallenge.svelte";
    import { onDestroy, onMount } from "svelte";

    let largeScreen = false;
    const media = watchMedia({ large: "(min-width: 1024px)" });
    media.subscribe((obj: any) => (largeScreen = obj.large));

    const sidebarOpenCloseAnimDuration = 400;

    function scaleFactor(): Number {
        let total = playerContainer.clientWidth + 384;
        return (total / playerContainer.clientWidth) * 100;
    }

    function sidebarCollapseStart() {
        if (!largeScreen) return;
        playerContainer.style.transitionProperty = "transform";
        playerContainer.style.transitionDuration = sidebarOpenCloseAnimDuration + "ms";
        playerContainer.style.transform = "scaleX(" + scaleFactor() + "%)";
    }
    function sidebarCollapseEnd() {
        if (!largeScreen) return;
        playerContainer.style.transitionProperty = "";
        playerContainer.style.transitionDuration = "0ms";
        playerContainer.style.transform = "";
    }
    async function sidebarOpenStart() {
        if (!largeScreen) return;
        playerContainer.style.transitionProperty = "";
        playerContainer.style.transitionDuration = "0ms";
        playerContainer.style.transform = "scaleX(" + scaleFactor() + "%)";
        await waitForElementTransition(playerContainer);
        playerContainer.style.transitionProperty = "transform";
        playerContainer.style.transitionDuration = sidebarOpenCloseAnimDuration + "ms";
        playerContainer.style.transform = "";
    }
    function sidebarOpenEnd() {
        if (!largeScreen) return;
        playerContainer.style.transitionProperty = "";
        playerContainer.style.transitionDuration = "0ms";
        playerContainer.style.transform = "";
    }

    let sidebarExpanded = true;
    let playerContainer: HTMLElement;

    let showCaptcha = false;
    let hasChallenge = false;
    let challengesDone = 0;
    onMount(() => {
        document.addEventListener("visibilitychange", checkShowCaptcha);
    });

    onDestroy(() => {
        document.removeEventListener("visibilitychange", checkShowCaptcha);
    });

    activityChallengeReceived.subscribe((c) => {
        if (c == null) {
            hasChallenge = false;
            showCaptcha = false;
            challengesDone++;
            return;
        }
        hasChallenge = true;
        checkShowCaptcha();
    });

    function checkShowCaptcha() {
        if (!document.hidden && hasChallenge) {
            showCaptcha = true;
        }
    }
</script>

<div class="flex flex-col lg:flex-row lg-screen-height-minus-top-padding w-full overflow-x-hidden bg-black">
    <div class="lg:flex-1 player-container relative" bind:this={playerContainer}>
        {#if showCaptcha}
            <ActivityChallenge bind:activityChallenge={$activityChallengeReceived} bind:challengesDone />
        {/if}
        <Player />
    </div>
    {#if sidebarExpanded || !largeScreen}
        <div
            class="flex flex-col overflow-hidden lg:shadow-xl bg-white dark:bg-gray-900 dark:text-white lg:w-96 lg:z-10"
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
            class="hidden right-0 fixed top-16 shadow-xl opacity-50 hover:bg-gray-700 hover:opacity-75 text-white w-10 h-10 z-10 cursor-pointer text-xl text-center md:flex flex-row place-content-center items-center ease-linear transition-all duration-150"
            on:click={() => (sidebarExpanded = true)}
        >
            <i class="fas fa-th-list" />
        </div>
    {/if}
</div>

<style>
    .player-container {
        transform-origin: center left;
        transition-timing-function: cubic-bezier(0.21, 0.575, 0.394, 1.039);
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
