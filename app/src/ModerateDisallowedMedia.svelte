<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import ErrorMessage from "./ErrorMessage.svelte";
    import PaginatedTable from "./PaginatedTable.svelte";
    import type { DisallowedVideo, PaginationParameters } from "./proto/jungletv_pb";
    import SuccessMessage from "./SuccessMessage.svelte";
    import DisallowedVideoTableItem from "./tableitems/DisallowedVideoTableItem.svelte";

    export let searchQuery = "";
    let prevSearchQuery = "";

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[DisallowedVideo[], number]> {
        let resp = await apiClient.disallowedVideos(searchQuery, pagParams);
        return [resp.getDisallowedVideosList(), resp.getTotal()];
    }

    $: {
        if (searchQuery != prevSearchQuery) {
            cur_page = 0;
            prevSearchQuery = searchQuery;
        }
    }

    let disallowVideoID = "";
    let disallowVideoSuccessful = false;
    let disallowVideoError = "";
    async function disallowVideo() {
        try {
            await apiClient.addDisallowedVideo(disallowVideoID);
            disallowVideoID = "";
            disallowVideoSuccessful = true;
            cur_page = -1;
        } catch (e) {
            disallowVideoError = e;
            disallowVideoSuccessful = false;
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
            placeholder="YouTube video ID to disallow"
            bind:value={disallowVideoID}
        />
        <button
            type="submit"
            class="col-span-1 inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            on:click={disallowVideo}
        >
            Disallow video
        </button>
        <div class="col-span-2">
            {#if disallowVideoSuccessful}
                <SuccessMessage>Video disallowed successfully</SuccessMessage>
            {:else if disallowVideoError != ""}
                <ErrorMessage>{disallowVideoError}</ErrorMessage>
            {/if}
        </div>
    </div>

    <PaginatedTable
        title={"Disallowed videos"}
        column_count={5}
        error_message={"Error loading disallowed videos"}
        no_items_message={"No disallowed videos"}
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
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Video ID </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Video Title </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Disallowed by </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Disallowed at </th>
            <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
        </tr>

        <tbody slot="item" let:item let:updateDataCallback class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <DisallowedVideoTableItem video={item} {updateDataCallback} />
        </tbody>
    </PaginatedTable>
</div>
