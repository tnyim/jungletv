<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import Leaderboard from "./Leaderboard.svelte";
    import { apiClient } from "./api_client";
    import { LeaderboardPeriod, Leaderboard as LeaderboardPB, LeaderboardPeriodMap } from "./proto/jungletv_pb";
    import SidebarTabButton from "./SidebarTabButton.svelte";
    const registerFocus = useFocus();

    let selectedPeriod: LeaderboardPeriodMap[keyof LeaderboardPeriodMap] = LeaderboardPeriod.LAST_7_DAYS;
    let loaded = false;
    let leaderboards: LeaderboardPB[];

    $: {
        loadLeaderboards(selectedPeriod);
    }

    async function loadLeaderboards(period: LeaderboardPeriodMap[keyof LeaderboardPeriodMap]) {
        loaded = false;
        let response = await apiClient.leaderboards(period);
        leaderboards = response.getLeaderboardsList();
        loaded = true;
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-md p-2">
    <span use:registerFocus class="hidden" />
    <h1 class="text-2xl">Leaderboards</h1>
    <div class="flex flex-row">
        <SidebarTabButton
            selected={selectedPeriod == LeaderboardPeriod.LAST_24_HOURS}
            on:click={() => (selectedPeriod = LeaderboardPeriod.LAST_24_HOURS)}
        >
            Last 24 hours
        </SidebarTabButton>
        <SidebarTabButton
            selected={selectedPeriod == LeaderboardPeriod.LAST_7_DAYS}
            on:click={() => (selectedPeriod = LeaderboardPeriod.LAST_7_DAYS)}
        >
            Last 7 days
        </SidebarTabButton>
        <SidebarTabButton
            selected={selectedPeriod == LeaderboardPeriod.LAST_30_DAYS}
            on:click={() => (selectedPeriod = LeaderboardPeriod.LAST_30_DAYS)}
        >
            Last 30 days
        </SidebarTabButton>
    </div>
    {#if !loaded}
        <p>Loading...</p>
    {:else}
        {#each leaderboards as leaderboard}
            <Leaderboard {leaderboard} />
        {/each}
    {/if}
</div>
