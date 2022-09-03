<script lang="ts">
    import { DateTime } from "luxon";
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { openUserProfile } from "../profile_utils";
    import { PlayedMedia } from "../proto/jungletv_pb";
    import { buildMonKeyURL, formatQueueEntryThumbnailDuration } from "../utils";

    export let media: PlayedMedia;

    function formatDate(date: Date): string {
        return (
            '<span class="whitespace-nowrap">' +
            DateTime.fromJSDate(date)
                .setLocale(DateTime.local().resolvedLocaleOpts().locale)
                .toLocal()
                .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
                .replace(", ", ',</span><br><span class="whitespace-nowrap font-semibold">') +
            "</span>"
        );
    }

    function openProfile() {
        openUserProfile(media.getRequestedBy().getAddress());
    }
</script>

<tr>
    <td class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white text-xs">
        {@html formatDate(media.getStartedAt().toDate())}
    </td>
    <td class="align-middle text-gray-500 text-xs sm:text-sm md:text-base">
        {#if media.getMediaInfoCase() == PlayedMedia.MediaInfoCase.YOUTUBE_VIDEO_DATA}
            <i class="fab fa-youtube" />
            {#if media.getYoutubeVideoData().getLiveBroadcast()}
                <!-- this isn't used for now since we don't store this information with each played media -->
                <i class="fas fa-broadcast-tower" title="Live broadcast" />
            {/if}
        {:else if media.getMediaInfoCase() == PlayedMedia.MediaInfoCase.SOUNDCLOUD_TRACK_DATA}
            <i class="fab fa-soundcloud" />
        {:else if media.getMediaInfoCase() == PlayedMedia.MediaInfoCase.DOCUMENT_DATA}
            <i class="fas fa-file-alt" />
        {/if}
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white text-xs sm:text-sm md:text-base"
    >
        {#if media.getMediaInfoCase() == PlayedMedia.MediaInfoCase.YOUTUBE_VIDEO_DATA}
            <a
                href="https://youtube.com/watch?v={media.getYoutubeVideoData().getId()}{media.getOffset().getSeconds() >
                0
                    ? '&t=' + media.getOffset().getSeconds()
                    : ''}"
                target="_blank"
                rel="noopener"
            >
                {media.getYoutubeVideoData().getTitle()}
            </a>
        {:else if media.getMediaInfoCase() == PlayedMedia.MediaInfoCase.SOUNDCLOUD_TRACK_DATA}
            <a href={media.getSoundcloudTrackData().getPermalink()} target="_blank" rel="noopener">
                {media.getSoundcloudTrackData().getTitle()}
            </a>
        {:else if media.getMediaInfoCase() == PlayedMedia.MediaInfoCase.DOCUMENT_DATA}
            <a use:link href="/documents/{media.getDocumentData().getId()}">
                {media.getDocumentData().getTitle()}
            </a>
        {/if}
        {#if media.getEndedAt().toDate().getTime() - media.getStartedAt().toDate().getTime() < media
                .getLength()
                .getSeconds() * 1000 - 5000}
            <span class="text-xs uppercase font-semibold bg-yellow-600 text-white rounded p-0.5">Skipped</span>
        {/if}
        {#if media.getUnskippable()}
            <span class="text-xs uppercase font-semibold bg-purple-600 text-white rounded p-0.5">Unskippable</span>
        {/if}
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white whitespace-nowrap text-xs sm:text-sm"
    >
        {formatQueueEntryThumbnailDuration(media.getLength(), media.getOffset())}
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {#if media.hasRequestedBy()}
            <span on:click={openProfile} class="cursor-pointer">
                <img
                    src={buildMonKeyURL(media.getRequestedBy().getAddress())}
                    alt="&nbsp;"
                    title=""
                    class="inline h-7 -ml-1 -mt-4 -mb-3"
                />
                {#if media.getRequestedBy().hasNickname()}
                    <span class="mr-4 text-sm font-semibold">{media.getRequestedBy().getNickname()}</span>
                {:else}
                    <span class="mr-4 text-xs font-mono">{media.getRequestedBy().getAddress().substring(0, 14)}</span>
                {/if}
            </span>
        {:else}
            <span class="text-xs">JungleTV</span>
        {/if}
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-semibold"
    >
        {apiClient.formatBANPriceFixed(media.getRequestCost())} BAN
    </td>
</tr>
