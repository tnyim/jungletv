<script lang="ts">
    import { currentlyWatching, playerConnected, sidebarMode } from "./stores";
    import { createEventDispatcher } from "svelte";
    import Queue from "./Queue.svelte";
    import SidebarTabButton from "./SidebarTabButton.svelte";
    import { fly } from "svelte/transition";
    import Chat from "./Chat.svelte";

    const dispatch = createEventDispatcher();

    let currentlyWatchingCount = 0;
    let playerIsConnected = false;
    currentlyWatching.subscribe((count) => {
        currentlyWatchingCount = count;
    });
    playerConnected.subscribe((connected) => {
        playerIsConnected = connected;
    });

    let selectedTab = "queue";
    sidebarMode.subscribe((mode) => {
        selectedTab = mode;
    });
</script>

<div class="px-2 pt-1 pb-2 cursor-default relative">
    <div
        class="hidden lg:flex flex-row left-0 absolute top-0 shadow-md bg-gray-100 hover:bg-gray-200 w-10 h-10 z-20 cursor-pointer text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
        on:click={() => dispatch("collapseSidebar")}
    >
        <i class="fas fa-angle-double-right" />
    </div>
    <div class="flex flex-row lg:ml-10">
        <div class="flex-grow flex flex-row">
            <SidebarTabButton selected={selectedTab == "queue"} on:click={() => sidebarMode.update((_) => "queue")}>
                Queue
            </SidebarTabButton>
            <SidebarTabButton selected={selectedTab == "chat"} on:click={() => sidebarMode.update((_) => "chat")}>
                Chat
            </SidebarTabButton>
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
        <div class="h-full lg:overflow-y-auto" transition:fly|local={{ duration: 200, x: -384 }}>
            <Queue mode="sidebar" />
        </div>
    {:else if selectedTab == "chat"}
        <div class="h-full lg:overflow-y-auto" transition:fly|local={{ duration: 200, x: 384 }}>
            <Chat mode="sidebar" />
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
</style>
