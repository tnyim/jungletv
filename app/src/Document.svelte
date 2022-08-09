<script lang="ts">
    import { onDestroy } from "svelte";

    import { useFocus } from "svelte-navigator";
    import type { Unsubscriber } from "svelte/store";
    import { apiClient } from "./api_client";
    import type { Document } from "./proto/jungletv_pb";
    import { mostRecentAnnouncement, unreadAnnouncement } from "./stores";
    import { parseCompleteMarkdown } from "./utils";
    export let documentID = "";
    export let mode: "page" | "sidebar" | "player" = "page";
    export let overrideDocument: Document = undefined;

    const registerFocus = function (el: HTMLElement) {
        if (mode == "page") {
            useFocus()(el);
        }
    };

    let documentPromise: Promise<Document>;

    function getDocumentPromise(documentID: string, override: Document): Promise<Document> {
        if (typeof override !== "undefined") {
            return (async function (): Promise<Document> {
                return override;
            })();
        }
        return apiClient.getDocument(documentID);
    }

    $: {
        documentPromise = getDocumentPromise(documentID, overrideDocument);
    }

    $: if (documentID == "announcements") {
        unreadAnnouncement.set(false);
        localStorage.setItem("lastSeenAnnouncement", $mostRecentAnnouncement.toString());
    }

    let mostRecentAnnouncementUnsubscribe: Unsubscriber;

    if (documentID == "announcements") {
        mostRecentAnnouncementUnsubscribe = mostRecentAnnouncement.subscribe((_) => {
            documentPromise = apiClient.getDocument(documentID);
        });
    } else if (typeof mostRecentAnnouncementUnsubscribe !== "undefined") {
        mostRecentAnnouncementUnsubscribe();
        mostRecentAnnouncementUnsubscribe = undefined;
    }

    onDestroy(() => {
        if (typeof mostRecentAnnouncementUnsubscribe !== "undefined") {
            mostRecentAnnouncementUnsubscribe();
        }
    });
</script>

<div class="flex-grow container mx-auto max-w-screen-md p-2 {mode == 'sidebar' ? 'pt-0' : ''}">
    <span use:registerFocus class="hidden" />
    {#if typeof documentPromise !== "undefined"}
        {#await documentPromise}
            <p>Loading content...</p>
        {:then d}
            {#if d.getFormat() == "markdown"}
                <div class="markdown-document {mode == 'sidebar' ? 'sidebar-document' : ''}">
                    {@html parseCompleteMarkdown(d.getContent())}
                </div>
            {:else if d.getFormat() == "html"}
                {@html d.getContent()}
            {/if}
        {:catch}
            <p>Content not available.</p>
        {/await}
    {/if}
</div>

<style>
    :global(.sidebar-document > :first-child) {
        margin-top: 0 !important;
    }
</style>
