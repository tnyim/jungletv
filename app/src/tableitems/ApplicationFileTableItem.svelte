<script lang="ts">
    import { apiClient } from "../api_client";
    import type { Application, ApplicationFile } from "../proto/application_editor_pb";
    import { formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let application: Application;
    export let file: ApplicationFile;
    export let updateDataCallback: () => void;

    async function deleteFile() {
        if (confirm("Are you sure you want to delete the file '" + file.getName() + "'?")) {
            try {
                await apiClient.deleteApplicationFile(application.getId(), file.getName());
                updateDataCallback();
            } catch (e) {
                alert("An error occurred: " + e);
            }
        }
    }

    async function cloneFileSameApp() {
        let name = prompt("Enter the name for the new file:");
        if (name === null) {
            return;
        }

        try {
            await apiClient.cloneApplicationFile(application.getId(), file.getName(), application.getId(), name);
            updateDataCallback();
        } catch (e) {
            alert("An error occurred when duplicating the file: " + e);
        }
    }

    async function cloneFileOtherApp() {
        let id = prompt("Enter the ID of the destination application:");
        if (id === null) {
            return;
        }

        let name = prompt("Enter the name for the new file:");
        if (name === null) {
            return;
        }

        try {
            await apiClient.cloneApplicationFile(application.getId(), file.getName(), id, name);
            updateDataCallback();
        } catch (e) {
            alert("An error occurred when duplicating the file: " + e);
        }
    }

    function getIconForType(t: string): string {
        if (t.startsWith("image/")) {
            return "fas fa-file-audio";
        }
        if (t.startsWith("video/")) {
            return "fas fa-file-video";
        }
        if (t.startsWith("audio/")) {
            return "fas fa-file-image";
        }
        switch (t) {
            case "text/csv":
                return "fas fa-file-csv";
            case "application/json":
                return "fas fa-file-alt";
            case "text/javascript":
                return "fas fa-file-code";
            default:
                return "fas fa-file";
        }
    }
</script>

<tr>
    <td
        class="border-t-0 pl-6 align-middle border-l-0 border-r-0 whitespace-nowrap text-gray-700 dark:text-white"
    >
        <i class={getIconForType(file.getType())} />
    </td>
    <td
        class="border-t-0 px-6 pl-2 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-bold"
    >
        {file.getName()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={file.getUpdatedBy()} />
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {file.getEditMessage()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDateForModeration(file.getUpdatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {file.getPublic() ? "Public" : "Internal"}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {#if application.getAllowFileEditing()}
            <a href={"/moderate/applications/" + application.getId() + "/files/" + file.getName()}>Edit</a><br />
        {/if}
        <span
            class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            tabindex="0"
            on:click={cloneFileSameApp}
        >
            Duplicate
        </span><br>
        <span
            class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            tabindex="0"
            on:click={cloneFileOtherApp}
        >
            Duplicate to another
        </span><br>
        <span
            class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            tabindex="0"
            on:click={deleteFile}
        >
            Delete
        </span>
    </td>
</tr>
