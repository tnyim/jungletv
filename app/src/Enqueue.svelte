<script lang="ts">
    import { navigate } from "svelte-navigator";

    import EnqueueFailure from "./EnqueueFailure.svelte";
    import EnqueueMediaSelection from "./EnqueueMediaSelection.svelte";
    import EnqueuePayment from "./EnqueuePayment.svelte";
    import EnqueueSuccess from "./EnqueueSuccess.svelte";
    import type { EnqueueMediaResponse, EnqueueMediaTicket } from "./proto/jungletv_pb";

    let step = 0;
    let ticket: EnqueueMediaTicket;
    function onMediaSelected(event: CustomEvent<EnqueueMediaResponse>) {
        ticket = event.detail.getTicket();
        step = 1;
    }
    function onUserCanceled() {
        ticket = undefined;
        step = 0;
    }
    function onTicketPaid() {
        step = 2;
    }
    function onTicketExpired() {
        step = 3;
    }
</script>

<div class="md:grid md:grid-cols-3 md:gap-6 m-6 flex-grow container mx-auto max-w-screen-lg">
    {#if step == 0}
        <EnqueueMediaSelection on:mediaSelected={onMediaSelected} on:userCanceled={() => navigate("/")} />
    {:else if step == 1}
        <EnqueuePayment
            on:userCanceled={onUserCanceled}
            on:ticketPaid={onTicketPaid}
            on:ticketExpired={onTicketExpired}
            bind:ticket
        />
    {:else if step == 2}
        <EnqueueSuccess on:enqueueAnother={onUserCanceled} bind:ticket />
    {:else if step == 3}
        <EnqueueFailure on:enqueueAnother={onUserCanceled} bind:ticket />
    {/if}
</div>
