<script lang="ts">
    import { navigate, link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import ErrorMessage from "./ErrorMessage.svelte";
    import PaginatedTable from "./PaginatedTable.svelte";
    import type { PaginationParameters, ReceivedReward, Withdrawal } from "./proto/jungletv_pb";

    import { rewardAddress, rewardBalance } from "./stores";
    import SuccessMessage from "./SuccessMessage.svelte";
    import ReceivedRewardTableItem from "./tableitems/ReceivedRewardTableItem.svelte";
    import WithdrawalTableItem from "./tableitems/WithdrawalTableItem.svelte";
    import WarningMessage from "./WarningMessage.svelte";
    import Wizard from "./Wizard.svelte";

    let pendingWithdrawal = false;
    let withdrawalPositionInQueue = 0;
    let withdrawalsInQueue = 0;

    let rewardInfoPromise = (async function () {
        try {
            let rewardInfo = await apiClient.rewardInfo();

            rewardAddress.update((_) => rewardInfo.getRewardAddress());
            rewardBalance.update((_) => rewardInfo.getRewardBalance());
            pendingWithdrawal = rewardInfo.getWithdrawalPending();
            if (rewardInfo.hasWithdrawalPositionInQueue()) {
                withdrawalPositionInQueue = rewardInfo.getWithdrawalPositionInQueue();
            }
            if (rewardInfo.hasWithdrawalsInQueue()) {
                withdrawalsInQueue = rewardInfo.getWithdrawalsInQueue();
            }
        } catch (ex) {
            console.log(ex);
            navigate("/rewards/address");
        }
    })();

    let withdrawClicked = false;
    let withdrawSuccessful = false;
    let withdrawFailed = false;
    async function withdraw() {
        if (withdrawClicked) {
            return;
        }
        withdrawFailed = false;
        withdrawSuccessful = false;
        withdrawClicked = true;
        try {
            await apiClient.withdraw();
            withdrawSuccessful = true;
            rewardBalance.update((_) => "0");
        } catch (e) {
            withdrawFailed = true;
            console.log(e);
        }
        withdrawClicked = false;
    }

    let cur_received_rewards_page = 0;
    async function getReceivedRewardsPage(pagParams: PaginationParameters): Promise<[ReceivedReward[], number]> {
        let resp = await apiClient.rewardHistory(pagParams);
        return [resp.getReceivedRewardsList(), resp.getTotal()];
    }

    let cur_withdrawals_page = 0;
    async function getWithdrawalsPage(pagParams: PaginationParameters): Promise<[Withdrawal[], number]> {
        let resp = await apiClient.withdrawalHistory(pagParams);
        return [resp.getWithdrawalsList(), resp.getTotal()];
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            At the end of every video, the amount paid to enqueue the video is distributed evenly among eligible users.
            To minimize the amount of Banano transactions caused by JungleTV, rewards are added to a balance before they
            are sent to you. You can wait for an automated withdrawal or withdraw manually at any time.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Some videos have e.g. regional restrictions and may not display for you. You will still be rewarded as long
            as you keep the JungleTV page open throughout the duration of the video.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            If you have watched multiple videos and have not received a reward, please confirm that you are not using a
            VPN or proxy and that you did not violate the <a use:link href="/guidelines">Guidelines</a>.
        </p>
    </div>
    <div slot="main-content">
        {#await rewardInfoPromise}
            <p>Loading...</p>
        {:then}
            <p class="text-lg font-semibold">Currently rewarding:</p>
            <p class="font-mono text-sm break-words">{$rewardAddress}</p>
            <p class="mt-2 mb-6">
                <a
                    use:link
                    href="/rewards/address"
                    class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg ease-linear transition-all duration-150"
                >
                    Change address
                </a>
            </p>
            {#if pendingWithdrawal}
                <WarningMessage>
                    A withdrawal is pending for your account. This usually takes some seconds to complete, and
                    occasionally can take some minutes. You'll be able to withdraw when it completes.
                    <br />
                    Your withdrawal is in position {withdrawalPositionInQueue} of {withdrawalsInQueue} withdrawals in queue
                    to be processed.
                </WarningMessage>
                <p class="text-lg font-semibold">Current balance:</p>
            {:else}
                <p class="text-lg font-semibold">Available to withdraw:</p>
            {/if}
            <p class="text-xl font-bold">
                {apiClient.formatBANPrice($rewardBalance)} BAN
            </p>
            {#if !pendingWithdrawal}
                <p class="mt-2 mb-6">
                    {#if withdrawSuccessful}
                        <SuccessMessage>
                            Withdraw request successful. You'll receive Banano in your account soon.
                        </SuccessMessage>
                    {:else if withdrawFailed}
                        <ErrorMessage>
                            Withdraw request failed. It is possible that a withdraw request is already in progress.
                            Please try again later.
                        </ErrorMessage>
                    {:else if parseFloat(apiClient.formatBANPrice($rewardBalance)) > 0}
                        <button
                            on:click={withdraw}
                            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:underline
                        {withdrawClicked
                                ? 'animate-pulse bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                                : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'}
                            text-white focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg ease-linear transition-all duration-150"
                        >
                            Withdraw
                        </button>
                    {/if}
                </p>
            {/if}
            <p class="mt-4">
                Withdrawals happen automatically when your balance reaches 10 BAN, or 24 hours after your last received
                reward, whichever happens first.
            </p>
        {/await}
    </div>
    <div slot="secondary_1">
        <PaginatedTable
            title={"Received rewards"}
            column_count={3}
            error_message={"Error loading received rewards"}
            no_items_message={"No rewards received yet"}
            data_promise_factory={getReceivedRewardsPage}
            bind:cur_page={cur_received_rewards_page}
        >
            <tr slot="thead">
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                >
                    Amount
                </th>
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
            bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                >
                    Received at
                </th>
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                >
                    Video
                </th>
            </tr>

            <tr slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
                <ReceivedRewardTableItem reward={item} />
            </tr>
        </PaginatedTable>
    </div>
    <div slot="secondary_2">
        <PaginatedTable
            title={"Completed withdrawals"}
            column_count={4}
            error_message={"Error loading completed withdrawals"}
            no_items_message={"No withdrawals"}
            data_promise_factory={getWithdrawalsPage}
            bind:cur_page={cur_withdrawals_page}
        >
            <tr slot="thead">
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                >
                    Amount
                </th>
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
            bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                >
                    Initiated at
                </th>
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                >
                    Completed
                </th>
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                />
            </tr>

            <tr slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
                <WithdrawalTableItem withdrawal={item} />
            </tr>
        </PaginatedTable>
    </div>
</Wizard>