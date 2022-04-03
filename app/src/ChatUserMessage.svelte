<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { apiClient } from "./api_client";
    import ChatGifAttachment from "./ChatGifAttachment.svelte";
    import ChatMessageDetails from "./ChatMessageDetails.svelte";

    import { getClassForMessageAuthor, getReadableMessageAuthor } from "./chat_utils";

    import { ChatMessage, ChatMessageAttachment, UserRole } from "./proto/jungletv_pb";
    import { blockedUsers, collapseGifs, rewardAddress } from "./stores";
    import { parseCompleteMarkdownInline, parseUserMessageMarkdown } from "./utils";

    export let message: ChatMessage;
    export let additionalPadding: boolean;
    export let mode: string;
    export let allowExpensiveCSSAnimations: boolean;
    export let detailsOpenForMsgID: string;

    let gifExpanded = false;
    let gifExplicitlyCollapsed = false;

    const dispatch = createEventDispatcher();

    function getBackgroundColorForMessage(): string {
        if (message.getUserMessage().getAuthor().getAddress() == $rewardAddress) {
            return "bg-gray-100 dark:bg-gray-800";
        } else if (
            message.hasReference() &&
            message.getReference().getUserMessage().getAuthor().getAddress() == $rewardAddress
        ) {
            return "bg-yellow-100 dark:bg-yellow-800";
        }
        return "";
    }

    async function removeChatMessage() {
        await apiClient.removeChatMessage(message.getId());
    }

    function renderMessage(): string {
        let result = "";
        if (message.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)) {
            result = parseCompleteMarkdownInline(message.getUserMessage().getContent());
        } else {
            result = parseUserMessageMarkdown(message.getUserMessage().getContent());
        }
        return result.replaceAll("<a ", '<a target="_blank" rel="noopener" ');
    }
</script>

{#if message.hasReference()}
    {#if $blockedUsers.has(message.getReference().getUserMessage().getAuthor().getAddress())}
        <p
            class="text-gray-600 dark:text-gray-400 text-xs {additionalPadding
                ? 'mt-2'
                : 'mt-1'} h-5 overflow-hidden italic
        {getBackgroundColorForMessage()}"
        >
            <i class="fas fa-reply" />
            <span class="italic">Message from blocked user</span>
        </p>
    {:else}
        <p
            class="text-gray-600 dark:text-gray-400 text-xs {additionalPadding
                ? 'mt-2'
                : 'mt-1'} h-5 overflow-hidden cursor-pointer {getBackgroundColorForMessage()}"
            on:click={() => dispatch("highlight", message.getReference())}
        >
            <i class="fas fa-reply" />
            <span class={getClassForMessageAuthor(message.getReference(), allowExpensiveCSSAnimations)}
                >{getReadableMessageAuthor(message.getReference())}</span
            >:
            {@html parseUserMessageMarkdown(message.getReference().getUserMessage().getContent())}
        </p>
    {/if}
{/if}
<div
    class="{additionalPadding && !message.hasReference()
        ? 'mt-1.5'
        : message.hasReference()
        ? ''
        : 'mt-0.5'} break-words relative
    {getBackgroundColorForMessage()}"
    on:pointerleave={(ev) => {
        if (ev.pointerType != "touch") {
            dispatch("hideDetails");
        }
    }}
>
    {#if mode == "moderation"}
        <i class="fas fa-trash cursor-pointer" on:click={() => removeChatMessage()} />
        <i class="fas fa-history cursor-pointer ml-1" on:click={() => dispatch("history")} />
        <i class="fas fa-edit cursor-pointer" on:click={() => dispatch("changeNickname")} />
    {/if}
    <div class="overflow-hidden">
        <span
            tabindex="0"
            on:keydown={(ev) => {
                if (ev.key == "Enter") {
                    dispatch("showDetails", message);
                }
            }}
            on:pointerenter={(ev) => {
                if (detailsOpenForMsgID == "" || ev.pointerType != "touch") {
                    dispatch("beginShowDetails", message);
                } else {
                    dispatch("hideDetails");
                }
            }}
        >
            <img
                src="https://monkey.banano.cc/api/v1/monkey/{message
                    .getUserMessage()
                    .getAuthor()
                    .getAddress()}?format=png"
                alt="&nbsp;"
                title="Click to reply"
                class="inline h-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                on:click={() => dispatch("reply")}
            />
            <span
                class="{getClassForMessageAuthor(message, allowExpensiveCSSAnimations)} cursor-pointer"
                title="Click to reply"
                on:click={() => dispatch("reply")}>{getReadableMessageAuthor(message)}</span
            >{#if message.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)}
                <i
                    class="fas fa-shield-alt text-xs ml-1 text-purple-700 dark:text-purple-500"
                    title="Chat moderator"
                />{/if}{#if message
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
        {@html renderMessage()}
        {#each message.getAttachmentsList() as attachment}
            {#if attachment.getAttachmentCase() === ChatMessageAttachment.AttachmentCase.TENOR_GIF}
                <div class="p-1 text-sm text-gray-600 dark:text-gray-400">
                    {#if (!$collapseGifs || gifExpanded) && !gifExplicitlyCollapsed}
                        <ChatGifAttachment
                            attachment={attachment.getTenorGif()}
                            on:collapse={() => {
                                gifExplicitlyCollapsed = true;
                            }}
                        />
                    {:else}
                        <i class="fas fa-photo-video" />
                        {attachment.getTenorGif().getTitle()} -
                        <span
                            class="text-blue-500 dark:text-blue-600 cursor-pointer hover:underline"
                            tabindex="0"
                            on:click={() => {
                                gifExplicitlyCollapsed = false;
                                gifExpanded = true;
                            }}
                            on:keydown={(ev) => ev.key == "Enter" && (gifExpanded = true)}
                        >
                            Show
                        </span>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
    {#if detailsOpenForMsgID == message.getId()}
        <ChatMessageDetails
            allowReplies={$rewardAddress != ""}
            msg={message}
            on:reply
            on:delete={() => removeChatMessage()}
            on:history
            on:changeNickname
            on:mouseLeft={() => dispatch("hideDetails")}
        />
    {/if}
</div>
