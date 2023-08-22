<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { getModalResult, modalAlert, modalConfirm, modalPrompt } from "../modal/modal";
    import ApplicationFileDetails from "../moderation/ApplicationFileDetails.svelte";
    import { mimeTypeIsEditable } from "../moderation/codeEditor";
    import type { Application, ApplicationFile } from "../proto/application_editor_pb";
    import DetailsButton from "../uielements/DetailsButton.svelte";
    import { formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let application: Application;
    export let file: ApplicationFile;
    export let updateDataCallback: () => void;

    async function deleteFile() {
        if (
            await modalConfirm(
                `Are you sure you want to delete the file ${file.getName()}?`,
                "Delete file?",
                `Delete ${file.getName()}`,
                "Cancel"
            )
        ) {
            try {
                await apiClient.deleteApplicationFile(application.getId(), file.getName());
                updateDataCallback();
            } catch (e) {
                await modalAlert("An error occurred: " + e);
            }
        }
    }

    async function cloneFileSameApp() {
        let name = await modalPrompt(
            "Enter the name for the new file:",
            `Clone ${file.getName()} into ${application.getId()}`
        );
        if (name === null) {
            return;
        }

        try {
            await apiClient.cloneApplicationFile(application.getId(), file.getName(), application.getId(), name);
            updateDataCallback();
        } catch (e) {
            await modalAlert("An error occurred when duplicating the file: " + e);
        }
    }

    async function cloneFileOtherApp() {
        let id = await modalPrompt("Enter the ID of the destination application:", `Clone ${file.getName()}`);
        if (id === null) {
            return;
        }

        let name = await modalPrompt("Enter the name for the new file:", `Clone ${file.getName()} into ${id}`);
        if (name === null) {
            return;
        }

        try {
            await apiClient.cloneApplicationFile(application.getId(), file.getName(), id, name);
            updateDataCallback();
        } catch (e) {
            await modalAlert("An error occurred when duplicating the file: " + e);
        }
    }

    async function updateFileProperties() {
        let result = await getModalResult<ApplicationFile>({
            component: ApplicationFileDetails,
            props: {
                file,
            },
        });
        if (result.result != "response") {
            return;
        }
        let updatedFile = result.response;

        let message = `Update ${updatedFile.getName()} properties`;
        message = await modalPrompt("Enter an edit message:", message, "", message);
        if (message === null) {
            return;
        }
        updatedFile.setEditMessage(message);

        try {
            await apiClient.updateApplicationFile(updatedFile);
            updateDataCallback();
        } catch (e) {
            await modalAlert("An error occurred when updating the file: " + e);
        }
    }

    function getIconForType(t: string): string {
        if (t.startsWith("image/")) {
            return "fas fa-file-image";
        }
        if (t.startsWith("video/")) {
            return "fas fa-file-video";
        }
        if (t.startsWith("audio/")) {
            return "fas fa-file-audio";
        }
        switch (t) {
            case "text/csv":
                return "fas fa-file-csv";
            case "text/plain":
            case "application/json":
                return "fas fa-file-alt";
            case "text/css":
            case "text/javascript":
            case "application/javascript":
            case "application/x-javascript":
            case "text/typescript":
            case "application/typescript":
            case "application/x-typescript":
                return "fas fa-file-code";
            default:
                return "fas fa-file";
        }
    }

    $: fileEditable = application.getAllowFileEditing() && mimeTypeIsEditable(file.getType());

    function fileClick() {
        if (fileEditable) {
            navigate("/moderate/applications/" + application.getId() + "/files/" + file.getName());
        } else {
            updateFileProperties();
        }
    }
</script>

<tr class="border-t border-gray-200 dark:border-gray-700 align-middle whitespace-nowrap text-gray-700 dark:text-white">
    <td class="pl-6 pt-4 text-gray-700 dark:text-white">
        <button type="button" on:click={fileClick}>
            <i class={getIconForType(file.getType())} />
        </button>
    </td>
    <td class="px-6 pl-2 pt-4 font-bold">
        <button type="button" on:click={fileClick}>
            {file.getName()}
        </button>
    </td>
    <td class="px-6 text-xs pt-4">
        <UserCellRepresentation user={file.getUpdatedBy()} />
    </td>
    <td class="px-6 text-xs pt-4">
        <span class="font-semibold">{file.getEditMessage()}</span><br />
        {formatDateForModeration(file.getUpdatedAt().toDate())}
    </td>
    <td class="px-6 text-xs pt-4">
        {file.getPublic() ? "Public" : "Internal"}
    </td>
</tr>
<tr class="border-t-0 px-6 align-middle whitespace-nowrap">
    <td colspan="5" class="p-4 pt-0">
        <div class="flex flex-row">
            <DetailsButton label="Details" iconClasses="fas fa-info-circle" on:click={updateFileProperties} />
            {#if fileEditable}
                <DetailsButton label="Edit" iconClasses="fas fa-edit" on:click={fileClick} />
            {/if}
            <div class="flex-grow" />
            <DetailsButton label="Duplicate" iconClasses="fas fa-copy" on:click={cloneFileSameApp} />
            <DetailsButton label="Duplicate to another" iconClasses="far fa-copy" on:click={cloneFileOtherApp} />
            <DetailsButton
                label="Delete"
                iconClasses="fas fa-trash"
                colorClasses="text-red-700 dark:text-red-500"
                on:click={deleteFile}
            />
        </div>
    </td>
</tr>
