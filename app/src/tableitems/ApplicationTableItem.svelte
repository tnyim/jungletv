<script lang="ts">
    import { DateTime } from "luxon";
    import { apiClient } from "../api_client";
    import type { Application } from "../proto/application_editor_pb";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let application: Application;
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

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
    }

    async function deleteApplication() {
        if (
            prompt(
                "Are you sure? This will permanently delete all current and past versions of the application.\nTo proceed, type the application ID '" +
                    application.getId() +
                    "':"
            ) == application.getId()
        ) {
            try {
                await apiClient.deleteApplication(application.getId());
                updateDataCallback();
            } catch (e) {
                alert("An error occurred: " + e);
            }
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
        {application.getEditMessage()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDate(application.getUpdatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {properties}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"/moderate/applications/" + application.getId()}>Edit</a><br />
        <span
            class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            tabindex="0"
            on:click={deleteApplication}
        >
            Delete
        </span>
        {#if application.getAllowLaunching()}
            <br /><a href={"#"}>Launch</a>
        {/if}
    </td>
</tr>
