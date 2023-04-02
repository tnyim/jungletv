<script lang="ts">
    import { DateTime } from "luxon";
    import { onDestroy } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import { link, navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { formatBANPriceFixed } from "./currency_utils";
    import type { ConvertBananoToPointsStatus } from "./proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "./rpcUtils";
    import { darkMode } from "./stores";
    import AddressBox from "./uielements/AddressBox.svelte";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import PointsIcon from "./uielements/PointsIcon.svelte";
    import WarningMessage from "./uielements/WarningMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";

    let status: ConvertBananoToPointsStatus;
    let disconnected = false;
    let timeRemainingFormatted = "";
    let updateTimeRemainingInterval: number;

    let requestController = consumeStreamRPCFromSvelteComponent<ConvertBananoToPointsStatus>(
        20000,
        5000,
        apiClient.convertBananoToPoints.bind(apiClient),
        (newStatus) => {
            disconnected = false;
            status = newStatus;
            updateTicketTimeRemaining();
        },
        (connected) => {
            disconnected = !connected;
        }
    );

    $: {
        if (typeof status !== "undefined" && status.getExpired() && disconnected) {
            // do not attempt to reconnect
            requestController?.disconnect();
        }
    }

    onDestroy(() => {
        if (updateTimeRemainingInterval !== undefined) {
            clearInterval(updateTimeRemainingInterval);
        }
    });

    function updateTicketTimeRemaining() {
        if (typeof updateTimeRemainingInterval === "undefined") {
            updateTimeRemainingInterval = setInterval(updateTicketTimeRemaining, 1000);
        }
        if (typeof status === "undefined") {
            timeRemainingFormatted = "?";
            return;
        }
        let endTime = DateTime.fromJSDate(status.getExpiration().toDate());
        let diff = endTime.diffNow();
        if (diff.toMillis() < -6000) {
            // surely by now we would have received an updated ticket with expired status
            disconnected = true;
        }
        timeRemainingFormatted = diff.toFormat("mm:ss");
    }
</script>

<Wizard>
    <div slot="step-info">
        <img src="/assets/brand/points.svg" alt="JungleTV Points" title="JungleTV Points" class="h-16" />
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Get points with Banano</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Banano spent on points is used to pay for JungleTV development and operational expenses.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            JungleTV Points are entirely separate from your BAN rewards balance.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            At this moment, points are not transferable between users. Points can't be exchanged to Banano.
        </p>
    </div>
    <div slot="main-content">
        {#if typeof status === "undefined"}
            <Moon size="28" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" />
        {:else if status.getExpired()}
            {#if status.getPointsConverted() > 0}
                <p class="mt-8">
                    The payment address has expired. You acquired
                    <span class="font-bold">{status.getPointsConverted()} <PointsIcon /></span>
                    using
                    <span class="font-semibold">{formatBANPriceFixed(status.getBananoConverted())} BAN</span>.
                </p>
            {:else}
                <ErrorMessage>
                    The payment address has expired. If you made a payment but it has not been taken into account, you
                    will receive a refund once the JungleTV team reviews your process. No action is needed on your part.
                </ErrorMessage>
            {/if}
        {:else}
            {#if disconnected}
                <div class="mb-8">
                    <WarningMessage>
                        Currently disconnected from the server and attempting to reconnect. If the problem persists,
                        reload the page. If you already paid,
                        <a use:link href="/points">check the points dashboard</a> to see if your points have been converted.
                    </WarningMessage>
                </div>
            {/if}
            <p>Send Banano to the following address in order to acquire JungleTV Points!</p>
            <p class="my-4 text-center text-xl font-semibold">
                0.01 BAN = 1 <PointsIcon />
                {#if status.getPointsConverted() > 0}
                    <br />
                    {formatBANPriceFixed(status.getBananoConverted())} BAN = {status.getPointsConverted()}
                    <PointsIcon />
                {/if}
            </p>
            <div class="mt-1 mb-4">
                <AddressBox
                    address={status.getPaymentAddress()}
                    allowQR={false}
                    showQR={true}
                    showBananoVaultLink={true}
                    qrCodeBackground={$darkMode ? "#1F2937" : "#FFFFFF"}
                    qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
                />
            </div>
            <p class="mt-8">
                You acquired <span class="font-bold">{status.getPointsConverted()} <PointsIcon /></span> using
                <span class="font-semibold">{formatBANPriceFixed(status.getBananoConverted())} BAN</span>. This payment
                address will expire in <span class="font-bold">{timeRemainingFormatted}</span>.
            </p>
            <p class="mt-4 font-semibold text-yellow-600 dark:text-yellow-400">
                Acquired points cannot be refunded. JungleTV Points can only be spent within JungleTV.
            </p>
        {/if}
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <div class="flex-grow" />
        <ButtonButton on:click={() => navigate("/points")}>Return to points dashboard</ButtonButton>
    </div>
</Wizard>
