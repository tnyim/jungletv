<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { apiClient } from "../api_client";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { AllowedVideoEnqueuingType, ModerationSettingsOverview } from "../proto/jungletv_pb";

    let settingsOverview: ModerationSettingsOverview;
    let monitorSettingsRequest: Request;
    let monitorSettingsTimeoutHandle: number = null;
    onMount(monitorSettings);
    function monitorSettings() {
        monitorSettingsRequest = apiClient.monitorModerationSettings(handleSettingsUpdated, (code, msg) => {
            setTimeout(monitorSettings, 5000);
        });
    }
    onDestroy(() => {
        if (monitorSettingsRequest !== undefined) {
            monitorSettingsRequest.close();
        }
        if (monitorSettingsTimeoutHandle != null) {
            clearTimeout(monitorSettingsTimeoutHandle);
        }
    });

    function monitorSettingsTimeout() {
        if (monitorSettingsRequest !== undefined) {
            monitorSettingsRequest.close();
        }
        monitorSettings();
    }

    function handleSettingsUpdated(settings: ModerationSettingsOverview) {
        if (monitorSettingsTimeoutHandle != null) {
            clearTimeout(monitorSettingsTimeoutHandle);
        }
        monitorSettingsTimeoutHandle = setTimeout(monitorSettingsTimeout, 20000);
        settingsOverview = settings;
    }
</script>

{#if settingsOverview === undefined}
    Loading...
{:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div>
            Video enqueuing
            {#if settingsOverview.getAllowedVideoEnqueuing() == AllowedVideoEnqueuingType.DISABLED}
                disabled
            {:else if settingsOverview.getAllowedVideoEnqueuing() == AllowedVideoEnqueuingType.STAFF_ONLY}
                restricted to staff
            {:else if settingsOverview.getAllowedVideoEnqueuing() == AllowedVideoEnqueuingType.ENABLED}
                enabled
            {/if}
        </div>
        <div>
            Enqueuing prices multiplier: {settingsOverview.getEnqueuingPricesMultiplier()}
        </div>
        <div>
            {#if settingsOverview.getCrowdfundedSkippingEnabled()}
                Crowdfunded skipping enabled
                {#if !settingsOverview.getAllSkippingEnabled()}
                    (but skipping as a whole is disabled)
                {/if}
            {:else}
                Crowdfunded skipping disabled
                {#if settingsOverview.getAllSkippingEnabled()}
                    (skipping through enqueuing is enabled)
                {/if}
            {/if}
        </div>
        <div>
            Crowdfunded skipping prices multiplier: {settingsOverview.getCrowdfundedSkippingPricesMultiplier()}
        </div>
        <div>
            Force new entries to be unskippable for free:
            {settingsOverview.getNewEntriesAlwaysUnskippable() ? "yes" : "no"}
        </div>
        <div>
            Removal of own queue entries {settingsOverview.getOwnEntryRemovalEnabled() ? "allowed" : "disallowed"}
        </div>
        <div>
            {#if settingsOverview.getAllSkippingEnabled()}
                Entry skipping, in general, is allowed
                {#if !settingsOverview.getCrowdfundedSkippingEnabled()}
                    (crowdfunded skipping is still disabled)
                {/if}
            {:else}
                Entry skipping, in general, is disabled
            {/if}
        </div>
        <div>
            {#if settingsOverview.hasQueueInsertCursor()}
                Queue insert cursor set
            {:else}
                Queue insert cursor not set
            {/if}
        </div>
    </div>
{/if}
