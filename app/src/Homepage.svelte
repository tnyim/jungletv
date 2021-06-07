<script lang="ts">
    import Player from "./Player.svelte";
    import Queue from "./Queue.svelte";
    import { fly, scale } from "svelte/transition";

    let queueExpanded = true;
</script>

<div class="flex-grow {queueExpanded ? 'pr-96' : ''} min-h-full">
    <Player />
</div>
{#if queueExpanded}
    <div
        class="right-0 block fixed top-16 bottom-0 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-96 z-10"
        transition:fly|local={{ x: 384, duration: 400 }}
    >
        <Queue on:collapseQueue={() => (queueExpanded = false)} />
    </div>
{:else}
    <div
        transition:scale|local="{{ duration: 400, start: 8, opacity: 1 }}"
        class="right-0 fixed top-16 shadow-xl opacity-50 hover:bg-gray-700 hover:opacity-75 text-white w-10 h-10 z-10 cursor-pointer text-xl text-center flex flex-row place-content-center items-center ease-linear transition-all duration-150"
        on:click={() => (queueExpanded = true)}
    >
        <i class="fas fa-th-list" />
    </div>
{/if}
