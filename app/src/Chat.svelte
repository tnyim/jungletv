<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount, beforeUpdate, afterUpdate } from "svelte";
    import { link } from "svelte-navigator";
    import { ChatDisabledReason, ChatMessage, ChatUpdate } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { fade } from "svelte/transition";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { rewardAddress } from "./stores";
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
    let sendError = false;
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
            chatMessages = chatMessages; // this triggers Svelte's reactivity
        } else if (update.hasMessageDeleted()) {
            for (var i = chatMessages.length - 1; i >= 0; i--) {
                if (chatMessages[i].getId() == update.getMessageDeleted().getId()) {
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
        let prevMsgDate = DateTime.fromJSDate(chatMessages[curIdx - 1].getCreatedAt().toDate());
        return !thisMsgDate.hasSame(prevMsgDate, "minute");
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

    async function sendMessage() {
        let msg = composedMessage;
        if (msg == "") {
            return;
        }
        composedMessage = "";
        sentMsgFlag = true;
        try {
            await apiClient.sendChatMessage(msg);
        } catch (ex) {
            sendError = true;
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
            await sendMessage();
            autoresize(ta);
            return false;
        }
        return true;
    }

    async function copyAddress(address: string) {
        try {
            await navigator.clipboard.writeText(address);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    }
    function focusOnInit(el: HTMLElement) {
        el.focus();
    }

    async function removeChatMessage(id: string) {
        await apiClient.removeChatMessage(id);
    }
</script>

<div class="flex flex-col {mode == 'moderation' ? '' : 'chat-max-height h-full'}">
    <div class="flex-grow overflow-y-auto px-2 pb-2" bind:this={chatContainer}>
        {#each chatMessages as msg, idx}
            {#if shouldShowTimeSeparator(idx)}
                <div class="pt-1 flex flex-row text-xs text-gray-600 justify-center items-center">
                    <hr class="flex-1 ml-8" />
                    <div class="px-2">{formatMessageCreatedAtForSeparator(idx)}</div>
                    <hr class="flex-1 mr-8" />
                </div>
            {/if}
            {#if msg.hasUserMessage()}
                <p
                    class="{shouldAddAdditionalPadding(idx) ? 'pt-1.5' : 'pb-0.5'} break-words"
                    transition:fade|local={{ duration: 200 }}
                >
                    {#if mode == "moderation"}
                        <i class="fas fa-trash cursor-pointer" on:click={() => removeChatMessage(msg.getId())} />
                    {/if}
                    <img
                        src="https://monkey.banano.cc/api/v1/monkey/{msg.getUserMessage().getAuthor().getAddress()}"
                        alt={msg.getUserMessage().getAuthor().getAddress()}
                        title="Click to copy: {msg.getUserMessage().getAuthor().getAddress()}"
                        class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                        on:click={() => copyAddress(msg.getUserMessage().getAuthor().getAddress())}
                    />
                    <span
                        class="font-mono cursor-pointer"
                        style="font-size: 0.70rem;"
                        title="Click to copy: {msg.getUserMessage().getAuthor().getAddress()}"
                        on:click={() => copyAddress(msg.getUserMessage().getAuthor().getAddress())}
                        >{msg.getUserMessage().getAuthor().getAddress().substr(0, 14)}</span
                    >:
                    {@html marked.parseInline(msg.getUserMessage().getContent())}
                </p>
                {:else if msg.hasSystemMessage()}
                <div class="pt-1 flex flex-row text-xs justify-center items-center">
                    <div class="flex-1" />
                    <div class="px-2 py-0.5 bg-gray-400 text-white rounded-sm">{@html marked.parseInline(msg.getSystemMessage().getContent())}</div>
                    <div class="flex-1" />
                </div>
            {/if}
        {:else}
            <div class="px-2 py-2">
                No messages. {#if chatEnabled}Say something!{/if}
            </div>
        {/each}
    </div>
    <div class="border-t border-gray-300 shadow-md">
        {#if rAddress == ""}
            <div class="p-2 text-gray-600">
                <a href="/rewards/address" use:link class="text-blue-600 hover:underline">Set a reward address</a> to chat.
            </div>
        {:else if !chatEnabled}
            <div class="p-2 text-gray-600">
                Chat currently disabled{#if chatDisabledReason != ""}{chatDisabledReason}{/if}.
            </div>
        {:else}
            {#if sendError}
                <div class="px-2 text-xs">
                    <ErrorMessage>Failed to send your message. Please try again.</ErrorMessage>
                </div>
            {/if}
            <div class="flex flex-row">
                <textarea
                    use:autoresize
                    bind:this={composeTextArea}
                    bind:value={composedMessage}
                    on:keydown={handleEnter}
                    use:focusOnInit
                    class="flex-grow p-2 resize-none max-h-32 focus:outline-none"
                    placeholder="Say something..."
                    maxlength="512"
                />

                <button
                    class="text-purple-700 min-h-full w-10 p-2 shadow-md bg-gray-100 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
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
        max-height: calc(100vh - 12rem);
    }
    @media (min-width: 1024px) {
        .chat-max-height {
            max-height: 100%;
        }
    }
</style>
