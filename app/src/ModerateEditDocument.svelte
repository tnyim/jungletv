<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { Document } from "./proto/jungletv_pb";
    import marked from "marked/lib/marked.esm.js";

    export let documentID = "";
    let content = "";
    let editing = false;

    async function fetchDocument(): Promise<Document> {
        try {
            let response = await apiClient.getDocument(documentID);
            content = response.getContent();
            editing = true;
            return response;
        } catch {
            content = "";
            editing = false;
            return new Document();
        }
    }

    async function save() {
        let document = new Document();
        document.setId(documentID);
        document.setContent(content);
        document.setFormat("markdown");
        await apiClient.updateDocument(document);
        alert("Document updated");
        editing = true;
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-md p-2">
    <a
        use:link
        href="/moderate"
        class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
    >
        Back to moderation dashboard
    </a>
    <h1 class="text-lg mt-6">{editing ? "Edit" : "Create"} document <span class="font-mono">{documentID}</span></h1>
    <button
        type="submit"
        class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        on:click={save}
    >
        Save
    </button>
    {#await fetchDocument()}
        <p>Loading document...</p>
    {:then}
        <textarea class="w-full h-96 text-black font-mono" bind:value={content} />
        <h2 class="text-lg mt-6 text-center border-b border-gray-500">Preview</h2>
        <div class="markdown-document">
            {@html marked.parse(content)}
        </div>
    {/await}
</div>
