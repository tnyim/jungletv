<script lang="ts">
    import type { Picker } from "emoji-picker-element/svelte";
    import { onDestroy, onMount } from "svelte";
    import { navigate } from "svelte-navigator";
    import { chatEmojiPickerCSS } from "./chat_utils";
    import { emojiDatabase } from "./emoji_utils";
    import { chatEmotesAsCustomEmoji, currentSubscription, darkMode } from "./stores";

    export let searchQuery = "";

    let emojiPicker: Picker;

    let emojiPickerTabObserver: MutationObserver;

    let searchBox: HTMLInputElement;

    onMount(() => {
        // the i18n property appears to rely on some kind of custom setter
        // if we set searchLabel directly, it won't work
        let i18n = emojiPicker.i18n;
        i18n.searchLabel = "Search emoji";
        i18n.categories.custom = "Emotes";
        emojiPicker.i18n = i18n;
        emojiPicker.customCategorySorting = (category1: string, category2: string): number => {
            if (category2 == "Nice emotes") {
                return 1;
            }
            if (category1 == "Emotes") {
                return 2;
            }
            return category1.localeCompare(category2);
        };
        emojiPicker.shadowRoot.adoptedStyleSheets = [...emojiPicker.shadowRoot.adoptedStyleSheets, chatEmojiPickerCSS];
        emojiPicker.customEmoji = emojiDatabase.customEmoji;

        searchBox = emojiPicker.shadowRoot.getElementById("search") as HTMLInputElement;
        searchBox.setSelectionRange(0, searchBox.value.length);
        searchBox.focus();
        searchBox.addEventListener("input", (e) => {
            searchQuery = searchBox.value;
        });

        let emotesTab = emojiPicker.shadowRoot.querySelector(".tabpanel") as HTMLDivElement;
        if (emotesTab !== null) {
            emojiPickerTabObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === "attributes" && mutation.attributeName == "id") {
                        if (emotesTab.getAttribute("id") == "tab--1" && $currentSubscription == null) {
                            let overlay = document.createElement("div");
                            let inner = document.createElement("div");
                            let span1 = document.createElement("span");
                            span1.textContent = "To use Nice emotes,";
                            inner.appendChild(span1);
                            inner.appendChild(document.createTextNode(" "));
                            let span2 = document.createElement("span");
                            span2.textContent = "subscribe to JungleTV Nice";
                            span2.classList.add("link");
                            span2.addEventListener("click", () => navigate("/points#nice"));
                            inner.appendChild(span2);
                            overlay.appendChild(inner);
                            overlay.setAttribute("id", "emoteUpsellOverlay");
                            emotesTab.prepend(overlay);
                        } else {
                            let overlay = emotesTab.querySelector("#emoteUpsellOverlay");
                            if (overlay !== null) {
                                emotesTab.removeChild(overlay);
                            }
                        }
                    }
                });
            });

            emojiPickerTabObserver.observe(emotesTab, {
                attributes: true,
            });
        }
    });

    onDestroy(() => {
        if (typeof emojiPickerTabObserver !== "undefined") {
            emojiPickerTabObserver.disconnect();
        }
    });

    $: {
        if (typeof emojiPicker !== "undefined") {
            emojiPicker.customEmoji = $chatEmotesAsCustomEmoji;
        }
    }

    $: {
        if (typeof searchBox !== "undefined") {
            searchBox.value = searchQuery;
            // trigger an event that causes the emoji picker svelte to realize there are changes
            let event = new Event("input", {
                bubbles: true,
                cancelable: true,
            });
            searchBox.dispatchEvent(event);
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
        --upsell-text-color: black;
        --category-font-color: black;
        --upsell-background-color: #fef3c7;
        --upsell-link-color: rgb(37, 99, 235);
    }
    emoji-picker.dark {
        --background: rgb(17, 24, 39);
        --button-hover-background: rgb(31, 41, 55);
        --button-active-background: rgb(107, 114, 128);
        --input-font-color: rgb(255, 255, 255);
        --input-placeholder-color: #9ca3af;
        --border-color: rgb(55, 65, 81);
        --input-background-color: rgb(10, 14, 22);
        --upsell-text-color: white;
        --category-font-color: white;
        --upsell-background-color: #3730a3;
        --upsell-link-color: rgb(96, 165, 250);
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
