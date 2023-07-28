<script lang="ts">
    import { Duration } from "google-protobuf/google/protobuf/duration_pb";
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import type { PaginationParameters } from "../proto/common_pb";
    import type { UserBan } from "../proto/jungletv_pb";
    import UserBanTableItem from "../tableitems/UserBanTableItem.svelte";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import ErrorMessage from "../uielements/ErrorMessage.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";
    import SuccessMessage from "../uielements/SuccessMessage.svelte";
    import { hrefButtonStyleClasses } from "../utils";

    export let searchQuery = "";
    let prevSearchQuery = "";
    export let activeOnly = true;
    let prevActiveOnly = true;

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[UserBan[], number]> {
        let resp = await apiClient.userBans(searchQuery, activeOnly, pagParams);
        return [resp.getUserBansList(), resp.getTotal()];
    }

    $: {
        if (searchQuery != prevSearchQuery || activeOnly != prevActiveOnly) {
            cur_page = -1;
            prevSearchQuery = searchQuery;
            prevActiveOnly = activeOnly;
        }
    }

    let banRewardAddress = "";
    let banRemoteAddress = "";
    let banFromChat = false;
    let banFromEnqueuing = false;
    let banFromRewards = false;
    let banReason = "";
    let banDurationHours = 0;
    let banIDs: string[] = [];
    let banError = "";
    async function createBan() {
        let duration: Duration = undefined;
        if (banDurationHours > 0) {
            duration = new Duration();
            duration.setSeconds(banDurationHours * 3600);
        }
        try {
            let response = await apiClient.banUser(
                banRewardAddress,
                banRemoteAddress,
                banFromChat,
                banFromEnqueuing,
                banFromRewards,
                banReason,
                duration
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
</script>

<div class="m-6 grow container mx-auto max-w-screen-lg p-2">
    <p class="mb-6">
        <a use:link href="/moderate" class={hrefButtonStyleClasses()}>Back to moderation dashboard</a>
    </p>
    <div class="mt-10 grid grid-rows-1 grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
            <p class="font-semibold text-lg">Create ban</p>
            <div class="grid grid-rows-5 grid-cols-3 gap-6 max-w-screen-sm">
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
                <div class="col-span-2 text-right text-gray-700">Ban duration in hours (0 for indefinite):</div>
                <input
                    class="dark:text-black"
                    type="number"
                    placeholder="Duration in hours (0 for indefinite ban)"
                    min="0"
                    step="0.5"
                    bind:value={banDurationHours}
                />
                <ButtonButton type="submit" color="red" extraClasses="col-span-3" on:click={createBan}>
                    Create ban
                </ButtonButton>
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
            <p class="font-semibold text-lg">Remove ban</p>
            <div class="grid grid-rows-3 grid-cols-1 gap-6 max-w-screen-sm">
                <input class="col-span-3 dark:text-black" type="text" placeholder="Ban ID" bind:value={removeBanID} />
                <input
                    class="col-span-3 dark:text-black"
                    type="text"
                    placeholder="Reason for unban"
                    bind:value={removeBanReason}
                />
                <ButtonButton type="submit" color="blue" extraClasses="col-span-3" on:click={removeBan}>
                    Remove ban
                </ButtonButton>
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

    <div class="mt-10 mb-4 grid grid-rows-1 grid-cols-2 gap-12">
        <div>
            <input
                id="showOnlyActive"
                name="showOnlyActive"
                type="checkbox"
                bind:checked={activeOnly}
                class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
            />
            <label for="showOnlyActive" class="font-medium text-gray-700 dark:text-gray-300">
                Show only active bans
            </label>
        </div>
    </div>

    <PaginatedTable
        title={"User bans"}
        column_count={4}
        error_message={"Error loading user bans"}
        no_items_message={"No user bans"}
        data_promise_factory={getPage}
        bind:cur_page
        bind:search_query={searchQuery}
        show_search_box={true}
    >
        <svelte:fragment slot="thead">
            <tr
                class="border border-solid border-b-0 border-l-0 border-r-0
            bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
            text-xs uppercase whitespace-nowrap font-semibold text-left"
            >
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Ban ID</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Created</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Banned until</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Banned by</th>
            </tr>
            <tr
                class="border border-solid border-t-0 border-l-0 border-r-0
            bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
            text-xs uppercase whitespace-nowrap font-semibold text-left"
            >
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Scope</th>
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Address</th>
                <th colspan="2" class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Reason</th>
            </tr>
        </svelte:fragment>

        <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <UserBanTableItem ban={item} />
        </tbody>
    </PaginatedTable>
</div>
