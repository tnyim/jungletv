<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import { ModerationStatusOverview, VipUserAppearance, type VipUserAppearanceMap } from "../proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "../rpcUtils";
    import ButtonButton from "../uielements/ButtonButton.svelte";

    let statusOverview: ModerationStatusOverview;

    consumeStreamRPCFromSvelteComponent<ModerationStatusOverview>(
        20000,
        5000,
        apiClient.monitorModerationStatus.bind(apiClient),
        (settings) => (statusOverview = settings),
    );

    async function addVipUser() {
        let rewardsAddress = await modalPrompt(
            "Enter the rewards address to make VIP, or press cancel:",
            "Add VIP user",
        );
        if (rewardsAddress === null) {
            return;
        }
        let valueStr = await modalPrompt(
            "Enter the appearance for the VIP, or press cancel:\n\n0: appear as a normal user\n1: appear as a moderator\n2: appear as a VIP\n3: appear as a VIP moderator",
            "Add VIP user",
        );
        if (valueStr === null) {
            return;
        }
        let value = parseInt(valueStr);
        if (isNaN(value)) {
            await modalAlert("Invalid value");
            return;
        }

        let appearance: VipUserAppearanceMap[keyof VipUserAppearanceMap] =
            VipUserAppearance.UNKNOWN_VIP_USER_APPEARANCE;
        switch (value) {
            case 0:
                appearance = VipUserAppearance.VIP_USER_APPEARANCE_NORMAL;
                break;
            case 1:
                appearance = VipUserAppearance.VIP_USER_APPEARANCE_MODERATOR;
                break;
            case 2:
                appearance = VipUserAppearance.VIP_USER_APPEARANCE_VIP;
                break;
            case 3:
                appearance = VipUserAppearance.VIP_USER_APPEARANCE_VIP_MODERATOR;
                break;
            default:
                await modalAlert("Invalid value");
                return;
        }

        try {
            await apiClient.addVipUser(rewardsAddress, appearance);
            await modalAlert("User successfully made VIP");
        } catch (e) {
            await modalAlert("An error occurred: " + e);
        }
    }

    async function removeVipUser(rewardsAddress: string) {
        try {
            await apiClient.removeVipUser(rewardsAddress);
            await modalAlert("User successfully made non-VIP");
        } catch (e) {
            await modalAlert("An error occurred: " + e);
        }
    }
</script>

<div class="mt-6 container mx-auto max-w-screen-lg px-2">
    <p class="font-semibold text-lg">VIP Users</p>
    <p class="text-sm mt-2">
        VIP users can enqueue while enqueuing is limited to staff, and can appear as a role they don't normally have,
        even though they don't get any other of the permissions associated with that role.
        <br />
        VIP users can be managed by JungleTV Application Framework
        <a use:link href="/moderate/applications">applications</a>.
    </p>
    <div class="mt-6">
        <ButtonButton on:click={addVipUser}>Add VIP user</ButtonButton>
    </div>
    <div class="mt-6">
        {#if statusOverview === undefined}
            Loading...
        {:else if statusOverview.getVipUsersList().length > 0}
            <p class="font-semibold">Current VIP users</p>
            <ul class="list-disc list-inside pt-2">
                {#each statusOverview.getVipUsersList() as vipUser}
                    <li>
                        {#if vipUser.getNickname()}
                            {vipUser.getNickname()} (<code>{vipUser.getAddress()}</code>)
                        {:else}
                            <code>{vipUser.getAddress()}</code>
                        {/if}
                        <ButtonButton on:click={() => removeVipUser(vipUser.getAddress())} extraClasses="ml-2">
                            Remove
                        </ButtonButton>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="font-semibold">No VIP users currently configured</p>
        {/if}
    </div>
</div>
