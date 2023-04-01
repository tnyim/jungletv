<script lang="ts">
    import type { grpc } from "@improbable-eng/grpc-web";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import "emoji-picker-element";
    import type { CustomEmoji } from "emoji-picker-element/shared";
    import { DateTime } from "luxon";
    import { afterUpdate, beforeUpdate, createEventDispatcher, onDestroy, onMount } from "svelte";
    import { link, navigate } from "svelte-navigator";
    import { fade } from "svelte/transition";
    import { apiClient } from "./api_client";
    import ChatComposeArea from "./ChatComposeArea.svelte";
    import ChatSeparator from "./ChatSeparator.svelte";
    import ChatSystemMessage from "./ChatSystemMessage.svelte";
    import ChatUserMessage from "./ChatUserMessage.svelte";
    import { getReadableMessageAuthor } from "./chat_utils";
    import UserChatHistory from "./moderation/UserChatHistory.svelte";
    import { ChatDisabledReason, ChatMessage, ChatUpdate, ChatUpdateEvent } from "./proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "./rpcUtils";
    import {
        blockedUsers,
        chatEmote,
        chatEmotes,
        chatEmotesAsCustomEmoji,
        rewardAddress,
        unreadChatMention,
    } from "./stores";
    import type { SidebarTab } from "./tabStores";
    import TabButton from "./uielements/TabButton.svelte";
    import { editNicknameForUser } from "./utils";

    type systemMessageGroupInfo = {
        expand: boolean;
        isGroupHeader: boolean;
        isGroupFooter: boolean;
        groupSize?: number;
        groupID?: string;
    };

    const dispatch = createEventDispatcher();

    export let mode = "sidebar";

    let replyingToMessage: ChatMessage;

    let chatEnabled = true;
    let chatDisabledReason = "";
    let chatMessages: ChatMessage[] = [];
    let seenMessageIDs = new Set<string>();
    let chatContainer: HTMLElement;
    let allowExpensiveCSSAnimations = false;
    let currentlyExpandedSystemMessageGroup = "";
    let chatSystemMessageGroupInfo: systemMessageGroupInfo[] = [];
    const systemMessageMinGroupSize = 5;
    const messageHistorySize = 250;

    function buildConsumeChatRequest(
        onUpdate: (update: ChatUpdate) => void,
        onEnd: (code: grpc.Code, msg: string) => void
    ): Request {
        return apiClient.consumeChat(50, onUpdate, onEnd);
    }

    consumeStreamRPCFromSvelteComponent(20000, 5000, buildConsumeChatRequest, handleChatUpdated, (connected) => {
        if (connected) {
            chatEnabled = true;
            $blockedUsers = new Set<string>();
        }
    });

    let bottomDetectionDiv: HTMLDivElement;
    let bottomVisible = true;
    let prevChatClientHeight = 0;
    let prevChatClientWidth = 0;
    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            //let newBottomVisible = ;
            // ensure that chat stays scrolled to the bottom when the compose area increases in height
            // iff we were already at the bottom
            if (
                !sentMsgFlag &&
                autoscrollStatus != "scrolling" &&
                chatContainer &&
                bottomVisible &&
                (prevChatClientHeight != chatContainer.clientHeight || prevChatClientWidth != chatContainer.clientWidth)
            ) {
                scrollToBottom(true);
            }
            prevChatClientHeight = chatContainer.clientHeight;
            prevChatClientWidth = chatContainer.clientWidth;
            bottomVisible = entries.some((e) => e.isIntersecting);
        });
        observer.observe(bottomDetectionDiv);

        scrollToBottom();
        return () => observer.unobserve(bottomDetectionDiv);
    });
    onMount(() => {
        document.addEventListener("visibilitychange", handleVisibilityChanged);
        allowExpensiveCSSAnimations = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
        unreadChatMention.set(false);

        return () => document.removeEventListener("visibilitychange", handleVisibilityChanged);
    });

    type autoscrollStatusType =
        | "at-bottom"
        | "scrolled-up"
        | "scrolled-up-new-message"
        | "new-message"
        | "new-own-message"
        | "scrolling";
    let autoscrollStatus: autoscrollStatusType = "at-bottom";

    let sentMsgFlag = false;
    let hasNewMentions = false;
    $: {
        if (bottomVisible) {
            if (autoscrollStatus == "scrolled-up" || autoscrollStatus == "scrolled-up-new-message") {
                autoscrollStatus = "at-bottom";
            }
            hasNewMentions = false;
        }
    }

    beforeUpdate(() => {
        if (!document.hidden) {
            // when the document is hidden, shouldAutoScroll can be incorrectly set to false
            // because browsers stop doing visibility calculations when the page is in the background
            if (autoscrollStatus != "scrolling") {
                if (bottomVisible) {
                    if (
                        autoscrollStatus == "at-bottom" ||
                        autoscrollStatus == "scrolled-up" ||
                        autoscrollStatus == "scrolled-up-new-message"
                    ) {
                        autoscrollStatus = "at-bottom";
                    }
                } else if (autoscrollStatus != "new-own-message") {
                    autoscrollStatus = autoscrollStatus == "new-message" ? "scrolled-up-new-message" : "scrolled-up";
                }
            }
        }
    });
    afterUpdate(() => {
        if (!document.hidden && (autoscrollStatus == "new-message" || autoscrollStatus == "new-own-message")) {
            scrollToBottom();
        }
    });

    function handleVisibilityChanged() {
        if (!document.hidden && autoscrollStatus == "new-message") {
            scrollToBottom();
        }
    }

    function scrollToBottom(instant?: boolean) {
        autoscrollStatus = "scrolling";
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: instant ? "auto" : "smooth",
        });
        ensureScrollToBottom();
    }

    let lastSeenScrollTop: number;
    let onScrollCheckTimeout: number;
    function ensureScrollToBottom() {
        let curTop = chatContainer.scrollTop;
        if (lastSeenScrollTop != curTop) {
            if (lastSeenScrollTop > curTop) {
                // scrolled up, give up so we don't fight the user
                clearTimeout(onScrollCheckTimeout);
                lastSeenScrollTop = undefined;
                autoscrollStatus = bottomVisible ? "at-bottom" : "scrolled-up";
                return;
            }
            // still has not stopped scrolling
            lastSeenScrollTop = curTop;
            onScrollCheckTimeout = setTimeout(ensureScrollToBottom, 100);
        } else {
            clearTimeout(onScrollCheckTimeout);
            lastSeenScrollTop = undefined;
            if (!bottomVisible) {
                scrollToBottom(true);
            } else {
                autoscrollStatus = "at-bottom";
            }
        }
    }
    onDestroy(() => clearTimeout(onScrollCheckTimeout));

    let hasBlockedMessages = false;
    function refreshHasBlockedMessages(bu: Set<string>) {
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
    $: refreshHasBlockedMessages($blockedUsers);

    type requiredUpdateType = {
        messageCreated: boolean;
        messageDeleted: boolean;
        emoteCreated: boolean;
    };

    function handleChatEvent(event: ChatUpdateEvent, updatesRequired: requiredUpdateType): requiredUpdateType {
        if (event.hasMessageCreated()) {
            let msg = event.getMessageCreated().getMessage();
            if (seenMessageIDs.has(msg.getId())) {
                return updatesRequired;
            }
            seenMessageIDs.add(msg.getId());
            chatMessages.push(msg);
            if (msg.hasUserMessage()) {
                if ($blockedUsers.has(msg.getUserMessage().getAuthor().getAddress())) {
                    hasBlockedMessages = true;
                } else if (
                    msg.hasReference() &&
                    msg.getReference().getUserMessage().getAuthor().getAddress() == $rewardAddress
                ) {
                    hasNewMentions = true;
                }
            }
            updatesRequired.messageCreated = true;
        } else if (event.hasMessageDeleted()) {
            let deletedId = event.getMessageDeleted().getId();
            for (var i = chatMessages.length - 1; i >= 0; i--) {
                if (chatMessages[i].hasReference() && chatMessages[i].getReference().getId() == deletedId) {
                    chatMessages[i].clearReference();
                }
                if (chatMessages[i].getId() == deletedId) {
                    chatMessages.splice(i, 1);
                }
            }
            seenMessageIDs.delete(deletedId);
            updatesRequired.messageDeleted = true;
        } else if (event.hasDisabled()) {
            chatEnabled = false;
            switch (event.getDisabled().getReason()) {
                case ChatDisabledReason.UNSPECIFIED:
                    chatDisabledReason = "";
                    break;
                case ChatDisabledReason.MODERATOR_NOT_PRESENT:
                    chatDisabledReason = " because no moderators are available";
                    break;
            }
        } else if (event.hasEnabled()) {
            chatEnabled = true;
        } else if (event.hasBlockedUserCreated()) {
            $blockedUsers = $blockedUsers.add(event.getBlockedUserCreated().getBlockedUserAddress());
        } else if (event.hasBlockedUserDeleted()) {
            let bu = $blockedUsers;
            bu.delete(event.getBlockedUserDeleted().getBlockedUserAddress());
            $blockedUsers = bu;
        } else if (event.hasEmoteCreated()) {
            let newEmote = {
                id: event.getEmoteCreated().getId(),
                shortcode: event.getEmoteCreated().getShortcode(),
                animated: event.getEmoteCreated().getAnimated(),
                requiresSubscription: event.getEmoteCreated().getRequiresSubscription(),
            };
            chatEmotes.update((oldValue): chatEmote[] => {
                for (let emoteIdx = 0; emoteIdx < oldValue.length; emoteIdx++) {
                    let emote = oldValue[emoteIdx];
                    if (emote.id == newEmote.id) {
                        // update data of emote
                        oldValue[emoteIdx] = newEmote;
                        return oldValue;
                    }
                }
                // emote with this ID not present, add it
                oldValue.push(newEmote);
                return oldValue;
            });
            updatesRequired.emoteCreated = true;
        }
        return updatesRequired;
    }

    function handleChatUpdated(update: ChatUpdate): void {
        let updatesRequired = {
            messageCreated: false,
            messageDeleted: false,
            emoteCreated: false,
        };
        for (let event of update.getEventsList()) {
            updatesRequired = handleChatEvent(event, updatesRequired);
        }
        if (updatesRequired.messageCreated) {
            // this sort has millisecond precision. we can do nanosecond precision if we really need to, but this is easier
            chatMessages.sort(
                (first, second) => first.getCreatedAt().toDate().getTime() - second.getCreatedAt().toDate().getTime()
            );
            if (autoscrollStatus != "scrolling") {
                autoscrollStatus = sentMsgFlag ? "new-own-message" : "new-message";
            }
            sentMsgFlag = false;
            // avoid growing the set too large unnecessarily
            let removedMessages = chatMessages.splice(0, Math.max(0, chatMessages.length - messageHistorySize));
            for (let m of removedMessages) {
                seenMessageIDs.delete(m.getId());
            }
            chatMessages = chatMessages; // this triggers Svelte's reactivity
        }
        if (updatesRequired.messageDeleted) {
            chatMessages = chatMessages; // this triggers Svelte's reactivity
            refreshHasBlockedMessages($blockedUsers);
        }
        if (updatesRequired.emoteCreated) {
            let customEmoji: CustomEmoji[] = $chatEmotes.map((emote): CustomEmoji => {
                return {
                    name: emote.shortcode,
                    shortcodes: [emote.shortcode],
                    url: "/emotes/" + emote.id + (emote.animated ? ".gif" : ".webp"),
                    category: emote.requiresSubscription ? "Nice emotes" : "Emotes",
                };
            });
            $chatEmotesAsCustomEmoji = customEmoji;
        }
    }

    function shouldShowTimeSeparator(curIdx: number): boolean {
        if (curIdx == 0) {
            return true;
        }
        let groupInfo = chatSystemMessageGroupInfo[curIdx - 1];
        if (
            !chatSystemMessageGroupInfo[curIdx - 1].expand &&
            groupInfo.groupID != currentlyExpandedSystemMessageGroup
        ) {
            // last message was collapsed, always show separator after collapsed messages
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

    $: refreshSystemMessageGroupingInfo(chatMessages);

    function refreshSystemMessageGroupingInfo(chatMessages: ChatMessage[]) {
        let groups: systemMessageGroupInfo[] = [];
        groups.length = chatMessages.length;
        for (let i = 0; i < groups.length; i++) {
            groups[i] = {
                expand: true,
                isGroupHeader: false,
                isGroupFooter: false,
            };
        }

        let createGroup = function (startIndex: number, size: number) {
            for (let i = startIndex; i < startIndex + size; i++) {
                groups[i] = {
                    expand: false,
                    isGroupHeader: i == startIndex,
                    isGroupFooter: i == startIndex + size - 1,
                    groupID: chatMessages[startIndex].getId(),
                    groupSize: curGroupSize,
                };
            }
        };

        let curGroupSize = 0;
        // we start on the second to last message,
        // so that if the most recent chat message is always visible even if it is a system message
        for (let curIdx = chatMessages.length - 2; curIdx >= 0; curIdx--) {
            if (chatMessages[curIdx].hasSystemMessage()) {
                curGroupSize++;
                continue;
            }
            // not a system message anymore
            // let's see if we need to create a group
            if (curGroupSize >= systemMessageMinGroupSize) {
                // create new group starting on last seen message (= oldest message of the group)
                createGroup(curIdx + 1, curGroupSize);
            }
            curGroupSize = 0;
        }
        if (curGroupSize >= systemMessageMinGroupSize) {
            createGroup(0, curGroupSize);
        }
        chatSystemMessageGroupInfo = groups;
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
    let highlightedMessageID = "";
    let highlightedMessageTimeout: number;
    onDestroy(() => clearTimeout(highlightedMessageTimeout));
    function highlightMessage(message: ChatMessage) {
        let msgElement = (chatContainer.getRootNode() as ShadowRoot).getElementById("chat-message-" + message.getId());
        if (msgElement == null) {
            return;
        }
        msgElement.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightedMessageID = message.getId();
        clearTimeout(highlightedMessageTimeout);
        highlightedMessageTimeout = setTimeout(() => {
            highlightedMessageID = "";
            highlightedMessageTimeout = undefined;
        }, 2500);
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
                isApplicationTab: false,
            };
            dispatch("openSidebarTab", newTab);
        } else if (mode == "popout") {
            if (window.opener != null) {
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
    let detailsLastOpenForMsgID = "";
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
        detailsLastOpenForMsgID = detailsOpenForMsgID;
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

<div class="flex flex-col {containerClasses} relative" on:pointerenter={hideMessageDetails}>
    <div class="flex-grow overflow-y-auto px-2 relative" bind:this={chatContainer}>
        {#each chatMessages as message, idx (message.getId())}
            <div transition:fade|local={{ duration: 200 }} id="chat-message-{message.getId()}">
                {#if message.hasUserMessage() && !$blockedUsers.has(message.getUserMessage().getAuthor().getAddress())}
                    {#if shouldShowTimeSeparator(idx)}
                        <ChatSeparator>
                            {formatMessageCreatedAtForSeparator(idx)}
                        </ChatSeparator>
                    {/if}
                    <ChatUserMessage
                        {message}
                        additionalPadding={shouldAddAdditionalPadding(idx)}
                        {allowExpensiveCSSAnimations}
                        {mode}
                        {detailsOpenForMsgID}
                        {detailsLastOpenForMsgID}
                        highlighted={highlightedMessageID == message.getId()}
                        on:reply={() => replyToMessage(message)}
                        on:highlight={(e) => highlightMessage(e.detail)}
                        on:history={() => openChatHistoryForAuthorOfMessage(message)}
                        on:changeNickname={() => editNicknameForAuthorOfMessage(message)}
                        on:beginShowDetails={() => beginShowMessageDetails(message)}
                        on:showDetails={() => showMessageDetails(message)}
                        on:hideDetails={hideMessageDetails}
                    />
                {:else if message.hasSystemMessage()}
                    {#if chatSystemMessageGroupInfo[idx].isGroupHeader && chatSystemMessageGroupInfo[idx].groupID != currentlyExpandedSystemMessageGroup}
                        <ChatSeparator>
                            {chatSystemMessageGroupInfo[idx].groupSize} events collapsed.
                            <button
                                type="button"
                                class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                                on:click={() =>
                                    (currentlyExpandedSystemMessageGroup = chatSystemMessageGroupInfo[idx].groupID)}
                            >
                                Expand
                            </button>
                        </ChatSeparator>
                    {/if}
                    {#if chatSystemMessageGroupInfo[idx].expand || chatSystemMessageGroupInfo[idx].groupID == currentlyExpandedSystemMessageGroup}
                        {#if shouldShowTimeSeparator(idx)}
                            <ChatSeparator>
                                {formatMessageCreatedAtForSeparator(idx)}
                            </ChatSeparator>
                        {/if}
                        <ChatSystemMessage {message} />
                    {/if}
                    {#if chatSystemMessageGroupInfo[idx].isGroupFooter && chatSystemMessageGroupInfo[idx].groupID == currentlyExpandedSystemMessageGroup}
                        <ChatSeparator>
                            <button
                                type="button"
                                class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                                on:click={() => (currentlyExpandedSystemMessageGroup = "")}
                            >
                                Collapse {chatSystemMessageGroupInfo[idx].groupSize} events
                            </button>
                        </ChatSeparator>
                    {/if}
                {/if}
            </div>
        {:else}
            <div class="px-2 py-2">
                No messages. {#if chatEnabled}Say something!{/if}
            </div>
        {/each}
        <div class="h-2" bind:this={bottomDetectionDiv} />
    </div>
    {#if autoscrollStatus == "scrolled-up-new-message"}
        <div class="flex flex-row border-t border-gray-200 dark:border-gray-500">
            <div class="px-2 py-1 flex-grow">New {hasNewMentions ? "replies" : "messages"} below</div>
            <TabButton selected={false} on:click={() => scrollToBottom()}>
                Jump down <i class="fas fa-caret-down" />
            </TabButton>
        </div>
    {/if}
    <div class="border-t border-gray-300 shadow-md flex flex-col">
        {#if !$rewardAddress}
            <div class="p-2 text-gray-600 dark:text-gray-400">
                <a href="/rewards/address" use:link>Set a reward address</a> to chat.
            </div>
        {:else if !chatEnabled}
            <div class="p-2 text-gray-600 dark:text-gray-400">
                Chat currently disabled{#if chatDisabledReason != ""}{chatDisabledReason}{/if}.
            </div>
        {:else}
            <ChatComposeArea
                {allowExpensiveCSSAnimations}
                bind:replyingToMessage
                {hasBlockedMessages}
                on:sentMessage={() => (sentMsgFlag = true)}
            />
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
</style>
