<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { apiClient } from "./api_client";
    import type { QueueEntry } from "./proto/jungletv_pb";
    import { buildMonKeyURL, formatQueueEntryThumbnailDuration, getReadableUserString } from "./utils";

    const dispatch = createEventDispatcher();

    export let entry: QueueEntry;
    export let isPlaying: boolean;
    export let mode: string;
</script>

<div class="flex-shrink-0 thumbnail mr-2" style="width: 120px">
    <div style="width: 120px; height: 90px; font-size: 65px;" class="flex flex-col justify-center text-center">
        <i class="fas fa-file-alt" />
    </div>
    {#if isPlaying}
        <div class="thumbnail-now-playing-overlay text-white flex flex-col place-content-center">
            <div style="width: auto;" class="flex flex-row place-content-center">
                <i class="fas fa-play text-5xl" />
            </div>
        </div>
    {/if}
    <div class="thumbnail-length-overlay text-white relative">
        <div
            class="absolute bottom-0.5 right-0.5 bg-black bg-opacity-80 px-1 py-0.5 font-bold rounded-sm"
            style="font-size: 0.7rem; line-height: 0.8rem;"
            title={formatQueueEntryThumbnailDuration(entry.getLength())}
        >
            {formatQueueEntryThumbnailDuration(entry.getLength(), entry.getOffset())}
        </div>
    </div>
</div>
<div class="flex flex-col flex-grow overflow-hidden">
    <p class="queue-entry-title break-words">
        {entry.getDocumentData().getTitle()}
        <br />
        <span class="text-xs text-gray-600 dark:text-gray-300 font-semibold">JungleTV Document</span>
    </p>
    <p class="text-xs whitespace-nowrap">
        {#if entry.hasRequestedBy() && entry.getRequestedBy().getAddress() != ""}
            Enqueued by <img
                src={buildMonKeyURL(entry.getRequestedBy().getAddress())}
                alt="&nbsp;"
                class="inline h-7 w-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
            />
            <span
                class="{entry.getRequestedBy().hasNickname()
                    ? 'requester-user-nickname'
                    : 'requester-user-address'} cursor-pointer"
                style="font-size: 0.70rem;">{getReadableUserString(entry.getRequestedBy())}</span
            >
        {:else}
            Added by JungleTV (no reward)
        {/if}
        {#if mode == "moderation"}
            | Request cost: {apiClient.formatBANPrice(entry.getRequestCost())} BAN |
            <span class="text-blue-600 hover:underline cursor-pointer" on:click={() => dispatch("remove", entry)}
                >Remove</span
            >
        {/if}
    </p>
</div>

<style lang="postcss" src="./styles/QueueEntryHeader.postcss"></style>
