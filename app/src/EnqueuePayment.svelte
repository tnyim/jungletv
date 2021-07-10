<script lang="ts">
    import { apiClient } from "./api_client";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { EnqueueMediaTicket, EnqueueMediaTicketStatus } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { DateTime } from "luxon";
    import { Moon } from "svelte-loading-spinners";
    import AddressBox from "./AddressBox.svelte";
    import WarningMessage from "./WarningMessage.svelte";
    import Wizard from "./Wizard.svelte";

    const dispatch = createEventDispatcher();

    export let ticket: EnqueueMediaTicket;

    let monitorTicketRequest: Request;
    let ticketTimeRemainingFormatted = "";
    let updateTicketTimeRemainingTimeout = 0;
    let selectedPrice = "";

    onMount(() => {
        selectedPrice = ticket.getEnqueuePrice();
        monitorTicket();
    });
    function monitorTicket() {
        updateTicketTimeRemaining();
        monitorTicketRequest = apiClient.monitorTicket(ticket.getId(), handleTicketUpdated, (code, msg) => {
            setTimeout(monitorTicket, 5000);
        });
    }
    onDestroy(() => {
        clearTimeout(updateTicketTimeRemainingTimeout);
        if (monitorTicketRequest !== undefined) {
            monitorTicketRequest.close();
        }
    });

    function updateTicketTimeRemaining() {
        let endTime = DateTime.fromJSDate(ticket.getExpiration().toDate());
        ticketTimeRemainingFormatted = endTime.diff(DateTime.now()).toFormat("mm:ss");
        updateTicketTimeRemainingTimeout = setTimeout(updateTicketTimeRemaining, 1000);
    }

    function handleTicketUpdated(t: EnqueueMediaTicket) {
        ticket = t;
        if (t.getStatus() == EnqueueMediaTicketStatus.EXPIRED) {
            dispatch("ticketExpired");
        } else if (t.getStatus() == EnqueueMediaTicketStatus.PAID) {
            dispatch("ticketPaid");
        }
    }

    function cancel() {
        dispatch("userCanceled");
    }

    function updateSelectedPrice(price: string) {
        selectedPrice = price;
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue a video</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Looks like this video can be played on JungleTV. The prices shown are valid for two minutes, regardless of
            the changes in queue length and viewership during this period.
        </p>
        <p class="mt-1 md:mt-3 text-sm text-gray-600 dark:text-gray-400">
            In addition to the minimum price, there are two additional price tiers you can use to play the video sooner.
            Beware: these might not make much sense if the queue is already short!
        </p>
        <p class="mt-1 md:mt-3 text-sm text-gray-600 dark:text-gray-400">
            If you decide to enqueue the video right after the current one, beware that until the current video finishes
            playing, it is still possible for others to dethrone it by using the same option.
        </p>
    </div>
    <div slot="main-content">
        <div class="px-2 py-1 flex flex-row space-x-1 shadow-sm rounded-md border border-gray-300">
            <div class="w-32 flex-shrink-0">
                <img
                    alt="{ticket.getYoutubeVideoData().getTitle()} thumbnail"
                    src={ticket.getYoutubeVideoData().getThumbnailUrl()}
                />
            </div>
            <div class="flex flex-col flex-grow">
                <p>{ticket.getYoutubeVideoData().getTitle()}</p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{ticket.getYoutubeVideoData().getChannelTitle()}</p>
            </div>
        </div>
        <p class="mt-8">
            The video will be added to the queue once at least <span class="font-bold"
                >{apiClient.formatBANPrice(ticket.getEnqueuePrice())} BAN</span
            > is sent to the following address:
        </p>
        <div class="mt-1 mb-4">
            <AddressBox address={ticket.getPaymentAddress()} allowQR={false} showQR={true} qrAmount={selectedPrice} />
        </div>
        {#if ticket.getUnskippable()}
            <div class="flex justify-center text-yellow-800">
                <strong> Prices have been heavily increased as you wish for this video to be unskippable. </strong>
            </div>
        {/if}
        <div class="flex justify-center">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="radio"
                                checked={selectedPrice == ticket.getEnqueuePrice()}
                                on:change={() => updateSelectedPrice(ticket.getEnqueuePrice())}
                            />
                        </td>
                        <td class="text-right font-bold p-2">
                            Send {apiClient.formatBANPrice(ticket.getEnqueuePrice())} BAN
                        </td>
                        <td class="p-2">to add the video to the end of the queue</td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="radio"
                                checked={selectedPrice == ticket.getPlayNextPrice()}
                                on:change={() => updateSelectedPrice(ticket.getPlayNextPrice())}
                            />
                        </td>
                        <td class="text-right font-bold p-2">
                            Send {apiClient.formatBANPrice(ticket.getPlayNextPrice())} BAN
                        </td>
                        <td class="p-2">to play the video right after the current one</td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="radio"
                                checked={selectedPrice == ticket.getPlayNowPrice()}
                                on:change={() => updateSelectedPrice(ticket.getPlayNowPrice())}
                            />
                        </td>
                        <td
                            class="text-right font-bold p-2 {ticket.getCurrentlyPlayingIsUnskippable()
                                ? 'line-through'
                                : ''}"
                        >
                            Send {apiClient.formatBANPrice(ticket.getPlayNowPrice())} BAN
                        </td>
                        <td class="p-2 {ticket.getCurrentlyPlayingIsUnskippable() ? 'line-through' : ''}"
                            >to skip the current video and play immediately</td
                        >
                    </tr>
                </tbody>
            </table>
        </div>
        {#if ticket.getCurrentlyPlayingIsUnskippable()}
            <WarningMessage>
                The currently playing video is unskippable; even if you pay the price to play immediately, it will still
                be enqueued to play after the current one.
            </WarningMessage>
        {/if}
        <p class="mt-2">Sending more BAN will increase the rewards for viewers when watching this video.</p>
        <p class="mt-2">
            This price and address will expire in <span class="font-bold">{ticketTimeRemainingFormatted}</span>.
        </p>
    </div>
    <div slot="buttons">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={cancel}
        >
            Cancel
        </button>
        <span class="mt-10 text-xs text-gray-400">Ticket ID: <span class="font-mono">{ticket.getId()}</span></span>
        <button
            disabled
            class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-300 cursor-default"
        >
            <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
            Awaiting payment
        </button>
    </div>
</Wizard>
