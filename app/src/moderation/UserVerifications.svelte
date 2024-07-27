<script lang="ts">
    import { apiClient } from "../api_client";
    import type { PaginationParameters } from "../proto/common_pb";
    import type { UserVerification } from "../proto/jungletv_pb";
    import UserVerificationTableItem from "../tableitems/UserVerificationTableItem.svelte";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import ErrorMessage from "../uielements/ErrorMessage.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";
    import SuccessMessage from "../uielements/SuccessMessage.svelte";
    import TextInput from "../uielements/TextInput.svelte";

    export let searchQuery = "";
    let prevSearchQuery = "";
    export let activeOnly = true;
    let prevActiveOnly = true;

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[UserVerification[], number]> {
        let resp = await apiClient.userVerifications(searchQuery, pagParams);
        return [resp.getUserVerificationsList(), resp.getTotal()];
    }

    $: {
        if (searchQuery != prevSearchQuery || activeOnly != prevActiveOnly) {
            cur_page = -1;
            prevSearchQuery = searchQuery;
            prevActiveOnly = activeOnly;
        }
    }

    let verifyRewardAddress = "";
    let skipClientIntegrityChecks = false;
    let skipIPAddressReputationChecks = false;
    let reduceHardChallengeFrequency = false;
    let reason = "";
    let verificationID = "";
    let verificationError = "";
    async function verifyUser() {
        try {
            let response = await apiClient.verifyUser(
                verifyRewardAddress,
                skipClientIntegrityChecks,
                skipIPAddressReputationChecks,
                reduceHardChallengeFrequency,
                reason,
            );
            verificationID = response.getVerificationId();
            verificationError = "";
            cur_page = -1;
        } catch (e) {
            verificationID = "";
            verificationError = e;
        }
    }

    let removeVerificationID = "";
    let removeVerificationReason = "";
    let removeVerificationError = "";
    let removeVerificationSuccessful = false;
    async function removeVerification() {
        try {
            await apiClient.removeUserVerification(removeVerificationID, removeVerificationReason);
            removeVerificationError = "";
            removeVerificationSuccessful = true;
            cur_page = -1;
        } catch (e) {
            removeVerificationError = e;
            removeVerificationSuccessful = false;
        }
    }
</script>

<div class="mt-6 px-2">
    <p class="font-semibold text-lg">Verified users</p>
    <p class="text-sm mt-2">
        Verified users may bypass some of the anti-abuse checks most users are subject to.
        <br />
        A user may be verified as long as JungleTV staff is sufficiently confident that their identity has no overlap with
        those assumed by any other users. Make sure to include all relevant references in the reason field.
    </p>
    <div class="mt-6 grid grid-rows-1 grid-cols-1 lg:grid-cols-2 gap-12 mb-8 max-w-screen-lg mx-auto">
        <div>
            <p class="font-semibold text-lg mb-2">Verify user</p>
            <div class="grid grid-cols-3 gap-6 max-w-screen-sm">
                <TextInput extraClasses="col-span-3" placeholder="Banano address" bind:value={verifyRewardAddress} />
                <div>
                    <input
                        id="skipClientIntegrityChecks"
                        name="skipClientIntegrityChecks"
                        type="checkbox"
                        bind:checked={skipClientIntegrityChecks}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                    <label for="skipClientIntegrityChecks" class="font-medium text-gray-700 dark:text-gray-300">
                        Allow corrupted clients
                    </label>
                </div>
                <div>
                    <input
                        id="skipIPAddressReputationChecks"
                        name="skipIPAddressReputationChecks"
                        type="checkbox"
                        bind:checked={skipIPAddressReputationChecks}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                    <label for="skipIPAddressReputationChecks" class="font-medium text-gray-700 dark:text-gray-300">
                        Allow VPNs
                    </label>
                </div>
                <div>
                    <input
                        id="reduceHardChallengeFrequency"
                        name="reduceHardChallengeFrequency"
                        type="checkbox"
                        bind:checked={reduceHardChallengeFrequency}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                    <label for="reduceHardChallengeFrequency" class="font-medium text-gray-700 dark:text-gray-300">
                        Reduce captcha frequency
                    </label>
                </div>
                <TextInput extraClasses="col-span-3" placeholder="Reason for verification" bind:value={reason} />
                <ButtonButton type="submit" color="green" extraClasses="col-span-3" on:click={verifyUser}>
                    Verify user
                </ButtonButton>
                {#if verificationID != "" || verificationError != ""}
                    <div class="col-span-3">
                        {#if verificationID != ""}
                            Take note of the following ID:<br />{verificationID}
                        {/if}
                        {#if verificationError != ""}
                            <ErrorMessage>{verificationError}</ErrorMessage>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
        <div>
            <p class="font-semibold text-lg mb-2">Remove verification</p>
            <div class="grid grid-cols-1 gap-6 max-w-screen-sm">
                <TextInput extraClasses="col-span-3" placeholder="Verification ID" bind:value={removeVerificationID} />
                <TextInput
                    extraClasses="col-span-3"
                    placeholder="Reason for removing"
                    bind:value={removeVerificationReason}
                />
                <ButtonButton type="submit" color="blue" extraClasses="col-span-3" on:click={removeVerification}>
                    Remove verification
                </ButtonButton>
                {#if removeVerificationSuccessful || removeVerificationError != ""}
                    <div class="col-span-3">
                        {#if removeVerificationSuccessful}
                            <SuccessMessage>Verification removed successfully</SuccessMessage>
                        {/if}
                        {#if removeVerificationError != ""}
                            <ErrorMessage>{removeVerificationError}</ErrorMessage>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <PaginatedTable
        title={"Verified users"}
        column_count={4}
        error_message={"Error loading verified users"}
        no_items_message={"No verified users"}
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
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Verification ID</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Created</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Verified by</th>
            </tr>
            <tr
                class="border border-solid border-t-0 border-l-0 border-r-0
            bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
            text-xs uppercase whitespace-nowrap font-semibold text-left"
            >
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Perks</th>
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Address</th>
                <th colspan="2" class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Reason</th>
            </tr>
        </svelte:fragment>

        <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <UserVerificationTableItem verification={item} />
        </tbody>
    </PaginatedTable>
</div>
