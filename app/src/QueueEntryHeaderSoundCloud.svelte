<script lang="ts">
    import type { QueueEntry } from "./proto/jungletv_pb";
    import QueueEntryEnqueuedBy from "./QueueEntryEnqueuedBy.svelte";
    import { formatQueueEntryThumbnailDuration, formatSoundCloudTrackAttribution } from "./utils";

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<div class="flex-shrink-0 thumbnail mr-2" style="width: 90px; margin-left: 30px">
    <img
        src={entry.getSoundcloudTrackData().getThumbnailUrl()}
        alt=""
        loading="lazy"
        width="90"
        height="90"
        style="max-width: 90px; max-height: 90px; object-fit: contain"
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
            {formatQueueEntryThumbnailDuration(entry.getLength(), entry.getOffset())}
        </div>
    </div>
</div>
<div class="flex flex-col flex-grow overflow-hidden">
    <p class="queue-entry-title break-words">
        {entry.getSoundcloudTrackData().getTitle()}
        {#if mode == "moderation"}
            | <a href={entry.getSoundcloudTrackData().getPermalink()} target="_blank" rel="noopener">
                Listen on SoundCloud
            </a>
        {/if}
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold"
            >{formatSoundCloudTrackAttribution(entry.getSoundcloudTrackData())}</span
        >
    </p>
    <QueueEntryEnqueuedBy {entry} {mode} on:remove on:disallow />
</div>

<style lang="postcss" src="./styles/QueueEntryHeader.postcss"></style>
