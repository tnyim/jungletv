<script lang="ts">
    import { onDestroy } from "svelte";
    import { link } from "svelte-navigator";
    import { fade } from "svelte/transition";
    import { apiClient } from "./api_client";
    import { SkipAndTipStatus, SkipStatus } from "./proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "./rpcUtils";
    import { currentSubscription, darkMode, rewardAddress } from "./stores";
    import AddressBox from "./uielements/AddressBox.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import PointsIcon from "./uielements/PointsIcon.svelte";

    export let mode = "sidebar";

    let skipAndTipStatus: SkipAndTipStatus;
    let skipPercentage = "";

    consumeStreamRPCFromSvelteComponent(20000, 5000, apiClient.monitorSkipAndTip.bind(apiClient), handleStatusUpdated);

    function handleStatusUpdated(status: SkipAndTipStatus) {
        skipAndTipStatus = status;
        skipPercentage = Math.min(
            100,
            (Number(BigInt(skipAndTipStatus.getSkipBalance())) / Number(BigInt(skipAndTipStatus.getSkipThreshold()))) *
                100
        ).toString();
    }

    let errorMessage = "";
    let errorMessageUpsellPoints = false;
    let errorMessageTimeout: number;
    async function changeSkipTarget(increase: boolean) {
        try {
            await apiClient.increaseOrReduceSkipThreshold(increase);
        } catch (ex) {
            if (typeof errorMessageTimeout !== "undefined") {
                clearTimeout(errorMessageTimeout);
            }
            if (ex.includes("insufficient points balance")) {
                errorMessage = "You don't have sufficient points.";
                errorMessageUpsellPoints = true;
            } else {
                errorMessage = "Failed to change skip target.";
                errorMessageUpsellPoints = false;
                console.log(ex);
            }
            errorMessageTimeout = setTimeout(() => {
                errorMessage = "";
            }, 10000);
        }
    }

    onDestroy(() => {
        if (typeof errorMessageTimeout !== "undefined") {
            clearTimeout(errorMessageTimeout);
        }
    });

    $: skipTargetChangeCost = typeof $currentSubscription !== "undefined" && $currentSubscription != null ? 91 : 100;
    $: skipThreshold = skipAndTipStatus?.getSkipThreshold();
    $: rainBalance = skipAndTipStatus?.getRainBalance();
</script>

