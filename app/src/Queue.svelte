<script lang="ts">
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { DateTime, Duration } from "luxon";
    import { onDestroy, onMount, tick } from "svelte";
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import Fuzzy from "./Fuzzy.svelte";
    import { AddDisallowedMediaResponse, PermissionLevel, Queue, QueueEntry } from "./proto/jungletv_pb";
    import QueueEntryDetails from "./QueueEntryDetails.svelte";
    import QueueEntryHeader from "./QueueEntryHeader.svelte";
    import QueueTop from "./QueueTop.svelte";
    import { permissionLevel, rewardAddress } from "./stores";
    import VirtualList from "./uielements/VirtualList.svelte";
    import { editNicknameForUser } from "./utils";

    export let mode = "sidebar";

    type QueueEntryWithIndex = QueueEntry & {
        queueIndex: number;
    };

    let firstLoaded = false;
    let queueEntries: QueueEntryWithIndex[] = [];
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
            queueEntries = queue.getEntriesList().map((entry, index): QueueEntryWithIndex => {
                return Object.assign(new QueueEntry(), entry, {
                    queueIndex: index,
                });
            });
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
            let reqPromise: Promise<AddDisallowedMediaResponse>;

            if (entry.hasYoutubeVideoData()) {
                reqPromise = apiClient.addDisallowedYouTubeVideo(entry.getYoutubeVideoData().getId());
            } else if (entry.hasSoundcloudTrackData()) {
                reqPromise = apiClient.addDisallowedSoundCloudTrack(entry.getSoundcloudTrackData().getPermalink());
            }
            await reqPromise;
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
    $: isStaff = $permissionLevel == PermissionLevel.ADMIN;

    function sumDurationOfEntriesBeforeIndex(idx: number): Duration {
        if (queueEntries[idx].getId() == insertCursor) {
            // this entry is after the insert cursor, therefore there's no point in providing an estimate as it'll
            // surely be wrong
            return Duration.fromMillis(-1);
        }
        let tl = Duration.fromMillis(0);
        for (let i = 0; i < idx; i++) {
            let entry = queueEntries[i];
            if (insertCursor == entry.getId()) {
                // this entry is after the insert cursor, therefore there's no point in providing an estimate as it'll
                // surely be wrong
                return Duration.fromMillis(-1);
            }
            tl = tl.plus(
                Duration.fromMillis(entry.getLength().getSeconds() * 1000 + entry.getLength().getNanos() / 1000000)
            );
        }
        return tl;
    }

    let searching = false;
    let searchQuery = "";
    let showOnlyOwnEntries = false;
    let useExtendedSearch = false;
    $: entriesToSearch =
        showOnlyOwnEntries && $rewardAddress != ""
            ? queueEntries.filter((e) => e.getRequestedBy()?.getAddress() == $rewardAddress)
            : queueEntries;

    $: fuseOptions = {
        threshold: 0.3,
        ignoreLocation: true,
        useExtendedSearch: useExtendedSearch,
        keys: [
            {
                name: "title",
                getFn: (entry: QueueEntry): string => {
                    if (entry.hasYoutubeVideoData()) {
                        return entry.getYoutubeVideoData().getTitle();
                    } else if (entry.hasSoundcloudTrackData()) {
                        return entry.getSoundcloudTrackData().getTitle();
                    }
                    return null;
                },
                weight: 5,
            },
            {
                name: "channel",
                getFn: (entry: QueueEntry): string => entry.getYoutubeVideoData()?.getChannelTitle(),
                weight: 3,
            },
            {
                name: "artist",
                getFn: (entry: QueueEntry): string => entry.getSoundcloudTrackData()?.getArtist(),
                weight: 3,
            },
            {
                name: "uploader",
                getFn: (entry: QueueEntry): string => entry.getSoundcloudTrackData()?.getUploader(),
                weight: 3,
            },
            {
                name: "requestedByNickname",
                getFn: (entry: QueueEntry): string => entry.getRequestedBy()?.getNickname(),
                weight: 2,
            },
        ],
    };
    $: if (searchQuery != "") {
        expandedEntryID = "";
    }

    let searchResults = [];

    let highlightedEntryID = "";
    let highlightedEntryTimeout: number;
    onDestroy(() => clearTimeout(highlightedEntryTimeout));

    let queueContainer: HTMLDivElement;
    function jumpToEntry(entry: QueueEntryWithIndex) {
        searching = false;
        tick().then(() => {
            queueContainer.querySelectorAll("[data-virtual-list-index]").forEach((e) => {
                if (+e.getAttribute("data-virtual-list-index") == entry.queueIndex) {
                    e.scrollIntoView({ behavior: "smooth", block: "center" });
                    highlightedEntryID = entry.getId();
                    clearTimeout(highlightedEntryTimeout);
                    highlightedEntryTimeout = setTimeout(() => {
                        highlightedEntryID = "";
                        highlightedEntryTimeout = undefined;
                    }, 2500);
                }
            });
        });
    }
</script>

{#if !firstLoaded}
    <div class="px-2 py-2">Loading...</div>
{:else}
    <div class="lg:overflow-y-auto overflow-x-hidden" bind:this={queueContainer}>
        <QueueTop
            numEntries={queueEntries.length}
            totalLength={totalQueueLength}
            numParticipants={totalQueueParticipants}
            {totalQueueValue}
            {currentEntryOffset}
            {playingSince}
            bind:searching
            bind:searchQuery
            bind:showOnlyOwnEntries
            bind:useExtendedSearch
        />

        <Fuzzy query={searchQuery} data={entriesToSearch} options={fuseOptions} bind:result={searchResults} />
        <VirtualList
            items={searchQuery != "" ? searchResults.map((e) => e.item) : entriesToSearch}
            let:item={entry}
            let:visible
        >
            <div class="px-2 py-2" slot="else">
                {#if searching}
                    No entries found matching the criteria.
                {:else}
                    Nothing playing.
                    {#if mode !== "popout"}
                        <a href="/enqueue" use:link>Get something going</a>!
                    {/if}
                {/if}
            </div>
            {#if insertCursor == entry.getId() && !searching}
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
            {#if visible}
                <div
                    class="px-2 py-1 {searching ? 'pl-0' : ''} flex flex-row text-sm
                        transition-colors ease-in-out duration-1000
                        {highlightedEntryID == entry.getId() ? 'bg-yellow-100 dark:bg-yellow-800' : ''}
                        hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                    on:click={() => openOrCollapse(entry)}
                >
                    <QueueEntryHeader
                        {entry}
                        isPlaying={entry.queueIndex == 0}
                        {mode}
                        showPosition={searching}
                        index={entry.queueIndex}
                        on:remove={() => removeEntry(entry, false)}
                        on:disallow={() => removeEntry(entry, true)}
                        on:jumpTo={() => jumpToEntry(entry)}
                    />
                </div>
            {:else}
                <div style="height: 98px" />
            {/if}
            {#if expandedEntryID == entry.getId()}
                <QueueEntryDetails
                    {entry}
                    entryIndex={entry.queueIndex}
                    {removalOfOwnEntriesAllowed}
                    timeUntilStarting={sumDurationOfEntriesBeforeIndex(entry.queueIndex)}
                    on:remove={() => removeEntry(entry, false)}
                    on:disallow={() => removeEntry(entry, true)}
                    on:changeNickname={async () => {
                        await editNicknameForUser(entry.getRequestedBy());
                    }}
                />
            {/if}
        </VirtualList>
    </div>
{/if}
