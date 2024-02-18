<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";
    import EnqueueTicketPreview from "./EnqueueTicketPreview.svelte";
    import { EnqueueMediaTicket, EnqueueMediaTicketStatus } from "./proto/jungletv_pb";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";
    import type { MediaSelectionKind } from "./utils";

    const dispatch = createEventDispatcher();

    export let ticket: EnqueueMediaTicket;
    export let mediaKind: MediaSelectionKind;
    export let connectionLost = false;

    function tryAgain() {
        dispatch("tryAgain");
    }

    function closeEnqueue() {
        navigate("/");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue a {mediaKind}</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <strong>Beware:</strong> if you just paid before the prices expired, it is possible your {mediaKind} was enqueued
            anyway. Double-check before trying again!
        </p>
    </div>
    <div slot="main-content">
        <EnqueueTicketPreview {ticket} />
        <div class="mt-8">
            <ErrorMessage>
                {#if connectionLost}
                    Connection to the server lost. If you already paid,
                    <button type="button" class="cursor-pointer hover:underline" on:click={closeEnqueue}>Cancel</button>
                    and check the queue to see if your {mediaKind} was enqueued.
                {:else if ticket.getStatus() == EnqueueMediaTicketStatus.FAILED_INSUFFICIENT_POINTS}
                    Enqueuing failed because you don't have sufficient points to enqueue an entry with hidden media
                    information.<br />
                    Your payment should have been refunded.
                {:else}
                    Payment not received in time. If you did not make a payment yet, please try again.<br />
                    If you made a payment but it has not been taken into account, you will receive a refund once the JungleTV
                    team reviews your process. No action is needed on your part.
                {/if}
            </ErrorMessage>
        </div>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={closeEnqueue}>Cancel</ButtonButton>
        <span class="px-4 text-xs text-gray-400 grow">
            Ticket ID: <span class="font-mono">{ticket.getId()}</span>
        </span>
        <ButtonButton type="submit" on:click={tryAgain}>Try again</ButtonButton>
    </div>
    <div slot="extra_1">
        <slot name="raffle-info" />
    </div>
</Wizard>
