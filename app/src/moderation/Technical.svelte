<script lang="ts">
    import { apiClient } from "../api_client";
    import { modalAlert, modalConfirm } from "../modal/modal";
    import ButtonButton from "../uielements/ButtonButton.svelte";

    async function triggerClientReload() {
        if (
            await modalConfirm(
                "Are you sure? This will reload the page for all connected users.",
                "Trigger client reload?",
            )
        ) {
            try {
                await apiClient.triggerClientReload();
                await modalAlert("Client reload triggered");
            } catch (e) {
                await modalAlert("An error occurred: " + e);
            }
        }
    }

    async function setMulticurrencyPaymentsEnabled() {
        await apiClient.setMulticurrencyPaymentsEnabled(true);
    }
    async function setMulticurrencyPaymentsDisabled() {
        await apiClient.setMulticurrencyPaymentsEnabled(false);
    }

    async function setRPCProxyEnabled() {
        await apiClient.setRPCProxyEnabled(true);
    }
    async function setRPCProxyDisabled() {
        await apiClient.setRPCProxyEnabled(false);
    }
</script>

<div class="mt-6 container mx-auto max-w-screen-lg px-2">
    <p class="font-semibold text-lg">Technical controls</p>
    <p class="text-sm mt-2">Miscellaneous technical controls.</p>
    <div class="grid grid-cols-3 gap-6 mt-6">
        <ButtonButton on:click={triggerClientReload}>Trigger client reload</ButtonButton>
        <ButtonButton color="green" on:click={setMulticurrencyPaymentsEnabled}>
            Enable multicurrency payments
        </ButtonButton>
        <ButtonButton color="red" on:click={setMulticurrencyPaymentsDisabled}>
            Disable multicurrency payments
        </ButtonButton>
    </div>
    <div class="grid grid-cols-3 gap-6 mt-6">
        <ButtonButton color="green" on:click={setRPCProxyEnabled}>Enable RPC Proxy</ButtonButton>
        <ButtonButton color="red" on:click={setRPCProxyDisabled}>Disable RPC Proxy</ButtonButton>
    </div>
</div>
