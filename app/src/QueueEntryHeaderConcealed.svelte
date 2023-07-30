<script lang="ts">
    import QueueEntryHeaderLayout from "./QueueEntryHeaderLayout.svelte";
    import { type PartialQueueEntryForHeader } from "./utils";

    export let entry: PartialQueueEntryForHeader;
    export let isPlaying: boolean;
    export let mode: string;

    $: randomBase = ((e: PartialQueueEntryForHeader): number => {
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

<QueueEntryHeaderLayout {entry} {isPlaying} {mode} hideConcealedIcon={true}>
    <div slot="thumbnail" class="thumbnail" style="background-position: {thumbnailPosX}px {thumbnailPosY}px" />
    <svelte:fragment slot="title">
        <span class="bg-black dark:bg-white">{"█".repeat(5 + randomUpTo(randomBase, 17))}</span>
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold bg-gray-600 dark:bg-gray-300">
            {"█".repeat(5 + randomUpTo(randomBase, 15))}
        </span>
    </svelte:fragment>
</QueueEntryHeaderLayout>

<style lang="postcss">
    .thumbnail {
        width: 120px;
        height: 90px;
        background-image: url("/assets/concealed.webp");
        background-repeat: no-repeat;
        background-attachment: scroll;
    }
</style>
