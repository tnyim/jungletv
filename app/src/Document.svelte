<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { mostRecentAnnouncement, unreadAnnouncement } from "./stores";
import { parseCompleteMarkdown } from "./utils";
    export let documentID = "";
    export let mode = "page";

    const registerFocus = function (el: HTMLElement) {
        if (mode == "page") {
            useFocus()(el);
        }
    };

    let documentPromise = apiClient.getDocument(documentID);

    $: if (documentID == "announcements") {
        unreadAnnouncement.set(false);
        localStorage.setItem("lastSeenAnnouncement", $mostRecentAnnouncement.toString());
    }

    if (documentID == "announcements") {
        mostRecentAnnouncement.subscribe((_) => {
            documentPromise = apiClient.getDocument(documentID);
        });
    }
</script>

<div class="flex-grow container mx-auto max-w-screen-md p-2 {mode == 'document' ? '' : 'pt-0'}">
    <span use:registerFocus class="hidden" />
    {#await documentPromise}
        <p>Loading content...</p>
    {:then d}
        {#if d.getFormat() == "markdown"}
            <div class="markdown-document {mode == 'sidebar' ? 'sidebar-document' : ''}">
                {@html parseCompleteMarkdown(d.getContent()) }
            </div>
        {:else if d.getFormat() == "html"}
            {@html d.getContent()}
        {/if}
    {:catch}
        <p>Content not available.</p>
    {/await}
</div>

<style>
    :global(.sidebar-document > :first-child) {
        margin-top: 0 !important;
    }
</style>
