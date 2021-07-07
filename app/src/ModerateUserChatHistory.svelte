<script lang="ts">
    import { DateTime } from "luxon";
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";

    import type { ChatMessage } from "./proto/jungletv_pb";

    export let address = "";

    async function fetchChatHistory(): Promise<ChatMessage[]> {
        let response = await apiClient.userChatMessages(address, 250);
        return response.getMessagesList();
    }

    function formatMessageTime(message: ChatMessage): string {
        return DateTime.fromJSDate(message.getCreatedAt().toDate()).toLocal().toLocaleString(DateTime.DATETIME_FULL);
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-md p-2">
    <a
        use:link
        href="/moderate"
        class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
    >
        Back to moderation dashboard
    </a>
    <h1 class="text-lg mt-6">Chat message history for <span class="font-mono">{address}</span></h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
        The latest 250 messages are shown.<br />
        Messages that have been already deleted by moderators are not shown.<br />
        Times are shown in your local time.<br />
        Messages are shown as plain text, without applying any formatting.
    </p>
    {#await fetchChatHistory()}
        <p>Loading messages...</p>
    {:then messages}
        {#each messages as message}
            <p>
                {#if message.hasReference()}
                    <span class="text-xs mt-6">
                        <i class="fas fa-reply" />
                        <span class="font-mono" style="font-size: 0.70rem;"
                            >{message.getReference().getUserMessage().getAuthor().getAddress().substr(0, 14)}</span
                        >:
                        {message.getReference().getUserMessage().getContent()}
                    </span>
                    <br />
                {/if}
                <span class="font-mono text-xs">{formatMessageTime(message)}:</span>
                {message.getUserMessage().getContent()}
            </p>
        {:else}
            <p class="text-gray-600 dark:text-gray-400">No chat messages found for this user.</p>
        {/each}
    {/await}
</div>
