<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount } from "svelte";
    import type { Queue, QueueEntry } from "./proto/jungletv_pb";
    import { Duration } from "luxon";
    import type * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { link } from "svelte-navigator";
    import { currentlyWatching, playerConnected } from "./stores";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let mode = "sidebar";

    let queueEntries: QueueEntry[] = [];
    let monitorQueueRequest: Request;
    onMount(monitorQueue);
    function monitorQueue() {
        apiClient.monitorQueue(handleQueueUpdated, (code, msg) => {
            setTimeout(monitorQueue, 5000);
        });
    }
    onDestroy(() => {
        if (monitorQueueRequest !== undefined) {
            monitorQueueRequest.close();
        }
    });

    let currentlyWatchingCount = 0;
    let playerIsConnected = false;
    currentlyWatching.subscribe((count) => {
        currentlyWatchingCount = count;
    });
    playerConnected.subscribe((connected) => {
        playerIsConnected = connected;
    });

    function handleQueueUpdated(queue: Queue) {
        queueEntries = queue.getEntriesList();
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

    async function removeEntry(id: string) {
        apiClient.removeQueueEntry(id);
    }
</script>

<div class="px-2 py-2 cursor-default relative">
    {#if mode != "moderation"}
        <div
            class="left-0 absolute top-0 shadow-md bg-gray-100 hover:bg-gray-200 w-10 h-10 z-20 cursor-pointer text-xl text-center flex flex-row place-content-center items-center"
            on:click={() => dispatch("collapseQueue")}
        >
            <i class="fas fa-angle-double-right" />
        </div>
    {/if}
    <span class="font-semibold text-lg ml-10">Queue</span>
    {#if mode != "moderation"}
        {#if playerIsConnected}
            <span
                class="float-right text-gray-500"
                title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
            >
                <i class="far fa-eye " />
                {currentlyWatchingCount}
            </span>
        {:else}
            <span
                class="float-right text-red-500"
                title="{currentlyWatchingCount} user{currentlyWatchingCount == 1 ? '' : 's'} watching"
            >
                <i class="fas fa-low-vision" /> Disconnected
            </span>
        {/if}
    {/if}
</div>
<div class="">
    {#each queueEntries as entry, i}
        <div class="px-2 py-1 flex flex-row text-sm space-x-1 hover:bg-gray-200 cursor-default">
            <div class="w-32 flex-shrink-0 thumbnail">
                <img
                    src={entry.getYoutubeVideoData().getThumbnailUrl()}
                    alt="{entry.getYoutubeVideoData().getTitle()} thumbnail"
                />
                {#if i == 0}
                    <div class="thumbnail-now-playing-overlay text-white flex flex-col place-content-center pr-2">
                        <div style="width: auto;" class="flex flex-row place-content-center">
                            <i class="fas fa-play text-5xl" />
                        </div>
                    </div>
                {/if}
            </div>
            <div class="flex flex-col flex-grow">
                <p class="queue-entry-title">
                    {entry.getYoutubeVideoData().getTitle()}
                    <br />
                    <span class="text-xs text-gray-600 font-semibold"
                        >{entry.getYoutubeVideoData().getChannelTitle()}</span
                    >
                </p>
                <p class="text-xs">
                    {formatDuration(entry.getLength())}
                    {#if entry.getRequestedBy().getAddress() != ""}
                        | Requested by <img
                            src="https://monkey.banano.cc/api/v1/monkey/{entry.getRequestedBy().getAddress()}"
                            alt={entry.getRequestedBy().getAddress()}
                            title="Click to copy: {entry.getRequestedBy().getAddress()}"
                            class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                            on:click={() => copyAddress(entry.getRequestedBy().getAddress())}
                        />
                        <span
                            class="font-mono cursor-pointer"
                            style="font-size: 0.70rem;"
                            title="Click to copy: {entry.getRequestedBy().getAddress()}"
                            on:click={() => copyAddress(entry.getRequestedBy().getAddress())}
                            >{entry.getRequestedBy().getAddress().substr(0, 16)}</span
                        >
                    {/if}
                    {#if mode == "moderation"}
                        | <span
                            class="text-blue-600 hover:underline cursor-pointer"
                            on:click={() => removeEntry(entry.getId())}>Remove</span
                        >
                    {/if}
                </p>
            </div>
        </div>
    {:else}
        <div class="px-2 py-2">
            Nothing playing. <a href="/enqueue" use:link class="text-blue-600 hover:underline">Get something going</a>!
        </div>
    {/each}
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
