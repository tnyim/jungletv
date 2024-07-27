<script lang="ts">
    import { apiClient } from "./api_client";
    import type { PaginationParameters } from "./proto/common_pb";
    import { RaffleDrawing } from "./proto/jungletv_pb";
    import RaffleDrawingTableItem from "./tableitems/RaffleDrawingTableItem.svelte";
    import PaginatedTable from "./uielements/PaginatedTable.svelte";

    let curRaffleDrawingsPage = 0;

    async function getRaffleDrawingsPage(pagParams: PaginationParameters): Promise<[RaffleDrawing[], number]> {
        let resp = await apiClient.raffleDrawings(pagParams);
        return [resp.getRaffleDrawingsList(), resp.getTotal()];
    }
</script>

<PaginatedTable
    title={"Weekly raffle drawings"}
    column_count={4}
    error_message={"Error loading raffle drawings"}
    no_items_message={"No raffle drawings"}
    data_promise_factory={getRaffleDrawingsPage}
    per_page={10}
    bind:cur_page={curRaffleDrawingsPage}
>
    <tr
        slot="thead"
        class="border border-solid border-l-0 border-r-0
                    bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
                        text-xs uppercase whitespace-nowrap text-left"
    >
        <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Period</th>
        <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Status</th>
        <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Winner</th>
        <th class="px-2 sm:px-6 align-middle py-3 font-semibold">Payment</th>
    </tr>

    <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
        <RaffleDrawingTableItem drawing={item} />
    </tbody>
</PaginatedTable>
