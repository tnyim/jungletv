<script lang="ts">
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import RafflesTable from "../RafflesTable.svelte";
    import ButtonButton from "../uielements/ButtonButton.svelte";

    async function confirmRaffleWinner() {
        let raffleID = await modalPrompt("Enter the raffle ID, or press cancel:", "Confirm raffle winner");
        if (raffleID === null) {
            return;
        }
        try {
            await apiClient.confirmRaffleWinner(raffleID);
            await modalAlert("Raffle winner confirmed successfully");
        } catch (e) {
            await modalAlert("An error occurred when confirming the raffle winner: " + e);
        }
    }

    async function redrawRaffle() {
        let raffleID = await modalPrompt("Enter the raffle ID, or press cancel:", "Redraw raffle");
        if (raffleID === null) {
            return;
        }
        let reason = await modalPrompt("Enter the reason for redrawing the raffle (this is public):", "Redraw raffle");
        if (reason === null) {
            return;
        }
        try {
            await apiClient.redrawRaffle(raffleID, reason);
            await modalAlert("Raffle redrawn successfully");
        } catch (e) {
            await modalAlert("An error occurred when redrawing the raffle: " + e);
        }
    }

    async function completeRaffle() {
        let raffleID = await modalPrompt("Enter the raffle ID, or press cancel:", "Complete raffle");
        if (raffleID === null) {
            return;
        }
        let tx = await modalPrompt("Enter the hash of the send block for the raffle prize:", "Complete raffle");
        if (tx === null) {
            return;
        }
        try {
            await apiClient.completeRaffle(raffleID, tx);
            await modalAlert("Raffle completed successfully");
        } catch (e) {
            await modalAlert("An error occurred when completing the raffle: " + e);
        }
    }
</script>

<div class="mt-6 container mx-auto max-w-screen-lg px-2">
    <p class="font-semibold text-lg">Raffles</p>
    <p class="text-sm mt-2">Controls for the verifiable raffle system.</p>
    <div class="mt-6 grid grid-cols-3 gap-6">
        <ButtonButton on:click={confirmRaffleWinner}>Confirm winner</ButtonButton>
        <ButtonButton on:click={redrawRaffle}>Redraw raffle</ButtonButton>
        <ButtonButton on:click={completeRaffle}>Complete raffle</ButtonButton>
    </div>
    <div class="mt-6">
        <RafflesTable />
    </div>
</div>
