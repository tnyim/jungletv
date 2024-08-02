<script lang="ts">
    import { DateTime } from "luxon";
    import type { Spectator } from "../proto/jungletv_pb";
    import { formatDateForModeration, formatMarkdownTimestamp } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let spectator: Spectator;
    export let relativeTimestamps: boolean;

    const formatDateRelative = (date: Date) => formatMarkdownTimestamp(DateTime.fromJSDate(date), "R");
    $: formatDate = relativeTimestamps ? formatDateRelative : formatDateForModeration;
    $: formatDateAlt = relativeTimestamps ? formatDateForModeration : formatDateRelative;
</script>

<tr class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white">
    <td class="px-6 align-middle whitespace-nowrap pt-4 pb-1">
        <UserCellRepresentation user={spectator.getUser()} />
    </td>
    <td
        class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1"
        title={formatDateAlt(spectator.getWatchingSince().toDate())}
    >
        {formatDate(spectator.getWatchingSince().toDate())}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1">
        {spectator.getNumConnections()}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1">
        {spectator.getNumSpectatorsWithSameRemoteAddress()}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1">
        {spectator.getRemoteAddressBannedFromRewards() ? "Yes" : "No"}
    </td>
</tr>
<tr class="text-gray-700 dark:text-white">
    <td class="px-6 align-middle text-xs whitespace-nowrap pb-4 pt-1">
        {#if spectator.hasAsNumber()}
            {spectator.getAsNumber()}
        {:else}
            Unknown
        {/if}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pb-4 pt-1">
        {!spectator.getRemoteAddressHasGoodReputation() ? "Yes" : "No"}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pb-4 pt-1">
        {spectator.getIpAddressReputationChecksSkipped() ? "Yes" : "No"}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pb-4 pt-1">
        {!spectator.getLegitimate() ? "Yes" : "No"}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pb-4 pt-1">
        {#if spectator.hasActivityChallenge()}
            Since
            <span title={formatDateAlt(spectator.getActivityChallenge().getChallengedAt().toDate())}>
                {formatDate(spectator.getActivityChallenge().getChallengedAt().toDate())}
            </span>
        {:else}
            No
        {/if}
    </td>
</tr>
