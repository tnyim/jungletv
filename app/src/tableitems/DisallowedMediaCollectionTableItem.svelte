<script lang="ts">
    import { apiClient } from "../api_client";
    import { DisallowedMediaCollection, DisallowedMediaCollectionType } from "../proto/jungletv_pb";
    import { formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let collection: DisallowedMediaCollection;
    export let updateDataCallback: () => void;

    async function remove() {
        await apiClient.removeDisallowedMediaCollection(collection.getId());
        updateDataCallback();
    }
</script>

<tr>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono"
    >
        {#if collection.getCollectionType() == DisallowedMediaCollectionType.DISALLOWED_MEDIA_COLLECTION_TYPE_YOUTUBE_CHANNEL}
            <i class="fab fa-youtube" />
        {:else if collection.getCollectionType() == DisallowedMediaCollectionType.DISALLOWED_MEDIA_COLLECTION_TYPE_SOUNDCLOUD_USER}
            <i class="fab fa-soundcloud" />
        {/if}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono text-xs"
    >
        {collection.getCollectionId()}
    </td>
    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white">
        {collection.getCollectionTitle()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={collection.getDisallowedBy()} />
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDateForModeration(collection.getDisallowedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"#"} on:click={remove}>Remove</a>
    </td>
</tr>
