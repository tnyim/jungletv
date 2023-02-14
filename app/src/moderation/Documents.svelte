<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import type { PaginationParameters } from "../proto/common_pb";
    import type { DocumentHeader } from "../proto/jungletv_pb";
    import DocumentTableItem from "../tableitems/DocumentTableItem.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";

    export let searchQuery = "";
    let prevSearchQuery = "";

    let cur_page = 0;
    async function getPage(pagParams: PaginationParameters): Promise<[DocumentHeader[], number]> {
        let resp = await apiClient.documents(searchQuery, pagParams);
        return [resp.getDocumentsList(), resp.getTotal()];
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
            href="/moderate"
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            Back to moderation dashboard
        </a>
    </p>

    <PaginatedTable
        title={"Documents"}
        column_count={6}
        error_message={"Error loading documents"}
        no_items_message={"No documents"}
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
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Document ID</th>
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Updated by</th>
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Updated at</th>
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
                <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
            </tr>
        </svelte:fragment>

        <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <DocumentTableItem document={item} />
        </tbody>
    </PaginatedTable>
</div>