<div class="lg:overflow-y-auto overflow-x-hidden">
    {#if skipAndTipStatus === undefined}
        <div class="px-2 py-2">Loading...</div>
    {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_NO_MEDIA}
        <div class="px-2 py-2">
            Nothing to skip as nothing is playing.<br />
            {#if mode !== "popout"}
                <a href="/enqueue" use:link>Get something going</a>!
            {/if}
        </div>
    {:else}
        <div class="px-2 py-2">
            <h3 class="text-lg font-bold">Crowdfunded skipping</h3>
            {#if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_UNSKIPPABLE}
                <p>The currently playing content is unskippable; crowdfunded skipping is unavailable.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_START_OF_MEDIA_PERIOD}
                <p>Crowdfunded skipping is presently unavailable as the current content just started.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_END_OF_MEDIA_PERIOD}
                <p>Crowdfunded skipping is presently unavailable as the current content is about to end.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_UNAVAILABLE}
                <p>Crowdfunded skipping is presently unavailable for technical reasons.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_DISABLED}
                <p>Crowdfunded skipping is currently disabled.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_ALLOWED}
                <p>
                    The content will be skipped once the balance of the skip pool reaches
                    {#key skipThreshold}
                        <span in:fade|local={{ duration: 200 }}>
                            {apiClient.formatBANPrice(skipAndTipStatus.getSkipThreshold())} BAN</span
                        >{/key}.
                </p>
                <p class="text-xs mb-1">
                    The amount in the skip pool will be distributed among the active viewers at the end of the current
                    queue entry, regardless of whether it is skipped.
                </p>
                <div class="border-r border-black dark:border-white mb-1">
                    <div class="text-xs flex flex-row mt-1 justify-end pr-1">
                        {#key skipThreshold}
                            <div in:fade|local={{ duration: 200 }}>
                                {apiClient.formatBANPriceFixed(skipAndTipStatus.getSkipThreshold())} BAN
                            </div>
                        {/key}
                    </div>
                    <div class="relative mt-1">
                        <div class="overflow-hidden h-4 text-xs flex rounded-l bg-purple-200 dark:bg-purple-900">
                            <div
                                style="width: {skipPercentage}%"
                                class="shadow-none flex flex-col text-right whitespace-nowrap text-white text-shadow justify-center bg-purple-500 dark:bg-purple-400"
                            >
                                <div class="px-2">
                                    {apiClient.formatBANPriceFixed(skipAndTipStatus.getSkipBalance())} BAN
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {#if $rewardAddress != ""}
                    <div class="flex flex-row space-x-2 justify-center">
                        {#if skipAndTipStatus.getSkipThresholdReducible()}
                            <button
                                title="Reduce skip target for {skipTargetChangeCost} JP"
                                class="flex flex-col mb-1 p-1 rounded hover:shadow-sm
                                dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer
                                ease-linear transition-all duration-150"
                                on:click={() => changeSkipTarget(false)}
                            >
                                <div class="text-purple-700 dark:text-purple-500">Reduce skip target</div>
                                <div class="font-semibold">
                                    {skipTargetChangeCost}
                                    <PointsIcon />
                                </div>
                            </button>
                        {/if}
                        <button
                            title="Increase skip target for {skipTargetChangeCost} JP"
                            class="flex flex-col mb-1 p-1 rounded hover:shadow-sm
                                dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer
                                ease-linear transition-all duration-150"
                            on:click={() => changeSkipTarget(true)}
                        >
                            <div class="text-purple-700 dark:text-purple-500">Increase skip target</div>
                            <div class="font-semibold">
                                {skipTargetChangeCost}
                                <PointsIcon />
                            </div>
                        </button>
                    </div>
                {/if}
                {#if errorMessage != ""}
                    <div class="text-sm" transition:fade|local={{ duration: 200 }}>
                        <ErrorMessage>
                            {errorMessage}
                            {#if errorMessageUpsellPoints}
                                <div>
                                    <a use:link href="/points/frombanano">Get points with Banano</a>
                                </div>
                            {/if}
                        </ErrorMessage>
                    </div>
                {/if}
                <p class="mb-2">
                    To contribute towards skipping the currently playing content, use the following address:
                </p>
                <AddressBox
                    address={skipAndTipStatus.getSkipAddress()}
                    allowQR={true}
                    showBananoVaultLink={true}
                    qrCodeBackground={$darkMode ? "#111827" : "#FFFFFF"}
                    qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
                />
            {/if}
        </div>

        <div class="px-2 py-2 mt-4">
            <h3 class="text-lg font-bold">Community tipping</h3>
            <!-- svelte-ignore missing-declaration -->
            {#if Number(BigInt(skipAndTipStatus.getRainBalance())) > 0}
                <p>
                    This content will pay out an additional reward of
                    {#key rainBalance}
                        <span class="font-semibold text-xl" in:fade|local={{ duration: 200 }}>
                            {apiClient.formatBANPriceFixed(skipAndTipStatus.getRainBalance())} BAN</span
                        >{/key}, that will be distributed among active viewers at the end of the current queue entry.
                </p>
                <p class="mb-2">
                    Increase the additional reward for this queue entry by sending to the following address:
                </p>
            {:else}
                <p class="mb-2">
                    Make it rain among active viewers! Increase the rewards for this queue entry by sending BAN to the
                    following address:
                </p>
            {/if}
            <AddressBox
                address={skipAndTipStatus.getRainAddress()}
                allowQR={true}
                showBananoVaultLink={true}
                qrCodeBackground={$darkMode ? "#111827" : "#FFFFFF"}
                qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
            />
            <p class="text-xs mt-4">
                The user who enqueued the content will receive 20% of the community tip if they are registered to
                receive rewards and are currently watching JungleTV or have disconnected in the last 15 minutes.
            </p>
        </div>
    {/if}
</div>

<style lang="postcss">
    .text-shadow {
        text-shadow: 1px 1px black;
    }
</style>
