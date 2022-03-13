<script lang="ts">
    import ChatEmojiAutocomplete from "./ChatEmojiAutocomplete.svelte";
    import ChatReplyingBanner from "./ChatReplyingBanner.svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
    import WarningMessage from "./WarningMessage.svelte";
    // @ts-ignore no type info available
    import { autoresize } from "svelte-textarea-autoresize";
    import { darkMode, modal, rewardAddress } from "./stores";
    import type { Picker } from "emoji-picker-element";
    import type { EmojiClickEvent, NativeEmoji } from "emoji-picker-element/shared";
    import { afterUpdate, createEventDispatcher, onMount } from "svelte";
    import { link } from "svelte-navigator";
    import { insertAtCursor, openPopout, parseUserMessageMarkdown, setNickname } from "./utils";
    import { apiClient } from "./api_client";
    import { emojiDatabase } from "./chat_utils";
    import type { ChatMessage } from "./proto/jungletv_pb";
    import BlockedUsers from "./BlockedUsers.svelte";

    export let chatEnabled: boolean;
    export let chatDisabledReason: string;
    export let allowExpensiveCSSAnimations: boolean;
    export let replyingToMessage: ChatMessage;
    export let hasBlockedMessages: boolean;

    let sendError = false;
    let sendErrorMessage = "";
    let composeTextArea: HTMLTextAreaElement;
    let composedMessage = "";

    let emojiPicker: Picker;
    let emojiAutocompletePrefix = "";
    let emojiAutocompleteSelection: NativeEmoji = null;
    let emojiAutocompleteSelectionIndex = -1;
    let showedGuidelinesChatWarning = localStorage.getItem("showedGuidelinesChatWarning") == "true";

    const dispatch = createEventDispatcher();

    onMount(() => {
        // the i18n property appears to rely on some kind of custom setter
        // if we set searchLabel directly, it won't work
        let i18n = emojiPicker.i18n;
        i18n.searchLabel = "Search emoji";
        emojiPicker.i18n = i18n;
        const style = document.createElement("style");
        style.textContent = `
            .emoji, button.emoji {
                border-radius: 0.175em;
            }
        `;
        emojiPicker.shadowRoot.appendChild(style);
    });

    afterUpdate(() => {
        if (
            emojiAutocompletePrefix.endsWith(":") &&
            emojiAutocompleteSelection !== null &&
            emojiAutocompleteSelection.shortcodes.findIndex((s) => emojiAutocompletePrefix == s + ":") >= 0
        ) {
            insertAutocompleteSelectionEmoji();
        }
    });

    $: {
        if (typeof replyingToMessage !== "undefined") {
            composeTextArea.focus();
        }
    }

    async function sendMessage(event: Event) {
        let msg = composedMessage.trim();
        if (msg == "") {
            return;
        }
        composedMessage = "";
        if (msg == "/lightsout") {
            darkMode.update((v) => !v);
            return;
        } else if (msg == "/popout") {
            openPopout("chat");
            return;
        }
        let refMsg = replyingToMessage;
        dispatch("clearReply");
        if (!emojiPicker.classList.contains("hidden")) {
            emojiPicker.classList.add("hidden");
        }
        try {
            if (msg.startsWith("/nick")) {
                let nickname = "";
                let parts = splitAtFirstSpace(msg);
                if (parts.length > 1) {
                    nickname = parts[1];
                }
                let [valid, errMsg] = await setNickname(nickname);
                if (!valid) {
                    sendError = true;
                    sendErrorMessage = errMsg;
                    setTimeout(() => (sendError = false), 5000);
                    return;
                }
            } else {
                dispatch("sentMessage");
                await apiClient.sendChatMessage(msg, event.isTrusted, refMsg);
            }
        } catch (ex) {
            composedMessage = msg;
            sendError = true;
            if (ex.includes("rate limit reached")) {
                sendErrorMessage = "You're going too fast. Slow down.";
            } else {
                sendErrorMessage = "Failed to send your message. Please try again.";
            }
            setTimeout(() => (sendError = false), 5000);
        }
        composeTextArea.focus();
    }
    async function handleKeyboardOnComposeTextarea(event: KeyboardEvent) {
        let ta = event.target as HTMLTextAreaElement;
        if (event.key === "Enter" && emojiAutocompleteSelection == null) {
            if (event.altKey || event.ctrlKey || event.shiftKey) {
                if (!event.shiftKey) ta.value += "\n";
                autoresize(ta);
                return true;
            }
            event.preventDefault();
            await sendMessage(event);
            autoresize(ta);
            return false;
        } else if (event.key === "ArrowUp" && emojiAutocompleteSelection != null) {
            event.preventDefault();
            emojiAutocompleteSelectionIndex--;
            return false;
        } else if (event.key === "ArrowDown" && emojiAutocompleteSelection != null) {
            event.preventDefault();
            emojiAutocompleteSelectionIndex++;
            return false;
        } else if ((event.key === "Tab" || event.key === "Enter") && emojiAutocompleteSelection != null) {
            event.preventDefault();
            insertAutocompleteSelectionEmoji();
            return false;
        }
        return true;
    }

    // 1st capture group includes everything that precedes the shortcode
    // the 2nd capture group includes the beginning of the shortcode
    // because this regex is reused and designed to always match just once, do not set the 'g' flag
    const shortcodeRegexp = /^(.*[^\\]){0,1}(:[a-zA-Z0-9_\+\-]+:{0,1})$/s;

    async function handleCursorMoved() {
        if (composeTextArea.selectionStart != composeTextArea.selectionEnd) {
            emojiAutocompletePrefix = "";
            emojiAutocompleteSelection = null;
            return;
        }
        let textUpUntilCursor = composedMessage.substring(0, composeTextArea.selectionStart);
        let matches = shortcodeRegexp.exec(textUpUntilCursor);
        if (matches == null || matches.length < 3) {
            emojiAutocompletePrefix = "";
            emojiAutocompleteSelection = null;
            return;
        }
        emojiAutocompletePrefix = matches[2].substr(1);
    }
    function insertAutocompleteSelectionEmoji() {
        if (emojiAutocompleteSelection != null) {
            replaceCurrentPartialEmojiShortcode(emojiAutocompleteSelection.unicode);
            emojiDatabase.incrementFavoriteEmojiCount(emojiAutocompleteSelection.unicode);
            emojiAutocompletePrefix = "";
        }
    }
    function replaceCurrentPartialEmojiShortcode(replacement: string) {
        let textUpUntilCursor = composeTextArea.value.substring(0, composeTextArea.selectionStart);
        let matches = shortcodeRegexp.exec(textUpUntilCursor);
        if (matches == null || matches.length < 3) {
            // preconditions changed...
            return;
        }
        if (matches[1] !== undefined) {
            composeTextArea.selectionStart = matches[1].length; // place cursor at beginning of shortcode
        } else {
            composeTextArea.selectionStart = 0;
        }
        composeTextArea.selectionEnd = matches[0].length;
        insertAtCursor(composeTextArea, replacement);
        composedMessage = composeTextArea.value;
    }

    function dismissGuidelinesWarning() {
        showedGuidelinesChatWarning = true;
        localStorage.setItem("showedGuidelinesChatWarning", "true");
    }

    function splitAtFirstSpace(str) {
        var i = str.indexOf(" ");
        if (i > 0) {
            return [str.substring(0, i), str.substring(i + 1)];
        } else return [str];
    }

    let emojiPickerShown = false;
    function toggleEmojiPicker() {
        if (emojiPicker.classList.contains("hidden")) {
            emojiPickerShown = true;
            emojiPicker.classList.remove("hidden");
            let searchBox = emojiPicker.shadowRoot.getElementById("search") as HTMLInputElement;
            if (emojiAutocompletePrefix != "") {
                searchBox.value = emojiAutocompletePrefix;
            }
            searchBox.setSelectionRange(0, searchBox.value.length);
            searchBox.focus();
        } else {
            emojiPickerShown = false;
            emojiPicker.classList.add("hidden");
            composeTextArea.focus();
        }
    }

    function onEmojiPicked(event: EmojiClickEvent) {
        emojiAutocompletePrefix = "";
        toggleEmojiPicker();
        replaceCurrentPartialEmojiShortcode("");
        insertAtCursor(composeTextArea, event.detail.unicode);
        composedMessage = composeTextArea.value;
        composeTextArea.focus();
    }

    function focusOnInit(el: HTMLElement) {
        el.focus();
    }

    function openBlockedUserManagement() {
        modal.set({
            component: BlockedUsers,
            options: {
                closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
                styleContent: {
                    padding: "0",
                },
            },
        });
    }
