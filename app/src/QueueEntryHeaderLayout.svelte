<script lang="ts">
    import { Duration } from "google-protobuf/google/protobuf/duration_pb";
    import QueueEntryEnqueuedBy from "./QueueEntryEnqueuedBy.svelte";
    import { playerCurrentTime } from "./stores";
    import { formatQueueEntryThumbnailDuration, type PartialQueueEntryForHeader } from "./utils";

    export let isPlaying: boolean;
    export let mode: string;
    export let entry: PartialQueueEntryForHeader;
    export let isLive = false;
    export let hideConcealedIcon = false;
</script>

<div class="shrink-0 relative mr-2" style="width: 120px;">
    <slot name="thumbnail" />
    {#if isPlaying}
        <div class="thumbnail-now-playing-overlay">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="fas fa-play text-5xl" />
            </div>
        </div>
    {/if}
    {#if entry.getConcealed() && !hideConcealedIcon}
        <div class="thumbnail-concealed-overlay">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="far fa-eye-slash text-5xl" />
            </div>
        </div>
    {/if}
    <div class="thumbnail-length-overlay text-white">
        <div class="thumbnail-length right-0.5">
            {formatQueueEntryThumbnailDuration(
                !isPlaying || !isLive
                    ? entry.getLength()
                    : (() => {
                          let d = new Duration();
                          d.setSeconds(Math.max(entry.getLength().getSeconds() - $playerCurrentTime, 0));
                          return d;
                      })(),
                entry.getOffset()
            )}
        </div>
        {#if isLive}
            <div class="thumbnail-length left-0.5 border border-red-500 text-red-500">LIVE</div>
        {/if}
    </div>
</div>
<div class="flex flex-col grow overflow-hidden">
    <p class="queue-entry-title break-words text-black dark:text-white">
        <slot name="title" />
    </p>
    {#if "getRequestedBy" in entry}
        <QueueEntryEnqueuedBy {entry} {mode} on:remove on:disallow />
    {/if}
</div>

<style lang="postcss">
    .thumbnail-now-playing-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        animation: thumbnail-now-playing-pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        @apply text-white flex flex-col place-content-center;
    }
    .thumbnail-concealed-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        text-shadow: 0 0 5px #8b5cf6;
        @apply text-yellow-400 flex flex-col place-content-center;
    }
    .thumbnail-length-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .thumbnail-length {
        @apply absolute bottom-0.5 bg-black/80 px-1 py-0.5 font-bold rounded-sm;
        font-size: 0.7rem;
        line-height: 0.8rem;
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
</style>
