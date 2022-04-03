<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { ChatMessageTenorGifAttachment } from "./proto/jungletv_pb";
    export let attachment: ChatMessageTenorGifAttachment;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div class="w-auto relative">
    <video
        src={attachment.getVideoUrl()}
        alt={attachment.getTitle()}
        title={attachment.getTitle()}
        width={attachment.getWidth()}
        height={attachment.getHeight()}
        autoplay={true}
        muted={true}
        controls={false}
        loop={true}
        class="gif"
        on:load
        on:error
        on:click={() => window.open("https://tenor.com/view/" + attachment.getId(), "", "noopener")}
    />
    <button
        class="absolute flex flex-row right-0 top-0 w-8 h-8 bg-gray-500 text-white opacity-0 hover:opacity-100 focus:opacity-100 cursor-pointer text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
        title="Collapse GIF"
        on:click={() => dispatch("collapse")}
    >
        <i class="fas fa-times" />
    </button>
</div>

<style lang="css">
    video {
        cursor: pointer;
        max-width: 100%;
        width: auto;
        height: auto;
        max-height: 200px;
        vertical-align: bottom;
        border-radius: 2px;
    }
</style>
