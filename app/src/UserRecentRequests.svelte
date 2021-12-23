<script lang="ts">
    import { DateTime } from "luxon";
    import { createEventDispatcher } from "svelte";
    import { apiClient } from "./api_client";
    import type { PlayedMedia } from "./proto/jungletv_pb";

    const dispatch = createEventDispatcher();

    export let recentRequests: Array<PlayedMedia> = [];
    export let isSelf: boolean;

    function formatDate(date: Date): string {
        return (
            '<span style="white-space: nowrap">' +
            DateTime.fromJSDate(date)
                .setLocale(DateTime.local().resolvedLocaleOpts().locale)
                .toLocal()
                .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
                .replace(", ", ',</span> <span style="white-space: nowrap">') +
            "</span>"
        );
    }

    async function featureMedia(mediaID: string) {
        await apiClient.setProfileFeaturedMedia(mediaID);
        dispatch("featured");
    }
</script>

<table class="py-2 items-center w-full bg-transparent border-collapse">
    <thead>
        <tr>
            <th
                class="px-4 align-middle border border-solid py-3 text-xs uppercase
                       border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                     bg-gray-300 text-gray-600  dark:bg-gray-700 dark:text-gray-400
                     border-gray-200 dark:border-gray-600"
            >
                Played at
            </th>
            <th
                class="px-4 align-middle border border-solid py-3 text-xs uppercase
                       border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                     bg-gray-300 text-gray-600  dark:bg-gray-700 dark:text-gray-400
                     border-gray-200 dark:border-gray-600"
            >
                Video
            </th>
            <th
                class="px-4 align-middle border border-solid py-3 text-xs uppercase
                       border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                     bg-gray-300 text-gray-600  dark:bg-gray-700 dark:text-gray-400
                     border-gray-200 dark:border-gray-600"
            >
                Request cost
            </th>
            {#if isSelf}
                <th
                    class="px-4 align-middle border border-solid py-3 text-xs uppercase
                       border-l-0 border-r-0 whitespace-nowrap font-semibold text-left
                     bg-gray-300 text-gray-600  dark:bg-gray-700 dark:text-gray-400
                     border-gray-200 dark:border-gray-600"
                />
            {/if}
        </tr>
    </thead>
    {#each recentRequests as request}
        <tbody class="hover:bg-gray-300 dark:hover:bg-gray-700">
            <tr>
                <td
                    class="border-t-0 align-middle border-l-0 border-r-0 text-xs p-4 text-gray-700 dark:text-white w-1/4"
                >
                    {@html formatDate(request.getStartedAt().toDate())}
                </td>
                <td class="border-t-0 align-middle border-l-0 border-r-0 text-xs p-4 text-gray-700 dark:text-white">
                    {#if request.hasYoutubeVideoData()}
                        <a
                            href="https://youtube.com/watch?v={request.getYoutubeVideoData().getId()}"
                            target="_blank"
                            rel="noopener"
                        >
                            {request.getYoutubeVideoData().getTitle()}
                        </a>
                    {/if}
                </td>
                <td
                    class="border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-semibold"
                >
                    {apiClient.formatBANPriceFixed(request.getRequestCost())} BAN
                </td>
                {#if isSelf}
                    <td class="border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        <i
                            title="Feature this media on your profile"
                            class="fas fa-highlighter cursor-pointer
                             text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500"
                            on:click={() => featureMedia(request.getId())}
                        />
                    </td>
                {/if}
            </tr>
        </tbody>
    {/each}
</table>
