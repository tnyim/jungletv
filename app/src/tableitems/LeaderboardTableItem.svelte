<script lang="ts">
    import { formatBANPriceFixed } from "../currency_utils";
    import type { LeaderboardRow } from "../proto/jungletv_pb";
    import { ordinalSuffix } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let row: LeaderboardRow;
</script>

<tr>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-2 text-gray-700 dark:text-white font-semibold text-right"
    >
        {ordinalSuffix(row.getPosition())}
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-2 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={row.getUser()} />
    </td>
    {#each row.getValuesList() as value}
        {#if value.hasAmount()}
            <td
                class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-2 text-gray-700 dark:text-white font-semibold"
            >
                {formatBANPriceFixed(value.getAmount())} BAN
            </td>
        {/if}
    {/each}
</tr>
