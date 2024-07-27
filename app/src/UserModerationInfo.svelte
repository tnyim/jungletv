<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";

    import { apiClient } from "./api_client";
    import { closeModal, modalAlert, modalConfirm, modalPrompt } from "./modal/modal";
    import { openUserProfile } from "./profile_utils";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import PointsIcon from "./uielements/PointsIcon.svelte";
    import { formatDateForModeration } from "./utils";

    const dispatch = createEventDispatcher();

    export let userAddress: string;

    async function resetSpectatorStatus() {
        const hadModal = await closeModal();
        try {
            await apiClient.resetSpectatorStatus(userAddress);
            await modalAlert("Spectator status reset successfully");
            if (hadModal) {
                openUserProfile(userAddress);
            }
        } catch (e) {
            await modalAlert("An error occurred: " + e);
        }
    }

    async function invalidateAuthTokens() {
        const hadModal = await closeModal();
        if (await modalConfirm("Are you sure? This will sign out the user on all devices.")) {
            try {
                await apiClient.invalidateUserAuthTokens(userAddress);
                await modalAlert("Auth tokens invalidated successfully");
            } catch (e) {
                await modalAlert("An error occurred: " + e);
            }
        }
        if (hadModal) {
            openUserProfile(userAddress);
        }
    }

    async function clearProfile() {
        const hadModal = await closeModal();
        try {
            await apiClient.clearUserProfile(userAddress);
            await modalAlert("User profile cleared successfully");
            dispatch("cleared");
        } catch (e) {
            await modalAlert("An error occurred: " + e);
        }
        if (hadModal) {
            openUserProfile(userAddress);
        }
    }

    function chatHistory() {
        navigate("/moderate/users/" + userAddress + "/chathistory");
    }

    async function adjustPointsBalance() {
        const hadModal = await closeModal();
        await (async () => {
            let valueStr = await modalPrompt(
                "Enter the integer value (positive or negative) for the adjustment, or press cancel:",
                "Adjust points balance",
            );
            if (valueStr === null) {
                return;
            }
            let value = parseInt(valueStr);
            if (isNaN(value)) {
                await modalAlert("Invalid value");
                return;
            }
            let reason = await modalPrompt(
                `Adjusting points balance of ${userAddress} by ${value} points.` +
                    "\n\nEnter a reason, or press cancel:",
                "Adjust points balance",
            );
            if (reason === null) {
                return;
            }
            try {
                await apiClient.adjustPointsBalance(userAddress, value, reason);
                await modalAlert("Balance adjustment successful");
            } catch (e) {
                await modalAlert("An error occurred when adjusting the points balance: " + e);
            }
        })();
        if (hadModal) {
            openUserProfile(userAddress);
        }
    }
</script>

<div class="text-sm">
    <p class="mb-4">
        <ButtonButton on:click={chatHistory}>Chat history</ButtonButton>
    </p>

    {#await apiClient.spectatorInfo(userAddress)}
        <p>Loading spectator information...</p>
    {:then spectator}
        <p>Number of connections: {spectator.getNumConnections()}</p>
        <p>
            Number of spectators with same IP address: {spectator.getNumSpectatorsWithSameRemoteAddress()}
        </p>
        <p>Watching since: {formatDateForModeration(spectator.getWatchingSince().toDate())}</p>
        <p>Using VPN: {spectator.getRemoteAddressHasGoodReputation() ? "no" : "yes"}</p>
        <p>VPN allowed: {spectator.getIpAddressReputationChecksSkipped() ? "yes" : "no"}</p>
        <p>IP banned from rewards: {spectator.getRemoteAddressBannedFromRewards() ? "yes" : "no"}</p>
        {#if spectator.getLegitimate()}
            <p>Failed captcha: no</p>
        {:else}
            <p>Failed captcha: yes, at {formatDateForModeration(spectator.getNotLegitimateSince().toDate())}</p>
        {/if}
        <p>Reduced captcha frequency: {spectator.getHardChallengeFrequencyReduced() ? "yes" : "no"}</p>
        {#if spectator.hasStoppedWatchingAt()}
            <p>Stopped watching at: {formatDateForModeration(spectator.getStoppedWatchingAt().toDate())}</p>
        {/if}
        {#if spectator.hasActivityChallenge()}
            <p>
                Has pending activity challenge since:
                {formatDateForModeration(spectator.getActivityChallenge().getChallengedAt().toDate())}
            </p>
        {/if}
        <p>Client integrity checks skipped: {spectator.getClientIntegrityChecksSkipped() ? "yes" : "no"}</p>
        <p class="mt-6 mb-4">
            <ButtonButton on:click={resetSpectatorStatus}>Reset spectator status</ButtonButton>
        </p>
    {:catch}
        <p>This address is not currently registered as a spectator.</p>
    {/await}
    <p class="mt-6 mb-4">
        <ButtonButton on:click={adjustPointsBalance}>
            <span class="inline">Adjust <PointsIcon /> balance</span>
        </ButtonButton>
    </p>
    <p class="mt-6 mb-4">
        <ButtonButton on:click={clearProfile}>Clear user profile</ButtonButton>
    </p>
    <p class="mt-6 mb-4">
        <ButtonButton color="red" on:click={invalidateAuthTokens}>
            Invalidate user auth tokens (sign user out on all devices)
        </ButtonButton>
    </p>
</div>
