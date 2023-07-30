<script lang="ts">
    import QueueEntryHeaderLayout from "./QueueEntryHeaderLayout.svelte";
    import { type PartialQueueEntryForHeader } from "./utils";

    export let entry: PartialQueueEntryForHeader;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<QueueEntryHeaderLayout {entry} {isPlaying} {mode} isLive={entry.getYoutubeVideoData().getLiveBroadcast()}>
    <img
        slot="thumbnail"
        src={entry.getYoutubeVideoData().getThumbnailUrl()}
        alt=""
        loading="lazy"
        width="120"
        height="90"
    />
    <svelte:fragment slot="title">
        {entry.getYoutubeVideoData().getTitle()}
        {#if mode == "moderation"}
            | <a
                href="https://www.youtube.com/watch?v={entry.getYoutubeVideoData().getId()}"
                target="_blank"
                rel="noopener"
            >
                Watch on YouTube
            </a>
        {/if}
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold"
            >{entry.getYoutubeVideoData().getChannelTitle()}</span
        >
    </svelte:fragment>
</QueueEntryHeaderLayout>

<style lang="postcss">
    img {
        max-width: 120px;
        max-height: 90px;
        object-fit: contain;
    }
</style>
