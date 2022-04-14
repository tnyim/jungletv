<script lang="ts">
    import { Moon } from "svelte-loading-spinners";
    import { navigate, link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import PaginatedTable from "./PaginatedTable.svelte";
    import PointsIcon from "./PointsIcon.svelte";
    import type { PaginationParameters, PointsInfoResponse, PointsTransaction } from "./proto/jungletv_pb";
    import { darkMode } from "./stores";
    import PointsTransactionTableItem from "./tableitems/PointsTransactionTableItem.svelte";
    import Wizard from "./Wizard.svelte";

    let pointsInfo: PointsInfoResponse;

    let pointsInfoPromise = (async function () {
        try {
            pointsInfo = await apiClient.pointsInfo();
        } catch (ex) {
            console.log(ex);
            navigate("/rewards/address");
        }
    })();

    let cur_points_txs_page = 0;
    async function getPointsTransactionsPage(pagParams: PaginationParameters): Promise<[PointsTransaction[], number]> {
        let resp = await apiClient.pointsTransactions(pagParams);
        return [resp.getTransactionsList(), resp.getTotal()];
    }
</script>

<Wizard>
    <div slot="step-info">
        <img src="/assets/brand/points.svg" alt="JungleTV Points" title="JungleTV Points" class="h-16" />
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">JungleTV Points</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            JungleTV Points are an in-website balance that is tied to your rewards address. You receive points by using
            the website and participating in the community. You can then spend those points on features that require
            them, such as sending GIFs in chat.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            JungleTV Points are entirely separate from your BAN rewards balance.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            At this moment, points are not transferable between users.
        </p>
    </div>
    <div slot="main-content">
        <p class="text-lg font-semibold">Current points balance:</p>
        {#await pointsInfoPromise}
            <Moon size="28" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" />
        {:then}
            <p class="text-2xl sm:text-3xl">
                {pointsInfo.getBalance()}
                <PointsIcon />
            </p>
        {/await}
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <p class="text-lg font-semibold">Earning Points</p>
                <p>You can earn points by:</p>
                <ul class="list-disc list-outside" style="padding: 0 0 0 20px;">
                    <li>Participating meaningfully in chat</li>
                    <li>Enqueuing videos</li>
                    <li>Solving captchas as you watch JungleTV</li>
                </ul>
            </div>
            <div>
                <p class="text-lg font-semibold">Spending Points</p>
                <p>You can spend points by:</p>
                <ul class="list-disc list-outside" style="padding: 0 0 0 20px;">
                    <li>Sending GIFs in chat</li>
                    <li>
                        Subscribing to
                        <span class="font-semibold text-green-600 dark:text-green-400">JungleTV Nice</span>, an upcoming
                        monthly subscription.
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div slot="extra_1">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-4 sm:p-6">
                <div class="flex flex-row gap-4 sm:gap-6">
                    <div class="text-lg font-semibold flex-grow">
                        Insufficient <PointsIcon />? Here's a shortcut.
                    </div>
                    <div>
                        <a
                            use:link
                            href="/points/frombanano"
                            class="hover:no-underline justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg ease-linear transition-all duration-150 whitespace-nowrap"
                        >
                            Get points with Banano
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div slot="extra_2">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-4 sm:p-6">
                <p class="text-lg font-semibold text-green-600 dark:text-green-400">JungleTV Nice</p>
                <p>
                    <span class="font-semibold">Nice</span> is an upcoming monthly subscription for JungleTV.
                    <span class="font-semibold">Nice</span> members will get exclusive perks that will let them stand out
                    in the community and make the JungleTV experience more amenable.
                </p>
                <p>
                    Becoming a member will not affect the Banano rewards received by watching JungleTV and participating
                    in events.
                </p>
                <p>
                    <span class="font-semibold">Nice</span> membership will be exclusively obtainable in exchange for
                    JungleTV Points, with a projected cost of 6900 <PointsIcon /> per month.
                </p>
            </div>
        </div>
    </div>
    <div slot="extra_3">
        <PaginatedTable
            title={"Points transaction history"}
            column_count={3}
            error_message={"Error loading points transactions"}
            no_items_message={"No transactions yet"}
            data_promise_factory={getPointsTransactionsPage}
            bind:cur_page={cur_points_txs_page}
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
                    Happened at
                </th>
                <th
                    class="px-4 sm:px-6 align-middle border border-solid py-3 text-xs uppercase
                        border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                >
                    Type
                </th>
            </tr>

            <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
                <PointsTransactionTableItem tx={item} />
            </tbody>
        </PaginatedTable>
    </div>
</Wizard>
