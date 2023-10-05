<script lang="ts">
    import ApplicationPage from "./ApplicationPage.svelte";
    import type { ResolveApplicationPageResponse } from "./proto/application_runtime_pb";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";

    let applicationID = "";
    let pageID = "";
    let preloadedPageInfo: ResolveApplicationPageResponse;
    let forceUpdateCount = 0;

    export let checkpoint: MediaConsumptionCheckpoint;

    async function handleCheckpoint(checkpoint: MediaConsumptionCheckpoint) {
        let newApplicationID = checkpoint.getApplicationPageData().getApplicationId();
        let newPageID = checkpoint.getApplicationPageData().getPageId();
        preloadedPageInfo = checkpoint.getApplicationPageData().getPageInfo();

        if (newApplicationID != applicationID || newPageID != pageID) {
            pageID = newPageID;
            applicationID = newApplicationID;
            forceUpdateCount++;
        }
    }

    $: {
        if (checkpoint.getMediaPresent() && checkpoint.getApplicationPageData()) {
            handleCheckpoint(checkpoint);
        }
    }
</script>

<div class="h-full w-full max-h-full max-w-full overflow-auto">
    {#key forceUpdateCount}
        <ApplicationPage {applicationID} {pageID} {preloadedPageInfo} />
    {/key}
</div>
