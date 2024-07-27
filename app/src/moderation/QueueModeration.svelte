<script lang="ts">
    import Queue from "../Queue.svelte";
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import { AllowedMediaEnqueuingType, ForcedTicketEnqueueType, ModerationStatusOverview } from "../proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "../rpcUtils";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import TextInput from "../uielements/TextInput.svelte";

    let statusOverview: ModerationStatusOverview;

    consumeStreamRPCFromSvelteComponent<ModerationStatusOverview>(
        20000,
        5000,
        apiClient.monitorModerationStatus.bind(apiClient),
        (settings) => (statusOverview = settings),
    );

    let ticketID = "";

    async function enqueue() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.ENQUEUE);
    }
    async function playNext() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.PLAY_NEXT);
    }
    async function playNow() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.PLAY_NOW);
    }

    async function setMediaEnqueuingEnabled() {
        await apiClient.setMediaEnqueuingEnabled(AllowedMediaEnqueuingType.ENABLED);
    }
    async function setMediaEnqueuingStaffOnly() {
        await apiClient.setMediaEnqueuingEnabled(AllowedMediaEnqueuingType.STAFF_ONLY);
    }
    async function setMediaEnqueuingPasswordRequired() {
        let password = await modalPrompt(
            "Enter the password that shall be required for enqueuing.",
            "Password restriction",
        );
        if (password === null || password == "") {
            return;
        }
        await apiClient.setMediaEnqueuingEnabled(AllowedMediaEnqueuingType.PASSWORD_REQUIRED, password);
    }
    async function setMediaEnqueuingDisabled() {
        await apiClient.setMediaEnqueuingEnabled(AllowedMediaEnqueuingType.DISABLED);
    }

    async function setCrowdfundedSkippingEnabled() {
        await apiClient.setCrowdfundedSkippingEnabled(true);
    }
    async function setCrowdfundedSkippingDisabled() {
        await apiClient.setCrowdfundedSkippingEnabled(false);
    }

    async function setPricesMultiplier() {
        let multiplierStr = await modalPrompt(
            "Enter the multiplier (think of it as a percentage of the original prices). Minimum is 1, default is 100.",
            "Prices multiplier",
        );
        let multiplier = parseInt(multiplierStr);
        if (Object.is(NaN, multiplier)) {
            await modalAlert("Invalid multiplier");
            return;
        }
        try {
            await apiClient.setPricesMultiplier(multiplier);
            await modalAlert("Prices multiplier set successfully");
        } catch (e) {
            await modalAlert("An error occurred when setting the prices multiplier: " + e);
        }
    }

    async function setMinimumPricesMultiplier() {
        let multiplierStr = await modalPrompt(
            "Enter the multiplier (25 means a target of 0.025 BAN minimum per eligible spectator). Minimum is 20, default is 25.",
            "Minimum prices multiplier",
        );
        let multiplier = parseInt(multiplierStr);
        if (Object.is(NaN, multiplier)) {
            await modalAlert("Invalid multiplier");
            return;
        }
        try {
            await apiClient.setMinimumPricesMultiplier(multiplier);
            await modalAlert("Minimum prices multiplier set successfully");
        } catch (e) {
            await modalAlert("An error occurred when setting the minimum prices multiplier: " + e);
        }
    }

    async function setSkipPriceMultiplier() {
        let multiplierStr = await modalPrompt(
            'Enter the multiplier (think of it as a percentage of the cheapest possible price to enqueue a single entry with the "Play now" option).\nMinimum is 1, default is 150.',
            "Skip price multiplier",
        );
        let multiplier = parseInt(multiplierStr);
        if (Object.is(NaN, multiplier)) {
            await modalAlert("Invalid multiplier");
            return;
        }
        try {
            await apiClient.setSkipPriceMultiplier(multiplier);
            await modalAlert("Skip price multiplier set successfully");
        } catch (e) {
            await modalAlert("An error occurred when setting the skip price multiplier: " + e);
        }
    }
</script>

