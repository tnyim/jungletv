<script lang="ts">
    import { onMount } from "svelte";
    import { apiClient } from "../api_client";
    import type { ApplicationFile } from "../proto/application_editor_pb";
    import { modal } from "../stores";

    export let resultCallback: (ApplicationFile) => void;
    export let file: ApplicationFile;

    let publicFile = false;
    onMount(() => {
        publicFile = file?.getPublic();
    });

    async function updateProperties() {
        file.setPublic(publicFile);
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
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    <p class="text-xl font-semibold mb-4">File <span class="font-mono">{file.getName()}</span></p>
    {#await apiClient.getApplicationFile(file.getApplicationId(), file.getName())}
        <p>Loading...</p>
    {:then completeFile}
        <p>Size: {completeFile.getContent_asU8().byteLength} bytes</p>
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
            <button
                on:click={() => downloadFile(completeFile)}
                class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:underline
                    bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500
                    text-white focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg ease-linear transition-all duration-150"
            >
                Download
            </button>
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
    <button
        type="button"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
        on:click={() => modal.set(null)}
    >
        Cancel
    </button>
    <div class="flex-grow" />
    <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
        on:click={updateProperties}
    >
        Update
    </button>
</div>
