<script lang="ts">
    import type { NativeEmoji } from "emoji-picker-element/shared";
    import { createEventDispatcher } from "svelte";
    import { emojiDatabase } from "./chat_utils";

    const dispatch = createEventDispatcher();

    export let enableReplyMargin = false;
    export let suppressPopup = false;
    export let prefix = "";
    let lastPrefix = "";
    export let currentSelection: NativeEmoji = null;
    export let currentSelectionIndex = 0;

    const searchResultsLimit = 5;
    let searchResults: NativeEmoji[] = [];
    let searchResultsElements: HTMLElement[] = [];

    async function searchEmoji(searchText: string): Promise<NativeEmoji[]> {
        let emojis = await emojiDatabase.getEmojiBySearchQuery(searchText);

        let shortcode = searchText;
        if (searchText.endsWith(":")) {
            // exact shortcode search
            shortcode = searchText.substring(0, searchText.length - 1).toLowerCase();
            emojis = emojis.filter((_) => _.shortcodes.includes(shortcode));
        }
        if (emojis.findIndex((e) => e.shortcodes.includes(shortcode)) < 0) {
            // sometimes getEmojiBySearchQuery does not find the exact match for short queries
            // e.g. :m won't bring up the :m: emoji
            let exactMatch = await emojiDatabase.getEmojiByShortcode(shortcode);
            if (exactMatch != null) {
                emojis.push(exactMatch);
            }
        }

        // prefer emojis whose beginning of first shortcode matches exactly the searchText
        // this improves visual/behavior consistency
        let numMoved = 0;
        for (let i = emojis.length - 1; i >= numMoved; i--) {
            if (emojis[i].shortcodes[0].startsWith(searchText)) {
                emojis.unshift(emojis[i]);
                i++;
                emojis.splice(i, 1);
                numMoved++;
            }
        }

        let result = emojis.filter((e): e is NativeEmoji => {
            return "unicode" in e;
        });

        return result.slice(0, searchResultsLimit);
    }

    function shortcodeMatchingPrefix(shortcodes: string[]): string {
        for (const shortcode of shortcodes) {
            if (shortcode.startsWith(prefix)) {
                return shortcode;
            }
        }
        return shortcodes[0];
    }

    $: if (prefix != lastPrefix) {
        lastPrefix = prefix;
        searchEmoji(prefix).then((emoji) => {
            searchResultsElements = [];
            searchResultsElements.length = searchResults.length;
            searchResults = emoji;
            if (searchResults.length == 0) {
                currentSelectionIndex = -1;
            }
            currentSelectionIndex = 0;
        });
    }

    $: {
        if (currentSelectionIndex < 0) {
            currentSelectionIndex = searchResults.length - 1;
        }
        if (currentSelectionIndex >= searchResults.length) {
            currentSelectionIndex = 0;
        }
        if (currentSelectionIndex >= 0 && currentSelectionIndex < searchResults.length) {
            currentSelection = searchResults[currentSelectionIndex];
        } else {
            currentSelection = null;
        }
    }
</script>

{#if searchResults.length > 0 && !suppressPopup}
    <div class="outer-container {enableReplyMargin ? 'reply-margin' : ''}">
        <div
            class="bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600
                    border rounded-sm shadow-md m-2 p-2"
        >
            <div class="text-sm text-gray-700 dark:text-gray-300 pb-0.5">
                Emoji matching <span class="font-semibold text-black dark:text-white">:{prefix}</span>
            </div>
            {#each searchResults as result, i}
                <div
                    on:mouseenter={() => (currentSelectionIndex = i)}
                    on:click={() => {
                        currentSelectionIndex = i;
                        dispatch("emojiPicked");
                    }}
                    class="p-1 cursor-pointer rounded-sm {currentSelectionIndex == i
                        ? 'bg-gray-300 dark:bg-gray-600'
                        : ''}"
                >
                    <span class="inline-flex w-6 emoji-container">{result.unicode}</span> :{shortcodeMatchingPrefix(
                        result.shortcodes
                    )}:
                </div>
            {/each}
        </div>
    </div>
{/if}

<style lang="postcss">
    .outer-container {
        position: absolute;
        bottom: calc(100%);
        width: 100%;
    }

    .outer-container.reply-margin {
        bottom: calc(100% + 40px);
    }

    .emoji-container {
        /* this ensures that if an emoji were to render as two separate symbols, the second one won't be visible */
        overflow: hidden;
        letter-spacing: 20px;
    }
</style>
