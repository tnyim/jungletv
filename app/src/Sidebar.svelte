<script lang="ts">
    import { currentlyWatching, playerConnected, sidebarMode } from "./stores";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import Queue from "./Queue.svelte";
    import SidebarTabButton from "./SidebarTabButton.svelte";
    import { fly } from "svelte/transition";
    import Chat from "./Chat.svelte";
    import Document from "./Document.svelte";

    const dispatch = createEventDispatcher();

    let currentlyWatchingCount = 0;
    let playerIsConnected = false;
    currentlyWatching.subscribe((count) => {
        currentlyWatchingCount = count;
    });
    playerConnected.subscribe((connected) => {
        playerIsConnected = connected;
    });

    const tabOrder = ["queue", "chat", "announcements"];
    const tabNames = ["Queue", "Chat", "Announcements"];
    let selectedTab = "queue"; // do not set this variable directly. update sidebarMode instead to ensure proper animations
    let tabInX = 384;
    let tabOutX = 384;
    const EXIT_LEFT = -384;
    const EXIT_RIGHT = 384;
    const ENTER_LEFT = -384;
    const ENTER_RIGHT = 384;
    const SLIDE_DURATION = 200;
    sidebarMode.subscribe((mode) => {
        if (tabOrder.indexOf(selectedTab) < tabOrder.indexOf(mode)) {
            // new tab is to the right
            tabInX = ENTER_RIGHT; // the tab that's entering must enter through the right
            tabOutX = EXIT_LEFT; // the tab that's leaving must leave through the left
        } else {
            // new tab is to the left
            tabInX = ENTER_LEFT; // the tab that's entering must enter through the left
            tabOutX = EXIT_RIGHT; // the tab that's leaving must leave through the right
        }
        selectedTab = mode;
    });

    let tabBar: HTMLDivElement;
    let blW = 0;
    let blSW = 1,
        wDiff = blSW / blW - 1, // widths difference ratio
        mPadd = 120, // Mousemove Padding
        damp = 10, // Mousemove response softness
        mX = 0, // Real mouse position
        mX2 = 0, // Modified mouse position
        posX = 0,
        mmAA = blW - mPadd * 2, // The mousemove available area
        mmAAr = blW / mmAA; // get available mousemove fidderence ratio
    $: if (tabBar !== undefined) {
        blSW = tabBar.scrollWidth;
        wDiff = blSW / blW - 1; // widths difference ratio
        mmAA = blW - mPadd * 2; // The mousemove available area
        mmAAr = blW / mmAA;
    }
    let touchingTabBar = false;
    function onTabBarMouseMove(e: MouseEvent) {
        if (!touchingTabBar) {
            mX = e.pageX - tabBar.getBoundingClientRect().left;
            mX2 = Math.min(Math.max(0, mX - mPadd), mmAA) * mmAAr;
            if (scrollInterval == undefined) {
                setupScrollInterval();
            }
        }
    }

    let scrollInterval: number;
    let didNotMoveFor = 0;

    function setupScrollInterval() {
        scrollInterval = setInterval(function () {
            if (!touchingTabBar) {
                let prev = tabBar.scrollLeft;
                posX += (mX2 - posX) / damp; // zeno's paradox equation "catching delay"
                tabBar.scrollLeft = posX * wDiff;
                if (prev == tabBar.scrollLeft) {
                    didNotMoveFor++;
                    if (didNotMoveFor > 20) {
                        // we have stopped moving, clear the interval to save power
                        clearScrollInterval();
                        return;
                    }
                } else {
                    didNotMoveFor = 0;
                }
            } else {
                clearScrollInterval();
            }
        }, 16);
    }

    function clearScrollInterval() {
        if (scrollInterval !== undefined) {
            clearInterval(scrollInterval);
            scrollInterval = undefined;
        }
    }

    onDestroy(() => {
        clearScrollInterval();
    });
</script>

<div class="px-2 pt-1 pb-2 cursor-default relative">
    <div
        class="hidden lg:flex flex-row left-0 absolute top-0 shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 w-10 h-10 z-20 cursor-pointer text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
        on:click={() => dispatch("collapseSidebar")}
    >
        <i class="fas fa-angle-double-right" />
    </div>
    <div class="flex flex-row lg:ml-10">
        <div
            class="flex-1 flex flex-row h-9 lg: overflow-x-scroll disable-scrollbars relative"
            on:mousemove={onTabBarMouseMove}
            on:touchstart={() => (touchingTabBar = true)}
            on:touchend={() => {
                clearScrollInterval();
                touchingTabBar = false;
            }}
            bind:this={tabBar}
            bind:offsetWidth={blW}
        >
            {#each tabOrder as tabId, idx}
                <SidebarTabButton selected={selectedTab == tabId} on:click={() => sidebarMode.update((_) => tabId)}>
                    {tabNames[idx]}
                </SidebarTabButton>
            {/each}
        </div>
        {#if playerIsConnected}
            <div
                class="text-gray-500 pt-1"
                title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
            >
                <i class="far fa-eye " />
                {currentlyWatchingCount}
            </div>
        {:else}
            <div
                class="text-red-500 pt-1"
                title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
            >
                <i class="fas fa-low-vision" /> Disconnected
            </div>
        {/if}
    </div>
</div>
<div class="h-full lg:overflow-y-auto transition-container">
    {#if selectedTab == "queue"}
        <div
            class="h-full lg:overflow-y-auto"
            in:fly|local={{ duration: SLIDE_DURATION, x: tabInX }}
            out:fly|local={{ duration: SLIDE_DURATION, x: tabOutX }}
        >
            <Queue mode="sidebar" />
        </div>
    {:else if selectedTab == "chat"}
        <div
            class="h-full lg:overflow-y-auto"
            in:fly|local={{ duration: SLIDE_DURATION, x: tabInX }}
            out:fly|local={{ duration: SLIDE_DURATION, x: tabOutX }}
        >
            <Chat mode="sidebar" />
        </div>
    {:else if selectedTab == "announcements"}
        <div
            class="h-full lg:overflow-y-auto"
            in:fly|local={{ duration: SLIDE_DURATION, x: tabInX }}
            out:fly|local={{ duration: SLIDE_DURATION, x: tabOutX }}
        >
            <Document documentID="announcements" />
        </div>
    {/if}
</div>

<style>
    .transition-container {
        display: grid;
        grid-template-rows: 1;
        grid-template-columns: 1;
        overflow-x: hidden;
    }
    .transition-container > * {
        grid-row: 1;
        grid-column: 1;
        overflow-x: hidden;
        mix-blend-mode: normal;
    }

    .disable-scrollbars::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent; /* Chrome/Safari/Webkit */
    }

    .disable-scrollbars {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
    }
</style>
