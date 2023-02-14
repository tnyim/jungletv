<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let selected = false;
    export let bgClasses = "hover:bg-gray-200 dark:hover:bg-gray-800";
    export let extraClasses = "";

    const dispatch = createEventDispatcher();

    function keyDown(ev: KeyboardEvent) {
        if (ev.key == "Enter") {
            dispatch("click");
        }
    }
</script>

<div
    tabindex="0"
    on:click
    on:mousedown
    on:keydown={keyDown}
    class="{extraClasses} {selected
        ? 'font-semibold'
        : 'text-purple-700 dark:text-purple-500'} focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-inset text-lg px-1.5 py-1 rounded hover:shadow-lg {bgClasses} outline-none focus:outline-none ease-linear transition-all duration-150 cursor-pointer whitespace-nowrap"
>
    <slot />
</div>
