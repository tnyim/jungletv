<script lang="ts">
    import type { ChatGifSearchResult } from "../proto/jungletv_pb";
    export let gif: ChatGifSearchResult;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
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
>
    <source src={gif.getPreviewUrl()} type="video/webm" />
    <source src={gif.getPreviewFallbackUrl()} type="video/mp4" />
</video>

<style lang="css">
    video {
        max-width: 100%;
        height: auto;
        max-height: 100%;
        vertical-align: bottom;
        background: linear-gradient(to right, #4cbf4b, #fbdd11);
    }
</style>
