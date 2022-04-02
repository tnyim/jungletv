<script lang="ts">
    import type { ChatMessageTenorGifAttachment } from "./proto/jungletv_pb";
    export let attachment: ChatMessageTenorGifAttachment;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
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
