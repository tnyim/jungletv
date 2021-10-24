<script lang="ts">
    import { DateTime } from "luxon";
    import type { UserBan } from "../proto/jungletv_pb";
    import { copyToClipboard } from "../utils";

    export let ban: UserBan;
    export let updateDataCallback: () => void;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
    }

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
        {formatDate(ban.getBannedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white"
    >
        {#if ban.hasBannedUntil()}
            {formatDate(ban.getBannedUntil().toDate())}
        {:else}
            Indefinitely
        {/if}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white font-mono"
    >
        {ban.getBannedBy().getAddress().substr(0, 14)}
    </td>
</tr>
<tr>
    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm pb-4 pt-1 text-gray-700 dark:text-white">
        {formatScope()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pb-4 pt-1 text-gray-700 dark:text-white font-mono"
    >
        <img
            src="https://monkey.banano.cc/api/v1/monkey/{ban.getAddress()}?format=png"
            alt="&nbsp;"
            title=""
            class="inline h-7 -ml-1 -mt-4 -mb-3"
        />
        <span class="font-mono">{ban.getAddress().substr(0, 14)} </span>
        <span class="float-right">
            <i
                class="fas fa-copy cursor-pointer hover:text-purple-700 hover:dark:text-purple-500"
                title="Copy address"
                on:click={() => copyToClipboard(ban.getAddress())}
            />
        </span>
    </td>
    <td
        colspan="2"
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm pb-4 pt-1 text-gray-700 dark:text-white"
    >
        {ban.getReason()}
    </td>
</tr>
