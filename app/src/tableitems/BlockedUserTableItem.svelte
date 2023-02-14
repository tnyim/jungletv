<script lang="ts">
    import { DateTime } from "luxon";
    import { apiClient } from "../api_client";
    import type { BlockedUser } from "../proto/jungletv_pb";
    import { blockedUsers } from "../stores";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let blockedUser: BlockedUser;
    export let updateDataCallback: () => void;

    function formatDate(date: Date): string {
        return (
            '<span class="whitespace-nowrap">' +
            DateTime.fromJSDate(date)
                .setLocale(DateTime.local().resolvedLocaleOpts().locale)
                .toLocal()
                .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) +
            "</span>"
        );
    }

    async function unblockUser() {
        await apiClient.unblockUser(blockedUser.getId());
        let bu = $blockedUsers;
        bu.delete(blockedUser.getBlockedUser().getAddress());
        $blockedUsers = bu;
        updateDataCallback();
    }
</script>

<tr>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={blockedUser.getBlockedUser()} />
    </td>
    <td class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white text-xs">
        {@html formatDate(blockedUser.getCreatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <button class="text-blue-600 dark:text-blue-400 hover:underline" type="button" on:click={unblockUser}>
            Unblock
        </button>
    </td>
</tr>
