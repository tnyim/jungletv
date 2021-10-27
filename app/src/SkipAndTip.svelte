<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount } from "svelte";
    import { SkipAndTipStatus, SkipStatus } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { link } from "svelte-navigator";
    import AddressBox from "./AddressBox.svelte";

    export const mode = "sidebar";

    let skipAndTipStatus: SkipAndTipStatus;
    let monitorSkipAndTipRequest: Request;
    let monitorSkipAndTipTimeoutHandle: number = null;
    let skipPercentage = "";
    onMount(monitorSkipAndTip);
    function monitorSkipAndTip() {
        monitorSkipAndTipRequest = apiClient.monitorSkipAndTip(handleStatusUpdated, (code, msg) => {
            setTimeout(monitorSkipAndTip, 5000);
        });
    }
    onDestroy(() => {
        if (monitorSkipAndTipRequest !== undefined) {
            monitorSkipAndTipRequest.close();
        }
        if (monitorSkipAndTipTimeoutHandle != null) {
            clearTimeout(monitorSkipAndTipTimeoutHandle);
        }
    });

    function monitorQueueTimeout() {
        if (monitorSkipAndTipRequest !== undefined) {
            monitorSkipAndTipRequest.close();
        }
        monitorSkipAndTip();
    }

    function handleStatusUpdated(status: SkipAndTipStatus) {
        if (monitorSkipAndTipTimeoutHandle != null) {
            clearTimeout(monitorSkipAndTipTimeoutHandle);
        }
        monitorSkipAndTipTimeoutHandle = setTimeout(monitorQueueTimeout, 20000);

        skipAndTipStatus = status;
        skipPercentage = Math.min(
            100,
            (Number(BigInt(skipAndTipStatus.getSkipBalance())) / Number(BigInt(skipAndTipStatus.getSkipThreshold()))) *
                100
        ).toString();
    }
</script>

<div class="lg:overflow-y-auto overflow-x-hidden">
    {#if skipAndTipStatus === undefined}
        <div class="px-2 py-2">Loading...</div>
    {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_NO_MEDIA}
        <div class="px-2 py-2">
            Nothing to skip as nothing is playing.<br />
            <a href="/enqueue" use:link>Get something going</a>!
        </div>
    {:else}
        <div class="px-2 py-2">
            <h3 class="text-lg font-bold">Crowdfunded skipping</h3>
            {#if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_UNSKIPPABLE}
                <p>The currently playing video is unskippable; crowdfunded skipping is unavailable.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_START_OF_MEDIA_PERIOD}
                <p>Crowdfunded skipping is presently unavailable as the current video just started.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_END_OF_MEDIA_PERIOD}
                <p>Crowdfunded skipping is presently unavailable as the current video is about to end.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_UNAVAILABLE}
                <p>Crowdfunded skipping is presently unavailable for technical reasons.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_DISABLED}
                <p>Crowdfunded skipping is currently disabled.</p>
            {:else if skipAndTipStatus.getSkipStatus() == SkipStatus.SKIP_STATUS_ALLOWED}
                <p>
                    The video will be skipped once the balance of the skip pool reaches
                    {apiClient.formatBANPrice(skipAndTipStatus.getSkipThreshold())} BAN.
                </p>
                <p class="text-xs mb-1">
                    The amount in the skip pool will be distributed among the active viewers at the end of the video,
                    regardless of whether the video is skipped.
                </p>
                <div class="border-r border-black dark:border-white">
                    <div class="text-xs flex flex-row mt-1 justify-end pr-1">
                        <div>{apiClient.formatBANPriceFixed(skipAndTipStatus.getSkipThreshold())} BAN</div>
                    </div>
                    <div class="relative mt-1">
                        <div class="overflow-hidden h-4 mb-4 text-xs flex rounded-l bg-purple-200 dark:bg-purple-900">
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
                <p class="mb-2">
                    If you think this video should be skipped, contribute to the pool by sending to the following
                    address:
                </p>
                <AddressBox address={skipAndTipStatus.getSkipAddress()} allowQR={true} showBananoVaultLink={true} />
            {/if}
        </div>

        <div class="px-2 py-2 mt-4">
            <h3 class="text-lg font-bold">Community tipping</h3>
            <!-- svelte-ignore missing-declaration -->
            {#if Number(BigInt(skipAndTipStatus.getRainBalance())) > 0}
                <p>
                    This video will pay out an additional reward of
                    <span class="font-semibold text-xl">
                        {apiClient.formatBANPriceFixed(skipAndTipStatus.getRainBalance())} BAN</span
                    >, that will be distributed among active viewers at the end of the video.
                </p>
                <p class="mb-2">Increase the additional reward for this video by sending to the following address:</p>
            {:else}
                <p class="mb-2">
                    Make it rain among active viewers! Increase the rewards for this video by sending BAN to the
                    following address:
                </p>
            {/if}
            <AddressBox address={skipAndTipStatus.getRainAddress()} allowQR={true} showBananoVaultLink={true} />
            <p class="text-xs mt-4">
                The user who enqueued the video will receive 20% of the community tip if they are registered to receive
                rewards and are currently watching JungleTV or have disconnected in the last 15 minutes.
            </p>
        </div>
    {/if}
</div>

<style lang="postcss">
    .text-shadow {
        text-shadow: 1px 1px black;
    }
</style>
