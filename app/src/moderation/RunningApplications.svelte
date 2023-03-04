<script lang="ts">
    import { apiClient } from "../api_client";
    import type { RunningApplication, RunningApplications } from "../proto/application_editor_pb";
    import { consumeStreamRPCFromSvelteComponent } from "../rpcUtils";
    import { formatDateForModeration } from "../utils";

    export let runningApplications: RunningApplication[];

    consumeStreamRPCFromSvelteComponent(
        20000,
        5000,
        apiClient.monitorRunningApplications.bind(apiClient),
        handleRunningApplicationsUpdated
    );

    function handleRunningApplicationsUpdated(applications: RunningApplications) {
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
