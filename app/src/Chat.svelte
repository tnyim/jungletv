<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount, beforeUpdate, afterUpdate, createEventDispatcher } from "svelte";
    import { link, navigate } from "svelte-navigator";
    import { ChatDisabledReason, ChatMessage, ChatUpdate, User, UserRole } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { fade } from "svelte/transition";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { darkMode, rewardAddress } from "./stores";
    import { DateTime } from "luxon";
    import marked from "marked/lib/marked.esm.js";
    import type Picker from "emoji-picker-element/picker";
    import type { EmojiClickEvent, NativeEmoji } from "emoji-picker-element/shared";
    import "emoji-picker-element";

    // @ts-ignore no type info available
    import { autoresize } from "svelte-textarea-autoresize";
    import WarningMessage from "./WarningMessage.svelte";
    import { editNicknameForUser, insertAtCursor } from "./utils";
    import type { SidebarTab } from "./tabStores";
    import ChatMessageDetails from "./ChatMessageDetails.svelte";
    import UserChatHistory from "./moderation/UserChatHistory.svelte";
    import ChatReplyingBanner from "./ChatReplyingBanner.svelte";
    import { emojiDatabase, getClassForMessageAuthor, getReadableMessageAuthor } from "./chat_utils";
    import ChatEmojiAutocomplete from "./ChatEmojiAutocomplete.svelte";

    const dispatch = createEventDispatcher();

    const tokenizer = {
        tag: () => {},
        link: () => {},
        reflink: () => {},
        autolink: () => {},
        url: () => {},
    };
    marked.setOptions({
        gfm: true,
        breaks: true,
    });
    marked.use({ tokenizer });

    export let mode = "sidebar";

    let composedMessage = "";
    let replyingToMessage: ChatMessage;
    let sendError = false;
    let sendErrorMessage = "";
    let chatEnabled = true;
    let chatDisabledReason = "";
    let chatMessages: ChatMessage[] = [];
    let seenMessageIDs: { [id: string]: boolean } = {};
    let consumeChatRequest: Request;
    let chatContainer: HTMLElement;
    let composeTextArea: HTMLTextAreaElement;
    let showedGuidelinesChatWarning = localStorage.getItem("showedGuidelinesChatWarning") == "true";
    let allowExpensiveCSSAnimations = false;
    let consumeChatTimeoutHandle: number = null;
    let emojiPicker: Picker;
    let emojiAutocompletePrefix = "";
    let emojiAutocompleteSelection: NativeEmoji = null;
    let emojiAutocompleteSelectionIndex = -1;

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

        document.addEventListener("visibilitychange", handleVisibilityChanged);
        allowExpensiveCSSAnimations = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
        consumeChat();
    });
    function consumeChat() {
        chatEnabled = true;
        consumeChatRequest = apiClient.consumeChat(50, handleChatUpdated, (code, msg) => {
            setTimeout(consumeChat, 5000);
        });
    }
    function consumeChatTimeout() {
        if (consumeChatRequest !== undefined) {
            consumeChatRequest.close();
        }
        consumeChat();
    }
    onDestroy(() => {
        document.removeEventListener("visibilitychange", handleVisibilityChanged);
        if (consumeChatRequest !== undefined) {
            consumeChatRequest.close();
        }
        if (consumeChatTimeoutHandle != null) {
            clearTimeout(consumeChatTimeoutHandle);
        }
    });

    let rAddress = "";

    rewardAddress.subscribe((address) => {
        rAddress = address;
    });

    let shouldAutoScroll = false;
    let mustAutoScroll = false;
    let sentMsgFlag = false;
    beforeUpdate(() => {
        if (!document.hidden) {
            // when the document is hidden, shouldAutoScroll can be incorrectly set to false
            // because browsers stop doing visibility calculations when the page is in the background
            shouldAutoScroll =
                chatContainer && chatContainer.offsetHeight + chatContainer.scrollTop > chatContainer.scrollHeight - 40;
        } else {
            // we were in the background and beforeUpdate is triggered, so a new message came in
            // therefore, we should autoscroll
            shouldAutoScroll = true;
        }
    });
    afterUpdate(() => {
        if (!document.hidden && (shouldAutoScroll || mustAutoScroll)) {
            scrollToBottom();
        }
        if (
            emojiAutocompletePrefix.endsWith(":") &&
            emojiAutocompleteSelection !== null &&
            emojiAutocompleteSelection.shortcodes.findIndex((s) => emojiAutocompletePrefix == s + ":") >= 0
        ) {
            insertAutocompleteSelectionEmoji();
        }
    });

    function handleVisibilityChanged() {
        if (!document.hidden && shouldAutoScroll) {
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        mustAutoScroll = false;
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: "smooth",
        });
    }

    function handleChatUpdated(update: ChatUpdate): void {
        if (consumeChatTimeoutHandle != null) {
            clearTimeout(consumeChatTimeoutHandle);
        }
        consumeChatTimeoutHandle = setTimeout(consumeChatTimeout, 20000);
        if (update.hasMessageCreated()) {
            let msg = update.getMessageCreated().getMessage();
            if (seenMessageIDs[msg.getId()]) {
                return;
            }
            seenMessageIDs[msg.getId()] = true;
            chatMessages.push(msg);
            // this sort has millisecond precision. we can do nanosecond precision if we really need to, but this is easier
            chatMessages.sort(
                (first, second) => first.getCreatedAt().toDate().getTime() - second.getCreatedAt().toDate().getTime()
            );
            if (sentMsgFlag) {
                sentMsgFlag = false;
                mustAutoScroll = true;
            }
            chatMessages = chatMessages.slice(Math.max(0, chatMessages.length - 250)); // this triggers Svelte's reactivity and removes old messages
        } else if (update.hasMessageDeleted()) {
            let deletedId = update.getMessageDeleted().getId();
            for (var i = chatMessages.length - 1; i >= 0; i--) {
                if (chatMessages[i].hasReference() && chatMessages[i].getReference().getId() == deletedId) {
                    chatMessages[i].clearReference();
                }
                if (chatMessages[i].getId() == deletedId) {
                    chatMessages.splice(i, 1);
                }
            }
            chatMessages = chatMessages; // this triggers Svelte's reactivity
        } else if (update.hasDisabled()) {
            chatEnabled = false;
            switch (update.getDisabled().getReason()) {
                case ChatDisabledReason.UNSPECIFIED:
                    chatDisabledReason = "";
                    break;
                case ChatDisabledReason.MODERATOR_NOT_PRESENT:
                    chatDisabledReason = " because no moderators are available";
                    break;
            }
        } else if (update.hasEnabled()) {
            chatEnabled = true;
        }
    }

    function shouldShowTimeSeparator(curIdx: number): boolean {
        if (curIdx == 0) {
            return true;
        }
        let thisMsgDate = DateTime.fromJSDate(chatMessages[curIdx].getCreatedAt().toDate()).toLocal();
        let prevMsgDate = DateTime.fromJSDate(chatMessages[curIdx - 1].getCreatedAt().toDate()).toLocal();
        return (
            Math.floor(thisMsgDate.toMillis() / (5 * 60 * 1000)) != Math.floor(prevMsgDate.toMillis() / (5 * 60 * 1000))
        );
    }

    function shouldAddAdditionalPadding(curIdx: number): boolean {
        if (curIdx == 0 || shouldShowTimeSeparator(curIdx)) {
            return false;
        }
        let thisMsgAuthor = "system";
        let prevMsgAuthor = "system";
        if (chatMessages[curIdx].hasUserMessage()) {
            thisMsgAuthor = chatMessages[curIdx].getUserMessage().getAuthor().getAddress();
        }
        if (chatMessages[curIdx - 1].hasUserMessage()) {
            prevMsgAuthor = chatMessages[curIdx - 1].getUserMessage().getAuthor().getAddress();
        }
        return thisMsgAuthor != prevMsgAuthor;
    }

    function formatMessageCreatedAtForSeparator(curIdx: number): string {
        let thisMsgDate = DateTime.fromJSDate(chatMessages[curIdx].getCreatedAt().toDate()).toLocal();
        let needsDate: boolean;
        if (curIdx > 0) {
            let prevMsgDate = DateTime.fromJSDate(chatMessages[curIdx - 1].getCreatedAt().toDate()).toLocal();
            needsDate = !thisMsgDate.hasSame(prevMsgDate, "day");
        } else {
            needsDate = !DateTime.now().toLocal().hasSame(thisMsgDate, "day");
        }
        return thisMsgDate.toLocaleString(needsDate ? DateTime.DATETIME_SHORT : DateTime.TIME_SIMPLE);
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
        }
        let refMsg = replyingToMessage;
        clearReplyToMessage();
        if (!emojiPicker.classList.contains("hidden")) {
            emojiPicker.classList.add("hidden");
        }
        sentMsgFlag = true;
        try {
            if (msg.startsWith("/nick")) {
                let nickname = "";
                let parts = splitAtFirstSpace(msg);
                if (parts.length > 1) {
                    nickname = parts[1];
                    if ([...nickname].length < 3) {
                        sendError = true;
                        sendErrorMessage = "The nickname must be at least 3 characters long.";
                        setTimeout(() => (sendError = false), 5000);
                        return;
                    } else if ([...nickname].length > 16) {
                        sendError = true;
                        sendErrorMessage = "The nickname must be at most 16 characters long.";
                        setTimeout(() => (sendError = false), 5000);
                        return;
                    }
                }
                await apiClient.setChatNickname(nickname);
            } else {
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
    const shortcodeRegexp = /^(.*[^\\]){0,1}(:[a-zA-Z0-9_]+:{0,1})$/s;

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

    function replyToMessage(message: ChatMessage) {
        replyingToMessage = message;
        composeTextArea.focus();
    }
    function clearReplyToMessage() {
        replyingToMessage = undefined;
    }
    function highlightMessage(message: ChatMessage) {
        let msgElement = document.getElementById("chat-message-" + message.getId());
        if (msgElement == null) {
            return;
        }
        chatContainer.scrollTo({
            top: msgElement.offsetTop,
            behavior: "smooth",
        });
        msgElement.classList.add("bg-yellow-100");
        msgElement.classList.add("dark:bg-yellow-800");
        setTimeout(() => {
            msgElement.classList.remove("bg-yellow-100");
            msgElement.classList.remove("dark:bg-yellow-800");
        }, 2000);
    }
    function focusOnInit(el: HTMLElement) {
        el.focus();
    }

    async function removeChatMessage(id: string) {
        await apiClient.removeChatMessage(id);
    }

    function openChatHistoryForAuthorOfMessage(message: ChatMessage) {
        if (mode == "sidebar") {
            let newTab: SidebarTab = {
                id: message.getId() + Math.random().toString().substr(2, 8),
                tabTitle: `${getReadableMessageAuthor(message)}'s chat history`,
                component: UserChatHistory,
                props: {
                    address: message.getUserMessage().getAuthor().getAddress(),
                    mode: "sidebar",
                },
                closeable: true,
                highlighted: false,
            };
            dispatch("openSidebarTab", newTab);
        } else {
            navigate("/moderate/users/" + message.getUserMessage().getAuthor().getAddress() + "/chathistory");
        }
    }

    async function editNicknameForAuthorOfMessage(message: ChatMessage) {
        await editNicknameForUser(message.getUserMessage().getAuthor());
    }

    function getBackgroundColorForMessage(msg: ChatMessage): string {
        if (msg.getUserMessage().getAuthor().getAddress() == rAddress) {
            return "bg-gray-100 dark:bg-gray-800";
        } else if (msg.hasReference() && msg.getReference().getUserMessage().getAuthor().getAddress() == rAddress) {
            return "bg-yellow-100 dark:bg-yellow-800";
        }
        return "";
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

    let detailsOpenForMsgID = "";
    let detailsOpenTimer: number;
    function beginShowMessageDetails(msg: ChatMessage) {
        endPreShowMessageDetails();
        detailsOpenTimer = setTimeout(() => showMessageDetails(msg), 500);
    }
    function endPreShowMessageDetails() {
        if (detailsOpenTimer !== undefined) {
            clearTimeout(detailsOpenTimer);
            detailsOpenTimer = undefined;
        }
    }
    function showMessageDetails(msg: ChatMessage) {
        detailsOpenTimer = undefined;
        detailsOpenForMsgID = msg.getId();
    }

    function hideMessageDetails() {
        endPreShowMessageDetails();
        detailsOpenForMsgID = "";
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
</script>

<div class="flex flex-col {mode == 'moderation' ? '' : 'chat-max-height h-full'}" on:pointerenter={hideMessageDetails}>
    <div class="flex-grow overflow-y-auto px-2 pb-2 relative" bind:this={chatContainer}>
        {#each chatMessages as msg, idx (msg.getId())}
            <div
                transition:fade|local={{ duration: 200 }}
                id="chat-message-{msg.getId()}"
                class="transition-colors ease-in-out duration-1000"
            >
                {#if shouldShowTimeSeparator(idx)}
                    <div
                        class="mt-1 flex flex-row text-xs text-gray-600 dark:text-gray-400 justify-center items-center"
                    >
                        <hr class="flex-1 ml-8" />
                        <div class="px-2">{formatMessageCreatedAtForSeparator(idx)}</div>
                        <hr class="flex-1 mr-8" />
                    </div>
                {/if}
                {#if msg.hasUserMessage()}
                    {#if msg.hasReference()}
                        <p
                            class="text-gray-600 dark:text-gray-400 text-xs {shouldAddAdditionalPadding(idx)
                                ? 'mt-2'
                                : 'mt-1'} h-5 overflow-hidden cursor-pointer
                                {getBackgroundColorForMessage(msg)}"
                            on:click={() => highlightMessage(msg.getReference())}
                        >
                            <i class="fas fa-reply" />
                            <span class={getClassForMessageAuthor(msg.getReference(), allowExpensiveCSSAnimations)}
                                >{getReadableMessageAuthor(msg.getReference())}</span
                            >:
                            {@html marked.parseInline(msg.getReference().getUserMessage().getContent())}
                        </p>
                    {/if}
                    <p
                        class="{shouldAddAdditionalPadding(idx) && !msg.hasReference()
                            ? 'mt-1.5'
                            : msg.hasReference()
                            ? ''
                            : 'mt-0.5'} break-words relative
                            {getBackgroundColorForMessage(msg)}"
                        on:pointerleave={(ev) => {
                            if (ev.pointerType != "touch") {
                                hideMessageDetails();
                            }
                        }}
                    >
                        {#if mode == "moderation"}
                            <i class="fas fa-trash cursor-pointer" on:click={() => removeChatMessage(msg.getId())} />
                            <i
                                class="fas fa-history cursor-pointer ml-1"
                                on:click={() => openChatHistoryForAuthorOfMessage(msg)}
                            />
                            <i
                                class="fas fa-edit cursor-pointer"
                                on:click={() => editNicknameForAuthorOfMessage(msg)}
                            />
                        {/if}
                        <span
                            on:pointerenter={(ev) => {
                                if (detailsOpenForMsgID == "" || ev.pointerType != "touch") {
                                    beginShowMessageDetails(msg);
                                } else {
                                    hideMessageDetails();
                                }
                            }}
                        >
                            <img
                                src="https://monkey.banano.cc/api/v1/monkey/{msg
                                    .getUserMessage()
                                    .getAuthor()
                                    .getAddress()}?format=png"
                                alt="&nbsp;"
                                title="Click to reply"
                                class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                                on:click={() => replyToMessage(msg)}
                            />
                            <span
                                class="{getClassForMessageAuthor(msg, allowExpensiveCSSAnimations)} cursor-pointer"
                                title="Click to reply"
                                on:click={() => replyToMessage(msg)}>{getReadableMessageAuthor(msg)}</span
                            >{#if msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)}
                                <i
                                    class="fas fa-shield-alt text-xs ml-1 text-purple-700 dark:text-purple-500"
                                    title="Chat moderator"
                                />{/if}{#if msg
                                .getUserMessage()
                                .getAuthor()
                                .getRolesList()
                                .includes(UserRole.CURRENT_ENTRY_REQUESTER)}
                                <i
                                    class="fas fa-coins text-xs ml-1 text-green-700 dark:text-green-500"
                                    title="Requester of currently playing video"
                                />
                            {/if}:
                        </span>
                        {@html marked
                            .parseInline(
                                msg.getUserMessage().getContent(),
                                msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)
                                    ? { tokenizer: undefined }
                                    : {}
                            )
                            .replaceAll("<a ", '<a target="_blank" rel="noopener" ')}
                        {#if detailsOpenForMsgID == msg.getId()}
                            <ChatMessageDetails
                                {msg}
                                on:reply={() => replyToMessage(msg)}
                                on:delete={() => removeChatMessage(msg.getId())}
                                on:history={() => openChatHistoryForAuthorOfMessage(msg)}
                                on:changeNickname={() => editNicknameForAuthorOfMessage(msg)}
                                on:mouseLeft={() => hideMessageDetails()}
                            />
                        {/if}
                    </p>
                {:else if msg.hasSystemMessage()}
                    <div class="mt-1 flex flex-row text-xs justify-center items-center text-center">
                        <div class="flex-1" />
                        <div
                            class="px-2 py-0.5 bg-gray-400 dark:bg-gray-600 text-white rounded text-center break-words max-w-full"
                        >
                            {@html marked.parseInline(msg.getSystemMessage().getContent())}
                        </div>
                        <div class="flex-1" />
                    </div>
                {/if}
            </div>
        {:else}
            <div class="px-2 py-2">
                No messages. {#if chatEnabled}Say something!{/if}
            </div>
        {/each}
    </div>
    <div class="border-t border-gray-300 shadow-md flex flex-col">
        <emoji-picker
            class="hidden w-full h-72 {$darkMode ? 'dark' : ''}"
            bind:this={emojiPicker}
            on:emoji-click={onEmojiPicked}
        />
        {#if rAddress == ""}
            <div class="p-2 text-gray-600 dark:text-gray-400">
                <a href="/rewards/address" use:link>Set a reward address</a> to chat.
            </div>
        {:else if !chatEnabled}
            <div class="p-2 text-gray-600 dark:text-gray-400">
                Chat currently disabled{#if chatDisabledReason != ""}{chatDisabledReason}{/if}.
            </div>
        {:else}
            {#if sendError}
                <div class="px-2 pb-2 text-xs">
                    <ErrorMessage>
                        {sendErrorMessage}
                    </ErrorMessage>
                </div>
            {/if}
            {#if !showedGuidelinesChatWarning}
                <div class="px-2 pb-2 text-xs">
                    <WarningMessage>
                        Before participating in chat, make sure to read the
                        <a use:link href="/guidelines" class="dark:text-blue-600">community guidelines</a>.
                        <br />
                        <a
                            class="font-semibold float-right dark:text-blue-600"
                            href={"#"}
                            on:click={dismissGuidelinesWarning}>I read the guidelines and will respect them</a
                        >
                    </WarningMessage>
                </div>
            {/if}
            {#if replyingToMessage !== undefined}
                <ChatReplyingBanner
                    {replyingToMessage}
                    {allowExpensiveCSSAnimations}
                    on:clearReply={clearReplyToMessage}
                >
                    <svelte:fragment slot="message-content">
                        {@html marked.parseInline(replyingToMessage.getUserMessage().getContent())}
                    </svelte:fragment>
                </ChatReplyingBanner>
            {/if}
            <div class="flex flex-row relative">
                {#if !emojiPickerShown && emojiAutocompletePrefix != ""}
                    <ChatEmojiAutocomplete
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
                    class="{composedMessage == ''
                        ? 'text-gray-400 dark:text-gray-600'
                        : 'text-purple-700 dark:text-purple-500'}
                    min-h-full w-10 p-2 shadow-md bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
                    on:click={sendMessage}
                >
                    <i class="fas fa-paper-plane" />
                </button>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    .chat-max-height {
        max-height: max(250px, calc(100vh - 56.25vw - 4rem - 48px));
    }
    @media (min-width: 1024px) {
        .chat-max-height {
            max-height: 100%;
        }
    }

    emoji-picker {
        --num-columns: 8;
        --input-border-radius: 0.375rem;
        --outline-size: 1px;
        --outline-color: rgb(245, 158, 11);
        --skintone-border-radius: 0.375rem;
        --indicator-color: rgb(109, 40, 217);
    }
    emoji-picker.dark {
        --background: rgb(17, 24, 39);
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
