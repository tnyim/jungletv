<script lang="ts">
    import { link, navigate } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { modalAlert } from "../modal/modal";
    import type { RunningApplication, RunningApplications } from "../proto/application_editor_pb";
    import type { PaginationParameters } from "../proto/common_pb";
    import { consumeStreamRPCFromSvelteComponent } from "../rpcUtils";
    import DetailsButton from "../uielements/DetailsButton.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";
    import { formatDateForModeration } from "../utils";

    export let runningApplications: RunningApplication[] = [];

    let cur_page = -1;
    let resolveLoaderPromise = () => {};
    let loaderPromise = new Promise<void>((resolve, reject) => {
        resolveLoaderPromise = resolve;
    });

    consumeStreamRPCFromSvelteComponent(
        20000,
        5000,
        apiClient.monitorRunningApplications.bind(apiClient),
        handleRunningApplicationsUpdated,
    );

    function handleRunningApplicationsUpdated(applications: RunningApplications) {
        if (!applications.getIsHeartbeat()) {
            runningApplications = applications.getRunningApplicationsList();
            resolveLoaderPromise();
            cur_page = -1;
        }
    }

    async function getPage(pagParams: PaginationParameters): Promise<[RunningApplication[], number]> {
        await loaderPromise;
        return [runningApplications, runningApplications.length];
    }

    async function stopApplication(id: string) {
        try {
            await apiClient.stopApplication(id);
        } catch (e) {
            await modalAlert("An error occurred when stopping the application: " + e);
        }
    }
</script>

<PaginatedTable
    title={"Running applications"}
    column_count={5}
    per_page={Infinity}
    no_items_message={"No running applications"}
    data_promise_factory={getPage}
    bind:cur_page
>
    <tr
        slot="thead"
        class="border border-solid border-l-0 border-r-0
                bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
                text-xs uppercase whitespace-nowrap text-left"
    >
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Application ID</th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold">
            <p>Version</p>
            <p class="pt-2">Started at</p>
        </th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold">Published pages</th>
        <th class="px-4 sm:px-6 align-middle py-3 font-semibold" />
    </tr>

    <tbody slot="item" let:item={runningApplication} class="hover:bg-gray-200 dark:hover:bg-gray-700">
        <tr class="whitespace-nowrap text-gray-700 dark:text-white">
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 p-4 font-mono row-span-2">
                <a
                    href={"/moderate/applications/" + runningApplication.getApplicationId()}
                    use:link
                    class="text-gray-700 dark:text-white"
                >
                    {runningApplication.getApplicationId()}
                </a>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4">
                <p>{formatDateForModeration(runningApplication.getApplicationVersion().toDate())}</p>
                <p class="pt-2">{formatDateForModeration(runningApplication.getStartedAt().toDate())}</p>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4">
                <ul class="list-disc list-inside">
                    {#each runningApplication.getPublishedPageIdsList() as publishedPageID}
                        {@const pageURL = "/apps/" + runningApplication.getApplicationId() + "/" + publishedPageID}
                        {#if publishedPageID}
                            <li class="font-mono">
                                <a href={pageURL} use:link>{publishedPageID}</a>
                            </li>
                        {:else}
                            <li>
                                <a href={pageURL} use:link class="italic">Index</a>
                            </li>
                        {/if}
                    {:else}
                        None
                    {/each}
                </ul>
            </td>
            <td class="border-t-0 px-6 align-right border-l-0 border-r-0 p-4">
                <div class="flex flex-row justify-end">
                    <DetailsButton
                        label="Console"
                        iconClasses="fas fa-terminal"
                        on:click={() =>
                            navigate("/moderate/applications/" + runningApplication.getApplicationId() + "/console")}
                    />
                    <DetailsButton
                        label="Stop"
                        iconClasses="fas fa-stop"
                        colorClasses="text-yellow-700 dark:text-yellow-500"
                        on:click={() => stopApplication(runningApplication.getApplicationId())}
                    />
                </div>
            </td>
        </tr>
    </tbody>
</PaginatedTable>
