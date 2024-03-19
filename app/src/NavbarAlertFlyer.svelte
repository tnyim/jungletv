<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { link } from "svelte-navigator";
    import { fade, fly } from "svelte/transition";

    const dispatch = createEventDispatcher();

    export let classes = "text-gray-700 bg-yellow-200";
    export let duration = 0;
    export let href: string | undefined = undefined;

    let hideTimeout: number;
    let visible = true;

    onMount(() => {
        if (duration > 0) {
            hideTimeout = setTimeout(() => {
                hideTimeout = undefined;
                visible = false;
            }, duration);
        }
    });

    onDestroy(() => {
        if (visible) {
            dispatch("done");
        }
        if (hideTimeout !== undefined) {
            clearTimeout(hideTimeout);
            hideTimeout = undefined;
        }
    });
</script>

{#if visible}
    {#if href}
        <a
            {href}
            use:link
            in:fly={{ x: 200, duration: 1000 }}
            out:fade
            on:outroend={() => dispatch("done")}
            on:click={() => dispatch("done")}
        >
            <span class="text-sm {classes} ml-5 p-1 rounded self-center">
                <slot />
            </span>
        </a>
    {:else}
        <span
            class="text-sm {classes} ml-5 p-1 rounded self-center"
            in:fly={{ x: 200, duration: 1000 }}
            out:fade
            on:outroend={() => dispatch("done")}
        >
            <slot />
        </span>
    {/if}
{/if}

<style>
    a:hover {
        text-decoration: none;
    }
    span {
        min-height: 1.75rem;
    }
</style>
