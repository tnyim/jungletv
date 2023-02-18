<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import type { AddDisallowedMediaCollectionResponse, AddDisallowedMediaResponse } from "../proto/jungletv_pb";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import ErrorMessage from "../uielements/ErrorMessage.svelte";
    import SuccessMessage from "../uielements/SuccessMessage.svelte";
    import { hrefButtonStyleClasses, parseURLForMediaSelection } from "../utils";
    import DisallowedMediaCollectionsTable from "./DisallowedMediaCollectionsTable.svelte";
    import DisallowedMediaEntryTable from "./DisallowedMediaEntryTable.svelte";

    let entriesTable: DisallowedMediaEntryTable;
    let collectionsTable: DisallowedMediaCollectionsTable;

    let disallowMediaURL = "";

    let operationSuccessful = false;
    let operationError = "";
    let lastOperationItemType: "Media" | "Collection" = "Media";

    async function disallowMedia() {
        operationSuccessful = false;
        operationError = "";
        lastOperationItemType = "Media";

        let result = parseURLForMediaSelection(disallowMediaURL);
        if (!result.valid) {
            operationSuccessful = false;
            operationError = "Failed to parse media URL";
            return;
        }

        let reqPromise: Promise<AddDisallowedMediaResponse>;

        if (result.type == "yt_video") {
            reqPromise = apiClient.addDisallowedYouTubeVideo(result.videoID);
        } else if (result.type == "sc_track") {
            reqPromise = apiClient.addDisallowedSoundCloudTrack(result.trackURL);
        }
        try {
            await reqPromise;
            disallowMediaURL = "";
            operationSuccessful = true;
            entriesTable.refresh();
        } catch (e) {
            operationError = e;
            operationSuccessful = false;
        }
    }

    async function disallowMediaCollection() {
        operationSuccessful = false;
        operationError = "";
        lastOperationItemType = "Collection";

        let result = parseURLForMediaSelection(disallowMediaURL);
        if (!result.valid) {
            operationSuccessful = false;
            operationError = "Failed to parse media URL";
            return;
        }

        let reqPromise: Promise<AddDisallowedMediaCollectionResponse>;

        if (result.type == "yt_video") {
            reqPromise = apiClient.addDisallowedYouTubeChannel(result.videoID);
        } else if (result.type == "sc_track") {
            reqPromise = apiClient.addDisallowedSoundCloudUser(result.trackURL);
        }
        try {
            await reqPromise;
            disallowMediaURL = "";
            operationSuccessful = true;
            collectionsTable.refresh();
        } catch (e) {
            operationError = e;
            operationSuccessful = false;
        }
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-lg p-2">
    <p class="mb-6">
        <a use:link href="/moderate" class={hrefButtonStyleClasses()}>Back to moderation dashboard</a>
    </p>
    <p class="mt-6">Note: always enter a specific video or track URL even when disallowing a channel or user</p>
    <div class="px-2 grid grid-rows-1 grid-cols-5 gap-6 mb-6">
        <input
            class="col-span-3 dark:text-black"
            type="text"
            placeholder="URL of YouTube video or SoundCloud track to disallow"
            bind:value={disallowMediaURL}
        />
        <ButtonButton color="red" type="submit" on:click={disallowMedia} extraClasses="col-span-1">
            Disallow media
        </ButtonButton>
        <ButtonButton color="red" type="submit" on:click={disallowMediaCollection} extraClasses="col-span-1">
            Disallow channel/user
        </ButtonButton>

        <div class="col-span-2 mt-3">
            {#if operationSuccessful}
                <SuccessMessage>{lastOperationItemType} disallowed successfully</SuccessMessage>
            {:else if operationError != ""}
                <ErrorMessage>{operationError}</ErrorMessage>
            {/if}
        </div>
    </div>

    <DisallowedMediaEntryTable bind:this={entriesTable} />
    <div class="h-6" />
    <DisallowedMediaCollectionsTable bind:this={collectionsTable} />
</div>
