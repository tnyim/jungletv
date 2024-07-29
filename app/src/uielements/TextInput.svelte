<script lang="ts">
    export let input: HTMLInputElement = undefined;
    export let extraClasses = "";
    export let placeholder = "";
    export let value: string;
    export let id: string = undefined;
    export let name: string = undefined;
    export let hasError = false;

    $: {
        if (!name) {
            name = id;
        }
    }
</script>

<input
    {id}
    {name}
    type="text"
    class="block p-2 w-full rounded-md text-sm dark:bg-gray-950
            focus:ring-yellow-500 focus:outline-none focus:border-yellow-500
            border {extraClasses} {hasError ? 'border-red-600' : 'border-gray-300'}"
    {placeholder}
    on:input
    on:keydown
    bind:value
    bind:this={input}
/>
