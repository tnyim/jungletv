<script lang="ts">
    import { apiClient } from "./api_client";
    import Chat from "./Chat.svelte";
    import { ForcedTicketEnqueueType } from "./proto/jungletv_pb";
    import Queue from "./Queue.svelte";

    let ticketID = "";

    async function enqueue() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.ENQUEUE);
    }
    async function playNext() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.PLAY_NEXT);
    }
    async function playNow() {
        await apiClient.forciblyEnqueueTicket(ticketID, ForcedTicketEnqueueType.PLAY_NOW);
    }

    async function setChatEnabled(enabled: boolean) {
        await apiClient.setChatSettings(enabled);
    }
</script>

<div class="flex-grow min-h-full">
    <div class="px-2 py-2">
        <p class="font-semibold text-lg">Forcibly enqueue ticket</p>
        <div class="grid grid-cols-6 gap-6">
            <input class="col-span-3" type="text" placeholder="ticket ID" bind:value={ticketID} />
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={enqueue}
            >
                Enqueue
            </button>
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={playNext}
            >
                Play next
            </button>
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={playNow}
            >
                Play now
            </button>
        </div>
    </div>
    <div class="mt-10">
        <p class="px-2 font-semibold text-lg">Queue</p>
        <Queue mode="moderation" />
    </div>
    <div class="mt-10">
        <p class="px-2 font-semibold text-lg">Chat</p>
        <div class="px-2 grid grid-cols-2 gap-6">
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => setChatEnabled(true)}
            >
                Enable chat
            </button>
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => setChatEnabled(false)}
            >
                Disable chat
            </button>
        </div>
        <Chat mode="moderation" />
    </div>
</div>
