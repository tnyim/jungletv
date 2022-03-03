<script lang="ts">
    import { currentlyWatching, playerConnected, sidebarMode, unreadAnnouncement, unreadChatMention } from "./stores";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import SidebarTabButton from "./SidebarTabButton.svelte";
    import { fly } from "svelte/transition";
    import { defaultSidebarTabIDs } from "./tabStores";
    import type { SidebarTab } from "./tabStores";
    import { sidebarTabs } from "./tabStores";
    import DoubleBounce from "svelte-loading-spinners/dist/DoubleBounce.svelte";
    import { openPopout } from "./utils";

    const dispatch = createEventDispatcher();

    let selectedTabID = "queue"; // do not set this variable directly. update sidebarMode instead to ensure proper animations
    let selectedTab: SidebarTab;

    let currentlyWatchingCount = 0;
    let playerIsConnected = false;
    currentlyWatching.subscribe((count) => {
        currentlyWatchingCount = count;
    });
    playerConnected.subscribe((connected) => {
        playerIsConnected = connected;
    });
    unreadAnnouncement.subscribe((hasUnread) => {
        sidebarTabs.update((currentTabs) => {
            currentTabs.find((t) => "announcements" == t.id).highlighted = hasUnread;
            return currentTabs;
        });
    });
    unreadChatMention.subscribe((hasUnread) => {
        if (selectedTabID != "chat" || !hasUnread) {
            sidebarTabs.update((currentTabs) => {
                currentTabs.find((t) => "chat" == t.id).highlighted = hasUnread;
                return currentTabs;
            });
        } else if (hasUnread) {
            unreadChatMention.set(false);
        }
    });

    let tabs: SidebarTab[] = [];

    sidebarTabs.subscribe((t) => {
        tabs = t;
    });

    function openSidebarTab(event: CustomEvent<SidebarTab>) {
        let newTab = event.detail;
        let selectedTabIndex = tabs.findIndex((t) => selectedTabID == t.id);
        tabs.splice(selectedTabIndex + 1, 0, newTab);
        sidebarTabs.update((_) => tabs);
        sidebarMode.update((_) => newTab.id);
    }

    function closeTab(tab: SidebarTab) {
        let tabIndex = tabs.findIndex((t) => tab.id == t.id);
        if (tabIndex >= 0) {
            tabs.splice(tabIndex, 1);
            if (selectedTabID == tab.id) {
                sidebarMode.update((_) => tabs[Math.max(0, tabIndex - 1)].id);
            }
            sidebarTabs.update((_) => tabs);
        }
    }

    let tabInX = 384;
    const SLIDE_DURATION = 200;
    let flipFlop = false;
    sidebarMode.subscribe((mode) => {
        if (tabs.findIndex((t) => selectedTabID == t.id) < tabs.findIndex((t) => mode == t.id)) {
            // new tab is to the right
            tabInX = 384;
        } else {
            // new tab is to the left
            tabInX = -384;
        }
        selectedTabID = mode;
        selectedTab = tabs.find((t) => selectedTabID == t.id);
        flipFlop = !flipFlop;
        if (defaultSidebarTabIDs.includes(mode)) {
            localStorage.setItem("sidebarMode", mode);
        }
    });

    let tabBar: HTMLDivElement;
    let blW = 0;
    let blSW = 1,
        wDiff = blSW / blW - 1, // widths difference ratio
        mPadd = 50, // Mousemove Padding
        damp = 12, // Mousemove response softness
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

    function onTabButtonMouseDown(tabID: string, e: MouseEvent) {
        if (e.button == 1) {
            let clickedTab = tabs.find((t) => tabID == t.id);
            if (typeof clickedTab !== "undefined" && clickedTab.canPopout) {
                e.preventDefault();
                openPopout(tabID);
            }
        }
    }

    onDestroy(() => {
        clearScrollInterval();
    });
</script>

<div class="px-2 pt-1 pb-2 cursor-default relative">
    <div
        class="hidden lg:flex flex-row left-0 absolute top-0 shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 w-10 h-10 z-40 cursor-pointer text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
        on:click={() => dispatch("collapseSidebar")}
    >
        <i class="fas fa-angle-double-right" />
    </div>
    <div class="flex flex-row lg:ml-10">
        <div
            class="flex-1 flex flex-row h-9 overflow-x-scroll disable-scrollbars relative"
            on:mousemove={onTabBarMouseMove}
            on:touchstart={() => (touchingTabBar = true)}
            on:touchend={() => {
                clearScrollInterval();
                touchingTabBar = false;
            }}
            bind:this={tabBar}
            bind:offsetWidth={blW}
        >
            {#each tabs as tab}
                <SidebarTabButton
                    selected={selectedTabID == tab.id}
                    on:mousedown={(e) => onTabButtonMouseDown(tab.id, e)}
                    on:click={() => sidebarMode.update((_) => tab.id)}
                >
                    {#if tab.highlighted}
                        <div class="inline-block">
                            <DoubleBounce size="14" color="#F59E0B" unit="px" duration="3s" />
                        </div>
                    {/if}
                    {tab.tabTitle}
                    {#if tab.closeable}
                        <i
                            class="fas fa-times cursor-pointer hover:text-yellow-700 dark:hover:text-yellow-500"
                            on:click|stopPropagation={() => closeTab(tab)}
                        />
                    {/if}
                </SidebarTabButton>
            {/each}
        </div>
        {#if playerIsConnected}
            <div
                class="text-gray-500 pt-1 pl-2"
                title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
            >
                <i class="far fa-eye " />
                {currentlyWatchingCount}
            </div>
        {:else}
            <div
                class="text-red-500 pt-1 pl-2"
                title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
            >
                <i class="fas fa-low-vision" /> Disconnected
            </div>
        {/if}
    </div>
</div>
<div class="h-full lg:overflow-y-auto transition-container">
    <!-- these two are identical. This is to work around the way the svelte transitions system behaves -->
    <!-- (no, #key does not have the same behavior here) -->
    {#if flipFlop}
        <div
            class="h-full lg:overflow-y-auto"
            in:fly|local={{ duration: SLIDE_DURATION, x: tabInX }}
            out:fly|local={{ duration: SLIDE_DURATION, x: -tabInX }}
        >
            <svelte:component
                this={selectedTab.component}
                {...selectedTab.props}
                on:openSidebarTab={openSidebarTab}
                on:closeTab={() => closeTab(selectedTab)}
            />
        </div>
    {:else}
        <div
            class="h-full lg:overflow-y-auto"
            in:fly|local={{ duration: SLIDE_DURATION, x: tabInX }}
            out:fly|local={{ duration: SLIDE_DURATION, x: -tabInX }}
        >
            <svelte:component
                this={selectedTab.component}
                {...selectedTab.props}
                on:openSidebarTab={openSidebarTab}
                on:closeTab={() => closeTab(selectedTab)}
            />
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
