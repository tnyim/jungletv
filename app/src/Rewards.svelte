<script lang="ts">
    import { navigate, link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import ErrorMessage from "./ErrorMessage.svelte";

    import { rewardAddress, rewardBalance } from "./stores";
    import SuccessMessage from "./SuccessMessage.svelte";
    import WarningMessage from "./WarningMessage.svelte";
    import Wizard from "./Wizard.svelte";

    let pendingWithdraw = false;

    let rewardInfoPromise = (async function () {
        try {
            let rewardInfo = await apiClient.rewardInfo();

            rewardAddress.update((_) => rewardInfo.getRewardAddress());
            rewardBalance.update((_) => rewardInfo.getRewardBalance());
            pendingWithdraw = rewardInfo.getWithdrawPending();
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
            <p class="font-mono text-sm">{$rewardAddress}</p>
            <p class="mt-2 mb-6">
                <a
                    use:link
                    href="/rewards/address"
                    class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg ease-linear transition-all duration-150"
                >
                    Change address
                </a>
            </p>
            {#if pendingWithdraw}
                <WarningMessage>
                    A withdrawal is pending for your account. This usually takes some seconds to complete, and
                    occasionally can take some minutes. You'll be able to withdraw when it completes.
                </WarningMessage>
                <p class="text-lg font-semibold">Current balance:</p>
            {:else}
                <p class="text-lg font-semibold">Available to withdraw:</p>
            {/if}
            <p class="text-xl font-bold">
                {apiClient.formatBANPrice($rewardBalance)} BAN
            </p>
            {#if !pendingWithdraw}
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
                            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md
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
                Withdraws happen automatically when your balance goes over 5 BAN, or 24 hours after your last received
                reward, whichever happens first.
            </p>
        {/await}
    </div>
    <div slot="buttons" />
</Wizard>
