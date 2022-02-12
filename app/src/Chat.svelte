<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount, beforeUpdate, afterUpdate, createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";
    import { ChatDisabledReason, ChatMessage, ChatUpdate } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { fade } from "svelte/transition";
    import { blockedUsers, unreadChatMention } from "./stores";
    import { DateTime } from "luxon";
    import { marked } from "marked/lib/marked.esm.js";
    import "emoji-picker-element";

    import { editNicknameForUser } from "./utils";
    import type { SidebarTab } from "./tabStores";
    import UserChatHistory from "./moderation/UserChatHistory.svelte";
    import { getReadableMessageAuthor } from "./chat_utils";
    import ChatUserMessage from "./ChatUserMessage.svelte";
    import ChatSystemMessage from "./ChatSystemMessage.svelte";
    import ChatComposeArea from "./ChatComposeArea.svelte";

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

    let replyingToMessage: ChatMessage;

    let chatEnabled = true;
    let chatDisabledReason = "";
    let chatMessages: ChatMessage[] = [];
    let seenMessageIDs: { [id: string]: boolean } = {};
    let consumeChatRequest: Request;
    let chatContainer: HTMLElement;
    let allowExpensiveCSSAnimations = false;
    let consumeChatTimeoutHandle: number = null;

    onMount(() => {
        document.addEventListener("visibilitychange", handleVisibilityChanged);
        allowExpensiveCSSAnimations = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
        consumeChat();
        unreadChatMention.set(false);
    });

    function consumeChat() {
        chatEnabled = true;
        $blockedUsers = new Set<string>();
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

    let hasBlockedMessages = false;
    function refreshHasBlockedMessages() {
        let bu = $blockedUsers;
        for (let msg of chatMessages) {
            if (!msg.hasUserMessage()) {
                continue;
            }
            if (bu.has(msg.getUserMessage().getAuthor().getAddress())) {
                hasBlockedMessages = true;
                return;
            }
        }
        hasBlockedMessages = false;
    }

    blockedUsers.subscribe((_) => {
        refreshHasBlockedMessages();
    });

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
            if (msg.hasUserMessage() && $blockedUsers.has(msg.getUserMessage().getAuthor().getAddress())) {
                hasBlockedMessages = true;
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
            refreshHasBlockedMessages();
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
        } else if (update.hasBlockedUserCreated()) {
            $blockedUsers = $blockedUsers.add(update.getBlockedUserCreated().getBlockedUserAddress());
        } else if (update.hasBlockedUserDeleted()) {
            let bu = $blockedUsers;
            bu.delete(update.getBlockedUserDeleted().getBlockedUserAddress());
            $blockedUsers = bu;
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

    function replyToMessage(message: ChatMessage) {
        replyingToMessage = message;
    }
    function clearReplyToMessage() {
        replyingToMessage = undefined;
    }
    function highlightMessage(message: ChatMessage) {
        let msgElement = (chatContainer.getRootNode() as ShadowRoot).getElementById("chat-message-" + message.getId());
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

    function openChatHistoryForAuthorOfMessage(message: ChatMessage) {
        let historyPath = "/moderate/users/" + message.getUserMessage().getAuthor().getAddress() + "/chathistory";
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
                canPopout: false,
            };
            dispatch("openSidebarTab", newTab);
        } else if (mode == "popout") {
            if(window.opener != null) {
                window.opener.document.location.href = window.origin + historyPath;
            } else {
                window.open(window.origin + historyPath);
            }
        } else {
            navigate(historyPath);
        }
    }

    async function editNicknameForAuthorOfMessage(message: ChatMessage) {
        await editNicknameForUser(message.getUserMessage().getAuthor());
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
    let containerClasses = "";
    $: {
        if (mode == "sidebar") {
            containerClasses = "chat-max-height h-full";
        } else if (mode == "popout") {
            containerClasses = "max-h-screen";
        }
    }
</script>

<div class="flex flex-col {containerClasses}" on:pointerenter={hideMessageDetails}>
    <div class="flex-grow overflow-y-auto px-2 pb-2 relative" bind:this={chatContainer}>
        {#each chatMessages as message, idx (message.getId())}
            <div
                transition:fade|local={{ duration: 200 }}
                id="chat-message-{message.getId()}"
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
                {#if message.hasUserMessage() && !$blockedUsers.has(message.getUserMessage().getAuthor().getAddress())}
                    <ChatUserMessage
                        {marked}
                        {message}
                        additionalPadding={shouldAddAdditionalPadding(idx)}
                        {allowExpensiveCSSAnimations}
                        {mode}
                        {detailsOpenForMsgID}
                        on:reply={() => replyToMessage(message)}
                        on:highlight={(e) => highlightMessage(e.detail)}
                        on:history={() => openChatHistoryForAuthorOfMessage(message)}
                        on:changeNickname={() => editNicknameForAuthorOfMessage(message)}
                        on:beginShowDetails={(e) => beginShowMessageDetails(e.detail)}
                        on:hideDetails={hideMessageDetails}
                    />
                {:else if message.hasSystemMessage()}
                    <ChatSystemMessage {marked} {message} />
                {/if}
            </div>
        {:else}
            <div class="px-2 py-2">
                No messages. {#if chatEnabled}Say something!{/if}
            </div>
        {/each}
    </div>
    <div class="border-t border-gray-300 shadow-md flex flex-col">
        <ChatComposeArea
            {marked}
            {chatEnabled}
            {chatDisabledReason}
            {allowExpensiveCSSAnimations}
            {replyingToMessage}
            {hasBlockedMessages}
            on:clearReply={clearReplyToMessage}
            on:sentMessage={() => (sentMsgFlag = true)}
        />
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
</style>
