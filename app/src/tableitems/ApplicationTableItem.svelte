<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import type { Application } from "../proto/application_editor_pb";
    import { formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let application: Application;
    export let launched: boolean;
    export let updateDataCallback: () => void;

    let properties = "";

    $: {
        let p = [];
        if (!application.getAllowLaunching()) {
            p.push("Draft");
        }
        if (!application.getAllowFileEditing()) {
            p.push("Read-only");
        }
        if (application.getAutorun()) {
            p.push("Runs on start-up");
        }
        properties = p.join(", ");
    }

    async function deleteApplication() {
        if (
            (await modalPrompt(
                "Are you sure? This will permanently delete all current and past versions of the application.\nTo proceed, type the application ID '" +
                    application.getId() +
                    "':",
                `Delete application ${application.getId()}`,
                "",
                "",
                "Delete",
                "Cancel"
            )) == application.getId()
        ) {
            try {
                await apiClient.deleteApplication(application.getId());
                updateDataCallback();
            } catch (e) {
                await modalAlert("An error occurred: " + e);
            }
        }
    }

    async function cloneApplication() {
        let id = await modalPrompt("Enter the ID for the new application:", `Clone application ${application.getId()}`);
        if (id === null) {
            return;
        }

        try {
            await apiClient.cloneApplication(application.getId(), id);
            updateDataCallback();
        } catch (e) {
            await modalAlert("An error occurred when duplicating the application: " + e);
        }
    }

    async function launchApplication() {
        try {
            await apiClient.launchApplication(application.getId());
        } catch (e) {
            await modalAlert("An error occurred when launching the application: " + e);
        }
    }

    async function stopApplication() {
        try {
            await apiClient.stopApplication(application.getId());
        } catch (e) {
            await modalAlert("An error occurred when stopping the application: " + e);
        }
    }
</script>

<tr>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono"
    >
        {application.getId()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={application.getUpdatedBy()} />
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <span class="font-semibold">{application.getEditMessage()}</span><br />
        {formatDateForModeration(application.getUpdatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {properties}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"/moderate/applications/" + application.getId()} use:link>Edit</a><br />
        <button
            type="button"
            class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            on:click={cloneApplication}
        >
            Duplicate
        </button><br />
        <button
            type="button"
            class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            on:click={deleteApplication}
        >
            Delete
        </button>
        {#if application.getAllowLaunching() && !launched}
            <br /><button
                type="button"
                class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                on:click={launchApplication}
            >
                Launch
            </button>
        {/if}
        {#if launched}
            <br /><button
                type="button"
                class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                on:click={stopApplication}
            >
                Stop
            </button>
            <br />
            <a href={"/moderate/applications/" + application.getId() + "/console"} use:link>Console</a>
        {/if}
    </td>
</tr>
