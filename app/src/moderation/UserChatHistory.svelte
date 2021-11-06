<script lang="ts">
    import type { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

    import { DateTime, Info } from "luxon";
    import { createEventDispatcher } from "svelte";
    import { link } from "svelte-navigator";
    import About from "../About.svelte";
    import { apiClient } from "../api_client";

    import type { ChatMessage, Spectator } from "../proto/jungletv_pb";

    const dispatch = createEventDispatcher();

    export let address = "";
    export let mode = "page";

    async function fetchChatHistory(): Promise<ChatMessage[]> {
        let response = await apiClient.userChatMessages(address, 250);
        return response.getMessagesList();
    }

    function formatMessageTime(message: ChatMessage): string {
        return formatTimestamp(message.getCreatedAt());
    }
    function formatTimestamp(ts: Timestamp): string {
        return DateTime.fromJSDate(ts.toDate()).toLocal().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
    }

    async function resetSpectatorStatus() {
        try {
            await apiClient.resetSpectatorStatus(address);
            alert("Spectator status reset successfully");
        } catch (e) {
            alert("An error occurred: " + e);
        }
    }
</script>

<div class="{mode == 'sidebar' ? '' : 'm-6'} flex-grow container mx-auto max-w-screen-md p-2">
    {#if mode == "sidebar"}
        <p class="mb-6">
            <a
                href={"#"}
                class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                on:click={() => dispatch("closeTab")}
            >
                Close tab
            </a>
        </p>
    {:else}
        <a
            use:link
            href="/moderate"
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            Back to moderation dashboard
        </a>
    {/if}

    <div class="text-sm mt-8">
        {#await apiClient.spectatorInfo(address)}
            <p>Loading spectator information...</p>
        {:then spectator}
            <p>Number of connections: {spectator.getNumConnections()}</p>
            <p>Watching since: {formatTimestamp(spectator.getWatchingSince())}</p>
            <p>Using VPN: {spectator.getRemoteAddressCanReceiveRewards() ? "no" : "yes"}</p>
            {#if spectator.getLegitimate()}
                <p>Failed captcha: no</p>
            {:else}
                <p>Failed captcha: yes, at {formatTimestamp(spectator.getNotLegitimateSince())}</p>
            {/if}
            {#if spectator.hasStoppedWatchingAt()}
                <p>Stopped watching at: {formatTimestamp(spectator.getStoppedWatchingAt())}</p>
            {/if}
            {#if spectator.hasActivityChallenge()}
                <p>
                    Has pending activity challenge since:
                    {formatTimestamp(spectator.getActivityChallenge().getChallengedAt())}
                </p>
            {/if}
            <p class="mt-6 mb-4">
                <a
                    href={"#"}
                    class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    on:click={resetSpectatorStatus}
                >
                    Reset spectator status
                </a>
            </p>
        {:catch}
            <p>This address is not currently registered as a spectator.</p>
        {/await}
    </div>

    {#if mode != "sidebar"}
        <h1 class="text-lg mt-6">Chat message history for <span class="font-mono">{address}</span></h1>
    {/if}

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
