<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount } from "svelte";
    import type { Queue, QueueEntry } from "./proto/jungletv_pb";
    import { Duration } from "luxon";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { link } from "svelte-navigator";
    import QueueEntryDetails from "./QueueEntryDetails.svelte";
    import { editNicknameForUser, formatQueueEntryThumbnailDuration, getReadableUserString } from "./utils";

    export let mode = "sidebar";

    let queueEntries: QueueEntry[] = [];
    let totalQueueLength: Duration;
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
            queueEntries = queue.getEntriesList();
            let tl = Duration.fromMillis(0);
            for (let entry of queueEntries) {
                tl = tl.plus(
                    Duration.fromMillis(entry.getLength().getSeconds() * 1000 + entry.getLength().getNanos() / 1000000)
                );
            }
            totalQueueLength = tl;
        }
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

<div class="lg:overflow-y-auto overflow-x-hidden">
    {#each queueEntries as entry, i}
        <div
            class="px-2 py-1 flex flex-row text-sm
            bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
            on:click={() => openOrCollapse(entry)}
        >
            <div class="w-32 flex-shrink-0 thumbnail">
                <img
                    src={entry.getYoutubeVideoData().getThumbnailUrl()}
                    alt="{entry.getYoutubeVideoData().getTitle()} thumbnail"
                />
                <div class="thumbnail-length-overlay text-white relative pr-2">
                    <div
                        class="absolute bottom-0.5 right-2.5 bg-black bg-opacity-80 px-1 py-0.5 font-bold rounded-sm"
                        style="font-size: 0.7rem; line-height: 0.8rem;"
                    >
                        {formatQueueEntryThumbnailDuration(entry.getLength())}
                    </div>
                    {#if entry.getYoutubeVideoData().getLiveBroadcast()}
                        <div
                            style="font-size: 0.7rem; line-height: 0.8rem;"
                            class="absolute bottom-0.5 left-0.5 bg-black border border-red-500 text-red-500 bg-opacity-80 px-1 py-0.5 font-bold rounded-sm"
                        >
                            LIVE
                        </div>
                    {/if}
                </div>
                {#if i == 0}
                    <div class="thumbnail-now-playing-overlay text-white flex flex-col place-content-center pr-2">
                        <div style="width: auto;" class="flex flex-row place-content-center">
                            <i class="fas fa-play text-5xl" />
                        </div>
                    </div>
                {/if}
            </div>
            <div class="flex flex-col flex-grow">
                <p class="queue-entry-title break-words">
                    {entry.getYoutubeVideoData().getTitle()}
                    {#if mode == "moderation"}
                        | <a
                            href="https://www.youtube.com/watch?v={entry.getYoutubeVideoData().getId()}"
                            target="_blank">Watch on YouTube</a
                        >
                    {/if}
                    <br />
                    <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold"
                        >{entry.getYoutubeVideoData().getChannelTitle()}</span
                    >
                </p>
                <p class="text-xs">
                    {#if entry.hasRequestedBy() && entry.getRequestedBy().getAddress() != ""}
                        Enqueued by <img
                            src="https://monkey.banano.cc/api/v1/monkey/{entry
                                .getRequestedBy()
                                .getAddress()}?monkey=png"
                            alt="&nbsp;"
                            class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                        />
                        <span
                            class="{entry.getRequestedBy().hasNickname()
                                ? 'requester-user-nickname'
                                : 'requester-user-address'} cursor-pointer"
                            style="font-size: 0.70rem;">{getReadableUserString(entry.getRequestedBy())}</span
                        >
                    {:else}
                        Added by JungleTV (no reward)
                    {/if}
                    {#if mode == "moderation"}
                        | Request cost: {apiClient.formatBANPrice(entry.getRequestCost())} BAN |
                        <span
                            class="text-blue-600 hover:underline cursor-pointer"
                            on:click={() => removeEntry(entry, false)}>Remove</span
                        >
                        |
                        <span
                            class="text-blue-600 hover:underline cursor-pointer"
                            on:click={() => removeEntry(entry, true)}>Remove and disallow video</span
                        >
                    {/if}
                </p>
            </div>
        </div>
        {#if expandedEntryID == entry.getId()}
            <QueueEntryDetails
                {entry}
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
    {#if queueEntries.length > 0}
        <div class="px-2 py-2 text-center italic text-gray-500">
            {queueEntries.length}
            {queueEntries.length == 1 ? "video" : "videos"} in queue with a total length of {totalQueueLength
                .toFormat("d 'days,' h 'hours and' m 'minutes'")
                .replace("0 days, 0 hours and ", "")
                .replace("0 days, ", "")
                .replace(/^1 minutes/, "1 minute")
                .replace(/^1 hours/, "1 hour")
                .replace(/^1 days/, "1 day")}
        </div>
    {/if}
</div>

<style lang="postcss">
    .requester-user-address {
        font-size: 0.7rem;
        @apply font-mono;
    }

    .requester-user-nickname {
        font-size: 0.8rem;
        @apply font-semibold;
    }

    .queue-entry-title {
        overflow: hidden;
        height: 4.5rem;
        position: relative;
        mix-blend-mode: hard-light;
    }
    .queue-entry-title::after {
        position: absolute;
        content: "";
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 1rem;
        background: linear-gradient(transparent, gray);
        pointer-events: none;
    }

    .thumbnail {
        position: relative;
    }
    .thumbnail-length-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .thumbnail-now-playing-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        animation: thumbnail-now-playing-pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes thumbnail-now-playing-pulse {
        0%,
        100% {
            opacity: 0.75;
        }
        50% {
            opacity: 0.25;
        }
    }
</style>
