<script lang="ts">
    import { apiClient } from "./api_client";
    // @ts-ignore no type info available
    import { onDestroy } from "svelte";
    import autosize from "svelte-autosize";

    export let biography: string;
    export let isSelf: boolean;
    export let isApplication: boolean;

    let editedBiography = "";
    $: editedBiography = biography;

    onDestroy(async () => {
        await editBiography();
    });

    let biographyTextArea: HTMLTextAreaElement;
    function focusOnBiographyEditing() {
        biographyTextArea.focus();
    }

    async function editBiography() {
        if (biography == editedBiography) {
            return;
        }
        await apiClient.setProfileBiography(editedBiography);
        biography = editedBiography;
    }

    // try to work around this bug https://github.com/jackmoore/autosize/issues/407
    const fixAutosize = (node: HTMLElement) => {
        Object.defineProperty(node.style, "overflow", {
            get: () => node.style.overflowY,
            set: (o) => (node.style.overflowY = o),
        });
    };
</script>

<div>
    {#if isSelf}
        <button
            type="button"
            title="Edit biography"
            class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 self-center mr-2"
            on:click={focusOnBiographyEditing}
        >
            <i class="fas fa-edit" />
        </button>
    {/if}
    {#if isApplication}
        <p class="text-sm font-semibold">
            This is an application running on the
            <a href="https://docs.jungletv.live" target="_blank" rel="noopener">JungleTV Application Framework</a>.
        </p>
        <p class="text-xs mb-4">
            Applications are able to add new pages to the JungleTV website, as well as interact with JungleTV features
            such as the queue and chat, much like regular users can. Applications can display their pages as additional
            sidebar tabs, enqueue them as if they were any other form of media, and even attach them to chat messages.
        </p>
        {#if biography != ""}
            <span class="text-lg font-medium">About this application</span>
        {/if}
    {:else}
        <span class="text-lg font-medium">About me</span>
    {/if}
</div>
{#if isSelf}
    <textarea
        style="resize: none;"
        use:fixAutosize
        use:autosize
        class="w-full max-h-64 bg-transparent"
        placeholder="Tell the monkeys a little bit about yourself"
        maxlength="512"
        rows="1"
        bind:this={biographyTextArea}
        bind:value={editedBiography}
        on:blur={editBiography}
    />
    <div class="flex flex-row justify-end">
        <div class="text-gray-600 dark:text-gray-400 text-xs">{editedBiography.length} / 512</div>
    </div>
{:else}
    {#each biography.split("\n") as line}
        {#if line == ""}
            <p>&nbsp;</p>
        {:else}
            <p>{line}</p>
        {/if}
    {/each}
{/if}
