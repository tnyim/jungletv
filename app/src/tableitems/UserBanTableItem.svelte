<script lang="ts">
    import type { UserBan } from "../proto/jungletv_pb";
    import { formatDateForModeration } from "../utils";
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

<tr class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white">
    <td class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1 font-mono">
        {ban.getBanId()}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1">
        {formatDateForModeration(ban.getBannedAt().toDate())}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1">
        {#if ban.hasBannedUntil()}
            {formatDateForModeration(ban.getBannedUntil().toDate())}
        {:else}
            Indefinitely
        {/if}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1">
        <UserCellRepresentation user={ban.getBannedBy()} />
    </td>
</tr>
<tr class="text-gray-700 dark:text-white">
    <td class="px-6 align-middle text-sm pb-4 pt-1">
        {formatScope()}
    </td>
    <td class="px-6 align-middle text-xs whitespace-nowrap pb-4 pt-1 cursor-pointer">
        <UserCellRepresentation user={ban.getUser()} alwaysShowAddress={true} />
    </td>
    <td colspan="2" class="px-6 align-middle text-sm pb-4 pt-1">
        {ban.getReason()}
    </td>
</tr>
