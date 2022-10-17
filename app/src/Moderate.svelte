<script lang="ts">
    import { link, navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import Chat from "./Chat.svelte";
    import StatusOverview from "./moderation/StatusOverview.svelte";
    import {
        AllowedMediaEnqueuingType,
        ForcedTicketEnqueueType,
        VipUserAppearance,
        VipUserAppearanceMap,
    } from "./proto/jungletv_pb";
    import Queue from "./Queue.svelte";

    let ticketID = "";
    let chatHistoryAddress = "";

    async function enqueue() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.ENQUEUE);
    }
    async function playNext() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.PLAY_NEXT);
    }
    async function playNow() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.PLAY_NOW);
    }

    async function setChatEnabled(enabled: boolean, slowmode: boolean) {
        await apiClient.setChatSettings(enabled, slowmode);
    }

    async function setMediaEnqueuingEnabled() {
        await apiClient.setMediaEnqueuingEnabled(AllowedMediaEnqueuingType.ENABLED);
    }
    async function setMediaEnqueuingStaffOnly() {
        await apiClient.setMediaEnqueuingEnabled(AllowedMediaEnqueuingType.STAFF_ONLY);
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
        let multiplierStr = prompt(
            "Enter the multiplier (think of it as a percentage of the original prices). Minimum is 1, default is 100."
        );
        let multiplier = parseInt(multiplierStr);
        if (Object.is(NaN, multiplier)) {
            alert("Invalid multiplier");
            return;
        }
        try {
            await apiClient.setPricesMultiplier(multiplier);
            alert("Prices multiplier set successfully");
        } catch (e) {
            alert("An error occurred when setting the prices multiplier: " + e);
        }
    }

    async function setMinimumPricesMultiplier() {
        let multiplierStr = prompt(
            "Enter the multiplier (25 means a target of 0.025 BAN minimum per eligible spectator). Minimum is 20, default is 25."
        );
        let multiplier = parseInt(multiplierStr);
        if (Object.is(NaN, multiplier)) {
            alert("Invalid multiplier");
            return;
        }
        try {
            await apiClient.setMinimumPricesMultiplier(multiplier);
            alert("Minimum prices multiplier set successfully");
        } catch (e) {
            alert("An error occurred when setting the minimum prices multiplier: " + e);
        }
    }

    async function setSkipPriceMultiplier() {
        let multiplierStr = prompt(
            'Enter the multiplier (think of it as a percentage of the cheapest possible price to enqueue a single entry with the "Play now" option).\nMinimum is 1, default is 150.'
        );
        let multiplier = parseInt(multiplierStr);
        if (Object.is(NaN, multiplier)) {
            alert("Invalid multiplier");
            return;
        }
        try {
            await apiClient.setSkipPriceMultiplier(multiplier);
            alert("Skip price multiplier set successfully");
        } catch (e) {
            alert("An error occurred when setting the skip price multiplier: " + e);
        }
    }

    async function confirmRaffleWinner() {
        let raffleID = prompt("Confirming the winner. Enter the raffle ID, or press cancel:");
        if (raffleID === null) {
            return;
        }
        try {
            await apiClient.confirmRaffleWinner(raffleID);
            alert("Raffle winner confirmed successfully");
        } catch (e) {
            alert("An error occurred when confirming the raffle winner: " + e);
        }
    }

    async function redrawRaffle() {
        let raffleID = prompt("Redrawing a raffle. Enter the raffle ID, or press cancel:");
        if (raffleID === null) {
            return;
        }
        let reason = prompt("Enter the reason for redrawing the raffle (this is public):");
        if (reason === null) {
            return;
        }
        try {
            await apiClient.redrawRaffle(raffleID, reason);
            alert("Raffle redrawn successfully");
        } catch (e) {
            alert("An error occurred when redrawing the raffle: " + e);
        }
    }

    async function completeRaffle() {
        let raffleID = prompt("Completing a raffle. Enter the raffle ID, or press cancel:");
        if (raffleID === null) {
            return;
        }
        let tx = prompt("Enter the hash of the send block for the raffle prize:");
        if (tx === null) {
            return;
        }
        try {
            await apiClient.completeRaffle(raffleID, tx);
            alert("Raffle completed successfully");
        } catch (e) {
            alert("An error occurred when completing the raffle: " + e);
        }
    }

    async function adjustPointsBalance() {
        let rewardsAddress = prompt(
            "Enter the rewards address for which to adjust the points balance, or press cancel:"
        );
        if (rewardsAddress === null) {
            return;
        }
        let valueStr = prompt("Enter the integer value (positive or negative) for the adjustment, or press cancel:");
        if (valueStr === null) {
            return;
        }
        let value = parseInt(valueStr);
        if (isNaN(value)) {
            alert("Invalid value");
            return;
        }
        let reason = prompt(
            `Adjusting points balance of ${rewardsAddress} by ${value} points.` + "\n\nEnter a reason, or press cancel:"
        );
        if (reason === null) {
            return;
        }
        try {
            await apiClient.adjustPointsBalance(rewardsAddress, value, reason);
            alert("Balance adjustment successful");
        } catch (e) {
            alert("An error occurred when adjusting the points balance: " + e);
        }
    }

    async function addVipUser() {
        let rewardsAddress = prompt("Enter the rewards address to make VIP, or press cancel:");
        if (rewardsAddress === null) {
            return;
        }
        let valueStr = prompt(
            "Enter the appearance for the VIP, or press cancel:\n\n0: appear as a normal user\n1: appear as a moderator\n2: appear as a VIP\n3: appear as a VIP moderator"
        );
        if (valueStr === null) {
            return;
        }
        let value = parseInt(valueStr);
        if (isNaN(value)) {
            alert("Invalid value");
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
                alert("Invalid value");
                return;
        }

        try {
            await apiClient.addVipUser(rewardsAddress, appearance);
            alert("User successfully made VIP");
        } catch (e) {
            alert("An error occurred: " + e);
        }
    }

    async function removeVipUser() {
        let rewardsAddress = prompt("Enter the rewards address to make non-VIP, or press cancel:");
        if (rewardsAddress === null) {
            return;
        }
        try {
            await apiClient.removeVipUser(rewardsAddress);
            alert("User successfully made VIP");
        } catch (e) {
            alert("An error occurred: " + e);
        }
    }

    async function triggerClientReload() {
        if (confirm("Are you sure? This will reload the page for all connected users.")) {
            try {
                await apiClient.triggerClientReload();
                alert("Client reload triggered");
            } catch (e) {
                alert("An error occurred: " + e);
            }
        }
    }

    async function setMulticurrencyPaymentsEnabled() {
        await apiClient.setMulticurrencyPaymentsEnabled(true);
    }
    async function setMulticurrencyPaymentsDisabled() {
        await apiClient.setMulticurrencyPaymentsEnabled(false);
    }
