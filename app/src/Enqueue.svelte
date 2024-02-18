<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";

    import EnqueueFailure from "./EnqueueFailure.svelte";
    import EnqueueMediaSelection from "./EnqueueMediaSelection.svelte";
    import EnqueuePayment from "./EnqueuePayment.svelte";
    import EnqueueRafflePromotion from "./EnqueueRafflePromotion.svelte";
    import EnqueueSuccess from "./EnqueueSuccess.svelte";
    import {
        EnqueueMediaResponse,
        type EnqueueMediaRequest,
        type EnqueueMediaTicket,
        type OngoingRaffleInfo,
    } from "./proto/jungletv_pb";
    import type { MediaSelectionKind } from "./utils";

    let step = 0;
    let request: EnqueueMediaRequest;
    let ticket: EnqueueMediaTicket;
    let mediaKind: MediaSelectionKind = "video";
    function onMediaSelected(event: CustomEvent<EnqueueMediaResponse>) {
        [request, ticket] = [event.detail[0], event.detail[1].getTicket()];
        step = 1;
    }
    function onUserCanceled() {
        ticket = undefined;
        request = undefined;
        step = 0;
    }
    function onTicketPaid() {
        step = 2;
    }
    function onTicketFailed() {
        step = 3;
    }
    function onConnectionLost() {
        step = 4;
    }
    async function onFailureRetry() {
        if (typeof request === "undefined") {
            onUserCanceled();
            return;
        }
        // try enqueueing the same again and going straight into the payment step, if it fails, then revert to the first step
        try {
            let response = await apiClient.enqueueFromRequest(request);
            switch (response.getEnqueueResponseCase()) {
                case EnqueueMediaResponse.EnqueueResponseCase.TICKET:
                    ticket = response.getTicket();
                    step = 1;
                    break;
                default:
                    onUserCanceled();
                    return;
            }
        } catch {
            onUserCanceled();
        }
    }

    let ongoingRaffleInfo: OngoingRaffleInfo;

    $: {
        if (typeof ticket !== "undefined") {
            if (ticket.hasYoutubeVideoData()) {
                mediaKind = "video";
            } else if (ticket.hasSoundcloudTrackData()) {
                mediaKind = "track";
            } else if (ticket.hasDocumentData()) {
                mediaKind = "document";
            }
        }
    }

    onMount(async () => {
        let resp = await apiClient.ongoingRaffleInfo();
        if (resp.hasRaffleInfo()) {
            ongoingRaffleInfo = resp.getRaffleInfo();
        }
    });
</script>

{#if step == 0}
    <EnqueueMediaSelection on:mediaSelected={onMediaSelected} on:userCanceled={() => navigate("/")}>
        <svelte:fragment slot="raffle-info">
            {#if ongoingRaffleInfo !== undefined}
                <EnqueueRafflePromotion {ongoingRaffleInfo} />
            {/if}
        </svelte:fragment>
    </EnqueueMediaSelection>
{:else if step == 1}
    <EnqueuePayment
        on:userCanceled={onUserCanceled}
        on:ticketPaid={onTicketPaid}
        on:ticketExpired={onTicketFailed}
        on:ticketFailed={onTicketFailed}
        on:connectionLost={onConnectionLost}
        bind:ticket
        {mediaKind}
    >
        <svelte:fragment slot="raffle-info">
            {#if ongoingRaffleInfo !== undefined}
                <EnqueueRafflePromotion {ongoingRaffleInfo} />
            {/if}
        </svelte:fragment>
    </EnqueuePayment>
{:else if step == 2}
    <EnqueueSuccess on:enqueueAnother={onUserCanceled} bind:ticket {mediaKind}>
        <svelte:fragment slot="raffle-info">
            {#if ongoingRaffleInfo !== undefined}
                <EnqueueRafflePromotion {ongoingRaffleInfo} />
            {/if}
        </svelte:fragment>
    </EnqueueSuccess>
{:else if step == 3}
    <EnqueueFailure on:tryAgain={onFailureRetry} bind:ticket {mediaKind}>
        <svelte:fragment slot="raffle-info">
            {#if ongoingRaffleInfo !== undefined}
                <EnqueueRafflePromotion {ongoingRaffleInfo} />
            {/if}
        </svelte:fragment>
    </EnqueueFailure>
{:else if step == 4}
    <EnqueueFailure on:tryAgain={onFailureRetry} bind:ticket connectionLost={true} {mediaKind}>
        <svelte:fragment slot="raffle-info">
            {#if ongoingRaffleInfo !== undefined}
                <EnqueueRafflePromotion {ongoingRaffleInfo} />
            {/if}
        </svelte:fragment>
    </EnqueueFailure>
{/if}
