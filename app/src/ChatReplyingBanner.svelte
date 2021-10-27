<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { getClassForMessageAuthor, getReadableMessageAuthor } from "./chat_utils";

    import type { ChatMessage } from "./proto/jungletv_pb";
    import { copyToClipboard } from "./utils";

    const dispatch = createEventDispatcher();

    export let replyingToMessage: ChatMessage;
    export let allowExpensiveCSSAnimations: boolean;
</script>

<div class="flex flex-row">
    <div class="flex-grow px-2 text-xs overflow-hidden">
        Replying to
        <span class="{getClassForMessageAuthor(replyingToMessage, allowExpensiveCSSAnimations)} h-5"
            >{getReadableMessageAuthor(replyingToMessage)}</span
        >
        <span
            class="cursor-pointer text-gray-600 dark:text-gray-400 hover:underline float-right"
            on:click={() => copyToClipboard(replyingToMessage.getUserMessage().getAuthor().getAddress())}
            >Copy address</span
        >
        <div class="text-gray-600 dark:text-gray-400 overflow-hidden h-5">
            <slot name="message-content" />
        </div>
    </div>
    <button
        title="Stop replying"
        class="text-purple-700 dark:text-purple-500 min-h-full w-10 p-2 shadow-md
            bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
            cursor-pointer ease-linear transition-all duration-150"
        on:click={() => dispatch("clearReply")}
    >
        <i class="fas fa-times-circle" />
    </button>
</div>
