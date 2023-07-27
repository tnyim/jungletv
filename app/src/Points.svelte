<script lang="ts">
    import { DateTime } from "luxon";
    import { Moon } from "svelte-loading-spinners";
    import { link, navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import type { PaginationParameters } from "./proto/common_pb";
    import type { PointsInfoResponse, PointsTransaction, SubscriptionDetails } from "./proto/jungletv_pb";
    import { currentSubscription, darkMode } from "./stores";
    import PointsTransactionTableItem from "./tableitems/PointsTransactionTableItem.svelte";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import PaginatedTable from "./uielements/PaginatedTable.svelte";
    import PointsIcon from "./uielements/PointsIcon.svelte";
    import Wizard from "./uielements/Wizard.svelte";
    import { hrefButtonStyleClasses } from "./utils";

    let pointsInfo: PointsInfoResponse;
    const subscriptionCost = 6900;

    $: currentlySubscribed = typeof $currentSubscription !== "undefined" && $currentSubscription != null;
    function canRenew(sub: SubscriptionDetails): boolean {
        if (!currentlySubscribed || sub == null) {
            return false;
        }
        let oneMonthFromNow = DateTime.now().plus({ months: 1 });
        let subUntil = DateTime.fromJSDate(sub.getSubscribedUntil().toDate());
        let subEndsAfterOneMonthFromNow = subUntil.diff(oneMonthFromNow).toMillis() > 0;
        return !subEndsAfterOneMonthFromNow;
    }
    $: canRenewSubscription = canRenew($currentSubscription);
    function checkCanSubscribe(i: PointsInfoResponse): boolean {
        return i.getBalance() >= subscriptionCost;
    }
    $: hasEnoughPointsToSubscribe = typeof pointsInfo !== "undefined" && checkCanSubscribe(pointsInfo);

    let pointsInfoPromise = async function () {
        try {
            pointsInfo = await apiClient.pointsInfo();
            $currentSubscription = pointsInfo.getCurrentSubscription();
        } catch (ex) {
            console.log(ex);
            navigate("/rewards/address");
        }
    };

    let cur_points_txs_page = 0;
    async function getPointsTransactionsPage(pagParams: PaginationParameters): Promise<[PointsTransaction[], number]> {
        let resp = await apiClient.pointsTransactions(pagParams);
        return [resp.getTransactionsList(), resp.getTotal()];
    }

    function formatSubscriptionDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOptions().locale)
            .toLocal()
            .toLocaleString(DateTime.DATE_MED);
    }

    async function subscribeOrExtendSubscription() {
        try {
            await apiClient.startOrExtendSubscription();
            await pointsInfoPromise();
            cur_points_txs_page = -1;
        } catch (ex) {
            console.log(ex);
        }
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
        {#await pointsInfoPromise()}
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
                    <li>Enqueuing content</li>
                    <li>Solving captchas as you watch JungleTV</li>
                </ul>
            </div>
            <div>
                <p class="text-lg font-semibold">Spending Points</p>
                <p>You can spend points by:</p>
                <ul class="list-disc list-outside" style="padding: 0 0 0 20px;">
                    <li>Sending GIFs in chat</li>
                    <li>Reordering queue entries</li>
                    <li>
                        Subscribing to
                        <span class="font-semibold text-green-600 dark:text-green-400">JungleTV Nice</span>
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
                        <a use:link href="/points/frombanano" class={hrefButtonStyleClasses()}>
                            Get points with Banano
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div slot="extra_2">
        <div class="shadow sm:rounded-md sm:overflow-hidden" id="nice">
            <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-4 sm:p-6">
                <p class="text-lg font-semibold text-green-600 dark:text-green-400">JungleTV Nice</p>
                <div class="flex flex-row gap-4 sm:gap-6 mb-4 align-center">
                    {#if currentlySubscribed}
                        <div class="font-semibold flex-grow self-center">
                            Subscribed to JungleTV Nice until
                            {formatSubscriptionDate($currentSubscription.getSubscribedUntil().toDate())}.
                            {#if canRenewSubscription && !hasEnoughPointsToSubscribe}
                                You do not have sufficient <PointsIcon /> to renew your subscription.
                            {/if}
                        </div>
                    {:else}
                        <div class="font-semibold flex-grow self-center">
                            Currently, you are not a JungleTV Nice member.
                            {#if !hasEnoughPointsToSubscribe}
                                You do not have sufficient <PointsIcon /> to become one.
                            {/if}
                        </div>
                    {/if}
                    <div>
                        {#if !currentlySubscribed && hasEnoughPointsToSubscribe}
                            <ButtonButton on:click={() => subscribeOrExtendSubscription()} extraClasses="flex-col">
                                <div>Become a <span class="font-semibold">Nice</span> member</div>
                                <div class="text-xs font-semibold">-{subscriptionCost} <PointsIcon /></div>
                            </ButtonButton>
                        {:else if canRenewSubscription && hasEnoughPointsToSubscribe}
                            <ButtonButton on:click={() => subscribeOrExtendSubscription()} extraClasses="flex-col">
                                <div>Extend membership by one month</div>
                                <div class="text-xs font-semibold">-{subscriptionCost} <PointsIcon /></div>
                            </ButtonButton>
                        {/if}
                    </div>
                </div>
                <p>
                    <span class="font-semibold">Nice</span> is a monthly subscription for JungleTV.
                    <span class="font-semibold">Nice</span> members enjoy exclusive perks:
                </p>
                <ul class="list-disc list-outside" style="padding: 0 0 0 20px;">
                    <li>Ability to use dozens more emotes in chat</li>
                    <li>Reduced <PointsIcon /> costs on actions that require them</li>
                    <li>Greatly reduced captcha frequency</li>
                </ul>
                <p>
                    <span class="font-semibold">Nice</span> membership is exclusively obtainable in exchange for
                    JungleTV Points, with a cost of {subscriptionCost}
                    <PointsIcon /> per month.
                </p>
                <p class="text-sm">
                    Membership does not affect the Banano rewards or other extra rewards, like NFTs, received by
                    watching JungleTV and participating in events. Member status does not circumvent moderation measures
                    applied to users' accounts by the team. Memberships, like other points transactions, are not
                    refundable.
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
