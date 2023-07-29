<script lang="ts">
    export let label: string;
    export let iconClasses: string;
    export let extraClasses = "";
    export let labelClasses = "";
</script>

<button
    type="button"
    class="text-purple-700 dark:text-purple-500 px-1.5 py-1 rounded hover:shadow-sm
            hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800
            outline-none focus:outline-none
            ease-linear transition-all duration-150 {extraClasses}"
    on:click
>
    <i class={iconClasses} />
    {#if labelClasses}
        <span class={labelClasses}>{label}</span>
    {:else}{label}{/if}
</button>
