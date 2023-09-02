<script lang="ts">
    import { link, navigate } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import type { Application } from "../proto/application_editor_pb";
    import DetailsButton from "../uielements/DetailsButton.svelte";
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
                "Are you sure? This will permanently delete all current and past versions of the application.\nAny FUNDS in the application wallet will also be LOST FOREVER.\n\nTo proceed, type the application ID '" +
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

<tr class="border-t border-gray-200 dark:border-gray-700 align-middle whitespace-nowrap text-gray-700 dark:text-white">
    <td class="px-6 pt-4 font-mono">
        <a href={"/moderate/applications/" + application.getId()} use:link class="text-gray-700 dark:text-white">
            {application.getId()}
        </a>
    </td>
    <td class="px-6 pt-4 text-xs">
        <UserCellRepresentation user={application.getUpdatedBy()} />
    </td>
    <td class="px-6 pt-4 text-xs">
        <span class="font-semibold">{application.getEditMessage()}</span><br />
        {formatDateForModeration(application.getUpdatedAt().toDate())}
    </td>
    <td class="px-6 pt-4 text-xs">
        {properties}
    </td>
</tr>
<tr class="border-t-0 px-6 align-middle whitespace-nowrap">
    <td colspan="4" class="p-4 pt-0">
        <div class="flex flex-row">
            <DetailsButton
                label="Edit"
                iconClasses="fas fa-edit"
                on:click={() => navigate("/moderate/applications/" + application.getId())}
            />
            <DetailsButton label="Duplicate" iconClasses="fas fa-copy" on:click={cloneApplication} />
            <DetailsButton
                label="Delete"
                iconClasses="fas fa-trash"
                colorClasses="text-red-700 dark:text-red-500"
                on:click={deleteApplication}
            />
            <div class="flex-grow" />
            {#if application.getAllowLaunching() && !launched}
                <DetailsButton
                    label="Launch"
                    iconClasses="fas fa-play"
                    colorClasses="text-green-700 dark:text-green-500"
                    on:click={launchApplication}
                />
            {/if}
            {#if launched}
                <DetailsButton
                    label="Console"
                    iconClasses="fas fa-terminal"
                    on:click={() => navigate("/moderate/applications/" + application.getId() + "/console")}
                />
                <DetailsButton
                    label="Stop"
                    iconClasses="fas fa-stop"
                    colorClasses="text-yellow-700 dark:text-yellow-500"
                    on:click={stopApplication}
                />
            {/if}
        </div>
    </td>
</tr>
