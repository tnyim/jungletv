<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import marked from "marked/lib/marked.esm.js";
    const registerFocus = useFocus();

    export let documentID = "";
    export let mode = "page";

    let documentPromise = apiClient.getDocument(documentID);
</script>

<div class="flex-grow container mx-auto max-w-screen-md p-2 {mode == 'sidebar' ? "pt-0" : ""}">
    <span use:registerFocus class="hidden" />
    {#await documentPromise}
        <p>Loading content...</p>
    {:then d}
        {#if d.getFormat() == "markdown"}
            <div class="markdown-document {mode == "sidebar" ? "sidebar-document" : ""}">
                {@html marked.parse(d.getContent(), { tokenizer: undefined })}
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
