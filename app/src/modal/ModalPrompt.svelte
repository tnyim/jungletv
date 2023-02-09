<script lang="ts">
    import { onMount } from "svelte";

    export let resultCallback: ([string, boolean]) => void;
    export let title: string;
    export let question: string;
    export let placeholder: string;
    export let value: string;
    export let positiveAnswerLabel: string;
    export let negativeAnswerLabel: string;

    let input: HTMLInputElement;

    onMount(() => {
        input.focus();
    });

    async function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter") {
            resultCallback([value, true]);
            return false;
        }
        return true;
    }
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    <p class="text-xl font-semibold mb-4">{title}</p>
    <p>
        {question}
    </p>
    <div class="mt-1 flex rounded-md shadow-sm">
        <input
            bind:this={input}
            on:keydown={handleEnter}
            type="text"
            class="dark:bg-gray-950 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500 flex-1 block w-full rounded-md text-sm border border-gray-300 p-2"
            {placeholder}
            bind:value
        />
    </div>
</div>
<div
    class="flex flex-row justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-black dark:text-gray-100 rounded-b-lg"
>
    <button
        type="button"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
        on:click={() => resultCallback([value, false])}
        tabindex="0"
    >
        {negativeAnswerLabel}
    </button>
    <div class="flex-grow" />
    <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
        on:click={() => resultCallback([value, true])}
    >
        {positiveAnswerLabel}
    </button>
</div>
