<script lang="ts">
    import { Moon } from "svelte-loading-spinners";
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import ErrorMessage from "./ErrorMessage.svelte";
    import PointsIcon from "./PointsIcon.svelte";
    import { PointsInfoResponse, QueueEntry, QueueEntryMovementDirection, QueueEntryMovementDirectionMap } from "./proto/jungletv_pb";
    import QueueEntryHeader from "./QueueEntryHeader.svelte";
    import { currentSubscription, darkMode, modal } from "./stores";

    export let direction: QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap];
    export let entry: QueueEntry;

    $: cost = typeof $currentSubscription !== "undefined" && $currentSubscription != null ? 69 : 119;

    let dirString = "";
    let errorMessage = "";

    $: {
        if (direction == QueueEntryMovementDirection.QUEUE_ENTRY_MOVEMENT_DIRECTION_UP) {
            dirString = "up";
        } else {
            dirString = "down";
        }
    }

    async function move() {
        try {
            await apiClient.moveQueueEntry(entry.getId(), direction);
            modal.set(null);
        } catch (ex) {
            if (ex.includes("insufficient points balance")) {
                errorMessage = "You don't have sufficient points to move this entry.";
            } else {
                errorMessage = "Failed to move queue entry.";
            }
        }
    }

    async function pointsPromise(): Promise<PointsInfoResponse> {
        let response = await apiClient.pointsInfo();
        $currentSubscription = response.getCurrentSubscription();
        return response;
    }
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    <p class="text-xl font-semibold mb-2">Move queue entry {dirString}?</p>
    <div class="mb-4 flex flex-row text-sm">
        <QueueEntryHeader {entry} isPlaying={false} mode="sidebar" />
    </div>
    <p>
        Moving this queue entry <span class="font-semibold">{dirString}</span> by one position will cost
        <span class="font-semibold">{cost} <PointsIcon /></span>.
    </p>
    <p>
        You currently have
        {#await pointsPromise()}
            <span class="inline-block">
                <Moon size="15" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" />
            </span>
        {:then response}
            <span class={response.getBalance() < cost ? "text-red" : ""}>{response.getBalance()}</span>
        {:catch}
            ?
        {/await}
        <PointsIcon />. <a use:link href="/points" class="text-sm">More information</a>
    </p>
    <p>Each user can move each queue entry only once.</p>
    {#if errorMessage != ""}
        <div class="mt-4">
            <ErrorMessage>
                {errorMessage}
            </ErrorMessage>
        </div>
    {/if}
</div>
<div
    class="flex flex-row justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-black dark:text-gray-100 rounded-b-lg"
>
    <button
        type="button"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
        on:click={() => modal.set(null)}
    >
        Cancel
    </button>
    <div class="flex-grow" />
    <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
        on:click={move}
    >
        Move {dirString}
    </button>
</div>
