<script lang="ts">
    import { DoubleBounce } from "svelte-loading-spinners";

    export let button: HTMLButtonElement = undefined;
    export let iconClasses: string;
    export let label: string;
    export let extraClasses = "";
    export let highlighted = false;
</script>

<button
    bind:this={button}
    type="button"
    class="p-1 lg:py-2 h-full flex flex-col items-center rounded
    dark:text-gray-300 text-gray-700
    hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800
    focus:shadow-lg focus:bg-gray-200 dark:focus:bg-gray-800
    outline-none focus:outline-none hover:no-underline
    ease-linear transition-all duration-150 {extraClasses} relative"
    on:click
>
    <i class="px-1.5 {iconClasses}" />
    {#if label}
        <div class="flex-grow flex items-center max-w-28 pt-0.5">
            <span class="text-xs font-bold uppercase line-clamp-2 overflow-ellipsis leading-none">{label}</span>
        </div>
    {/if}
    {#if highlighted}
        <div class="absolute top-0 right-0 m-1 pointer-events-none">
            <DoubleBounce size="14" color="#F59E0B" unit="px" duration="3s" />
        </div>
    {/if}
</button>
