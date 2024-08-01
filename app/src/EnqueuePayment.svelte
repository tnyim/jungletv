<script lang="ts">
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { DateTime } from "luxon";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import { apiClient } from "./api_client";
    import { formatPrice } from "./currency_utils";
    import EnqueueTicketPreview from "./EnqueueTicketPreview.svelte";
    import { EnqueueMediaTicket, EnqueueMediaTicketStatus } from "./proto/jungletv_pb";
    import { darkMode } from "./stores";
    import AddressBox from "./uielements/AddressBox.svelte";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import TabButton from "./uielements/TabButton.svelte";
    import WarningMessage from "./uielements/WarningMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";
    import type { MediaSelectionKind } from "./utils";

    const dispatch = createEventDispatcher();

    export let ticket: EnqueueMediaTicket;
    export let mediaKind: MediaSelectionKind;

    let monitorTicketRequest: Request;
    let ticketTimeRemainingFormatted = "";
    let updateTicketTimeRemainingInterval: number;
    let selectedPriceOption: "enqueue" | "next" | "skip" = "enqueue";
    let selectedPrice = "";

    interface PaymentInfo {
        getEnqueuePrice(): string;
        getPlayNextPrice(): string;
        getPlayNowPrice(): string;
        getPaymentAddress(): string;
    }
    let paymentInfo: PaymentInfo;

    let selectedCurrency: "BAN" | "XNO" = "BAN";

    $: {
        if (typeof ticket !== "undefined") {
            switch (selectedCurrency) {
                case "BAN":
                    paymentInfo = ticket;
                    break;
                case "XNO":
                    let found = false;
                    for (let d of ticket.getExtraCurrencyPaymentDataList()) {
                        if (d.getCurrencyTicker() == selectedCurrency) {
                            paymentInfo = d;
                            found = true;
                        }
                    }
                    if (!found) {
                        paymentInfo = undefined;
                    }
                    break;
            }
        }
    }
    $: {
        if (typeof paymentInfo !== "undefined") {
            switch (selectedPriceOption) {
                case "enqueue":
                    selectedPrice = paymentInfo.getEnqueuePrice();
                    break;
                case "next":
                    selectedPrice = paymentInfo.getPlayNextPrice();
                    break;
                case "skip":
                    selectedPrice = paymentInfo.getPlayNowPrice();
                    break;
            }
        }
    }

    onMount(() => {
        selectedPrice = ticket.getEnqueuePrice();
        monitorTicket();
    });
    async function monitorTicket() {
        updateTicketTimeRemaining();
        monitorTicketRequest = await apiClient.monitorTicket(ticket.getId(), handleTicketUpdated, (code, msg) => {
            setTimeout(monitorTicket, 5000);
        });
    }
    onDestroy(() => {
        if (updateTicketTimeRemainingInterval !== undefined) {
            clearInterval(updateTicketTimeRemainingInterval);
        }
        if (monitorTicketRequest !== undefined) {
            monitorTicketRequest.close();
        }
    });

    function updateTicketTimeRemaining() {
        let endTime = DateTime.fromJSDate(ticket.getExpiration().toDate());
        let diff = endTime.diffNow();
        if (diff.toMillis() < -6000) {
            // surely by now we would have received an updated ticket with expired status
            dispatch("connectionLost");
        }
        ticketTimeRemainingFormatted = diff.toFormat("mm:ss");
        if (updateTicketTimeRemainingInterval === undefined) {
            updateTicketTimeRemainingInterval = setInterval(updateTicketTimeRemaining, 1000);
        }
    }

    function handleTicketUpdated(t: EnqueueMediaTicket) {
        ticket = t;
        if (t.getStatus() == EnqueueMediaTicketStatus.EXPIRED) {
            dispatch("ticketExpired");
        } else if (t.getStatus() == EnqueueMediaTicketStatus.FAILED_INSUFFICIENT_POINTS) {
            dispatch("ticketFailed");
        } else if (t.getStatus() == EnqueueMediaTicketStatus.PAID) {
            dispatch("ticketPaid");
        }
    }

    function cancel() {
        dispatch("userCanceled");
    }

    function updateSelectedPrice(priceOption: typeof selectedPriceOption) {
        selectedPriceOption = priceOption;
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue a {mediaKind}</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Looks like this {mediaKind} can be played on JungleTV. The prices shown are valid for ten minutes, regardless
            of the changes in queue length and viewership during this period.
        </p>
        <p class="mt-1 md:mt-3 text-sm text-gray-600 dark:text-gray-400">
            In addition to the minimum price, there are two additional price tiers you can use to play the {mediaKind} sooner.
            Beware: these might not make much sense if the queue is already short!
        </p>
        <p class="mt-1 md:mt-3 text-sm text-gray-600 dark:text-gray-400">
            If you decide to enqueue the {mediaKind} right after the currently playing content, beware that until the current
            entry finishes playing, it is still possible for others to dethrone it by using the same option.
        </p>
    </div>
    <!-- if the ticket is paid/expired it'll be missing some fields this component needs -->
    <div slot="main-content">
        <EnqueueTicketPreview {ticket} />
        <div class="flex flex-row flex-wrap justify-center mt-4">
            <div class="text-lg py-1 px-1.5">Pay with</div>
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={selectedCurrency == "BAN"}
                on:click={() => (selectedCurrency = "BAN")}
            >
                <img src="/assets/3rdparty/banano-icon.svg" alt="Banano" class="h-4 inline align-baseline" />
                Banano
            </TabButton>
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={selectedCurrency == "XNO"}
                on:click={() => (selectedCurrency = "XNO")}
            >
                <img src="/assets/3rdparty/nano-icon.svg" alt="Nano" class="h-4 inline align-baseline" />
                Nano
            </TabButton>
        </div>
        {#if ticket.getStatus() == EnqueueMediaTicketStatus.ACTIVE && typeof paymentInfo !== "undefined"}
            <div class="text-center text-xs" style="min-height: 16px">
                {#if selectedCurrency !== "BAN"}
                    Conversion to Banano powered by <a
                        href="https://nanswap.com/?r=83940629260"
                        target="_blank"
                        rel="noopener">Nanswap</a
                    >
                {/if}
            </div>
            <div class="flex justify-center">
                <table>
                    <tbody>
                        {#if paymentInfo.getEnqueuePrice() != ""}
                            <tr>
                                <td class="text-right p-2">
                                    Minimum send of
                                    <span class="font-bold"
                                        >{formatPrice(
                                            paymentInfo.getEnqueuePrice(),
                                            selectedCurrency,
                                        )}&nbsp;{selectedCurrency}</span
                                    >
                                </td>
                                <td class="p-2">to add the {mediaKind} to the end of the queue</td>
                            </tr>
                        {/if}
                        {#if paymentInfo.getPlayNextPrice() != ""}
                            <tr>
                                <td class="text-right p-2">
                                    Send at least
                                    <span class="font-bold"
                                        >{formatPrice(
                                            paymentInfo.getPlayNextPrice(),
                                            selectedCurrency,
                                        )}&nbsp;{selectedCurrency}</span
                                    >
                                </td>
                                <td class="p-2">to place the {mediaKind} right after the current entry</td>
                            </tr>
                        {/if}
                        {#if paymentInfo.getPlayNowPrice() != ""}
                            <tr>
                                <td
                                    class="text-right p-2 {ticket.getCurrentlyPlayingIsUnskippable()
                                        ? 'line-through'
                                        : ''}"
                                >
                                    Send at least
                                    <span class="font-bold"
                                        >{formatPrice(
                                            paymentInfo.getPlayNowPrice(),
                                            selectedCurrency,
                                        )}&nbsp;{selectedCurrency}</span
                                    >
                                </td>
                                <td class="p-2 {ticket.getCurrentlyPlayingIsUnskippable() ? 'line-through' : ''}"
                                    >to skip the current content and play immediately</td
                                >
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
            <div class="my-4">
                <AddressBox
                    address={paymentInfo.getPaymentAddress()}
                    allowQR={false}
                    showQR={true}
                    showWebWalletLink={true}
                    paymentAmount={selectedPrice}
                    qrCodeBackground={$darkMode ? "#1F2937" : "#FFFFFF"}
                    qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
                >
                    <div class="justify-center flex flex-row space-x-4 mt-4">
                        {#if paymentInfo.getEnqueuePrice() != ""}
                            <div>
                                <input
                                    type="radio"
                                    id="enqueueoption"
                                    checked={selectedPriceOption == "enqueue"}
                                    on:change={() => updateSelectedPrice("enqueue")}
                                />
                                <label for="enqueueoption" class="font-semibold">
                                    {formatPrice(paymentInfo.getEnqueuePrice(), selectedCurrency)}
                                    {selectedCurrency}
                                </label>
                            </div>
                        {/if}
                        {#if paymentInfo.getPlayNextPrice() != ""}
                            <div>
                                <input
                                    type="radio"
                                    id="playnextoption"
                                    checked={selectedPriceOption == "next"}
                                    on:change={() => updateSelectedPrice("next")}
                                />
                                <label for="playnextoption" class="font-semibold">
                                    {formatPrice(paymentInfo.getPlayNextPrice(), selectedCurrency)}
                                    {selectedCurrency}
                                </label>
                            </div>
                        {/if}
                        {#if paymentInfo.getPlayNowPrice() != ""}
                            <div>
                                <input
                                    type="radio"
                                    id="skipoption"
                                    checked={selectedPriceOption == "skip"}
                                    on:change={() => updateSelectedPrice("skip")}
                                />
                                <label for="skipoption" class="font-semibold">
                                    {formatPrice(paymentInfo.getPlayNowPrice(), selectedCurrency)}
                                    {selectedCurrency}
                                </label>
                            </div>
                        {/if}
                    </div>
                </AddressBox>
            </div>
        {:else if ticket.getStatus() == EnqueueMediaTicketStatus.ACTIVE && typeof paymentInfo === "undefined"}
            <p class="text-center p-2 my-4">Payment with this currency currently unavailable.</p>
        {/if}
        {#if ticket.getUnskippable()}
            <div class="flex justify-center text-yellow-800 dark:text-yellow-400">
                <strong>Prices have been heavily increased as you wish for this {mediaKind} to be unskippable.</strong>
            </div>
        {/if}
        {#if ticket.getCurrentlyPlayingIsUnskippable()}
            <div class="mt-3">
                <WarningMessage>
                    The currently playing content is unskippable; even if you pay the price to play immediately, it will
                    still be enqueued to play after the current one.
                </WarningMessage>
            </div>
        {/if}
        <p class="mt-2">
            The amount sent will be distributed among those {mediaKind == "video" ? "watching" : "listening"} when this
            {mediaKind} plays.
        </p>
        <p class="mt-2">
            The prices and payment address are valid for <span class="font-bold">{ticketTimeRemainingFormatted}</span>.
        </p>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={cancel}>Cancel</ButtonButton>
        <span class="px-4 text-xs text-gray-400 grow">
            Ticket ID: <span class="font-mono">{ticket.getId()}</span>
        </span>
        <ButtonButton disabled colorClasses="bg-gray-300">
            <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
            Awaiting payment
        </ButtonButton>
    </div>
    <div slot="extra_1">
        <slot name="raffle-info" />
    </div>
</Wizard>
