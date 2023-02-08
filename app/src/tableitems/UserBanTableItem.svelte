<script lang="ts">
    import { DateTime } from "luxon";
    import { openUserProfile } from "../profile_utils";
    import type { UserBan } from "../proto/jungletv_pb";
    import { buildMonKeyURL, formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let ban: UserBan;

    function formatScope(): string {
        let places = [];
        if (ban.getChatBanned()) {
            places.push("Chat");
        }
        if (ban.getEnqueuingBanned()) {
            places.push("Enqueuing");
        }
        if (ban.getRewardsBanned()) {
            places.push("Rewards");
        }
        return places.join(", ");
    }
</script>

<tr>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white font-mono"
    >
        {ban.getBanId()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white"
    >
        {formatDateForModeration(ban.getBannedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white"
    >
        {#if ban.hasBannedUntil()}
            {formatDateForModeration(ban.getBannedUntil().toDate())}
        {:else}
            Indefinitely
        {/if}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={ban.getBannedBy()} />
    </td>
</tr>
<tr>
    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm pb-4 pt-1 text-gray-700 dark:text-white">
        {formatScope()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pb-4 pt-1 text-gray-700 dark:text-white font-mono cursor-pointer"
        on:click={() => openUserProfile(ban.getAddress())}
    >
        <img src={buildMonKeyURL(ban.getAddress())} alt="&nbsp;" title="" class="inline h-7 w-7 -ml-1 -mt-4 -mb-3" />
        <span class="font-mono">{ban.getAddress().substring(0, 14)} </span>
    </td>
    <td
        colspan="2"
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm pb-4 pt-1 text-gray-700 dark:text-white"
    >
        {ban.getReason()}
    </td>
</tr>
