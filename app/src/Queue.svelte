<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount } from "svelte";
    import type { Queue, QueueEntry } from "./proto/jungletv_pb";
    import { Duration } from "luxon";
    import type * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { link } from "svelte-navigator";

    export let mode = "sidebar";

    let queueEntries: QueueEntry[] = [];
    let totalQueueLength: Duration;
    let monitorQueueRequest: Request;
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
    });

    function handleQueueUpdated(queue: Queue) {
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

    function formatDuration(duration: google_protobuf_duration_pb.Duration): string {
        return Duration.fromMillis(duration.getSeconds() * 1000 + duration.getNanos() / 1000000).toFormat("mm:ss");
    }

    async function copyAddress(address: string) {
        try {
            await navigator.clipboard.writeText(address);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    }

    async function removeEntry(entry: QueueEntry, disallow: boolean) {
        await apiClient.removeQueueEntry(entry.getId());
        if (disallow) {
            await apiClient.addDisallowedVideo(entry.getYoutubeVideoData().getId());
        }
    }
</script>

<div class="lg:overflow-y-auto overflow-x-hidden">
    {#each queueEntries as entry, i}
        <div
            class="px-2 py-1 flex flex-row text-sm
            bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-default"
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
                        {formatDuration(entry.getLength())}
                    </div>
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
                            title="Click to copy: {entry.getRequestedBy().getAddress()}"
                            class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                            on:click={() => copyAddress(entry.getRequestedBy().getAddress())}
                        />
                        <span
                            class="font-mono cursor-pointer"
                            style="font-size: 0.70rem;"
                            title="Click to copy: {entry.getRequestedBy().getAddress()}"
                            on:click={() => copyAddress(entry.getRequestedBy().getAddress())}
                            >{entry.getRequestedBy().getAddress().substr(0, 14)}</span
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

<style>
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
