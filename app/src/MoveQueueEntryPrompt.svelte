<script lang="ts">
    import { Moon } from "svelte-loading-spinners";
    import { link } from "svelte-navigator";
    import QueueEntryHeader from "./QueueEntryHeader.svelte";
    import { apiClient } from "./api_client";
    import { closeModal } from "./modal/modal";
    import {
        PointsInfoResponse,
        QueueEntry,
        QueueEntryMovementDirection,
        QueueEntryMovementDirectionMap,
    } from "./proto/jungletv_pb";
    import { currentSubscription, darkMode } from "./stores";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import PointsIcon from "./uielements/PointsIcon.svelte";

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
            closeModal();
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
        <QueueEntryHeader {entry} isPlaying={false} mode="sidebar" showPosition={false} index={0} />
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
    <ButtonButton color="purple" on:click={closeModal}>Cancel</ButtonButton>
    <div class="flex-grow" />
    <ButtonButton on:click={move}>Move {dirString}</ButtonButton>
</div>
