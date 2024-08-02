<script lang="ts">
    import { apiClient } from "../api_client";
    import Fuzzy from "../Fuzzy.svelte";
    import type { PaginationParameters } from "../proto/common_pb";
    import type { Spectator } from "../proto/jungletv_pb";
    import SpectatorTableItem from "../tableitems/SpectatorTableItem.svelte";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import PaginatedTable from "../uielements/PaginatedTable.svelte";

    let cur_page = -1;
    export let searchQuery = "";
    let prevSearchQuery = "";

    let spectatorsPromise = getSpectators();
    let spectators: Spectator[] = [];
    let searchResults = [];
    async function getSpectators(): Promise<Spectator[]> {
        const s = await apiClient.spectators();
        return s.getSpectatorsList();
    }

    async function getPage(pagParams: PaginationParameters): Promise<[Spectator[], number]> {
        spectators = await spectatorsPromise;

        let source = spectators;
        if (searchQuery != "") {
            source = searchResults.map((e) => e.item);
        }
        return [source.slice(pagParams.getOffset(), pagParams.getOffset() + pagParams.getLimit()), source.length];
    }

    $: fuseOptions = {
        threshold: 0.3,
        ignoreLocation: true,
        useExtendedSearch: true,
        keys: [
            {
                name: "address",
                getFn: (spectator: Spectator): string => {
                    return spectator.getUser().getAddress();
                },
                weight: 5,
            },
            {
                name: "nickname",
                getFn: (spectator: Spectator): string => {
                    return spectator.getUser().getNickname();
                },
                weight: 5,
            },
            {
                name: "asn",
                getFn: (spectator: Spectator): string => {
                    return spectator.hasAsNumber() ? spectator.getAsNumber().toString() : null;
                },
                weight: 3,
            },
        ],
    };

    $: {
        if (searchQuery != prevSearchQuery) {
            cur_page = -1;
            prevSearchQuery = searchQuery;
        }
    }

    let relativeTimestamps = true;
</script>

<div class="mt-6 px-2">
    <p class="font-semibold text-lg">Spectators</p>
    <p class="text-sm mt-2 mb-6">
        Spectators are authenticated users who are currently connected to the media player. This list does not update
        automatically.
    </p>
    <div class="mb-6 flex flex-row items-center">
        <ButtonButton
            on:click={() => {
                spectatorsPromise = getSpectators();
                cur_page = -1;
            }}
        >
            Update list
        </ButtonButton>
        <div class="px-4">
            <input
                id="showOnlyActive"
                name="showOnlyActive"
                type="checkbox"
                bind:checked={relativeTimestamps}
                class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
            />
            <label for="showOnlyActive" class="font-medium text-gray-700 dark:text-gray-300">
                Relative timestamps
            </label>
        </div>
    </div>
    <Fuzzy query={searchQuery} data={spectators} options={fuseOptions} bind:result={searchResults} />
    <PaginatedTable
        title={"Spectators"}
        column_count={5}
        error_message={"Error loading spectators"}
        no_items_message={"No spectators"}
        data_promise_factory={getPage}
        bind:cur_page
        bind:search_query={searchQuery}
        show_search_box={true}
        min_search_query_length={1}
    >
        <svelte:fragment slot="thead">
            <tr
                class="border border-solid border-b-0 border-l-0 border-r-0
        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
        text-xs uppercase whitespace-nowrap font-semibold text-left"
            >
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">User</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Watching since</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Connections</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">Spectators with same IP</th>
                <th class="px-4 sm:px-6 align-middle pt-3 pb-1 font-semibold">IP Banned</th>
            </tr>
            <tr
                class="border border-solid border-t-0 border-l-0 border-r-0
        bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600
        text-xs uppercase whitespace-nowrap font-semibold text-left"
            >
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">AS Number</th>
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Using VPN</th>
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">VPN allowed</th>
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Failed captcha</th>
                <th class="px-4 sm:px-6 align-middle pb-3 pt-1 font-semibold">Pending captcha</th>
            </tr>
        </svelte:fragment>

        <tbody slot="item" let:item class="hover:bg-gray-200 dark:hover:bg-gray-700">
            <SpectatorTableItem spectator={item} {relativeTimestamps} />
        </tbody>
    </PaginatedTable>
</div>