<div class="mt-6 px-2 overflow-x-hidden">
    <div>
        {#if !globalThis.PRODUCTION_BUILD}
            <div class="mb-6">
                <p class="font-semibold text-lg">Forcibly enqueue ticket</p>
                <div class="grid grid-cols-6 gap-6">
                    <TextInput extraClasses="col-span-3" placeholder="Ticket ID" bind:value={ticketID} />
                    <ButtonButton type="submit" on:click={enqueue}>Enqueue</ButtonButton>
                    <ButtonButton type="submit" on:click={playNext}>Play next</ButtonButton>
                    <ButtonButton type="submit" on:click={playNow}>Play now</ButtonButton>
                </div>
            </div>
        {/if}
        <p class="font-semibold text-lg">Current settings</p>
        <div>
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
                        {:else if statusOverview.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.PASSWORD_REQUIRED}
                            requires a password
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
                        Removal of own queue entries {statusOverview.getOwnEntryRemovalEnabled()
                            ? "allowed"
                            : "disallowed"}
                    </div>
                    <div>
                        Reordering of queue entries {statusOverview.getAllowEntryReordering()
                            ? "allowed"
                            : "disallowed"}
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
    </div>
    <div class="mt-6">
        <p class="font-semibold text-lg">Queue flow control</p>
        <p class="text-sm">Press all green buttons to revert to default settings</p>
        <div class="grid grid-cols-4 gap-6">
            <ButtonButton color="green" on:click={setMediaEnqueuingEnabled}>Allow media enqueuing</ButtonButton>
            <ButtonButton color="blue" on:click={setMediaEnqueuingPasswordRequired}
                >Require password to enqueue</ButtonButton
            >
            <ButtonButton color="blue" on:click={setMediaEnqueuingStaffOnly}>Allow only staff to enqueue</ButtonButton>
            <ButtonButton color="red" on:click={setMediaEnqueuingDisabled}>Disable media enqueuing</ButtonButton>
        </div>
        <div class="grid grid-cols-3 gap-6 mt-6">
            <ButtonButton on:click={setPricesMultiplier}>Set prices multiplier</ButtonButton>
            <ButtonButton on:click={setMinimumPricesMultiplier}>Set minimum prices multiplier</ButtonButton>
            <div><!-- spacer --></div>
            <ButtonButton color="green" on:click={() => apiClient.setSkippingEnabled(true)}>
                Enable skipping, in general
            </ButtonButton>
            <ButtonButton color="red" on:click={() => apiClient.setSkippingEnabled(false)}>
                Disable all forms of skipping
            </ButtonButton>
            <ButtonButton color="green" on:click={() => apiClient.clearQueueInsertCursor()}>
                Clear queue insert cursor
            </ButtonButton>
            <ButtonButton color="red" on:click={() => apiClient.setNewQueueEntriesAlwaysUnskippable(true)}>
                Make new queue entries unskippable at no additional cost
            </ButtonButton>
            <ButtonButton color="green" on:click={() => apiClient.setNewQueueEntriesAlwaysUnskippable(false)}>
                Stop making new queue entries unskippable
            </ButtonButton>
            <div><!-- spacer --></div>
            <ButtonButton color="red" on:click={() => apiClient.setOwnQueueEntryRemovalAllowed(false)}>
                Disallow removal of own queue entries
            </ButtonButton>
            <ButtonButton color="green" on:click={() => apiClient.setOwnQueueEntryRemovalAllowed(true)}>
                Allow removal of own queue entries
            </ButtonButton>
            <div><!-- spacer --></div>
            <ButtonButton color="red" on:click={() => apiClient.setQueueEntryReorderingAllowed(false)}>
                Disallow reordering of queue entries
            </ButtonButton>
            <ButtonButton color="green" on:click={() => apiClient.setQueueEntryReorderingAllowed(true)}>
                Allow reordering of queue entries
            </ButtonButton>
        </div>
        <div>
            <p class="font-semibold text-md mt-4">Crowdfunded skipping</p>
            <div class="grid grid-cols-3 gap-6">
                <ButtonButton color="green" on:click={setCrowdfundedSkippingEnabled}>
                    Enable crowdfunded skipping
                </ButtonButton>
                <ButtonButton color="red" on:click={setCrowdfundedSkippingDisabled}>
                    Disable crowdfunded skipping
                </ButtonButton>
                <ButtonButton on:click={setSkipPriceMultiplier}>Set skip price multiplier</ButtonButton>
            </div>
        </div>
    </div>
    <p class="mt-6 font-semibold text-lg">Queue</p>
    <Queue mode="moderation" />
</div>
