<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount } from "svelte";
    import type { Queue, QueueEntry } from "./proto/jungletv_pb";
    import { Duration } from "luxon";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { link } from "svelte-navigator";
    import QueueEntryDetails from "./QueueEntryDetails.svelte";
    import { editNicknameForUser } from "./utils";
    import QueueTotals from "./QueueTotals.svelte";
    import QueueEntryHeader from "./QueueEntryHeader.svelte";

    export let mode = "sidebar";

    let firstLoaded = false;
    let queueEntries: QueueEntry[] = [];
    let removalOfOwnEntriesAllowed = false;
    let totalQueueLength: Duration = Duration.fromMillis(0);
    let totalQueueValue = BigInt(0);
    let totalQueueParticipants = 0;
    let monitorQueueRequest: Request;
    let monitorQueueTimeoutHandle: number = null;
    onMount(monitorQueue);
    function monitorQueue() {
        monitorQueueRequest = apiClient.monitorQueue(handleQueueUpdated, (code, msg) => {
            setTimeout(monitorQueue, 5000);
        });
    }
    onDestroy(() => {
        if (monitorQueueRequest !== undefined) {
            monitorQueueRequest.close();
        }
        if (monitorQueueTimeoutHandle != null) {
            clearTimeout(monitorQueueTimeoutHandle);
        }
    });

    function monitorQueueTimeout() {
        if (monitorQueueRequest !== undefined) {
            monitorQueueRequest.close();
        }
        monitorQueue();
    }

    function handleQueueUpdated(queue: Queue) {
        if (monitorQueueTimeoutHandle != null) {
            clearTimeout(monitorQueueTimeoutHandle);
        }
        monitorQueueTimeoutHandle = setTimeout(monitorQueueTimeout, 20000);
        if (!queue.getIsHeartbeat()) {
            removalOfOwnEntriesAllowed = queue.getOwnEntryRemovalEnabled();
            queueEntries = queue.getEntriesList();
            let tl = Duration.fromMillis(0);
            let tv = BigInt(0);
            let participantsSet = new Set();
            for (let entry of queueEntries) {
                tl = tl.plus(
                    Duration.fromMillis(entry.getLength().getSeconds() * 1000 + entry.getLength().getNanos() / 1000000)
                );
                tv += BigInt(entry.getRequestCost());
                if (entry.hasRequestedBy()) {
                    participantsSet.add(entry.getRequestedBy().getAddress());
                }
            }
            totalQueueLength = tl;
            totalQueueValue = tv;
            totalQueueParticipants = participantsSet.size;
        }
        firstLoaded = true;
    }

    async function removeEntry(entry: QueueEntry, disallow: boolean) {
        await apiClient.removeQueueEntry(entry.getId());
        if (disallow) {
            await apiClient.addDisallowedVideo(entry.getYoutubeVideoData().getId());
        }
    }

    let expandedEntryID = "";

    function openOrCollapse(entry: QueueEntry) {
        let entryID = entry.getId();
        if (expandedEntryID == entryID) {
            expandedEntryID = "";
        } else {
            expandedEntryID = entryID;
        }
    }
</script>

{#if !firstLoaded}
    <div class="px-2 py-2">Loading...</div>
{:else}
    <div class="lg:overflow-y-auto overflow-x-hidden">
        <QueueTotals
            numEntries={queueEntries.length}
            totalLength={totalQueueLength}
            numParticipants={totalQueueParticipants}
            {totalQueueValue}
        />
        {#each queueEntries as entry, i}
            <div
                class="px-2 py-1 flex flex-row text-sm
            bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                on:click={() => openOrCollapse(entry)}
            >
                <QueueEntryHeader
                    {entry}
                    isPlaying={i == 0}
                    {mode}
                    on:remove={() => removeEntry(entry, false)}
                    on:disallow={() => removeEntry(entry, true)}
                />
            </div>
            {#if expandedEntryID == entry.getId()}
                <QueueEntryDetails
                    {entry}
                    {removalOfOwnEntriesAllowed}
                    on:remove={() => removeEntry(entry, false)}
                    on:disallow={() => removeEntry(entry, true)}
                    on:changeNickname={async () => {
                        await editNicknameForUser(entry.getRequestedBy());
                    }}
                />
            {/if}
        {:else}
            <div class="px-2 py-2">
                Nothing playing. <a href="/enqueue" use:link>Get something going</a>!
            </div>
        {/each}
    </div>
{/if}
