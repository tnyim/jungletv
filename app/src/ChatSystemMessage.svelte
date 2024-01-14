<script lang="ts">
    import type { ChatMessage } from "./proto/jungletv_pb";
    import { parseSystemMessageMarkdown } from "./utils";

    export let message: ChatMessage;

    // do this instead of using an #await block directly, as that breaks chat animations
    let renderedMessage = "";
    async function renderMessage(m) {
        renderedMessage = await parseSystemMessageMarkdown(m.getSystemMessage().getContent());
    }
    $: renderMessage(message);
</script>

<div class="mt-1 flex flex-row text-xs justify-center items-center text-center">
    <div class="flex-1" />
    <div class="px-2 py-0.5 bg-gray-400 dark:bg-gray-600 text-white rounded text-center break-words max-w-full">
        {@html renderedMessage}
    </div>
    <div class="flex-1" />
</div>
