<script lang="ts">
    import { apiClient } from "./api_client";
    import PaginatedTable from "./uielements/PaginatedTable.svelte";
    import type { PaginationParameters } from "./proto/common_pb";
    import type { BlockedUser } from "./proto/jungletv_pb";
    import BlockedUserTableItem from "./tableitems/BlockedUserTableItem.svelte";

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[BlockedUser[], number]> {
        let resp = await apiClient.blockedUsers(pagParams);
        return [resp.getBlockedUsersList(), resp.getTotal()];
    }
</script>

<div class="dark:text-white">
    <PaginatedTable
        title={"Blocked users"}
        column_count={3}
        error_message={"Error loading blocked users"}
        no_items_message={"No blocked users"}
        data_promise_factory={getPage}
        bind:cur_page
    >
        <tr
            slot="thead"
            class="border border-solid border-l-0 border-r-0
        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
        text-xs uppercase whitespace-nowrap text-left"
        >
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">User</th>
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Blocked at</th>
            <th />
        </tr>

        <tbody slot="item" let:item let:updateDataCallback class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <BlockedUserTableItem blockedUser={item} {updateDataCallback} />
        </tbody>
    </PaginatedTable>
</div>
