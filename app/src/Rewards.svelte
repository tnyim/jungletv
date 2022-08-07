<script lang="ts">
    import { navigate, link } from "svelte-navigator";
    import { Moon } from "svelte-loading-spinners";
    import AccountConnections from "./AccountConnections.svelte";
    import { apiClient } from "./api_client";
    import ErrorMessage from "./ErrorMessage.svelte";
    import PaginatedTable from "./PaginatedTable.svelte";
    import { openUserProfile } from "./profile_utils";
    import type {
        Connection,
        PaginationParameters,
        PointsInfoResponse,
        ReceivedReward,
        ServiceInfo,
        Withdrawal,
    } from "./proto/jungletv_pb";

    import { badRepresentative, currentSubscription, darkMode, rewardAddress, rewardBalance } from "./stores";
    import SuccessMessage from "./SuccessMessage.svelte";
    import ReceivedRewardTableItem from "./tableitems/ReceivedRewardTableItem.svelte";
    import WithdrawalTableItem from "./tableitems/WithdrawalTableItem.svelte";
    import WarningMessage from "./WarningMessage.svelte";
    import Wizard from "./Wizard.svelte";
    import { DateTime } from "luxon";

    let pendingWithdrawal = false;
    let withdrawalPositionInQueue = 0;
    let withdrawalsInQueue = 0;
    let connections: Connection[];
    let services: ServiceInfo[];

    let rewardInfoPromise = (async function () {
        try {
            let rewardInfo = await apiClient.rewardInfo();

            rewardAddress.update((_) => rewardInfo.getRewardsAddress());
            rewardBalance.update((_) => rewardInfo.getRewardBalance());
            badRepresentative.update((_) => rewardInfo.getBadRepresentative());
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

    async function loadConnections() {
        try {
            let r = await apiClient.connections();
            connections = r.getConnectionsList();
            services = r.getServiceInfosList();
        } catch (ex) {
            console.log(ex);
            navigate("/rewards/address");
        }
    }

    let connectionsPromise = loadConnections();

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

    async function pointsPromise(): Promise<PointsInfoResponse> {
        let response = await apiClient.pointsInfo();
        $currentSubscription = response.getCurrentSubscription();
        return response;
    }

    $: currentSubAboutToExpire =
        $currentSubscription != null &&
        DateTime.fromJSDate($currentSubscription.getSubscribedUntil().toDate()).diffNow().as("days") < 7;
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            When a queue entry finishes playing, the amount it cost to enqueue is distributed evenly among eligible users.
            To minimize the number of Banano transactions caused by JungleTV, rewards are added to a balance before they
            are sent to you. You can wait for an automated withdrawal or withdraw manually at any time.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Some content has e.g. regional restrictions and may not display for you. You will still be rewarded as long
            as you keep the JungleTV page open throughout the duration of the queue entry.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            If you have watched multiple pieces of content and have not received a reward, please confirm that you are not using a
            VPN or proxy and that you did not violate the <a use:link href="/guidelines">Guidelines</a>.
        </p>
    </div>
    <div slot="main-content">
        {#await rewardInfoPromise}
            <p><Moon size="28" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" /></p>
        {:then}
            <p class="text-lg font-semibold">Currently rewarding:</p>
            <p class="font-mono text-sm break-words">{$rewardAddress}</p>
            <div class="mt-2 mb-6">
                <a
                    use:link
                    href="/rewards/address"
                    class="hover:no-underline justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg ease-linear transition-all duration-150"
                >
                    Change address
                </a>
                <span
                    on:click={() => openUserProfile($rewardAddress)}
                    class="cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg ease-linear transition-all duration-150"
                >
                    View profile
                </span>
            </div>
            {#if pendingWithdrawal}
                <div class="mt-3">
                    <WarningMessage>
                        A withdrawal is pending for your account. This usually takes some seconds to complete, and
                        occasionally can take some minutes. You'll be able to withdraw when it completes.
                        <br />
                        Your withdrawal is in position {withdrawalPositionInQueue} of {withdrawalsInQueue} withdrawals in
                        queue to be processed.
                    </WarningMessage>
                </div>
                <p class="text-lg font-semibold">Current balance:</p>
            {:else}
                <p class="text-lg font-semibold">Available to withdraw:</p>
            {/if}
            <p class="text-2xl sm:text-3xl">
                {apiClient.formatBANPrice($rewardBalance)} <span class="text-xl">BAN</span>
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
    <div slot="extra_1">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6">
                <div class="flex flex-row gap-4 sm:gap-6 items-center">
                    <img src="/assets/brand/points.svg" alt="JungleTV Points" title="JungleTV Points" class="h-16" />
                    <div class="flex-grow">
                        <p class="text-lg font-semibold text-gray-800 dark:text-white">JungleTV Points</p>
                        <p class="text-sm">Participate in the community and earn points to spend in JungleTV.</p>
                        {#if typeof $currentSubscription !== "undefined" && $currentSubscription != null}
                            <p class="text-sm">
                                Your <span class="font-semibold text-green-500 dark:text-green-300">
                                    JungleTV Nice
                                </span>
                                membership gets you awesome perks{#if currentSubAboutToExpire}
                                    <span class="font-semibold text-red-600 dark:text-red-400">
                                        &nbsp;and is about to expire</span
                                    >{/if}.
                            </p>
                        {:else}
                            <p class="text-sm">
                                Upgrade to <span class="font-semibold text-green-500 dark:text-green-300">
                                    JungleTV Nice
                                </span> to get awesome perks!
                            </p>
                        {/if}
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div class="flex-grow">
                        You have
                        {#await pointsPromise()}
                            <span class="inline-block">
                                <Moon size="28" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" />
                            </span>
                        {:then response}
                            <span class="text-2xl sm:text-3xl">{response.getBalance()}</span>
                        {/await}
                        points.
                    </div>
                    <div class="flex flex-row gap-4 sm:gap-6">
                        <a
                            use:link
                            href="/points/frombanano"
                            class="hover:no-underline justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg ease-linear transition-all duration-150"
                        >
                            Get points with Banano
                        </a>
                        <span
                            on:click={() => navigate("/points")}
                            class="cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 hover:shadow-lg ease-linear transition-all duration-150"
                        >
                            Learn more
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div slot="extra_2">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6">
                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-3">
                        {#await connectionsPromise}
                            <p><Moon size="28" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" /></p>
                        {:then}
                            <AccountConnections {connections} {services} on:needsUpdate={loadConnections} />
                        {/await}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div slot="extra_3">
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
                    Media
                </th>
            </tr>

            <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
                <ReceivedRewardTableItem reward={item} />
            </tbody>
        </PaginatedTable>
    </div>
    <div slot="extra_4">
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

            <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
                <WithdrawalTableItem withdrawal={item} />
            </tbody>
        </PaginatedTable>
    </div>
</Wizard>
