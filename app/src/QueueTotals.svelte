<script lang="ts">
    import { DateTime, Duration } from "luxon";
    import { onDestroy, onMount } from "svelte";
    import { apiClient } from "./api_client";
    import { playerCurrentTime } from "./stores";

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
            .replace(/(^|\s)1 days/, " 1 day").trim();
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
</script>

<div class="w-full grid grid-cols-2 grid-rows-2 gap-2 px-2 mb-2 text-gray-500 text-center">
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
{#if formattedPlayingSince != ""}
    <div class="w-full px-2 mb-2 text-center text-yellow-600">
        Playing non-stop for <span class="font-semibold">{formattedPlayingSince}</span>!
    </div>
{/if}
