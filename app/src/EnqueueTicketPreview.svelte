<script lang="ts">
    import type { EnqueueMediaTicket } from "./proto/jungletv_pb";
    import { formatQueueEntryThumbnailDuration } from "./utils";

    export let ticket: EnqueueMediaTicket;
</script>

<div class="px-2 py-1 flex flex-row space-x-1 shadow-sm rounded-md border border-gray-300">
    <div class="w-32 flex-shrink-0">
        <img
            alt="{ticket.getYoutubeVideoData().getTitle()} thumbnail"
            src={ticket.getYoutubeVideoData().getThumbnailUrl()}
        />
        <div class="thumbnail-length-overlay text-white relative pr-2">
            <div
                class="absolute bottom-0.5 right-2.5 bg-black bg-opacity-80 px-1 py-0.5 font-bold rounded-sm"
                style="font-size: 0.7rem; line-height: 0.8rem;"
            >
                {formatQueueEntryThumbnailDuration(ticket.getMediaLength())}
            </div>
            {#if ticket.getYoutubeVideoData().getLiveBroadcast()}
                <div
                    style="font-size: 0.7rem; line-height: 0.8rem;"
                    class="absolute bottom-0.5 left-0.5 bg-black border border-red-500 text-red-500 bg-opacity-80 px-1 py-0.5 font-bold rounded-sm"
                >
                    LIVE
                </div>
            {/if}
        </div>
    </div>
    <div class="flex flex-col flex-grow">
        <p>{ticket.getYoutubeVideoData().getTitle()}</p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {ticket.getYoutubeVideoData().getChannelTitle()}
        </p>
    </div>
</div>
