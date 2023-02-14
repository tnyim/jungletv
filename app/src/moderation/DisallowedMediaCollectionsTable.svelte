<script lang="ts">
    import { apiClient } from "../api_client";
    import type { PaginationParameters } from "../proto/common_pb";
    import type { DisallowedMediaCollection } from "../proto/jungletv_pb";
    import DisallowedMediaCollectionTableItem from "../tableitems/DisallowedMediaCollectionTableItem.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";

    export let searchQuery = "";
    let prevSearchQuery = "";

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[DisallowedMediaCollection[], number]> {
        let resp = await apiClient.disallowedMediaCollections(searchQuery, pagParams);
        return [resp.getDisallowedMediaCollectionsList(), resp.getTotal()];
    }

    export function refresh() {
        cur_page = -1;
    }

    $: {
        if (searchQuery != prevSearchQuery) {
            cur_page = 0;
            prevSearchQuery = searchQuery;
        }
    }
</script>

<PaginatedTable
    title={"Disallowed media collections"}
    column_count={5}
    error_message={"Error loading disallowed media collections"}
    no_items_message={"No disallowed media collections"}
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
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Type </th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Collection ID </th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Collection Title </th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Disallowed by </th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold"> Disallowed at </th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
    </tr>

    <tbody slot="item" let:item let:updateDataCallback class="hover:bg-gray-200 dark:hover:bg-gray-700">
        <DisallowedMediaCollectionTableItem collection={item} {updateDataCallback} />
    </tbody>
</PaginatedTable>
