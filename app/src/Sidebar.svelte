<script lang="ts">
    import { currentlyWatching, playerConnected } from "./stores";
    import { createEventDispatcher } from "svelte";
    import Queue from "./Queue.svelte";

    const dispatch = createEventDispatcher();

    let currentlyWatchingCount = 0;
    let playerIsConnected = false;
    currentlyWatching.subscribe((count) => {
        currentlyWatchingCount = count;
    });
    playerConnected.subscribe((connected) => {
        playerIsConnected = connected;
    });
</script>

<div class="px-2 py-2 cursor-default relative">
    <div
        class="hidden lg:flex flex-row left-0 absolute top-0 shadow-md bg-gray-100 hover:bg-gray-200 w-10 h-10 z-20 cursor-pointer text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
        on:click={() => dispatch("collapseSidebar")}
    >
        <i class="fas fa-angle-double-right" />
    </div>
    <span class="font-semibold text-lg lg:ml-10">Queue</span>
    {#if playerIsConnected}
        <span
            class="float-right text-gray-500"
            title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
        >
            <i class="far fa-eye " />
            {currentlyWatchingCount}
        </span>
    {:else}
        <span
            class="float-right text-red-500"
            title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
        >
            <i class="fas fa-low-vision" /> Disconnected
        </span>
    {/if}
</div>
<Queue mode="sidebar" />
