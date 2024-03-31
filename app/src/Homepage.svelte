<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import watchMedia from "svelte-media";
    import { cubicOut } from "svelte/easing";
    import { fly, scale } from "svelte/transition";
    import ActivityChallenge from "./ActivityChallenge.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { activityChallengeReceived, activityChallengesDone, playerVolume, sidebarSplitterPosition } from "./stores";
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
    let sidebarContainer: HTMLElement;
    export let playerContainer: HTMLElement;
    export let playerContainerWidth: number;
    export let playerContainerHeight: number;
    // exporting this state allows us to fix mousemove tracking getting lost over iframes on Blink-based browsers
    // which made it very hard to increase the size of the sidebar while media is playing
    export let resizingSidebar: boolean;
    export let sidebarWidth: number = 384;
    let cssSidebarWidth = sidebarWidth;

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

    let md;
    const onMouseDownWrapper = (e) => {
        e.preventDefault();
        if (e.button !== 0) return;
        resizingSidebar = true;
        md = {
            e,
            firstWidth: playerContainer.offsetWidth,
            secondWidth: sidebarContainer.offsetWidth,
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUpWrapper);
        window.addEventListener("touchmove", onMouseMove);
        window.addEventListener("touchend", onMouseUpWrapper);
    };
    const onMouseMove = (e) => {
        e.preventDefault();
        if (e.button !== 0) return;
        var delta = { x: e.clientX - md.e.clientX, y: e.clientY - md.e.clientY };
        // Prevent negative-sized elements
        delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);
        cssSidebarWidth = md.secondWidth - delta.x;
        //sidebarContainer.style.setProperty("--sidebar-width", md.secondWidth - delta.x + "px");
        const fraction = (md.firstWidth + delta.x) / (md.firstWidth + md.secondWidth);
        sidebarSplitterPosition.set(fraction);
    };
    const onMouseUpWrapper = (e) => {
        if (e) {
            e.preventDefault();
            if (e.button !== 0) return;
        }
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUpWrapper);
        window.removeEventListener("touchmove", onMouseMove);
        window.removeEventListener("touchend", onMouseUpWrapper);
        resizingSidebar = false;
    };
    function onResize() {
        if (largeScreen && sidebarExpanded && playerContainer && sidebarContainer) {
            setSplitterPositionFromStore();
        }
    }
    onMount(() => {
        window.addEventListener("resize", onResize);
    });
    onDestroy(() => {
        window.removeEventListener("resize", onResize);
    });
    function setSplitterPositionFromStore() {
        const total = playerContainer.offsetWidth + sidebarContainer.offsetWidth;
        cssSidebarWidth = (1 - $sidebarSplitterPosition) * total;
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
            bind:this={sidebarContainer}
            class="sidebar-container flex flex-col lg:shadow-xl bg-white dark:bg-gray-900 dark:text-white lg:z-40 relative"
            style="--sidebar-width: {cssSidebarWidth}px; pointer-events: {resizingSidebar ? 'none' : 'auto'}"
            transition:fly|local={{
                x: sidebarWidth,
                duration: sidebarOpenCloseAnimDuration,
                easing: cubicOut,
            }}
            on:introstart={sidebarOpenStart}
            on:introend={sidebarOpenEnd}
            on:outrostart={sidebarCollapseStart}
            on:outroend={sidebarCollapseEnd}
            bind:offsetWidth={sidebarWidth}
        >
            {#if largeScreen}
                <div
                    class="separator transparent hover:bg-gray-500 transition-colors ease-in-out duration-100"
                    on:mousedown={onMouseDownWrapper}
                    on:touchstart={onMouseDownWrapper}
                />
            {/if}
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
            min-width: 384px;
        }
        .sidebar-container {
            min-width: 384px;
            width: var(--sidebar-width);
        }
    }

    div.separator {
        cursor: col-resize;
        height: 100%;
        width: 5px;
        z-index: 1;

        position: absolute;
        top: 0;
        left: -5px;
    }
</style>
