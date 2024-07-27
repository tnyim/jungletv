<script lang="ts">
    export let input: HTMLInputElement = undefined;
    export let extraClasses = "";
    export let placeholder = "";
    export let value: string;
</script>

<input
    type="text"
    class="block p-2 w-full rounded-md text-sm dark:bg-gray-950
                focus:ring-yellow-500 focus:outline-none focus:border-yellow-500
                border border-gray-300 {extraClasses}"
    {placeholder}
    on:keydown
    bind:value
    bind:this={input}
/>
