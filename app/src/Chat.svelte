<script lang="ts">
    import { apiClient } from "./api_client";
    import { onDestroy, onMount, beforeUpdate, afterUpdate } from "svelte";
    import { link } from "svelte-navigator";
    import { ChatDisabledReason, ChatMessage, ChatUpdate } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { autoresize } from "svelte-textarea-autoresize";
    import { fade } from "svelte/transition";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { rewardAddress } from "./stores";

    export let mode = "sidebar";

    let composedMessage = "";
    let sendError = false;
    let chatEnabled = true;
    let chatDisabledReason = "";
    let chatMessages: ChatMessage[] = [];
    let consumeChatRequest: Request;
    let chatContainer: HTMLElement;

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
    beforeUpdate(() => {
        shouldAutoScroll =
            chatContainer && chatContainer.offsetHeight + chatContainer.scrollTop > chatContainer.scrollHeight - 40;
    });
    afterUpdate(() => {
        if (shouldAutoScroll)
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: "smooth",
            });
    });

    function handleChatUpdated(update: ChatUpdate) {
        if (update.hasMessageCreated()) {
            chatMessages.push(update.getMessageCreated().getMessage());
            // this sort has millisecond precision. we can do nanosecond precision if we really need to, but this is easier
            chatMessages.sort(
                (first, second) => first.getCreatedAt().toDate().getTime() - second.getCreatedAt().toDate().getTime()
            );
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

    async function sendMessage() {
        let msg = composedMessage;
        if (msg == "") {
            return;
        }
        composedMessage = "";
        try {
            await apiClient.sendChatMessage(msg);
        } catch (ex) {
            sendError = true;
            setTimeout(() => (sendError = false), 5000);
        }
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
    <div class="flex-grow lg:overflow-y-auto px-2 pb-2" bind:this={chatContainer}>
        {#each chatMessages as msg}
            <p class="pt-2 break-words" transition:fade|local={{ duration: 200 }}>
                {#if mode == "moderation"}
                    <i class="fas fa-trash cursor-pointer" on:click={() => removeChatMessage(msg.getId())} />
                {/if}
                <img
                    src="https://monkey.banano.cc/api/v1/monkey/{msg.getAuthor().getAddress()}"
                    alt={msg.getAuthor().getAddress()}
                    title="Click to copy: {msg.getAuthor().getAddress()}"
                    class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                    on:click={() => copyAddress(msg.getAuthor().getAddress())}
                />
                <span
                    class="font-mono cursor-pointer"
                    style="font-size: 0.70rem;"
                    title="Click to copy: {msg.getAuthor().getAddress()}"
                    on:click={() => copyAddress(msg.getAuthor().getAddress())}
                    >{msg.getAuthor().getAddress().substr(0, 14)}</span
                >:
                {#each msg.getContent().split("\n") as line, i}
                    {line}
                    {#if i < msg.getContent().split("\n").length}
                        <br />
                    {/if}
                {/each}
            </p>
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
                    bind:value={composedMessage}
                    on:keydown={handleEnter}
                    use:focusOnInit
                    class="flex-grow p-2 resize-none max-h-32 focus:outline-none"
                    placeholder="Say something..."
                    maxlength="512"
                />

                <button
                    class="text-purple-700 h-full w-10 p-2 shadow-md bg-gray-100 hover:bg-gray-200 cursor-pointer ease-linear transition-all duration-150"
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
        max-height: 90vh;
    }
    @media (min-width: 1024px) {
        .chat-max-height {
            max-height: 100%;
        }
    }
</style>
