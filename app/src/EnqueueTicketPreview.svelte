<script lang="ts">
    import EnqueueTicketPreviewDocument from "./EnqueueTicketPreviewDocument.svelte";

    import EnqueueTicketPreviewSoundCloud from "./EnqueueTicketPreviewSoundCloud.svelte";

    import EnqueueTicketPreviewYouTube from "./EnqueueTicketPreviewYouTube.svelte";
    import type { EnqueueMediaTicket } from "./proto/jungletv_pb";

    export let ticket: EnqueueMediaTicket;
</script>

<div class="px-2 py-1 flex flex-row space-x-2 shadow-sm rounded-md border border-gray-300">
    {#if ticket.hasYoutubeVideoData()}
        <EnqueueTicketPreviewYouTube {ticket} />
    {:else if ticket.hasSoundcloudTrackData()}
        <EnqueueTicketPreviewSoundCloud {ticket} />
    {:else if ticket.hasDocumentData()}
        <EnqueueTicketPreviewDocument {ticket} />
    {/if}
</div>
