<script lang="ts">
    import QueueEntryHeaderLayout from "./QueueEntryHeaderLayout.svelte";
    import type { QueueApplicationPageData, QueueEntry } from "./proto/jungletv_pb";

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;

    let pd: QueueApplicationPageData;
    $: {
        if (entry && entry.hasApplicationPageData()) {
            pd = entry.getApplicationPageData();
        }
    }
</script>

<QueueEntryHeaderLayout {entry} {isPlaying} {mode}>
    <svelte:fragment slot="thumbnail">
        {#if pd.getThumbnailFileName() != ""}
            <img
                src={`/assets/app/${pd.getApplicationId()}/${
                    pd.getApplicationVersion().toDate().getTime() + ""
                }/${pd.getThumbnailFileName()}`}
                alt=""
                loading="lazy"
                width="120"
                height="90"
            />
        {:else}
            <div class="thumbnail">
                <i class="fas fa-file-alt" />
            </div>
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="title">
        {pd.getTitle()}
    </svelte:fragment>
</QueueEntryHeaderLayout>

<style lang="postcss">
    .thumbnail {
        @apply flex flex-col justify-center text-center;
        width: 120px;
        height: 90px;
        font-size: 65px;
    }
    img {
        max-width: 120px;
        max-height: 90px;
        object-fit: contain;
    }
</style>
