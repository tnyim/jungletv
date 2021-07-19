<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import Leaderboard from "./Leaderboard.svelte";
    import { apiClient } from "./api_client";
    const registerFocus = useFocus();

    let leaderboardsPromise = apiClient.leaderboards();
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-md p-2">
    <span use:registerFocus class="hidden" />
    <h1 class="text-2xl">Leaderboards</h1>
    {#await leaderboardsPromise}
        <p>Loading...</p>
    {:then leaderboardsResponse}
        {#each leaderboardsResponse.getLeaderboardsList() as leaderboard}
            <Leaderboard {leaderboard} />
        {/each}
    {/await}
</div>
