<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { formatBANPriceFixed, isPriceZero } from "./currency_utils";
    import type { QueueEntry } from "./proto/jungletv_pb";
    import { buildMonKeyURL, getReadableUserString } from "./utils";

    export let entry: QueueEntry;
    export let mode: string;

    const dispatch = createEventDispatcher();
</script>

<p class="text-xs whitespace-nowrap">
    {#if entry.hasRequestedBy() && entry.getRequestedBy().getAddress() != ""}
        Enqueued by <img
            src={buildMonKeyURL(entry.getRequestedBy().getAddress())}
            alt="&nbsp;"
            class="inline h-7 w-7 -ml-1 -mt-4 -mb-3 -mr-1"
        />
        <span
            class={entry.getRequestedBy().hasNickname() ? "requester-user-nickname" : "requester-user-address"}
            style="font-size: 0.70rem;">{getReadableUserString(entry.getRequestedBy())}</span
        >
    {:else}
        Added by JungleTV {#if isPriceZero(entry.getRequestCost())}(no reward){/if}
    {/if}
    {#if mode == "moderation"}
        | Request cost: {formatBANPriceFixed(entry.getRequestCost())} BAN |
        <button class="text-blue-600 hover:underline cursor-pointer" on:click={() => dispatch("remove", entry)}>
            Remove
        </button>
        {#if entry.hasYoutubeVideoData()}
            |
            <button class="text-blue-600 hover:underline cursor-pointer" on:click={() => dispatch("disallow", entry)}>
                Remove and disallow video
            </button>
        {:else if entry.hasSoundcloudTrackData()}
            |
            <button class="text-blue-600 hover:underline cursor-pointer" on:click={() => dispatch("disallow", entry)}>
                Remove and disallow track
            </button>
        {/if}
    {/if}
</p>

<style lang="postcss">
    .requester-user-address {
        font-size: 0.7rem;
        @apply font-mono;
    }

    .requester-user-nickname {
        font-size: 0.8rem;
        @apply font-semibold;
    }
</style>
