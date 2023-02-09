<script lang="ts">
    import type { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
    import { DateTime } from "luxon";
    import { createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";

    import { apiClient } from "./api_client";
    import { modalAlert } from "./modal/modal";

    const dispatch = createEventDispatcher();

    export let userAddress: string;

    async function resetSpectatorStatus() {
        try {
            await apiClient.resetSpectatorStatus(userAddress);
            await modalAlert("Spectator status reset successfully");
        } catch (e) {
            await modalAlert("An error occurred: " + e);
        }
    }

    async function clearProfile() {
        try {
            await apiClient.clearUserProfile(userAddress);
            await modalAlert("User profile cleared successfully");
            dispatch("cleared");
        } catch (e) {
            await modalAlert("An error occurred: " + e);
        }
    }

    function formatTimestamp(ts: Timestamp): string {
        return DateTime.fromJSDate(ts.toDate()).toLocal().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
    }

    function chatHistory() {
        navigate("/moderate/users/" + userAddress + "/chathistory");
    }
</script>

<div class="text-sm">
    <p class="mb-4">
        <a
            href={"#"}
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            on:click={chatHistory}
        >
            Chat history
        </a>
    </p>

    {#await apiClient.spectatorInfo(userAddress)}
        <p>Loading spectator information...</p>
    {:then spectator}
        <p>Number of connections: {spectator.getNumConnections()}</p>
        <p>
            Number of spectators with same IP address: {spectator.getNumSpectatorsWithSameRemoteAddress()}
        </p>
        <p>Watching since: {formatTimestamp(spectator.getWatchingSince())}</p>
        <p>Using VPN: {spectator.getRemoteAddressHasGoodReputation() ? "no" : "yes"}</p>
        <p>VPN allowed: {spectator.getIpAddressReputationChecksSkipped() ? "yes" : "no"}</p>
        <p>IP banned from rewards: {spectator.getRemoteAddressBannedFromRewards() ? "yes" : "no"}</p>
        {#if spectator.getLegitimate()}
            <p>Failed captcha: no</p>
        {:else}
            <p>Failed captcha: yes, at {formatTimestamp(spectator.getNotLegitimateSince())}</p>
        {/if}
        <p>Reduced captcha frequency: {spectator.getHardChallengeFrequencyReduced() ? "yes" : "no"}</p>
        {#if spectator.hasStoppedWatchingAt()}
            <p>Stopped watching at: {formatTimestamp(spectator.getStoppedWatchingAt())}</p>
        {/if}
        {#if spectator.hasActivityChallenge()}
            <p>
                Has pending activity challenge since:
                {formatTimestamp(spectator.getActivityChallenge().getChallengedAt())}
            </p>
        {/if}
        <p>Client integrity checks skipped: {spectator.getClientIntegrityChecksSkipped() ? "yes" : "no"}</p>
        <p class="mt-6 mb-4">
            <a
                href={"#"}
                class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={resetSpectatorStatus}
            >
                Reset spectator status
            </a>
        </p>
    {:catch}
        <p>This address is not currently registered as a spectator.</p>
    {/await}
    <p class="mt-6 mb-4">
        <a
            href={"#"}
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            on:click={clearProfile}
        >
            Clear user profile
        </a>
    </p>
</div>
