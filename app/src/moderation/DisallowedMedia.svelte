<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import ErrorMessage from "../ErrorMessage.svelte";
    import PaginatedTable from "../PaginatedTable.svelte";
    import type { AddDisallowedMediaResponse, DisallowedMedia, PaginationParameters } from "../proto/jungletv_pb";
    import SuccessMessage from "../SuccessMessage.svelte";
    import DisallowedMediaTableItem from "../tableitems/DisallowedMediaTableItem.svelte";
    import { parseURLForMediaSelection } from "../utils";

    export let searchQuery = "";
    let prevSearchQuery = "";

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[DisallowedMedia[], number]> {
        let resp = await apiClient.disallowedMedia(searchQuery, pagParams);
        return [resp.getDisallowedMediaList(), resp.getTotal()];
    }

    $: {
        if (searchQuery != prevSearchQuery) {
            cur_page = 0;
            prevSearchQuery = searchQuery;
        }
    }

    let disallowMediaURL = "";
    let disallowMediaSuccessful = false;
    let disallowMediaError = "";
    async function disallowMedia() {
        let result = parseURLForMediaSelection(disallowMediaURL);
        if (!result.valid) {
            disallowMediaSuccessful = false;
            disallowMediaError = "Failed to parse media URL";
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
            disallowMediaSuccessful = true;
            cur_page = -1;
        } catch (e) {
            disallowMediaError = e;
            disallowMediaSuccessful = false;
        }
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-lg p-2">
    <p class="mb-6">
        <a
            use:link
            href="/moderate"
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            Back to moderation dashboard
        </a>
    </p>
    <div class="px-2 grid grid-rows-1 grid-cols-3 gap-6 max-w-screen-sm mb-6">
        <input
            class="col-span-2 dark:text-black"
            type="text"
            placeholder="URL of YouTube video or SoundCloud track to disallow"
            bind:value={disallowMediaURL}
        />
        <button
            type="submit"
            class="col-span-1 inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            on:click={disallowMedia}
        >
            Disallow media
        </button>
        <div class="col-span-2 mt-3">
            {#if disallowMediaSuccessful}
                <SuccessMessage>Media disallowed successfully</SuccessMessage>
            {:else if disallowMediaError != ""}
                <ErrorMessage>{disallowMediaError}</ErrorMessage>
            {/if}
        </div>
    </div>

    <PaginatedTable
        title={"Disallowed media"}
        column_count={5}
        error_message={"Error loading disallowed media"}
        no_items_message={"No disallowed media"}
        data_promise_factory={getPage}
        bind:cur_page
        search_query={searchQuery}
    >
        <tr
            slot="thead"
            class="border border-solid border-l-0 border-r-0
        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
        text-xs uppercase whitespace-nowrap text-left"
        >
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Type </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Media ID </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Media Title </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Disallowed by </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Disallowed at </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
        </tr>

        <tbody slot="item" let:item let:updateDataCallback class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <DisallowedMediaTableItem media={item} {updateDataCallback} />
        </tbody>
    </PaginatedTable>
</div>
