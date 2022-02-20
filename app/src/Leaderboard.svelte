<script lang="ts">
    import PaginatedTable from "./PaginatedTable.svelte";
    import type { Leaderboard, LeaderboardRow, PaginationParameters } from "./proto/jungletv_pb";
    import LeaderboardTableItem from "./tableitems/LeaderboardTableItem.svelte";

    export let leaderboard: Leaderboard;

    function shouldShowSeparator(rows: LeaderboardRow[], curIdx: number): boolean {
        if (curIdx == 0) {
            return false;
        }
        return rows[curIdx].getRowNum() > rows[curIdx - 1].getRowNum() + 1;
    }

    async function dataPromiseFactory(pagParams: PaginationParameters): Promise<[LeaderboardRow[], number]> {
        let r = leaderboard.getRowsList();
        return [r, r.length];
    }
</script>

<div class="mt-2 mb-10">
    <PaginatedTable
        title={leaderboard.getTitle()}
        column_count={2 + leaderboard.getValueTitlesList().length}
        error_message={"Error loading leaderboard"}
        no_items_message={"Nobody participated in this period."}
        data_promise_factory={dataPromiseFactory}
        per_page={Number.MAX_VALUE}
    >
        <tr
            slot="thead"
            class="border border-solid border-l-0 border-r-0
    bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
    text-xs uppercase whitespace-nowrap text-left"
        >
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold text-right">Place</th>
            <th class="px-2 sm:px-6 align-middle py-3 font-semibold">User</th>
            {#each leaderboard.getValueTitlesList() as title}
                <th class="px-2 sm:px-6 align-middle py-3 font-semibold">{title}</th>
            {/each}
        </tr>

        <tbody slot="item" let:item let:rowIndex class="hover:bg-gray-200 dark:hover:bg-gray-700">
            {#if shouldShowSeparator(leaderboard.getRowsList(), rowIndex)}
                <tr class="border-t border-gray-200 dark:border-gray-600" />
            {/if}
            <LeaderboardTableItem row={item} />
        </tbody>
    </PaginatedTable>
</div>
