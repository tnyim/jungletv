<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import Chat from "../Chat.svelte";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import TextInput from "../uielements/TextInput.svelte";

    async function setChatEnabled(enabled: boolean, slowmode: boolean) {
        await apiClient.setChatSettings(enabled, slowmode);
    }

    let chatHistoryAddress = "";
</script>

<div class="min-h-full overflow-x-hidden">
    <p class="px-2 mt-6 font-semibold text-lg">Chat</p>
    <div class="px-2 mb-10 grid grid-cols-3 gap-6 mt-6">
        <TextInput extraClasses="col-span-2" placeholder="Banano address" bind:value={chatHistoryAddress} />
        <ButtonButton on:click={() => navigate("/moderate/users/" + chatHistoryAddress + "/chathistory")}>
            See chat history
        </ButtonButton>
    </div>
    <div class="px-2 grid grid-cols-3 gap-6 mb-6">
        <ButtonButton color="green" on:click={() => setChatEnabled(true, false)}>Enable chat</ButtonButton>
        <ButtonButton color="blue" on:click={() => setChatEnabled(true, true)}>Enable with slowmode</ButtonButton>
        <ButtonButton color="red" on:click={() => setChatEnabled(false, false)}>Disable chat</ButtonButton>
    </div>
    <Chat mode="moderation" />
</div>
