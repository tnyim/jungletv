<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount, beforeUpdate, afterUpdate } from "svelte";
    import { link } from "svelte-navigator";
    import { ChatDisabledReason, ChatMessage, ChatUpdate, User, UserRole } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { fade } from "svelte/transition";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { darkMode, rewardAddress } from "./stores";
    import { DateTime } from "luxon";
    import marked from "marked/lib/marked.esm.js";

    // @ts-ignore no type info available
    import { autoresize } from "svelte-textarea-autoresize";

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
    let sendErrorIsRateLimit = false;
    let chatEnabled = true;
    let chatDisabledReason = "";
    let chatMessages: ChatMessage[] = [];
    let seenMessageIDs: { [id: string]: boolean } = {};
    let consumeChatRequest: Request;
    let chatContainer: HTMLElement;
    let composeTextArea: HTMLTextAreaElement;

    onMount(consumeChat);
    function consumeChat() {
        chatEnabled = true;
        consumeChatRequest = apiClient.consumeChat(50, handleChatUpdated, (code, msg) => {
            setTimeout(consumeChat, 5000);
        });
    }
    onDestroy(() => {
        if (consumeChatRequest !== undefined) {
            consumeChatRequest.close();
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
        shouldAutoScroll =
            chatContainer && chatContainer.offsetHeight + chatContainer.scrollTop > chatContainer.scrollHeight - 40;
    });
    afterUpdate(() => {
        if (shouldAutoScroll || mustAutoScroll) {
            mustAutoScroll = false;
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    });

    function handleChatUpdated(update: ChatUpdate): void {
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
        sentMsgFlag = true;
        try {
            await apiClient.sendChatMessage(msg, event.isTrusted, refMsg);
        } catch (ex) {
            composedMessage = msg;
            sendError = true;
            sendErrorIsRateLimit = ex instanceof Error && (ex as Error).toString().includes("rate limit reached");
            setTimeout(() => (sendError = false), 5000);
        }
        composeTextArea.focus();
    }
    async function handleEnter(event: KeyboardEvent) {
        let ta = event.target as HTMLTextAreaElement;
        if (event.key === "Enter") {
            if (event.altKey || event.ctrlKey || event.shiftKey) {
                if (!event.shiftKey) ta.value += "\n";
                autoresize(ta);
                return true;
            }
            event.preventDefault();
            await sendMessage(event);
            autoresize(ta);
            return false;
        }
        return true;
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

    async function copyToClipboard(content: string) {
        try {
            await navigator.clipboard.writeText(content);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    }

    function getBackgroundColorForMessage(msg: ChatMessage): string {
        if (msg.getUserMessage().getAuthor().getAddress() == rAddress) {
            return "bg-gray-100 dark:bg-gray-800";
        } else if (msg.hasReference() && msg.getReference().getUserMessage().getAuthor().getAddress() == rAddress) {
            return "bg-yellow-100 dark:bg-yellow-800";
        }
        return "";
    }
</script>

<div class="flex flex-col {mode == 'moderation' ? '' : 'chat-max-height h-full'}">
    <div class="flex-grow overflow-y-auto px-2 pb-2 relative" bind:this={chatContainer}>
        {#each chatMessages as msg, idx}
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
                                : 'mt-1'} h-4 overflow-hidden cursor-pointer
                                {getBackgroundColorForMessage(msg)}"
                            on:click={() => highlightMessage(msg.getReference())}
                        >
                            <i class="fas fa-reply" />
                            <span class="font-mono" style="font-size: 0.70rem;"
                                >{msg.getReference().getUserMessage().getAuthor().getAddress().substr(0, 14)}</span
                            >:
                            {@html marked.parseInline(msg.getReference().getUserMessage().getContent())}
                        </p>
                    {/if}
                    <p
                        class="{shouldAddAdditionalPadding(idx) && !msg.hasReference()
                            ? 'mt-1.5'
                            : msg.hasReference()
                            ? 'pt-0.5'
                            : 'mt-0.5'} break-words
                            {getBackgroundColorForMessage(msg)}"
                    >
                        {#if mode == "moderation"}
                            <i class="fas fa-trash cursor-pointer" on:click={() => removeChatMessage(msg.getId())} />
                        {/if}
                        <img
                            src="https://monkey.banano.cc/api/v1/monkey/{msg.getUserMessage().getAuthor().getAddress()}"
                            alt={msg.getUserMessage().getAuthor().getAddress()}
                            title="Click to reply"
                            class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                            on:click={() => replyToMessage(msg)}
                        />
                        <span
                            class="font-mono cursor-pointer"
                            style="font-size: 0.70rem;"
                            title="Click to reply"
                            on:click={() => replyToMessage(msg)}
                            >{msg.getUserMessage().getAuthor().getAddress().substr(0, 14)}</span
                        >{#if msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)}
                            <i
                                class="fas fa-shield-alt text-xs ml-1 text-purple-700 dark:text-purple-500"
                                title="Chat moderator"
                            />{/if}:
                        {@html marked
                            .parseInline(
                                msg.getUserMessage().getContent(),
                                msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)
                                    ? { tokenizer: undefined }
                                    : {}
                            )
                            .replace("<a ", '<a class="text-blue-600 hover:underline" target="_blank" rel="noopener" ')}
                    </p>
                {:else if msg.hasSystemMessage()}
                    <div class="mt-1 flex flex-row text-xs justify-center items-center text-center">
                        <div class="flex-1" />
                        <div class="px-2 py-0.5 bg-gray-400 dark:bg-gray-600 text-white rounded-sm text-center">
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
    <div class="border-t border-gray-300 shadow-md">
        {#if rAddress == ""}
            <div class="p-2 text-gray-600 dark:text-gray-400">
                <a href="/rewards/address" use:link class="text-blue-600 hover:underline">Set a reward address</a> to chat.
            </div>
        {:else if !chatEnabled}
            <div class="p-2 text-gray-600 dark:text-gray-400">
                Chat currently disabled{#if chatDisabledReason != ""}{chatDisabledReason}{/if}.
            </div>
        {:else}
            {#if sendError}
                <div class="px-2 text-xs">
                    <ErrorMessage>
                        {#if sendErrorIsRateLimit}
                            Failed to send your message. Please try again.
                        {:else}
                            You're going too fast. Slow down.
                        {/if}
                    </ErrorMessage>
                </div>
            {/if}
            {#if replyingToMessage !== undefined}
                <div class="flex flex-row">
                    <div class="flex-grow px-2 text-xs">
                        Replying to
                        <span
                            class="font-mono cursor-pointer"
                            style="font-size: 0.70rem;"
                            on:click={() =>
                                copyToClipboard(replyingToMessage.getUserMessage().getAuthor().getAddress())}
                            >{replyingToMessage.getUserMessage().getAuthor().getAddress().substr(0, 14)}</span
                        >
                        <span
                            class="cursor-pointer text-gray-600 dark:text-gray-400"
                            on:click={() =>
                                copyToClipboard(replyingToMessage.getUserMessage().getAuthor().getAddress())}
                            >(click to copy address)</span
                        >
                        <div class="text-gray-600 dark:text-gray-400 overflow-hidden h-4">
                            {@html marked.parseInline(replyingToMessage.getUserMessage().getContent())}
                        </div>
                    </div>
                    <button
                        title="Stop replying"
                        class="text-purple-700 dark:text-purple-500 min-h-full w-10 p-2 shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ease-linear transition-all duration-150"
                        on:click={clearReplyToMessage}
                    >
                        <i class="fas fa-times-circle" />
                    </button>
                </div>
            {/if}
            <div class="flex flex-row">
                <textarea
                    use:autoresize
                    bind:this={composeTextArea}
                    bind:value={composedMessage}
                    on:keydown={handleEnter}
                    use:focusOnInit
                    class="flex-grow p-2 resize-none max-h-32 focus:outline-none dark:bg-gray-900"
                    placeholder="Say something..."
                    maxlength="512"
                />

                <button
                    title="Send message"
                    class="text-purple-700 dark:text-purple-500 min-h-full w-10 p-2 shadow-md bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
                    on:click={sendMessage}
                >
                    <i class="fas fa-paper-plane" />
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .chat-max-height {
        max-height: max(250px, calc(100vh - 56.25vw - 4rem - 48px));
    }
    @media (min-width: 1024px) {
        .chat-max-height {
            max-height: 100%;
        }
    }
</style>
