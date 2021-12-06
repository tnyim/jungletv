<script lang="ts">
    import { Duration } from "luxon";
    import { apiClient } from "./api_client";
    import { playerCurrentTime } from "./stores";

    export let numEntries = 0;
    export let totalLength: Duration;
    export let numParticipants = 0;
    export let totalQueueValue = BigInt(0);
    export let currentEntryOffset: Duration;

    function updatingQueueDuration(totalLength: Duration, currentTime: number): string {
        let d = totalLength.minus(Duration.fromMillis(currentTime * 1000));
        if (d.milliseconds < 0) {
            d = Duration.fromMillis(0);
        }
        return d.toFormat("d'd 'h'h 'm'm'").replace(/^0d /, "").replace(/^0h /, "");
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
