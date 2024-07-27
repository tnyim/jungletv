<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import Leaderboard from "./Leaderboard.svelte";
    import { Leaderboard as LeaderboardPB, LeaderboardPeriod, type LeaderboardPeriodMap } from "./proto/jungletv_pb";
    import RafflesTable from "./RafflesTable.svelte";
    import TabButton from "./uielements/TabButton.svelte";
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
</script>

<div class="m-6 grow container mx-auto max-w-screen-md p-2">
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
        <TabButton selected={selectedPeriod == "raffle-drawings"} on:click={() => (selectedPeriod = "raffle-drawings")}>
            Weekly 2000 BAN Raffle
        </TabButton>
    </div>
    {#if !loaded}
        <p>Loading...</p>
    {:else if selectedPeriod === "raffle-drawings"}
        <div class="mt-2">
            <RafflesTable />
        </div>
    {:else}
        {#each leaderboards as leaderboard}
            <Leaderboard {leaderboard} />
        {/each}
    {/if}
</div>
