<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import { Application, RunningApplication } from "../proto/application_editor_pb";
    import type { PaginationParameters } from "../proto/common_pb";
    import ApplicationTableItem from "../tableitems/ApplicationTableItem.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";
    import RunningApplications from "./RunningApplications.svelte";

    export let searchQuery = "";
    let prevSearchQuery = "";
    let runningApplications: RunningApplication[] = [];
    let runningApplicationsSet: { [id: string]: boolean } = {};

    $: {
        let s = {};
        for (let application of runningApplications) {
            s[application.getApplicationId()] = true;
        }
        runningApplicationsSet = s;
    }

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[Application[], number]> {
        let resp = await apiClient.applications(searchQuery, pagParams);
        return [resp.getApplicationsList(), resp.getTotal()];
    }

    $: {
        if (searchQuery != prevSearchQuery) {
            cur_page = -1;
            prevSearchQuery = searchQuery;
        }
    }

    async function create() {
        let id = await modalPrompt(
            "Enter the ID for the new application:",
            "Create application",
            "",
            "",
            "Create",
            "Cancel"
        );
        if (id === null) {
            return;
        }

        try {
            await apiClient.getApplication(id);
            await modalAlert("An application with the same ID already exists");
            return;
        } catch {}

        let application = new Application();
        application.setId(id);
        application.setAllowFileEditing(true);
        try {
            await apiClient.updateApplication(application);
            cur_page = -1;
        } catch (e) {
            await modalAlert("An error occurred when creating the application: " + e);
        }
    }
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-lg p-2">
    <p class="mb-6">
        <a
            use:link
            href="/moderate"
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            Back to moderation dashboard
        </a>
        <button
            on:click={create}
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:underline
                bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500
                text-white focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg ease-linear transition-all duration-150"
        >
            Create application
        </button>
    </p>

    <RunningApplications bind:runningApplications />

    <PaginatedTable
        title={"Applications"}
        column_count={6}
        error_message={"Error loading applications"}
        no_items_message={"No applications"}
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
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Application ID</th>
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Updated by</th>
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Updated at</th>
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Properties</th>
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
            </tr>
        </svelte:fragment>

        <tbody slot="item" let:item let:updateDataCallback class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <ApplicationTableItem
                application={item}
                launched={runningApplicationsSet[item.getId()]}
                {updateDataCallback}
            />
        </tbody>
    </PaginatedTable>
</div>
