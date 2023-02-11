<script lang="ts">
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { onDestroy, onMount } from "svelte";
    import { apiClient } from "../api_client";
    import type { RunningApplication, RunningApplications } from "../proto/application_editor_pb";
    import { formatDateForModeration } from "../utils";

    export let runningApplications: RunningApplication[];
    let monitorRunningApplicationsRequest: Request;
    let monitorRunningApplicationsTimeoutHandle: number = null;

    onMount(monitorRunningApplications);
    function monitorRunningApplications() {
        monitorRunningApplicationsRequest = apiClient.monitorRunningApplications(
            handleRunningApplicationsUpdated,
            (code, msg) => {
                setTimeout(monitorRunningApplications, 5000);
            }
        );
    }
    onDestroy(() => {
        if (monitorRunningApplicationsRequest !== undefined) {
            monitorRunningApplicationsRequest.close();
        }
        if (monitorRunningApplicationsTimeoutHandle != null) {
            clearTimeout(monitorRunningApplicationsTimeoutHandle);
        }
    });

    function monitorRunningApplicationsTimeout() {
        if (monitorRunningApplicationsRequest !== undefined) {
            monitorRunningApplicationsRequest.close();
        }
        monitorRunningApplications();
    }

    function handleRunningApplicationsUpdated(applications: RunningApplications) {
        if (monitorRunningApplicationsTimeoutHandle != null) {
            clearTimeout(monitorRunningApplicationsTimeoutHandle);
        }
        monitorRunningApplicationsTimeoutHandle = setTimeout(monitorRunningApplicationsTimeout, 20000);
        if (!applications.getIsHeartbeat()) {
            runningApplications = applications.getRunningApplicationsList();
        }
    }
</script>

<p class="font-semibold text-lg">Running applications</p>
<div class="mb-4">
    {#if runningApplications === undefined}
        Loading...
    {:else}
        <ul class="list-disc list-inside">
            {#each runningApplications as runningApplication}
                <li>
                    <span class="font-mono">{runningApplication.getApplicationId()}</span>
                    version {formatDateForModeration(runningApplication.getApplicationVersion().toDate())}
                    started at {formatDateForModeration(runningApplication.getStartedAt().toDate())}
                </li>
            {:else}
                No applications running
            {/each}
        </ul>
    {/if}
</div>
