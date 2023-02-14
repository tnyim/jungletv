<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import Leaderboard from "./Leaderboard.svelte";
    import PaginatedTable from "./uielements/PaginatedTable.svelte";
    import type { PaginationParameters } from "./proto/common_pb";
    import {
        Leaderboard as LeaderboardPB,
        LeaderboardPeriod,
        LeaderboardPeriodMap,
        RaffleDrawing,
    } from "./proto/jungletv_pb";
    import TabButton from "./uielements/TabButton.svelte";
    import RaffleDrawingTableItem from "./tableitems/RaffleDrawingTableItem.svelte";
    const registerFocus = useFocus();

    type TabSelection = LeaderboardPeriodMap[keyof LeaderboardPeriodMap] | "raffle-drawings";
    let selectedPeriod: TabSelection = LeaderboardPeriod.LAST_7_DAYS;
    let loaded = false;
    let leaderboards: LeaderboardPB[];

    $: {
        if (selectedPeriod === "raffle-drawings") {
            loaded = true;
        } else {
            loadLeaderboards(selectedPeriod);
        }
    }

    async function loadLeaderboards(period: LeaderboardPeriodMap[keyof LeaderboardPeriodMap]) {
        loaded = false;
        let response = await apiClient.leaderboards(period);
        leaderboards = response.getLeaderboardsList();
        loaded = true;
    }

    let curRaffleDrawingsPage = 0;

    async function getRaffleDrawingsPage(pagParams: PaginationParameters): Promise<[RaffleDrawing[], number]> {
        let resp = await apiClient.raffleDrawings(pagParams);
        return [resp.getRaffleDrawingsList(), resp.getTotal()];
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-md p-2">
    <span use:registerFocus class="hidden" />
    <h1 class="text-2xl">Leaderboards</h1>
    <div class="flex flex-row flex-wrap">
        <TabButton
            selected={selectedPeriod == LeaderboardPeriod.LAST_24_HOURS}
            on:click={() => (selectedPeriod = LeaderboardPeriod.LAST_24_HOURS)}
        >
            Last 24 hours
        </TabButton>
        <TabButton
            selected={selectedPeriod == LeaderboardPeriod.LAST_7_DAYS}
            on:click={() => (selectedPeriod = LeaderboardPeriod.LAST_7_DAYS)}
        >
            Last 7 days
        </TabButton>
        <TabButton
            selected={selectedPeriod == LeaderboardPeriod.LAST_30_DAYS}
            on:click={() => (selectedPeriod = LeaderboardPeriod.LAST_30_DAYS)}
        >
            Last 30 days
        </TabButton>
        <TabButton
            selected={selectedPeriod == "raffle-drawings"}
            on:click={() => (selectedPeriod = "raffle-drawings")}
        >
            Weekly 2000 BAN Raffle
        </TabButton>
    </div>
    {#if !loaded}
        <p>Loading...</p>
    {:else if selectedPeriod === "raffle-drawings"}
        <div class="mt-2">
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
        </div>
    {:else}
        {#each leaderboards as leaderboard}
            <Leaderboard {leaderboard} />
        {/each}
    {/if}
</div>