</script>

<div class="flex-grow min-h-full overflow-x-hidden">
    {#if !globalThis.PRODUCTION_BUILD}
        <div class="px-2 py-2 mb-6">
            <p class="font-semibold text-lg">Forcibly enqueue ticket</p>
            <div class="grid grid-cols-6 gap-6">
                <input class="col-span-3" type="text" placeholder="ticket ID" bind:value={ticketID} />
                <button
                    type="submit"
                    class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    on:click={enqueue}
                >
                    Enqueue
                </button>
                <button
                    type="submit"
                    class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    on:click={playNext}
                >
                    Play next
                </button>
                <button
                    type="submit"
                    class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    on:click={playNow}
                >
                    Play now
                </button>
            </div>
        </div>
    {/if}
    <details>
        <summary class="px-2 font-semibold text-lg">Queue</summary>
        <Queue mode="moderation" />
    </details>
    <div class="mt-6">
        <StatusOverview />
    </div>
    <div class="mt-6">
        <p class="px-2 font-semibold text-lg">Queue flow control</p>
        <p class="px-2 text-sm">Press all green buttons to revert to default settings</p>
        <div class="px-2 grid grid-cols-3 gap-6">
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={setMediaEnqueuingEnabled}
            >
                Allow media enqueuing
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                on:click={setMediaEnqueuingStaffOnly}
            >
                Allow only staff to enqueue
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                on:click={setMediaEnqueuingDisabled}
            >
                Disable media enqueuing
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={setPricesMultiplier}
            >
                Set prices multiplier
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={setMinimumPricesMultiplier}
            >
                Set minimum prices multiplier
            </button>
            <div><!-- spacer --></div>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={() => apiClient.setSkippingEnabled(true)}
            >
                Enable skipping, in general
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                on:click={() => apiClient.setSkippingEnabled(false)}
            >
                Disable all forms of skipping
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={() => apiClient.clearQueueInsertCursor()}
            >
                Clear queue insert cursor
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                on:click={() => apiClient.setNewQueueEntriesAlwaysUnskippable(true)}
            >
                Make new queue entries unskippable at no additional cost
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={() => apiClient.setNewQueueEntriesAlwaysUnskippable(false)}
            >
                Stop making new queue entries unskippable
            </button>
            <div><!-- spacer --></div>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                on:click={() => apiClient.setOwnQueueEntryRemovalAllowed(false)}
            >
                Disallow removal of own queue entries
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={() => apiClient.setOwnQueueEntryRemovalAllowed(true)}
            >
                Allow removal of own queue entries
            </button>
            <div><!-- spacer --></div>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                on:click={() => apiClient.setQueueEntryReorderingAllowed(false)}
            >
                Disallow reordering of queue entries
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={() => apiClient.setQueueEntryReorderingAllowed(true)}
            >
                Allow reordering of queue entries
            </button>
        </div>
        <div>
            <p class="px-2 font-semibold text-md mt-4">Crowdfunded skipping</p>
            <div class="px-2 grid grid-cols-3 gap-6">
                <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    on:click={setCrowdfundedSkippingEnabled}
                >
                    Enable crowdfunded skipping
                </button>
                <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    on:click={setCrowdfundedSkippingDisabled}
                >
                    Disable crowdfunded skipping
                </button>
                <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    on:click={setSkipPriceMultiplier}
                >
                    Set skip price multiplier
                </button>
            </div>
            <div>
                <p class="px-2 font-semibold text-md mt-4">VIP users</p>
                <p class="px-2 text-sm mt-2">
                    VIP users can enqueue while enqueuing is limited to staff, and can appear as a role they don't
                    normally have.
                </p>
                <div class="px-2 grid grid-cols-3 gap-6">
                    <button
                        type="submit"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        on:click={addVipUser}
                    >
                        Add VIP user
                    </button>
                    <button
                        type="submit"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        on:click={removeVipUser}
                    >
                        Remove VIP user
                    </button>
                    <div />
                </div>
            </div>
        </div>
    </div>
    <div class="mt-6">
        <p class="px-2 text-lg">
            <a href="/moderate/media/disallowed" use:link>Manage disallowed media</a>
        </p>
    </div>
    <div class="mt-6">
        <p class="px-2 font-semibold text-lg">User bans and verification</p>
        <p class="px-2 text-lg">
            <a href="/moderate/bans" use:link>Manage user bans</a>
        </p>
        <p class="px-2 text-lg">
            <a href="/moderate/verifiedusers" use:link>Manage verified users</a>
        </p>
    </div>
    <div class="mt-6">
        <p class="px-2 font-semibold text-lg">Documents</p>
        <p class="px-2">
            <a use:link href="/moderate/documents/guidelines">Edit Guidelines</a> |
            <a use:link href="/moderate/documents/faq">Edit FAQ</a> |
            <a use:link href="/moderate/documents/announcements">Edit Announcements</a>
        </p>
    </div>
    <div class="mt-6">
        <p class="px-2 font-semibold text-lg">Raffles</p>
        <div class="px-2 grid grid-cols-3 gap-6">
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => confirmRaffleWinner()}
            >
                Confirm winner
            </button>
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => redrawRaffle()}
            >
                Redraw raffle
            </button>
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => completeRaffle()}
            >
                Complete raffle
            </button>
        </div>
    </div>
    <div class="mt-6">
        <p class="px-2 font-semibold text-lg">Points</p>
        <div class="px-2 grid grid-cols-3 gap-6">
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => adjustPointsBalance()}
            >
                Adjust balance
            </button>
            <div />
            <div />
        </div>
    </div>
    <div class="mt-6">
        <p class="px-2 font-semibold text-lg">Technical</p>
        <div class="px-2 grid grid-cols-3 gap-6">
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => triggerClientReload()}
            >
                Trigger client reload
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={setMulticurrencyPaymentsEnabled}
            >
                Enable multicurrency payments
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                on:click={setMulticurrencyPaymentsDisabled}
            >
                Disable multicurrency payments
            </button>
        </div>
    </div>
    <div class="mt-6">
        <p class="px-2 font-semibold text-lg">Chat</p>
        <div class="px-2 mb-10 grid grid-cols-3 gap-6">
            <input class="col-span-2" type="text" placeholder="Banano address" bind:value={chatHistoryAddress} />
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => navigate("/moderate/users/" + chatHistoryAddress + "/chathistory")}
            >
                See chat history
            </button>
        </div>
        <div class="px-2 grid grid-cols-3 gap-6">
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => setChatEnabled(true, false)}
            >
                Enable chat
            </button>
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => setChatEnabled(true, true)}
            >
                Enable with slowmode
            </button>
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => setChatEnabled(false, false)}
            >
                Disable chat
            </button>
        </div>
        <Chat mode="moderation" />
    </div>
</div>
