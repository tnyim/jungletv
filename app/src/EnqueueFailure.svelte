<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { EnqueueMediaTicket } from "./proto/jungletv_pb";
    import { navigate } from "svelte-navigator";
    import ErrorMessage from "./ErrorMessage.svelte";
    import Wizard from "./Wizard.svelte";
import EnqueueTicketPreview from "./EnqueueTicketPreview.svelte";

    const dispatch = createEventDispatcher();

    export let ticket: EnqueueMediaTicket;
    export let connectionLost = false;

    function enqueueAnother() {
        dispatch("enqueueAnother");
    }

    function closeEnqueue() {
        navigate("/");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue a video</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <strong>Beware:</strong> if you just paid before the prices expired, it is possible your video was enqueued anyway.
            Double-check before trying again!
        </p>
    </div>
    <div slot="main-content">
        <EnqueueTicketPreview {ticket} />
        <div class="mt-8">
            <ErrorMessage>
                {#if connectionLost}
                    Connection to the server lost. If you already paid, <strong
                        class="cursor-pointer hover:underline"
                        on:click={closeEnqueue}>Cancel</strong
                    > and check the queue to see if your video was enqueued.
                {:else}
                    Payment not received in time. If you did not make a payment yet, please try again.
                {/if}
            </ErrorMessage>
        </div>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={closeEnqueue}
        >
            Cancel
        </button>
        <span class="px-4 text-xs text-gray-400 flex-grow">
            Ticket ID: <span class="font-mono">{ticket.getId()}</span>
        </span>
        <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
            on:click={enqueueAnother}
        >
            Try again
        </button>
    </div>
</Wizard>
