<script lang="ts">
    import { apiClient } from "./api_client";
    // @ts-ignore no type info available
    import { onDestroy } from "svelte";
    import { autoresize } from "svelte-textarea-autoresize";

    export let biography: string;
    export let isSelf: boolean;

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
    <span class="text-lg font-medium">About me</span>
</div>
{#if isSelf}
    <textarea
        style="resize: none;"
        use:autoresize
        class="w-full max-h-64 bg-transparent"
        placeholder="Tell the monkeys a little bit about yourself"
        maxlength="512"
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
