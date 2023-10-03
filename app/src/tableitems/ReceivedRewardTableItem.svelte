<script lang="ts">
    import { DateTime } from "luxon";
    import { link } from "svelte-navigator";
    import { formatBANPriceFixed } from "../currency_utils";
    import type { ReceivedReward } from "../proto/jungletv_pb";

    export let reward: ReceivedReward;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOptions().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    }
</script>

<tr>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-semibold"
    >
        {formatBANPriceFixed(reward.getAmount())} BAN
    </td>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDate(reward.getReceivedAt().toDate())}
    </td>
    <td class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 text-xs p-4 text-gray-700 dark:text-white">
        {#if reward.hasYoutubeVideoData()}
            <a href="https://youtube.com/watch?v={reward.getYoutubeVideoData().getId()}" target="_blank" rel="noopener">
                {reward.getYoutubeVideoData().getTitle()}
            </a>
        {:else if reward.hasSoundcloudTrackData()}
            <a href={reward.getSoundcloudTrackData().getPermalink()} target="_blank" rel="noopener">
                {reward.getSoundcloudTrackData().getTitle()}
            </a>
        {:else if reward.hasDocumentData()}
            <a use:link href="/documents/{reward.getDocumentData().getId()}">
                {reward.getDocumentData().getTitle()}
            </a>
        {:else if reward.hasApplicationPageData()}
            {reward.getApplicationPageData().getTitle()} <span class="font-thin">from</span>
            <span class="font-extralight mono">{reward.getApplicationPageData().getApplicationId()}</span>
        {/if}
    </td>
</tr>
