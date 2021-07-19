<script lang="ts">
    import { apiClient } from "./api_client";

    import type { Leaderboard } from "./proto/jungletv_pb";
    import { copyToClipboard } from "./utils";

    export let leaderboard: Leaderboard;

    function ordinalSuffix(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }
</script>

<div class="mt-2 mb-10">
    <h2 class="text-xl">{leaderboard.getTitle()}</h2>
    <table class="w-full border-collapse border-2 border-gray-500 p-2 mt-2">
        <thead>
            <tr class="border-b-2 border-gray-500">
                <th class="font-bold p-2">Place</th>
                <th class="font-bold p-2">User</th>
                {#each leaderboard.getValueTitlesList() as title}
                    <th class="font-bold p-2">{title}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each leaderboard.getRowsList() as row}
                <tr>
                    <td class="p-2 text-right">{ordinalSuffix(row.getPosition())}</td>
                    <td class="p-2">
                        <img
                            src="https://monkey.banano.cc/api/v1/monkey/{row.getAddress()}?format=png"
                            alt="&nbsp;"
                            title=""
                            class="inline h-7 -ml-1 -mt-4 -mb-3"
                        />
                        {#if row.hasNickname()}
                            <span class="font-semibold mr-4">{row.getNickname()}</span>
                        {/if}
                        <span class="font-mono">{row.getAddress().substr(0, 14)} </span>
                        <span class="float-right">
                            <i class="fas fa-copy cursor-pointer hover:text-purple-700 hover:dark:text-purple-500"
                            title="Copy address" on:click={() => copyToClipboard(row.getAddress())} />
                        </span>
                    </td>
                    {#each row.getValuesList() as value}
                        {#if value.hasAmount()}
                            <td class="p-2 text-right">
                                {apiClient.formatBANPriceFixed(value.getAmount())} BAN
                            </td>
                        {/if}
                    {/each}
                </tr>
            {:else}
                <tr>
                    <td colspan={2 + leaderboard.getValueTitlesList().length} class="p-2 text-center">
                        Nobody participated in this period.
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
