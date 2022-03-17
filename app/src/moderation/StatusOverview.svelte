<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { apiClient } from "../api_client";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { AllowedVideoEnqueuingType, ModerationStatusOverview } from "../proto/jungletv_pb";

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
        alert("You are now marked as actively moderating.");
    }
</script>

<p class="px-2 font-semibold text-lg">Moderation settings overview</p>
<div class="px-2">
    {#if statusOverview === undefined}
        Loading...
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div>
                Video enqueuing
                {#if statusOverview.getAllowedVideoEnqueuing() == AllowedVideoEnqueuingType.DISABLED}
                    disabled
                {:else if statusOverview.getAllowedVideoEnqueuing() == AllowedVideoEnqueuingType.STAFF_ONLY}
                    restricted to staff
                {:else if statusOverview.getAllowedVideoEnqueuing() == AllowedVideoEnqueuingType.ENABLED}
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
    {/if}
</div>
<p class="mt-10 px-2 font-semibold text-lg">Staff members actively moderating</p>
<div class="px-2">
    <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        on:click={markAsActivelyModerating}
    >
        Mark yourself as actively moderating
    </button>
    {#if statusOverview === undefined}
        Loading...
    {:else}
        <ul class="{statusOverview.getActivelyModeratingList().length > 0 ? 'list-disc list-inside' : ''} pt-2">
            {#each statusOverview.getActivelyModeratingList() as staffMember}
                <li>{staffMember.getNickname()} (<code>{staffMember.getAddress()}</code>)</li>
            {:else}
                <li>No staff members actively moderating</li>
            {/each}
        </ul>
    {/if}
</div>
