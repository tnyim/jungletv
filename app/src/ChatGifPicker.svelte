<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import { apiClient } from "./api_client";
    import Grid from "./gifpicker/Grid.svelte";
    import type { ChatGifSearchResult } from "./proto/jungletv_pb";
    import { darkMode } from "./stores";

    let searchInput: HTMLInputElement;
    let searchInputValue = ""; // pre-debouncing
    let searchQuery = ""; // debounced
    let prevQuery = "";
    let cursor = "";
    let nextCursor = "";
    let gifResults: ChatGifSearchResult[] = [];
    let loading = true;

    onMount(() => {
        searchInput.focus();
    });

    let timer: number;
    const debounce = (v) => {
        if (typeof timer !== "undefined") {
            clearTimeout(timer);
        }
        gifResults = [];
        loading = true;
        timer = setTimeout(() => {
            searchQuery = v;
        }, 500);
    };

    $: debounce(searchInputValue);

    onDestroy(() => {
        if (typeof timer !== "undefined") {
            clearTimeout(timer);
        }
    });

    async function doSearch(query: string) {
        if (query != prevQuery) {
            cursor = "";
            gifResults = [];
        }
        try {
            let response = await apiClient.chatGifSearch(query, cursor);
            gifResults = response.getResultsList().reduce((acc, current) => {
                const x = acc.find((item) => item.getId() === current.getId());
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, gifResults);
            nextCursor = response.getNextCursor();
            prevQuery = query;
            loading = false;
        } catch {}
    }

    $: doSearch(searchQuery);

    let resetPosition = false;
    $: {
        searchQuery; // make reactive block depend on this
        resetPosition = true;
    }

    async function handleNext() {
        cursor = nextCursor;
        await doSearch(searchQuery);
    }
</script>

<div
    class="w-full h-full flex flex-col border-r border-l border-b border-gray-300 dark:border-gray-700 pt-2.5 space-y-2"
>
    <div class="px-2">
        <input
            bind:this={searchInput}
            bind:value={searchInputValue}
            type="text"
            placeholder="Search Tenor"
            class="dark:bg-gray-950 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 block w-full rounded-md border border-gray-300 p-1"
        />
    </div>

    {#if loading}
        <div class="flex h-full justify-center items-center">
            <Moon size="80" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" />
        </div>
    {:else}
        <div class="overflow-y-auto px-2 pb-2">
            <Grid gifs={gifResults} columnSize={100} bind:resetPosition on:click />
            {#if nextCursor != ""}
                <div class="flex flex-row justify-center py-2">
                    <button
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
                        on:click={handleNext}
                    >
                        More...
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>
