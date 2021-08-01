<script lang="ts">
    import { link } from "svelte-navigator";
    import { navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import Chat from "./Chat.svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { AllowedVideoEnqueuingType, ForcedTicketEnqueueType } from "./proto/jungletv_pb";
    import Queue from "./Queue.svelte";
    import SuccessMessage from "./SuccessMessage.svelte";

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

    let banRewardAddress = "";
    let banRemoteAddress = "";
    let banFromChat = false;
    let banFromEnqueuing = false;
    let banFromRewards = false;
    let banReason = "";
    let banIDs: string[] = [];
    let banError = "";
    async function createBan() {
        try {
            let response = await apiClient.banUser(
                banRewardAddress,
                banRemoteAddress,
                banFromChat,
                banFromEnqueuing,
                banFromRewards,
                banReason
            );
            banIDs = response.getBanIdsList();
            banError = "";
        } catch (e) {
            banIDs = [];
            banError = e;
        }
    }

    let removeBanID = "";
    let removeBanReason = "";
    let removeBanError = "";
    let removeBanSuccessful = false;
    async function removeBan() {
        try {
            await apiClient.removeBan(removeBanID, removeBanReason);
            removeBanError = "";
            removeBanSuccessful = true;
        } catch (e) {
            removeBanError = e;
            removeBanSuccessful = false;
        }
    }

    async function setPricesMultiplier() {
        let multiplierStr = prompt(
            "Enter the multiplier (think of it as a percentage of the original prices). Minimum is 10, default is 100."
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
    <div>
        <p class="px-2 font-semibold text-lg">Queue</p>
        <Queue mode="moderation" />
    </div>
    <div class="mt-10">
        <p class="px-2 font-semibold text-lg">Video enqueuing</p>
        <div class="px-2 grid grid-cols-4 gap-6">
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={setVideoEnqueuingEnabled}
            >
                Allow video enqueuing
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={setVideoEnqueuingStaffOnly}
            >
                Allow only staff to enqueue
            </button>
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
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
        </div>
        <p class="px-2 py-2 text-lg">
            <a href="/moderate/media/disallowed" use:link>Manage disallowed videos</a>
        </p>
    </div>
    <div class="mt-10 grid grid-rows-1 grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
            <p class="px-2 font-semibold text-lg">Create ban</p>
            <div class="px-2 grid grid-rows-5 grid-cols-3 gap-6 max-w-screen-sm">
                <input
                    class="col-span-3 dark:text-black"
                    type="text"
                    placeholder="Banano address"
                    bind:value={banRewardAddress}
                />
                <input
                    class="col-span-3 dark:text-black"
                    type="text"
                    placeholder="IP address (leave empty if unknown)"
                    bind:value={banRemoteAddress}
                />
                <div>
                    <input
                        id="banFromChat"
                        name="banFromChat"
                        type="checkbox"
                        bind:checked={banFromChat}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                    <label for="banFromChat" class="font-medium text-gray-700 dark:text-gray-300">
                        Ban from chat
                    </label>
                </div>
                <div>
                    <input
                        id="banFromEnqueuing"
                        name="banFromEnqueuing"
                        type="checkbox"
                        bind:checked={banFromEnqueuing}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                    <label for="banFromEnqueuing" class="font-medium text-gray-700 dark:text-gray-300">
                        Ban from enqueuing
                    </label>
                </div>
                <div>
                    <input
                        id="banFromRewards"
                        name="banFromRewards"
                        type="checkbox"
                        bind:checked={banFromRewards}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                    <label for="banFromRewards" class="font-medium text-gray-700 dark:text-gray-300">
                        Ban from receiving rewards
                    </label>
                </div>
                <input
                    class="col-span-3 dark:text-black"
                    type="text"
                    placeholder="Reason for ban"
                    bind:value={banReason}
                />
                <button
                    type="submit"
                    class="col-span-3 inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    on:click={createBan}
                >
                    Create ban
                </button>
                <div class="col-span-3">
                    {#if banIDs.length > 0}
                        Take note of the following ban IDs:
                        <ul>
                            {#each banIDs as banID}
                                <li>{banID}</li>
                            {/each}
                        </ul>
                    {/if}
                    {#if banError != ""}
                        <ErrorMessage>{banError}</ErrorMessage>
                    {/if}
                </div>
            </div>
        </div>
        <div>
            <p class="px-2 font-semibold text-lg">Remove ban</p>
            <div class="px-2 grid grid-rows-3 grid-cols-1 gap-6 max-w-screen-sm">
                <input class="col-span-3 dark:text-black" type="text" placeholder="Ban ID" bind:value={removeBanID} />
                <input
                    class="col-span-3 dark:text-black"
                    type="text"
                    placeholder="Reason for unban"
                    bind:value={removeBanReason}
                />
                <button
                    type="submit"
                    class="col-span-3 inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    on:click={removeBan}
                >
                    Remove ban
                </button>
                <div class="col-span-3">
                    {#if removeBanSuccessful}
                        <SuccessMessage>Ban removed successfully</SuccessMessage>
                    {/if}
                    {#if removeBanError != ""}
                        <ErrorMessage>{removeBanError}</ErrorMessage>
                    {/if}
                </div>
            </div>
        </div>
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
