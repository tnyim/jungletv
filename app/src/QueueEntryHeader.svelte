<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { QueueEntry } from "./proto/jungletv_pb";
    import QueueEntryHeaderConcealed from "./QueueEntryHeaderConcealed.svelte";
    import QueueEntryHeaderDocument from "./QueueEntryHeaderDocument.svelte";
    import QueueEntryHeaderSoundCloud from "./QueueEntryHeaderSoundCloud.svelte";
    import QueueEntryHeaderYouTube from "./QueueEntryHeaderYouTube.svelte";

    const dispatch = createEventDispatcher();

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;
    export let index: number;
    export let showPosition: boolean;
</script>

{#if showPosition}
    <div class="w-10 flex-shrink-0 flex flex-col gap-2 place-content-center items-center text-xl">
        <div class={index + 1 > 999 ? "text-lg" : index + 1 > 99 ? "text-xl" : "text-2xl"} title="Position in queue">
            {index + 1}
        </div>
        <button
            type="button"
            title="See in the complete queue"
            on:click|stopPropagation={() => dispatch("jumpTo")}
            class="text-gray-500 hover:text-purple-500 ease-linear transition-all"
        >
            <i class="fas fa-location-arrow " />
        </button>
    </div>
{/if}
{#if entry.hasYoutubeVideoData()}
    <QueueEntryHeaderYouTube {entry} {isPlaying} {mode} />
{:else if entry.hasSoundcloudTrackData()}
    <QueueEntryHeaderSoundCloud {entry} {isPlaying} {mode} />
{:else if entry.hasDocumentData()}
    <QueueEntryHeaderDocument {entry} {isPlaying} {mode} />
{:else if entry.hasConcealedData()}
    <QueueEntryHeaderConcealed {entry} {isPlaying} {mode} />
{:else}
    <p style="height: 90px">Unknown queue entry type</p>
{/if}
