<script lang="ts">
    import { apiClient } from "./api_client";
    import WarningMessage from "./uielements/WarningMessage.svelte";
    import UserStatsForPeriod from "./UserStatsForPeriod.svelte";

    export let userAddress: string;
    export let userIsStaff: boolean;
</script>

{#await apiClient.userStats(userAddress)}
    Loading...
{:then userStats}
    {#if userIsStaff}
        <WarningMessage>
            This is a JungleTV team member and spending totals may include third-party sponsorships for event hosting.
        </WarningMessage>
    {/if}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
            <h2 class="text-xl">Last 7 days</h2>
            <UserStatsForPeriod stats={userStats.getStats7Days()} />
        </div>
        <div>
            <h2 class="text-xl">Last 30 days</h2>
            <UserStatsForPeriod stats={userStats.getStats30Days()} />
        </div>
        <div>
            <h2 class="text-xl">All time</h2>
            <UserStatsForPeriod stats={userStats.getStatsAllTime()} />
        </div>
    </div>
{/await}
