<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount } from "svelte";
    import { PermissionLevel, Queue, QueueEntry } from "./proto/jungletv_pb";
    import { DateTime, Duration } from "luxon";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { link } from "svelte-navigator";
    import QueueEntryDetails from "./QueueEntryDetails.svelte";
    import { editNicknameForUser } from "./utils";
    import QueueTotals from "./QueueTotals.svelte";
    import QueueEntryHeader from "./QueueEntryHeader.svelte";
    import { permissionLevel } from "./stores";
    import Lazy from "svelte-lazy";

    export let mode = "sidebar";

    let firstLoaded = false;
    let queueEntries: QueueEntry[] = [];
    let insertCursor: string = "";
    let playingSince: DateTime;
    let removalOfOwnEntriesAllowed = false;
    let totalQueueLength: Duration = Duration.fromMillis(0);
    let currentEntryOffset: Duration = Duration.fromMillis(0);
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
            if (queue.hasInsertCursor()) {
                insertCursor = queue.getInsertCursor();
            } else {
                insertCursor = "";
            }
            if (queue.hasPlayingSince()) {
                playingSince = DateTime.fromJSDate(queue.getPlayingSince().toDate());
            } else {
                playingSince = undefined;
            }
            let tl = Duration.fromMillis(0);
            let tv = BigInt(0);
            let participantsSet = new Set();
            if (queueEntries.length > 0 && queueEntries[0].hasOffset()) {
                currentEntryOffset = Duration.fromMillis(
                    queueEntries[0].getOffset().getSeconds() * 1000 + queueEntries[0].getOffset().getNanos() / 1000000
                );
            } else {
                currentEntryOffset = Duration.fromMillis(0);
            }
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

    let isStaff = false;
    permissionLevel.subscribe((level) => {
        isStaff = level == PermissionLevel.ADMIN;
    });
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
            {currentEntryOffset}
            {playingSince}
        />
        {#each queueEntries as entry, i}
            {#if insertCursor == entry.getId()}
                <div class="border-t border-red-600 bg-red-600 flex flex-row mx-2 mb-1 pr-2 rounded-r-md">
                    <div class="flex-grow bg-white dark:bg-gray-900 rounded-tr-md" />
                    <div class="bg-white dark:bg-gray-900">
                        <div class="text-xs text-white py-1 pl-2 bg-red-600 rounded-bl-md">
                            New entries will be added here
                            {#if isStaff}
                                <i
                                    class="ml-1 fas fa-times cursor-pointer hover:text-gray-300"
                                    on:click={async () => await apiClient.clearQueueInsertCursor()}
                                />
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
            <Lazy height={98}>
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
            </Lazy>
            {#if expandedEntryID == entry.getId()}
                <QueueEntryDetails
                    {entry}
                    entryIndex={i}
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
