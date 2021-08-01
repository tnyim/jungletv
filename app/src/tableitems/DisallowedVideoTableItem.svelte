<script lang="ts">
    import { DateTime } from "luxon";
    import { apiClient } from "../api_client";
    import type { DisallowedVideo } from "../proto/jungletv_pb";

    export let video: DisallowedVideo;
    export let updateDataCallback: () => void;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
    }

    async function remove() {
        await apiClient.removeDisallowedVideo(video.getId());
        updateDataCallback();
    }
</script>

<td
    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono"
>
    {video.getYtVideoId()}
</td>
<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s p-4 text-gray-700 dark:text-white">
    {video.getYtVideoTitle()}
</td>
<td
    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono"
>
    {video.getDisallowedBy().substr(0, 14)}
</td>
<td
    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
>
    {formatDate(video.getDisallowedAt().toDate())}
</td>
<td
    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
>
    <a href={"#"} on:click={remove}>Remove</a>
</td>
