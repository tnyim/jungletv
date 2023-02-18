<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { apiClient } from "./api_client";
    import ChatGifAttachment from "./ChatGifAttachment.svelte";
    import ChatMessageDetails from "./ChatMessageDetails.svelte";

    import { getClassForMessageAuthor, getReadableMessageAuthor } from "./chat_utils";
    import { UserRole } from "./proto/common_pb";

    import { ChatMessage, ChatMessageAttachment } from "./proto/jungletv_pb";
    import { blockedUsers, collapseGifs, rewardAddress } from "./stores";
    import VisibilityGuard from "./uielements/VisibilityGuard.svelte";
    import { buildMonKeyURL, parseUserMessageMarkdown } from "./utils";

    export let message: ChatMessage;
    export let additionalPadding: boolean;
    export let mode: string;
    export let allowExpensiveCSSAnimations: boolean;
    export let detailsOpenForMsgID: string;
    export let highlighted = false;

    let gifExpanded = false;
    let gifExplicitlyCollapsed = false;

    const dispatch = createEventDispatcher();

    function getBackgroundColorForMessage(highlighted: boolean): string {
        if (highlighted) {
            return "transition-colors ease-in-out duration-1000 bg-yellow-100 dark:bg-yellow-800";
        }
        if (message.getUserMessage().getAuthor().getAddress() == $rewardAddress) {
            return "transition-colors ease-in-out duration-1000 bg-gray-100 dark:bg-gray-800";
        } else if (
            message.hasReference() &&
            message.getReference().getUserMessage().getAuthor().getAddress() == $rewardAddress
        ) {
            return "transition-colors ease-in-out duration-1000 bg-yellow-100 dark:bg-yellow-800";
        }
        return "transition-colors ease-in-out duration-1000";
    }

    async function removeChatMessage() {
        await apiClient.removeChatMessage(message.getId());
    }

    function renderMessage(msg: ChatMessage): [string, boolean] {
        let result = "";
        let emotesOnly = false;
        [result, emotesOnly] = parseUserMessageMarkdown(
            msg.getUserMessage().getContent(),
            msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)
        );
        return [result.replaceAll("<a ", '<a target="_blank" rel="noopener" '), emotesOnly];
    }

    let renderedMessage = "";
    let emotesOnly = false;
    $: [renderedMessage, emotesOnly] = renderMessage(message);
</script>

{#if message.hasReference()}
    {#if $blockedUsers.has(message.getReference().getUserMessage().getAuthor().getAddress())}
        <p
            class="text-gray-600 dark:text-gray-400 text-xs {additionalPadding
                ? 'mt-2'
                : 'mt-1'} h-5 overflow-hidden italic whitespace-nowrap
        {getBackgroundColorForMessage(highlighted)}"
        >
            <i class="fas fa-reply" />
            <span class="italic">Message from blocked user</span>
        </p>
    {:else}
        <button
            class="text-gray-600 dark:text-gray-400 text-xs {additionalPadding
                ? 'mt-2'
                : 'mt-1'} block w-full text-left h-5 overflow-hidden whitespace-nowrap
                {getBackgroundColorForMessage(highlighted)}"
            on:click={() => dispatch("highlight", message.getReference())}
        >
            <i class="fas fa-reply" />
            <span class={getClassForMessageAuthor(message.getReference(), allowExpensiveCSSAnimations)}
                >{getReadableMessageAuthor(message.getReference())}</span
            >:
            {@html parseUserMessageMarkdown(message.getReference().getUserMessage().getContent(), false)[0]}
        </button>
    {/if}
{/if}
<div
    class="{additionalPadding && !message.hasReference()
        ? 'mt-1.5'
        : message.hasReference()
        ? ''
        : 'mt-0.5'} break-words relative
    {getBackgroundColorForMessage(highlighted)}"
    on:pointerleave={(ev) => {
        if (ev.pointerType != "touch") {
            dispatch("hideDetails");
        }
    }}
>
    {#if mode == "moderation"}
        <button type="button" class="inline cursor-pointer" on:click={() => removeChatMessage()}>
            <i class="fas fa-trash " />
        </button>
        <button type="button" class="inline cursor-pointer  ml-1" on:click={() => dispatch("history")}>
            <i class="fas fa-history" />
        </button>
        <button type="button" class="inline cursor-pointer ml-1" on:click={() => dispatch("changeNickname")}>
            <i class="fas fa-edit" />
        </button>
    {/if}
    <div class="{emotesOnly ? '' : 'overflow-hidden'} inline">
        <button
            type="button"
            class="inline {emotesOnly ? 'align-middle' : ''}"
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
            <VisibilityGuard let:visible divClass="inline">
                {#if visible}
                    <img
                        src={buildMonKeyURL(message.getUserMessage().getAuthor().getAddress())}
                        alt="&nbsp;"
                        title="Click to reply"
                        class="inline h-7 w-7 -ml-1 -mt-4 -mb-3 -mr-1 cursor-pointer"
                        on:click={() => dispatch("reply")}
                    />
                {:else}
                    <div class="inline-block h-7 w-7 -ml-1 -mt-4 -mb-3 -mr-1" />
                {/if}
            </VisibilityGuard>
            <button
                type="button"
                class="{getClassForMessageAuthor(message, allowExpensiveCSSAnimations)} inline cursor-pointer"
                title="Click to reply"
                data-rewards-address={message.getUserMessage().getAuthor().getAddress()}
                on:click|stopPropagation={(e) => dispatch("reply")}>{getReadableMessageAuthor(message)}</button
            >{#if message.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR) && message
                    .getUserMessage()
                    .getAuthor()
                    .getRolesList()
                    .includes(UserRole.VIP)}
                <i
                    class="fas fa-shield-alt text-xs ml-1 text-yellow-400 dark:text-yellow-600"
                    title="VIP Chat moderator"
                />{:else if message.getUserMessage().getAuthor().getRolesList().includes(UserRole.VIP)}
                <i
                    class="fas fa-crown text-xs ml-1 text-yellow-400 dark:text-yellow-600"
                    title="VIP"
                />{:else if message.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)}
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
                    title="Requester of currently playing content"
                />{/if}:
        </button>
        <span class={emotesOnly ? "text-2xl align-middle" : ""}>{@html renderedMessage}</span>
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
                        <button
                            type="button"
                            class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline inline"
                            on:click={() => {
                                gifExplicitlyCollapsed = false;
                                gifExpanded = true;
                            }}
                        >
                            Show
                        </button>
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
