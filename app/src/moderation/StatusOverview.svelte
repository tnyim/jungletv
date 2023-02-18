<script lang="ts">
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { onDestroy, onMount } from "svelte";
    import { apiClient } from "../api_client";
    import { modalAlert } from "../modal/modal";
    import { AllowedMediaEnqueuingType, ModerationStatusOverview } from "../proto/jungletv_pb";
    import { rewardAddress } from "../stores";
    import ButtonButton from "../uielements/ButtonButton.svelte";

    let statusOverview: ModerationStatusOverview;
    let monitorSettingsRequest: Request;
    let monitorStatusTimeoutHandle: number = null;
    onMount(monitorStatus);
    function monitorStatus() {
        monitorSettingsRequest = apiClient.monitorModerationStatus(handleStatusUpdated, (code, msg) => {
            setTimeout(monitorStatus, 5000);
        });
    }
    onDestroy(() => {
        if (monitorSettingsRequest !== undefined) {
            monitorSettingsRequest.close();
        }
        if (monitorStatusTimeoutHandle != null) {
            clearTimeout(monitorStatusTimeoutHandle);
        }
    });

    function monitorStatusTimeout() {
        if (monitorSettingsRequest !== undefined) {
            monitorSettingsRequest.close();
        }
        monitorStatus();
    }

    function handleStatusUpdated(settings: ModerationStatusOverview) {
        if (monitorStatusTimeoutHandle != null) {
            clearTimeout(monitorStatusTimeoutHandle);
        }
        monitorStatusTimeoutHandle = setTimeout(monitorStatusTimeout, 20000);
        statusOverview = settings;
    }

    async function markAsActivelyModerating() {
        await apiClient.markAsActivelyModerating();
        await modalAlert("You are now marked as actively moderating.");
    }

    async function stopActivelyModerating() {
        await apiClient.stopActivelyModerating();
        await modalAlert("You are no longer marked as actively moderating.");
    }
</script>

<p class="px-2 font-semibold text-lg">Moderation settings overview</p>
<div class="px-2">
    {#if statusOverview === undefined}
        Loading...
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div>
                Media enqueuing
                {#if statusOverview.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.DISABLED}
                    disabled
                {:else if statusOverview.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.STAFF_ONLY}
                    restricted to staff
                {:else if statusOverview.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.ENABLED}
                    enabled
                {/if}
            </div>
            <div>
                Enqueuing prices multiplier: {statusOverview.getEnqueuingPricesMultiplier()}
            </div>
            <div>
                Minimum prices multiplier: {statusOverview.getMinimumPricesMultiplier()}
            </div>
            <div>
                {#if statusOverview.getCrowdfundedSkippingEnabled()}
                    Crowdfunded skipping enabled
                    {#if !statusOverview.getAllSkippingEnabled()}
                        (but skipping as a whole is disabled)
                    {/if}
                {:else}
                    Crowdfunded skipping disabled
                    {#if statusOverview.getAllSkippingEnabled()}
                        (skipping through enqueuing is enabled)
                    {/if}
                {/if}
            </div>
            <div>
                Crowdfunded skipping prices multiplier: {statusOverview.getCrowdfundedSkippingPricesMultiplier()}
            </div>
            <div>
                Force new entries to be unskippable for free:
                {statusOverview.getNewEntriesAlwaysUnskippable() ? "yes" : "no"}
            </div>
            <div>
                Removal of own queue entries {statusOverview.getOwnEntryRemovalEnabled() ? "allowed" : "disallowed"}
            </div>
            <div>
                Reordering of queue entries {statusOverview.getAllowEntryReordering() ? "allowed" : "disallowed"}
            </div>
            <div>
                {#if statusOverview.getAllSkippingEnabled()}
                    Entry skipping, in general, is allowed
                    {#if !statusOverview.getCrowdfundedSkippingEnabled()}
                        (crowdfunded skipping is still disabled)
                    {/if}
                {:else}
                    Entry skipping, in general, is disabled
                {/if}
            </div>
            <div>
                {#if statusOverview.hasQueueInsertCursor()}
                    Queue insert cursor set
                {:else}
                    Queue insert cursor not set
                {/if}
            </div>
        </div>
        {#if statusOverview.getVipUsersList().length > 0}
            <p class="font-semibold text-lg">VIP users</p>
            <ul class="list-disc list-inside pt-2">
                {#each statusOverview.getVipUsersList() as vipUser}
                    <li>{vipUser.getNickname()} (<code>{vipUser.getAddress()}</code>)</li>
                {/each}
            </ul>
        {/if}
    {/if}
</div>
<p class="mt-6 px-2 font-semibold text-lg">Staff members actively moderating</p>
<div class="px-2">
    {#if statusOverview === undefined}
        Loading...
    {:else}
        {#if typeof statusOverview
            .getActivelyModeratingList()
            .find((e) => e.getAddress() == $rewardAddress) === "undefined"}
            <ButtonButton color="blue" on:click={markAsActivelyModerating}>
                Mark yourself as actively moderating
            </ButtonButton>
        {:else}
            <ButtonButton color="red" on:click={stopActivelyModerating}>
                Mark yourself as no longer moderating
            </ButtonButton>
        {/if}
        <ul class="{statusOverview.getActivelyModeratingList().length > 0 ? 'list-disc list-inside' : ''} pt-2">
            {#each statusOverview.getActivelyModeratingList() as staffMember}
                <li>{staffMember.getNickname()} (<code>{staffMember.getAddress()}</code>)</li>
            {:else}
                <li>No staff members actively moderating</li>
            {/each}
        </ul>
    {/if}
</div>
