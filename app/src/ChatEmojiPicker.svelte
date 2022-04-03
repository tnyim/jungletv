<script lang="ts">
    import type { Picker } from "emoji-picker-element/svelte";
    import { onMount } from "svelte";
    import { emojiDatabase } from "./chat_utils";
    import { chatEmotesAsCustomEmoji, darkMode } from "./stores";

    let emojiPicker: Picker;

    onMount(() => {
        // the i18n property appears to rely on some kind of custom setter
        // if we set searchLabel directly, it won't work
        let i18n = emojiPicker.i18n;
        i18n.searchLabel = "Search emoji";
        i18n.categories.custom = "Emotes";
        emojiPicker.i18n = i18n;
        const style = document.createElement("style");
        style.textContent = `
            .emoji, button.emoji {
                border-radius: 0.175em;
            }
            .picker {
                border-top: none;
            }
            input.search::placeholder {
                opacity: 1;
            }
            input.search {
                background-color: var(--input-background-color);
            }
        `;
        emojiPicker.shadowRoot.appendChild(style);
        emojiPicker.customEmoji = emojiDatabase.customEmoji;

        let searchBox = emojiPicker.shadowRoot.getElementById("search") as HTMLInputElement;
        searchBox.setSelectionRange(0, searchBox.value.length);
        searchBox.focus();
    });

    $: {
        if (typeof emojiPicker !== "undefined") {
            emojiPicker.customEmoji = $chatEmotesAsCustomEmoji;
        }
    }
</script>

<emoji-picker class="w-full h-full {$darkMode ? 'dark' : ''}" bind:this={emojiPicker} on:emoji-click />

<style lang="postcss">
    emoji-picker {
        --num-columns: 8;
        --input-border-radius: 0.375rem;
        --outline-size: 1px;
        --outline-color: rgb(245, 158, 11);
        --skintone-border-radius: 0.375rem;
        --indicator-color: rgb(109, 40, 217);
        --background: rgb(249, 250, 251);
        --button-hover-background: rgb(229, 231, 235);
        --button-active-background: rgb(156, 163, 175);
        --input-font-color: rgb(0, 0, 0);
        --input-placeholder-color: #9ca3af;
        --border-color: rgb(209, 213, 219);
    }
    emoji-picker.dark {
        --background: rgb(17, 24, 39);
        --button-hover-background: rgb(31, 41, 55);
        --button-active-background: rgb(107, 114, 128);
        --input-font-color: rgb(255, 255, 255);
        --input-placeholder-color: #9ca3af;
        --border-color: rgb(55, 65, 81);
        --input-background-color: rgb(10, 14, 22);
    }
    @media (min-width: 640px) {
        emoji-picker {
            --num-columns: 12;
        }
    }
    @media (min-width: 1024px) {
        emoji-picker {
            --num-columns: 8;
        }
    }
</style>
