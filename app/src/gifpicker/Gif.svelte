<script lang="ts">
    import type { ChatGifSearchResult } from "../proto/jungletv_pb";
    export let gif: ChatGifSearchResult;

    let errored = false;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
    src={errored ? gif.getPreviewFallbackUrl() : gif.getPreviewUrl()}
    alt={gif.getTitle()}
    title={gif.getTitle()}
    width={gif.getWidth()}
    height={gif.getHeight()}
    autoplay={true}
    muted={true}
    controls={false}
    loop={true}
    playsinline={true}
    class="gif"
    on:load
    on:error={() => (errored = true)}
/>

<style lang="css">
    video {
        max-width: 100%;
        height: auto;
        max-height: 100%;
        vertical-align: bottom;
        background: linear-gradient(to right, #4cbf4b, #fbdd11);
    }
</style>
