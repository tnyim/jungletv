<script lang="ts">
    import type { EnqueueMediaTicket } from "./proto/jungletv_pb";
    import { formatQueueEntryThumbnailDuration } from "./utils";

    export let ticket: EnqueueMediaTicket;
</script>

<div class="shrink-0 relative" style="width: 120px; height: 90px">
    <div style="width: 120px; height: 90px; font-size: 65px;" class="flex flex-col justify-center text-center">
        <i class="fas fa-file-alt" />
    </div>
    {#if ticket.getConcealed()}
        <div class="thumbnail-concealed-overlay text-yellow-400 flex flex-col place-content-center">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="far fa-eye-slash text-5xl" />
            </div>
        </div>
    {/if}
    <div class="thumbnail-length-overlay text-white pr-2">
        <div
            class="absolute bottom-0.5 right-0.5 bg-black/80 px-1 py-0.5 font-bold rounded-sm"
            style="font-size: 0.7rem; line-height: 0.8rem;"
        >
            {formatQueueEntryThumbnailDuration(ticket.getMediaLength())}
        </div>
    </div>
</div>
<div class="flex flex-col grow overflow-hidden">
    <p class="break-words">{ticket.getDocumentData().getTitle()}</p>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 break-words">
        {ticket.getDocumentData().getId()}
    </p>
</div>
