<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import { Application, ApplicationFile } from "../proto/application_editor_pb";
    import type { PaginationParameters } from "../proto/common_pb";
    import ApplicationFileTableItem from "../tableitems/ApplicationFileTableItem.svelte";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";
    import { hrefButtonStyleClasses } from "../utils";

    export let searchQuery = "";
    let prevSearchQuery = "";

    export let application: Application = undefined;
    export let applicationID: string;

    $: {
        if (typeof application === "undefined" && applicationID != "") {
            fetchApplication(applicationID);
        }
    }

    async function fetchApplication(id: string) {
        application = await apiClient.getApplication(id);
        allowEditing = application.getAllowFileEditing();
        allowLaunching = application.getAllowLaunching();
        autorun = application.getAutorun();
    }

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[ApplicationFile[], number]> {
        let resp = await apiClient.applicationFiles(application.getId(), searchQuery, pagParams);
        return [resp.getFilesList(), resp.getTotal()];
    }

    $: {
        if (searchQuery != prevSearchQuery) {
            cur_page = -1;
            prevSearchQuery = searchQuery;
        }
    }

    let allowEditing = false;
    let allowLaunching = false;
    let autorun = false;

    let fileInput: HTMLInputElement;
    let uploadFiles: FileList;

    async function uploadFile() {
        let name = await modalPrompt(
            "Enter the name for the new file:\nNote: if you specify the name of an existing file, it will be updated.",
            "Upload file",
            "",
            uploadFiles[0].name
        );
        if (name === null) {
            return;
        }
        let type = await modalPrompt("Enter the MIME type for the new file:", "Upload file", "", uploadFiles[0].type);
        if (type === null) {
            return;
        }
        let message = await modalPrompt("Enter an edit message:", "Upload file", "", `Upload ${name}`);
        let file = new ApplicationFile();
        file.setApplicationId(application.getId());
        file.setName(name);
        file.setType(type);
        file.setContent(new Uint8Array(await uploadFiles[0].arrayBuffer()));
        file.setEditMessage(message);
        try {
            await apiClient.updateApplicationFile(file);
            cur_page = -1;
            fileInput.value = "";
            uploadFiles = undefined;
        } catch (e) {
            await modalAlert("An error occurred when uploading the file: " + e);
        }
    }

    async function updateProperties() {
        application.setAllowFileEditing(allowEditing);
        application.setAllowLaunching(allowLaunching);
        application.setAutorun(autorun);

        let message = await modalPrompt("Enter an edit message:", "Update application properties");
        if (message === null) {
            return;
        }
        application.setEditMessage(message);
        try {
            await apiClient.updateApplication(application);
            await fetchApplication(application.getId());
            cur_page = -1;
            fileInput.value = "";
            uploadFiles = undefined;
        } catch (e) {
            await modalAlert("An error occurred when updating the application: " + e);
        }
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-lg p-2">
    <p class="mb-6">
        <a use:link href="/moderate/applications" class={hrefButtonStyleClasses()}>Back to application list</a>
    </p>

    {#if typeof application !== "undefined"}
        <p class="font-semibold text-xl mb-4">Application <span class="font-mono">{application.getId()}</span></p>
        <div class="mb-4">
            <p>
                <input
                    id="allowEditing"
                    name="allowEditing"
                    type="checkbox"
                    bind:checked={allowEditing}
                    class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                />
                <label for="allowEditing" class="font-medium text-gray-700 dark:text-gray-300">Allow editing</label>
            </p>
            <p>
                <input
                    id="allowLaunching"
                    name="allowLaunching"
                    type="checkbox"
                    bind:checked={allowLaunching}
                    class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                />
                <label for="allowLaunching" class="font-medium text-gray-700 dark:text-gray-300">Allow launching</label>
            </p>
            <p>
                <input
                    id="autorun"
                    name="autorun"
                    type="checkbox"
                    bind:checked={autorun}
                    class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                />
                <label for="autorun" class="font-medium text-gray-700 dark:text-gray-300">Run on server start-up</label>
            </p>
            <p>
                <ButtonButton on:click={updateProperties}>Update properties</ButtonButton>
            </p>
        </div>
        <p class="font-semibold text-lg">Files</p>
        <p>
            <input type="file" bind:files={uploadFiles} bind:this={fileInput} />
            <ButtonButton
                on:click={uploadFile}
                disabled={!(uploadFiles && uploadFiles[0])}
                color={!(uploadFiles && uploadFiles[0]) ? "gray" : "yellow"}
            >
                Upload file
            </ButtonButton>
        </p>
        <div class="h-6" />
        <PaginatedTable
            title={"Files"}
            column_count={6}
            error_message={"Error loading files"}
            no_items_message={"No files"}
            data_promise_factory={getPage}
            bind:cur_page
            bind:search_query={searchQuery}
            show_search_box={true}
        >
            <svelte:fragment slot="thead">
                <tr
                    slot="thead"
                    class="border border-solid border-l-0 border-r-0
                        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
                        text-xs uppercase whitespace-nowrap text-left"
                >
                    <th class="pl-4 sm:pl-6 align-middle py-3 font-semibold" />
                    <th class="pr-4 sm:pr-6 pl-2 align-middle py-3 font-semibold">Name</th>
                    <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Updated by</th>
                    <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Updated at</th>
                    <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Public</th>
                    <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
                </tr>
            </svelte:fragment>

            <tbody slot="item" let:item let:updateDataCallback class="hover:bg-gray-200 dark:hover:bg-gray-700">
                <ApplicationFileTableItem {application} file={item} {updateDataCallback} />
            </tbody>
        </PaginatedTable>
    {/if}
</div>
