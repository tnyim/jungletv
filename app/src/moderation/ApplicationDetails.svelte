<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import PaginatedTable from "../PaginatedTable.svelte";
    import type { Application, ApplicationFile } from "../proto/application_editor_pb";
    import type { PaginationParameters } from "../proto/common_pb";
    import ApplicationFileTableItem from "../tableitems/ApplicationFileTableItem.svelte";

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
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-lg p-2">
    <p class="mb-6">
        <a
            use:link
            href="/moderate/applications"
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            Back to application list
        </a>
    </p>

    {#if typeof application !== "undefined"}
        <p class="font-semibold text-lg">Application <span class="font-mono">{application.getId()}</span></p>

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
                    <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
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
