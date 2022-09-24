<script lang="ts">
    import type { EnqueueMediaTicket } from "./proto/jungletv_pb";
    import { formatQueueEntryThumbnailDuration } from "./utils";

    export let ticket: EnqueueMediaTicket;
</script>

<div class="flex-shrink-0 relative" style="width: 120px; height: 90px">
    <img
        alt="{ticket.getYoutubeVideoData().getTitle()} thumbnail"
        src={ticket.getYoutubeVideoData().getThumbnailUrl()}
        style="width: 120px; height: 90px"
    />
    {#if ticket.getConcealed()}
        <div class="thumbnail-concealed-overlay text-yellow-400 flex flex-col place-content-center">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="far fa-eye-slash text-5xl" />
            </div>
        </div>
    {/if}
    <div class="thumbnail-length-overlay text-white pr-2">
        <div
            class="absolute bottom-0.5 right-0.5 bg-black bg-opacity-80 px-1 py-0.5 font-bold rounded-sm"
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
<div class="flex flex-col flex-grow overflow-hidden">
    <p class="break-words">{ticket.getYoutubeVideoData().getTitle()}</p>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 break-words">
        {ticket.getYoutubeVideoData().getChannelTitle()}
    </p>
</div>
