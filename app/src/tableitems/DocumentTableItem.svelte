<script lang="ts">
    import { link } from "svelte-navigator";
    import type { DocumentHeader } from "../proto/jungletv_pb";
    import { formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let document: DocumentHeader;
</script>

<tr>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-mono"
    >
        {document.getId()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={document.getUpdatedBy()} />
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDateForModeration(document.getUpdatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"/documents/" + document.getId()} use:link>View</a>
    </td><td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"/moderate/documents/" + document.getId()} use:link>Edit</a>
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {#if document.getPublic()}
            <a href={"/enqueue?url=" + encodeURIComponent("document:" + document.getId() + "?title=EDIT_ME")} use:link
                >Enqueue</a
            >
        {/if}
    </td>
</tr>
