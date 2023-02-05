<script lang="ts">
    import { apiClient } from "./api_client";
    import PaginatedTable from "./PaginatedTable.svelte";
    import type { PaginationParameters } from "./proto/common_pb";
    import type { PlayedMedia } from "./proto/jungletv_pb";
    import PlayHistoryTableItem from "./tableitems/PlayHistoryTableItem.svelte";

    export let searchQuery = "";

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[PlayedMedia[], number]> {
        let resp = await apiClient.playedMediaHistory(searchQuery, pagParams);
        return [resp.getPlayedMediaList(), resp.getTotal()];
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-lg sm:p-2">
    <PaginatedTable
        title={"Play history"}
        column_count={6}
        error_message={"Error loading play history"}
        no_items_message={"No play history"}
        data_promise_factory={getPage}
        bind:cur_page
        bind:search_query={searchQuery}
        show_search_box={true}
    >
        <tr
            slot="thead"
            class="border border-solid border-l-0 border-r-0
        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
        text-xs uppercase whitespace-nowrap text-left"
        >
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Start Time</th>
            <th />
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Title</th>
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Length</th>
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Requested By</th>
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Request Cost</th>
        </tr>

        <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <PlayHistoryTableItem media={item} />
        </tbody>
    </PaginatedTable>
</div>