</script>

<emoji-picker
    class="hidden w-full h-72 {$darkMode ? 'dark' : ''}"
    bind:this={emojiPicker}
    on:emoji-click={onEmojiPicked}
/>
{#if $rewardAddress == ""}
    <div class="p-2 text-gray-600 dark:text-gray-400">
        <a href="/rewards/address" use:link>Set a reward address</a> to chat.
    </div>
{:else if !chatEnabled}
    <div class="p-2 text-gray-600 dark:text-gray-400">
        Chat currently disabled{#if chatDisabledReason != ""}{chatDisabledReason}{/if}.
    </div>
{:else}
    {#if sendError}
        <div class="px-2 pb-2 text-xs mt-2">
            <ErrorMessage>
                {sendErrorMessage}
            </ErrorMessage>
        </div>
    {/if}
    {#if !showedGuidelinesChatWarning}
        <div class="px-2 pb-2 text-xs mt-2">
            <WarningMessage>
                Before participating in chat, make sure to read the
                <a use:link href="/guidelines" class="dark:text-blue-600">community guidelines</a>.
                <br />
                <a class="font-semibold float-right dark:text-blue-600" href={"#"} on:click={dismissGuidelinesWarning}
                    >I read the guidelines and will respect them</a
                >
            </WarningMessage>
        </div>
    {/if}
    {#if hasBlockedMessages}
        <div class="px-2 py-1 text-xs">
            Some messages were hidden.
            <span
                class="text-blue-500 dark:text-blue-600 cursor-pointer hover:underline"
                tabindex="0"
                on:click={openBlockedUserManagement}
            >
                Manage blocked users
            </span>
        </div>
    {/if}
    {#if replyingToMessage !== undefined}
        <ChatReplyingBanner
            {replyingToMessage}
            {allowExpensiveCSSAnimations}
            on:clearReply={() => dispatch("clearReply")}
        >
            <svelte:fragment slot="message-content">
                {@html parseUserMessageMarkdown(replyingToMessage.getUserMessage().getContent())}
            </svelte:fragment>
        </ChatReplyingBanner>
    {/if}
    <div class="flex flex-row relative">
        {#if emojiAutocompletePrefix != ""}
            <ChatEmojiAutocomplete
                suppressPopup={emojiPickerShown}
                enableReplyMargin={replyingToMessage !== undefined}
                prefix={emojiAutocompletePrefix}
                bind:currentSelection={emojiAutocompleteSelection}
                bind:currentSelectionIndex={emojiAutocompleteSelectionIndex}
                on:emojiPicked={insertAutocompleteSelectionEmoji}
            />
        {/if}
        <textarea
            use:autoresize
            bind:this={composeTextArea}
            bind:value={composedMessage}
            on:keydown={handleKeyboardOnComposeTextarea}
            on:click={handleCursorMoved}
            on:keyup={handleCursorMoved}
            use:focusOnInit
            class="flex-grow p-2 resize-none max-h-32 focus:outline-none dark:bg-gray-900"
            placeholder="Say something..."
            maxlength="512"
        />

        <button
            title="Insert emoji"
            class="text-purple-700 dark:text-purple-500 min-h-full w-8 py-2 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
            on:click={toggleEmojiPicker}
        >
            <i class="far fa-smile" />
        </button>

        <button
            title="Send message"
            class="{composedMessage == '' ? 'text-gray-400 dark:text-gray-600' : 'text-purple-700 dark:text-purple-500'}
        min-h-full w-10 p-2 shadow-md bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
            on:click={sendMessage}
        >
            <i class="fas fa-paper-plane" />
        </button>
    </div>
{/if}

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
        --input-placeholder-color: rgb(156, 163, 175);
        --border-color: rgb(209, 213, 219);
    }
    emoji-picker.dark {
        --background: rgb(17, 24, 39);
        --button-hover-background: rgb(31, 41, 55);
        --button-active-background: rgb(107, 114, 128);
        --input-font-color: rgb(255, 255, 255);
        --input-placeholder-color: rgb(107, 114, 128);
        --border-color: rgb(55, 65, 81);
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
