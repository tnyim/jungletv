<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import marked from "marked/lib/marked.esm.js";
    const registerFocus = useFocus();

    export let documentID = "";

    let documentPromise = apiClient.getDocument(documentID);
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-md p-2">
    <span use:registerFocus class="hidden" />
    {#await documentPromise}
        <p>Loading content...</p>
    {:then d}
        {#if d.getFormat() == "markdown"}
            <div class="markdown-document">
                {@html marked.parse(d.getContent())}
            </div>
        {:else if d.getFormat() == "html"}
            {@html d.getContent()}
        {/if}
    {:catch}
        <p>Document not available.</p>
    {/await}
</div>
