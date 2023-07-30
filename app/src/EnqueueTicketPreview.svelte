<script lang="ts">
    import QueueEntryHeader from "./QueueEntryHeader.svelte";
    import type { EnqueueMediaTicket } from "./proto/jungletv_pb";

    export let ticket: EnqueueMediaTicket;
</script>

<div class="px-2 py-1 flex flex-row space-x-2 shadow-sm rounded-md border border-gray-300 text-sm">
    <QueueEntryHeader entry={ticket} isPlaying={false} mode="sidebar" showPosition={false} index={0} />
</div>
