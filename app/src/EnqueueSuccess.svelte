<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";
    import EnqueueTicketPreview from "./EnqueueTicketPreview.svelte";
    import type { EnqueueMediaTicket } from "./proto/jungletv_pb";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import Wizard from "./uielements/Wizard.svelte";
    import type { MediaSelectionKind } from "./utils";

    const dispatch = createEventDispatcher();

    export let ticket: EnqueueMediaTicket;
    export let mediaKind: MediaSelectionKind;

    function enqueueAnother() {
        dispatch("enqueueAnother");
    }

    function closeEnqueue() {
        navigate("/");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue a {mediaKind}</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">You just made JungleTV more interesting!</p>
    </div>
    <div slot="main-content">
        <EnqueueTicketPreview {ticket} />
        <p class="mt-8">{mediaKind == "video" ? "Video" : "Track"} enqueued successfully! Thank you!</p>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={enqueueAnother}>Enqueue another</ButtonButton>
        <span class="px-4 text-xs text-gray-400 flex-grow">
            Ticket ID: <span class="font-mono">{ticket.getId()}</span>
        </span>
        <ButtonButton type="submit" on:click={closeEnqueue}>Close</ButtonButton>
    </div>
    <div slot="extra_1">
        <slot name="raffle-info" />
    </div>
</Wizard>
