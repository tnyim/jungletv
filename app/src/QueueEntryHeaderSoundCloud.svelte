<script lang="ts">
    import type { QueueEntry } from "./proto/jungletv_pb";
    import QueueEntryEnqueuedBy from "./QueueEntryEnqueuedBy.svelte";
    import { formatQueueEntryThumbnailDuration, formatSoundCloudTrackAttribution } from "./utils";

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<div class="shrink-0 thumbnail mr-2" style="width: 90px; margin-left: 30px">
    <img
        src={entry.getSoundcloudTrackData().getThumbnailUrl()}
        alt=""
        loading="lazy"
        width="90"
        height="90"
        style="max-width: 90px; max-height: 90px; object-fit: contain"
    />
    {#if isPlaying}
        <div class="thumbnail-now-playing-overlay">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="fas fa-play text-5xl" />
            </div>
        </div>
    {/if}
    {#if entry.getConcealed()}
        <div class="thumbnail-concealed-overlay">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="far fa-eye-slash text-5xl" />
            </div>
        </div>
    {/if}
    <div class="thumbnail-length-overlay text-white">
        <div class="thumbnail-length" title={formatQueueEntryThumbnailDuration(entry.getLength())}>
            {formatQueueEntryThumbnailDuration(entry.getLength(), entry.getOffset())}
        </div>
    </div>
</div>
<div class="flex flex-col grow overflow-hidden">
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
