<script lang="ts">
    import { openUserProfile } from "./profile_utils";

    import {
        autoCloseMediaPickerOnInsert,
        autoCloseMediaPickerOnSend,
        collapseGifs,
        convertEmoticons,
        rewardAddress,
    } from "./stores";

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
    <div class="flex items-start">
        <div class="flex items-center h-5">
            <input
                id="convertEmoticons"
                name="convertEmoticons"
                type="checkbox"
                bind:checked={$convertEmoticons}
                class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
            />
        </div>
        <div class="ml-3 text-sm">
            <label for="convertEmoticons" class="font-medium text-gray-700 dark:text-gray-300">
                Automatically convert emoticons to emojis
            </label>
            <p class="text-gray-500">For example, when you type :-) JungleTV will convert it to 🙂</p>
        </div>
    </div>
    <div class="flex items-start">
        <div class="flex items-center h-5">
            <input
                id="autoCloseMediaPickerOnInsert"
                name="autoCloseMediaPickerOnInsert"
                type="checkbox"
                bind:checked={$autoCloseMediaPickerOnInsert}
                class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
            />
        </div>
        <div class="ml-3 text-sm">
            <label for="autoCloseMediaPickerOnInsert" class="font-medium text-gray-700 dark:text-gray-300">
                Close this pane when a selection is made
            </label>
        </div>
    </div>
    <div class="flex items-start">
        <div class="flex items-center h-5">
            <input
                id="autoCloseMediaPickerOnSend"
                name="autoCloseMediaPickerOnSend"
                type="checkbox"
                bind:checked={$autoCloseMediaPickerOnSend}
                class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
            />
        </div>
        <div class="ml-3 text-sm">
            <label for="autoCloseMediaPickerOnSend" class="font-medium text-gray-700 dark:text-gray-300">
                Close this pane when your message is sent
            </label>
        </div>
    </div>
    <div class="flex-grow" />
    <div class="text-sm">
        You can change your nickname on
        <span
            class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
            tabindex="0"
            on:click={() => openUserProfile($rewardAddress)}
            on:keydown={(ev) => ev.key == "Enter" && openUserProfile($rewardAddress)}>your profile</span
        >.
    </div>
</div>
