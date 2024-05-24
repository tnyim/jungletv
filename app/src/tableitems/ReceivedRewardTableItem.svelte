<script lang="ts">
    import { DateTime } from "luxon";
    import { link } from "svelte-navigator";
    import { formatBANPriceFixed } from "../currency_utils";
    import { openUserProfile } from "../profile_utils";
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
        {#if reward.getPlayedMedia()?.hasYoutubeVideoData()}
            {@const d = reward.getPlayedMedia().getYoutubeVideoData()}
            <a href="https://youtube.com/watch?v={d.getId()}" target="_blank" rel="noopener">
                {d.getTitle()}
            </a>
        {:else if reward.getPlayedMedia()?.hasSoundcloudTrackData()}
            {@const d = reward.getPlayedMedia().getSoundcloudTrackData()}
            <a href={d.getPermalink()} target="_blank" rel="noopener">
                {d.getTitle()}
            </a>
        {:else if reward.getPlayedMedia()?.hasDocumentData()}
            {@const d = reward.getPlayedMedia().getDocumentData()}
            <a use:link href="/documents/{d.getId()}">
                {d.getTitle()}
            </a>
        {:else if reward.getPlayedMedia()?.hasApplicationPageData()}
            {@const d = reward.getPlayedMedia().getApplicationPageData()}
            {@const application = reward.getPlayedMedia().getRequestedBy()}
            {d.getTitle()} <span class="font-thin italic">from</span>
            <a use:link href="/profile/{d.getApplicationId()}">
                <button
                    class="hover:underline inline italic"
                    on:click|preventDefault={(e) => openUserProfile(d.getApplicationId())}
                >
                    {#if application?.hasNickname()}
                        {application.getNickname()}
                    {:else}
                        <span class="font-mono">{d.getApplicationId()}</span>
                    {/if}
                </button>
            </a>
        {/if}
    </td>
</tr>
