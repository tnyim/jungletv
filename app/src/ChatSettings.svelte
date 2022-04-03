<script lang="ts">
    import { collapseGifs } from "./stores";

    let showGIFs = !$collapseGifs;
    $: $collapseGifs = !showGIFs;
</script>

<div
    class="w-full h-full flex flex-col border-r border-l border-b border-gray-300 dark:border-gray-700 p-2.5 space-y-4"
>
    <div class="flex items-start">
        <div class="flex items-center h-5">
            <input
                id="showGIFs"
                name="showGIFs"
                type="checkbox"
                bind:checked={showGIFs}
                class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
            />
        </div>
        <div class="ml-3 text-sm">
            <label for="showGIFs" class="font-medium text-gray-700 dark:text-gray-300">Automatically show GIFs</label>
            <p class="text-gray-500">
                With this setting disabled, GIFs in chat messages will not be automatically downloaded or displayed.
            </p>
        </div>
    </div>
</div>
