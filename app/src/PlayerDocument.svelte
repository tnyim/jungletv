<script lang="ts">
    import Document from "./Document.svelte";
    import type { MediaConsumptionCheckpoint, Document as DocumentPB } from "./proto/jungletv_pb";

    let documentID = "";
    let updatedAt = new Date(0);
    let overrideDocument: DocumentPB;
    let forceUpdateCount = 0;
    let handledFirstCheckpoint = false;

    export let checkpoint: MediaConsumptionCheckpoint;

    async function handleCheckpoint(checkpoint: MediaConsumptionCheckpoint) {
        let newDocumentID = checkpoint.getDocumentData().getId();
        let isNewDocument = documentID != newDocumentID;
        if (isNewDocument) {
            documentID = newDocumentID;
            updatedAt = checkpoint.getDocumentData().getUpdatedAt().toDate();
        }
        if (isNewDocument || checkpoint.getDocumentData().getUpdatedAt().toDate().getTime() > updatedAt.getTime()) {
            if (checkpoint.getDocumentData().hasDocument()) {
                overrideDocument = checkpoint.getDocumentData().getDocument();
                updatedAt = checkpoint.getDocumentData().getDocument().getUpdatedAt().toDate();
            } else {
                // updatedAt moved past what we had, and we didn't receive an updated document via checkpoints
                // force update
                forceUpdateCount++;
            }
        }
        handledFirstCheckpoint = true;
    }

    $: {
        if (checkpoint.getMediaPresent() && checkpoint.hasDocumentData()) {
            handleCheckpoint(checkpoint);
        }
    }
</script>

<div
    class="h-full w-full max-h-full max-w-full overflow-auto bg-gray-100 dark:bg-gray-900 text-black dark:text-gray-300"
>
    {#if handledFirstCheckpoint}
        {#key forceUpdateCount}
            <Document mode="player" {documentID} {overrideDocument} />
        {/key}
    {/if}
</div>
