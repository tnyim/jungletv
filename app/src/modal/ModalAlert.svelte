<script lang="ts">
    import { onMount } from "svelte";
    import ButtonButton from "../uielements/ButtonButton.svelte";

    export let resultCallback: (boolean) => void;
    export let title: string;
    export let message: string;
    export let buttonLabel: string;

    let button: HTMLButtonElement;

    onMount(() => {
        button.focus();
    });
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    {#if title != ""}
        <p class="text-xl font-semibold mb-4">{title}</p>
    {/if}
    <p class="whitespace-pre-line">{message}</p>
</div>
<div
    class="flex flex-row justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-black dark:text-gray-100 rounded-b-lg"
>
    <div class="flex-grow" />
    <ButtonButton on:click={() => resultCallback(true)} bind:innerButton={button}>
        {buttonLabel}
    </ButtonButton>
</div>
