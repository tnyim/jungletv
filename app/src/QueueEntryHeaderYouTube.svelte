<script lang="ts">
    import { Duration as PBDuration } from "google-protobuf/google/protobuf/duration_pb";
    import { createEventDispatcher } from "svelte";
    import { apiClient } from "./api_client";
    import type { QueueEntry } from "./proto/jungletv_pb";
    import { playerCurrentTime } from "./stores";
    import { buildMonKeyURL, formatQueueEntryThumbnailDuration, getReadableUserString } from "./utils";

    const dispatch = createEventDispatcher();

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<div class="flex-shrink-0 thumbnail mr-2" style="width: 120px">
    <img
        src={entry.getYoutubeVideoData().getThumbnailUrl()}
        alt=""
        loading="lazy"
        width="120"
        height="90"
        style="max-width: 120px; max-height: 90px; object-fit: contain"
    />
    {#if isPlaying}
        <div class="thumbnail-now-playing-overlay text-white flex flex-col place-content-center">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="fas fa-play text-5xl" />
            </div>
        </div>
    {/if}
    {#if entry.getConcealed()}
        <div class="thumbnail-concealed-overlay text-yellow-400 flex flex-col place-content-center">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="far fa-eye-slash text-5xl" />
            </div>
        </div>
    {/if}
    <div class="thumbnail-length-overlay text-white">
        <div
            class="absolute bottom-0.5 right-0.5 bg-black bg-opacity-80 px-1 py-0.5 font-bold rounded-sm"
            style="font-size: 0.7rem; line-height: 0.8rem;"
            title={formatQueueEntryThumbnailDuration(entry.getLength())}
        >
            {formatQueueEntryThumbnailDuration(
                !isPlaying || !entry.getYoutubeVideoData().getLiveBroadcast()
                    ? entry.getLength()
                    : (() => {
                          let d = new PBDuration();
                          d.setSeconds(Math.max(entry.getLength().getSeconds() - $playerCurrentTime, 0));
                          return d;
                      })(),
                entry.getOffset()
            )}
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
</div>
<div class="flex flex-col flex-grow overflow-hidden">
    <p class="queue-entry-title break-words">
        {entry.getYoutubeVideoData().getTitle()}
        {#if mode == "moderation"}
            | <a href="https://www.youtube.com/watch?v={entry.getYoutubeVideoData().getId()}" target="_blank"
                >Watch on YouTube</a
            >
        {/if}
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold"
            >{entry.getYoutubeVideoData().getChannelTitle()}</span
        >
    </p>
    <p class="text-xs whitespace-nowrap">
        {#if entry.hasRequestedBy() && entry.getRequestedBy().getAddress() != ""}
            Enqueued by <img
                src={buildMonKeyURL(entry.getRequestedBy().getAddress())}
                alt="&nbsp;"
                class="inline h-7 w-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
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
            | Request cost: {apiClient.formatBANPriceFixed(entry.getRequestCost())} BAN |
            <span class="text-blue-600 hover:underline cursor-pointer" on:click={() => dispatch("remove", entry)}
                >Remove</span
            >
            |
            <span class="text-blue-600 hover:underline cursor-pointer" on:click={() => dispatch("disallow", entry)}
                >Remove and disallow video</span
            >
        {/if}
    </p>
</div>

<style lang="postcss" src="./styles/QueueEntryHeader.postcss"></style>
