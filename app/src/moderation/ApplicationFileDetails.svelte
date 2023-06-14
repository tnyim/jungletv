<script lang="ts">
    import { onMount } from "svelte";
    import { apiClient } from "../api_client";
    import { closeModal } from "../modal/modal";
    import type { ApplicationFile } from "../proto/application_editor_pb";
    import ButtonButton from "../uielements/ButtonButton.svelte";

    export let resultCallback: (ApplicationFile) => void;
    export let file: ApplicationFile;

    let publicFile = false;
    let mimeType = "";
    onMount(() => {
        publicFile = file?.getPublic();
        mimeType = file?.getType();
    });

    async function updateProperties() {
        file.setPublic(publicFile);
        file.setType(mimeType);
        resultCallback(file);
    }

    function downloadFile(f: ApplicationFile) {
        let link = document.createElement("a");
        let a = f.getContent_asU8();
        let blob = new Blob([a.buffer.slice(a.byteOffset, a.byteLength + a.byteOffset)], {
            type: f.getType(),
        });
        link.download = f.getName();
        link.href = URL.createObjectURL(blob);
        link.addEventListener("onclick", () => URL.revokeObjectURL(link.href));
        link.click();
    }

    let typeInput: HTMLInputElement;

    function focusOnTypeEditing() {
        typeInput.focus();
        typeInput.select();
    }
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    <p class="text-xl font-semibold mb-4">File <span class="font-mono">{file.getName()}</span></p>
    {#await apiClient.getApplicationFile(file.getApplicationId(), file.getName())}
        <p>Loading...</p>
    {:then completeFile}
        <p>Size: {completeFile.getContent_asU8().byteLength} bytes</p>
        <p class="flex flex-row gap-2">
            <span>MIME type:</span>
            <button
                type="button"
                title="Edit nickname"
                on:click={focusOnTypeEditing}
                class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 self-center"
            >
                <i class="fas fa-edit" />
            </button>
            <input bind:this={typeInput} class="bg-transparent flex-grow" type="text" bind:value={mimeType} />
        </p>
        {#if completeFile.getType().startsWith("image/")}
            <p class="my-4 text-center max-w-xl max-h-96 flex justify-center">
                <img
                    src="data:{completeFile.getType()};base64,{completeFile.getContent_asB64()}"
                    alt={completeFile.getName()}
                    title={completeFile.getName()}
                    class="object-contain"
                />
            </p>
        {/if}
        <p>
            <ButtonButton on:click={() => downloadFile(completeFile)}>Download</ButtonButton>
        </p>
    {/await}

    <p class="mt-4">
        <input
            id="publicFile"
            name="publicFile"
            type="checkbox"
            bind:checked={publicFile}
            class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
        />
        <label for="publicFile" class="font-medium text-gray-700 dark:text-gray-300">
            Public (serve file over HTTP)
        </label>
    </p>
</div>
<div
    class="flex flex-row justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-black dark:text-gray-100 rounded-b-lg"
>
    <ButtonButton color="purple" on:click={closeModal}>Cancel</ButtonButton>
    <div class="flex-grow" />
    <ButtonButton type="submit" on:click={updateProperties}>Update</ButtonButton>
</div>
