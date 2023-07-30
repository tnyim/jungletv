<script lang="ts">
    import QueueEntryHeaderLayout from "./QueueEntryHeaderLayout.svelte";
    import { type PartialQueueEntryForHeader } from "./utils";

    export let entry: PartialQueueEntryForHeader;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<QueueEntryHeaderLayout {entry} {isPlaying} {mode}>
    <div class="thumbnail" slot="thumbnail">
        <i class="fas fa-file-alt" />
    </div>
    <svelte:fragment slot="title">
        {entry.getDocumentData().getTitle()}
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold">JungleTV Document</span>
    </svelte:fragment>
</QueueEntryHeaderLayout>

<style lang="postcss">
    .thumbnail {
        @apply flex flex-col justify-center text-center;
        width: 120px;
        height: 90px;
        font-size: 65px;
    }
</style>
