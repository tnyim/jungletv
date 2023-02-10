<script lang="ts">
    import { onMount } from "svelte";

    export let resultCallback: (boolean) => void;
    export let title: string;
    export let question: string;
    export let positiveAnswerLabel: string;
    export let negativeAnswerLabel: string;

    let button: HTMLButtonElement;

    onMount(() => {
        button.focus();
    });
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    <p class="text-xl font-semibold mb-4">{title}</p>
    <p class="whitespace-pre-line">{question}</p>
</div>
<div
    class="flex flex-row justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-black dark:text-gray-100 rounded-b-lg"
>
    <button
        type="button"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
        on:click={() => resultCallback(false)}
    >
        {negativeAnswerLabel}
    </button>
    <div class="flex-grow" />
    <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
        on:click={() => resultCallback(true)}
        bind:this={button}
    >
        {positiveAnswerLabel}
    </button>
</div>
