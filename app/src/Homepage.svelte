<script lang="ts">
    import Player from "./Player.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { fly, scale } from "svelte/transition";
    import watchMedia from "svelte-media";
    import { activityChallengeReceived } from "./stores";
    import { apiClient } from "./api_client";
    import { cubicOut } from "svelte/easing";
    import waitForElementTransition from "wait-for-element-transition";

    let largeScreen = false;
    const media = watchMedia({ large: "(min-width: 1024px)" });
    media.subscribe((obj: any) => (largeScreen = obj.large));
    let latestActivityChallenge = "";
    activityChallengeReceived.subscribe((challenge) => (latestActivityChallenge = challenge));

    async function stillWatching() {
        await apiClient.submitActivityChallenge(latestActivityChallenge);
        latestActivityChallenge = "";
    }

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
</script>

<div class="flex flex-col lg:flex-row w-full overflow-x-hidden">
    <div class="lg:flex-1 player-container relative" bind:this={playerContainer}>
        {#if latestActivityChallenge != ""}
            <div
                class="absolute left-0 top-3/4 w-72 bg-white flex flex-row p-2 rounded-r space-x-2"
                transition:fly|local={{ x: -384, duration: 400 }}
            >
                <div>
                    <h3>Are you still watching?</h3>
                    <p class="text-xs text-gray-600">To receive rewards, confirm you're still watching.</p>
                </div>
                <button
                    type="submit"
                    class="inline-flex float-right items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
                    on:click={stillWatching}
                >
                    Still watching
                </button>
            </div>
        {/if}
        <Player />
    </div>
    {#if sidebarExpanded || !largeScreen}
        <div
            class="flex flex-col overflow-hidden lg:shadow-xl bg-white lg:w-96 lg:z-10"
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
        .player-container {
            height: auto;
            min-height: 100%;
        }
    }
</style>
