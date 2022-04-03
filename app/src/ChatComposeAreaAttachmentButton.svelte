<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    import { crossfade } from "svelte/transition";

    const [send, receive] = crossfade({ duration: 1000 });

    let curIcon = 0;

    let interval: number;

    onMount(() => {
        interval = setInterval(() => {
            curIcon = (curIcon + 1) % 3;
        }, 4000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<button
    title="Insert emoji and GIFs"
    class="relative text-purple-700 dark:text-purple-500 min-h-full w-8 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
    on:click
>
    {#if curIcon == 0}
        <i
            class="fas fa-grin-tongue-wink absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            in:send|local={{ key: "icon" }}
            out:receive|local={{ key: "icon" }}
        />
    {:else if curIcon == 1}
        <i
            class="fas fa-photo-video absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            in:send|local={{ key: "icon" }}
            out:receive|local={{ key: "icon" }}
        />
    {:else}
        <i
            class="fas fa-cog absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            in:send|local={{ key: "icon" }}
            out:receive|local={{ key: "icon" }}
        />
    {/if}
</button>
