<script lang="ts">
    import { DoubleBounce } from "svelte-loading-spinners";

    export let iconClasses: string;
    export let label: string;
    export let extraClasses = "";
    export let highlighted = false;
</script>

<button
    type="button"
    class="p-1 lg:py-2 flex flex-col items-center rounded
    dark:text-gray-300 text-gray-700
    hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800
    focus:shadow-lg focus:bg-gray-200 dark:focus:bg-gray-800
    outline-none focus:outline-none hover:no-underline
    ease-linear transition-all duration-150 {extraClasses} relative"
    on:click
>
    <i class={iconClasses} />
    {#if label}
        <div class="text-xs font-bold uppercase">{label}</div>
    {/if}
    {#if highlighted}
        <div class="absolute top-0 right-0 m-1 pointer-events-none">
            <DoubleBounce size="14" color="#F59E0B" unit="px" duration="3s" />
        </div>
    {/if}
</button>
