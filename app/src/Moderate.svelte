<script lang="ts">
    import { link } from "svelte-navigator";
    import { navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import Chat from "./Chat.svelte";
    import SettingsOverview from "./moderation/SettingsOverview.svelte";
    import {
        AllowedVideoEnqueuingType,
        ForcedTicketEnqueueType,
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

    async function setVideoEnqueuingEnabled() {
        await apiClient.setVideoEnqueuingEnabled(AllowedVideoEnqueuingType.ENABLED);
    }
    async function setVideoEnqueuingStaffOnly() {
        await apiClient.setVideoEnqueuingEnabled(AllowedVideoEnqueuingType.STAFF_ONLY);
    }
    async function setVideoEnqueuingDisabled() {
        await apiClient.setVideoEnqueuingEnabled(AllowedVideoEnqueuingType.DISABLED);
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
            'Enter the multiplier (think of it as a percentage of the cheapest possible price to enqueue a single video with the "Play now" option).\nMinimum is 1, default is 150.'
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
</script>

<div class="flex-grow min-h-full overflow-x-hidden">
    {#if !globalThis.PRODUCTION_BUILD}
        <div class="px-2 py-2 mb-10">
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
    <div class="mt-10">
        <p class="px-2 font-semibold text-lg">Moderation settings overview</p>
        <div class="px-2">
            <SettingsOverview />
        </div>
    </div>
    <div class="mt-10">
        <p class="px-2 font-semibold text-lg">Queue flow control</p>
        <p class="px-2 text-sm">Press all green buttons to revert to default settings</p>
        <div class="px-2 grid grid-cols-3 gap-6">
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                on:click={setVideoEnqueuingEnabled}
            >
                Allow video enqueuing
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                on:click={setVideoEnqueuingStaffOnly}
            >
                Allow only staff to enqueue
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                on:click={setVideoEnqueuingDisabled}
            >
                Disable video enqueuing
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
        </div>
        <p class="px-2 py-2 text-lg">
            <a href="/moderate/media/disallowed" use:link>Manage disallowed videos</a>
        </p>
    </div>
    <div class="mt-10">
        <p class="px-2 font-semibold text-lg">User bans</p>
        <p class="px-2 py-2 text-lg">
            <a href="/moderate/bans" use:link>Manage user bans</a>
        </p>
    </div>
    <div>
        <p class="px-2 font-semibold text-lg">Documents</p>
        <p class="px-2">
            <a use:link href="/moderate/documents/guidelines">Edit Guidelines</a> |
            <a use:link href="/moderate/documents/faq">Edit FAQ</a> |
            <a use:link href="/moderate/documents/announcements">Edit Announcements</a>
        </p>
    </div>
    <div class="mt-10">
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
    <div class="mt-10">
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
