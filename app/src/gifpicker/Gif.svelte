<script lang="ts">
    import type { ChatGifSearchResult } from "../proto/jungletv_pb";
    export let gif: ChatGifSearchResult;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
    src={gif.getPreviewUrl()}
    alt={gif.getTitle()}
    title={gif.getTitle()}
    width={gif.getWidth()}
    height={gif.getHeight()}
    autoplay={true}
    muted={true}
    controls={false}
    loop={true}
    class="gif"
    on:load
    on:error
/>

<style lang="css">
    video {
        max-width: 100%;
        height: auto;
        max-height: 100%;
        vertical-align: bottom;
        background: linear-gradient(to right, #4CBF4B, #FBDD11);
    }
</style>
