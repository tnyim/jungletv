<script lang="ts">
    import QueueEntryHeaderLayout from "./QueueEntryHeaderLayout.svelte";
    import { formatSoundCloudTrackAttribution, type PartialQueueEntryForHeader } from "./utils";

    export let entry: PartialQueueEntryForHeader;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<QueueEntryHeaderLayout {entry} {isPlaying} {mode}>
    <img
        slot="thumbnail"
        src={entry.getSoundcloudTrackData().getThumbnailUrl()}
        alt=""
        loading="lazy"
        width="90"
        height="90"
    />
    <svelte:fragment slot="title">
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
    </svelte:fragment>
</QueueEntryHeaderLayout>

<style>
    img {
        margin-left: 30px;
        max-width: 90px;
        max-height: 90px;
        object-fit: contain;
    }
</style>
