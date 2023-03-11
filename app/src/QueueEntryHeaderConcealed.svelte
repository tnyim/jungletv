<script lang="ts">
    import type { QueueEntry } from "./proto/jungletv_pb";
    import QueueEntryEnqueuedBy from "./QueueEntryEnqueuedBy.svelte";
    import { formatQueueEntryThumbnailDuration } from "./utils";

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;

    $: randomBase = ((e: QueueEntry): number => {
        let s = 0;
        for (let i = 0; i < e.getId().length; i++) {
            s += e.getId().charCodeAt(i);
        }
        return s;
    })(entry);

    function randomUpTo(randomBase: number, max: number) {
        return randomBase % max;
    }
    $: thumbnailPosX = -randomUpTo(randomBase, 512 - 120);
    $: thumbnailPosY = -randomUpTo(randomBase, 512 - 90);
</script>

<div class="flex-shrink-0 thumbnail mr-2" style="width: 120px">
    <div class="thumbnail-concealed-queue-entry" style="background-position: {thumbnailPosX}px {thumbnailPosY}px" />
    {#if isPlaying}
        <div class="thumbnail-now-playing-overlay text-white flex flex-col place-content-center">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="fas fa-play text-5xl" />
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
        <span class="bg-black dark:bg-white">{"█".repeat(5 + randomUpTo(randomBase, 17))}</span>
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold bg-gray-600 dark:bg-gray-300">
            {"█".repeat(5 + randomUpTo(randomBase, 15))}
        </span>
    </p>
    <QueueEntryEnqueuedBy {entry} {mode} on:remove on:disallow />
</div>

<style lang="postcss" src="./styles/QueueEntryHeader.postcss"></style>
