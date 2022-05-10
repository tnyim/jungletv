<script lang="ts">
    import { DateTime, Duration } from "luxon";
    import { onDestroy, onMount, tick } from "svelte";
    import { apiClient } from "./api_client";
    import { playerCurrentTime, rewardAddress } from "./stores";

    export let numEntries = 0;
    export let totalLength: Duration;
    export let numParticipants = 0;
    export let totalQueueValue = BigInt(0);
    export let currentEntryOffset: Duration;
    export let playingSince: DateTime;

    let formattedPlayingSince = "";

    function updatingQueueDuration(totalLength: Duration, currentTime: number): string {
        let d = totalLength.minus(Duration.fromMillis(currentTime * 1000));
        if (d.milliseconds < 0) {
            d = Duration.fromMillis(0);
        }
        return d.toFormat("d'd 'h'h 'm'm'").replace(/^0d /, "").replace(/^0h /, "");
    }

    function formatPlayingSince(playingSince: DateTime): string {
        let duration = playingSince.diffNow().negate();
        let formatString = "d 'days,' h 'hours and' m 'minutes'";
        if (duration.as("days") > 1) {
            formatString = "d 'days and' h 'hours";
        }
        return duration
            .toFormat(formatString)
            .replace(/^0 days, 0 hours and /, "")
            .replace(/^0 days, /, "")
            .replace(/(^|\s)1 minutes/, " 1 minute")
            .replace(/(^|\s)1 hours/, " 1 hour")
            .replace(/(^|\s)1 days/, " 1 day")
            .trim();
    }

    let playingSinceInterval: number;

    function updateFormatted() {
        if (typeof playingSince !== "undefined" && playingSince.diffNow().as("hours") < -4) {
            formattedPlayingSince = formatPlayingSince(playingSince);
        } else {
            formattedPlayingSince = "";
        }
    }
    onMount(() => {
        playingSinceInterval = setInterval(updateFormatted, 10000);
    });

    onDestroy(() => {
        clearInterval(playingSinceInterval);
    });

    $: {
        // make it trigger on any change to playingSince
        if (typeof playingSince !== "undefined") {
            updateFormatted();
        } else {
            formattedPlayingSince = "";
        }
    }

    export let searching = false;
    export let searchQuery = "";
    export let showOnlyOwnEntries = false;
    export let useExtendedSearch = false;

    let searchBox: HTMLInputElement;

    $: if (numEntries == 0) {
        searching = false;
    }

    $: if (!searching) {
        searchQuery = "";
        showOnlyOwnEntries = false;
    } else {
        tick().then(() => searchBox?.focus());
    }

    function onKeyDown(ev: KeyboardEvent) {
        if (ev.key == "Escape") {
            if (searching && searchQuery != "") {
                searchQuery = "";
            } else {
                searching = false;
            }
        }
    }

    function documentKeyDown(e: KeyboardEvent) {
        if (e.ctrlKey && e.key == "f" && numEntries != 0) {
            e.preventDefault();
            searching = true;
        }
    }
</script>
<svelte:body on:keydown={documentKeyDown} />
<div class="w-full flex flex-row">
    {#if searching}
        <div class="flex-grow flex flex-col px-2 gap-2 mb-2" on:keydown={onKeyDown}>
            <input
                type="text"
                placeholder="Search queue entries..."
                class="dark:bg-gray-950 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 flex-1 block w-full rounded-md sm:text-sm border border-gray-300 p-2"
                bind:value={searchQuery}
                bind:this={searchBox}
            />
            <div class="grid gap-2 text-xs grid-rows-1 grid-cols-2">
                {#if $rewardAddress != ""}
                    <div class="flex flex-row">
                        <div class="flex items-center h-4">
                            <input
                                id="onlyown"
                                name="onlyown"
                                type="checkbox"
                                bind:checked={showOnlyOwnEntries}
                                class="focus:ring-yellow-500 h-3 w-3 text-yellow-600 border-gray-300 dark:border-black rounded"
                            />
                        </div>
                        <label for="onlyown" class="ml-1.5 font-medium text-gray-700 dark:text-gray-300">
                            Your requests only
                        </label>
                    </div>
                {/if}
                <div class="flex flex-row">
                    <div class="flex items-center h-4">
                        <input
                            id="advsearch"
                            name="advsearch"
                            type="checkbox"
                            bind:checked={useExtendedSearch}
                            class="focus:ring-yellow-500 h-3 w-3 text-yellow-600 border-gray-300 dark:border-black rounded"
                        />
                    </div>
                    <label for="advsearch" class="ml-1.5 mr-1 font-medium text-gray-700 dark:text-gray-300">
                        Advanced search
                    </label>
                    <a href="https://fusejs.io/examples.html#extended-search" target="_blank" rel="noopener">
                        <i class="fas fa-info-circle text-gray-500 hover:text-purple-500 ease-linear transition-all" />
                    </a>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex-grow grid grid-cols-2 grid-rows-2 gap-2 px-2 mb-2 text-gray-500 text-center">
            <div title="Number of entries in queue">
                {#if numEntries == 0}
                    <i class="fas fa-sad-cry text-sm" />
                {:else}
                    <i class="fas fa-photo-video text-sm" />
                {/if}
                {numEntries}
                {numEntries == 1 ? "entry" : "entries"}
            </div>
            <div title="Total duration of the queue">
                <i class="fas fa-stopwatch text-sm" />
                {updatingQueueDuration(totalLength, $playerCurrentTime - currentEntryOffset.toMillis() / 1000)}
            </div>
            <div title="Request cost of all queue entries">
                <i class="fas fa-coins text-sm" />
                {apiClient.formatBANPriceFixed(totalQueueValue.toString())} BAN
            </div>
            <div title="Number of people who enqueued entries">
                {#if numParticipants == 0}
                    <i class="fas fa-ghost text-sm" />
                {:else}
                    <i class="fas fa-users text-sm" />
                {/if}
                {numParticipants}
                {numParticipants == 1 ? "requester" : "requesters"}
            </div>
        </div>
    {/if}
    {#if numEntries > 0}
        <button
            title="Search queue entries"
            class="text-purple-700 dark:text-purple-500 min-h-full w-8 p-2
        dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
            on:click={() => (searching = !searching)}
        >
            <i class="fas {searching ? 'fa-times' : 'fa-search'}" />
        </button>
    {/if}
</div>
{#if formattedPlayingSince != "" && !searching}
    <div class="w-full px-2 mb-2 text-center text-yellow-600">
        Playing non-stop for <span class="font-semibold">{formattedPlayingSince}</span>!
    </div>
{/if}
