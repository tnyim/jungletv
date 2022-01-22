<script lang="ts">
    import type { ChatMessage } from "./proto/jungletv_pb";

    export let message: ChatMessage;
    export let marked: any;
</script>

<div class="mt-1 flex flex-row text-xs justify-center items-center text-center">
    <div class="flex-1" />
    <div class="px-2 py-0.5 bg-gray-400 dark:bg-gray-600 text-white rounded text-center break-words max-w-full">
        {@html marked.parseInline(message.getSystemMessage().getContent())}
    </div>
    <div class="flex-1" />
</div>
