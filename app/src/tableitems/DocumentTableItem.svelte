<script lang="ts">
    import { DateTime } from "luxon";
    import { navigate } from "svelte-navigator";
    import type { DocumentHeader } from "../proto/jungletv_pb";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let document: DocumentHeader;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
    }
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
        {formatDate(document.getUpdatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"#"} on:click={() => navigate("/documents/" + document.getId())}>View</a>
    </td><td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href={"#"} on:click={() => navigate("/moderate/documents/" + document.getId())}>Edit</a>
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {#if document.getPublic()}
            <a
                href={"#"}
                on:click={() =>
                    navigate("/enqueue?url=" + encodeURIComponent("document:" + document.getId() + "?title=EDIT_ME"))}
                >Enqueue</a
            >
        {/if}
    </td>
</tr>
