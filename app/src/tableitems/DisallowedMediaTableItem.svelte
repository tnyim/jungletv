<script lang="ts">
    import { apiClient } from "../api_client";
    import { DisallowedMedia, DisallowedMediaType } from "../proto/jungletv_pb";
    import { formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let media: DisallowedMedia;
    export let updateDataCallback: () => void;

    async function remove() {
        await apiClient.removeDisallowedMedia(media.getId());
        updateDataCallback();
    }
</script>

<tr>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono"
    >
        {#if media.getMediaType() == DisallowedMediaType.DISALLOWED_MEDIA_TYPE_YOUTUBE_VIDEO}
            <i class="fab fa-youtube" />
        {:else if media.getMediaType() == DisallowedMediaType.DISALLOWED_MEDIA_TYPE_SOUNDCLOUD_TRACK}
            <i class="fab fa-soundcloud" />
        {/if}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono"
    >
        {media.getMediaId()}
    </td>
    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white">
        {media.getMediaTitle()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={media.getDisallowedBy()} />
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDateForModeration(media.getDisallowedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"#"} on:click={remove}>Remove</a>
    </td>
</tr>
