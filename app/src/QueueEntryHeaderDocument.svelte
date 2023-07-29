<script lang="ts">
    import type { QueueEntry } from "./proto/jungletv_pb";
    import QueueEntryEnqueuedBy from "./QueueEntryEnqueuedBy.svelte";
    import { formatQueueEntryThumbnailDuration } from "./utils";

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<div class="shrink-0 thumbnail mr-2" style="width: 120px">
    <div style="width: 120px; height: 90px; font-size: 65px;" class="flex flex-col justify-center text-center">
        <i class="fas fa-file-alt" />
    </div>
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
        {entry.getDocumentData().getTitle()}
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold">JungleTV Document</span>
    </p>
    <QueueEntryEnqueuedBy {entry} {mode} on:remove on:disallow />
</div>

<style lang="postcss" src="./styles/QueueEntryHeader.postcss"></style>
