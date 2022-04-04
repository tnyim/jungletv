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
    on:click={() => window.open("https://tenor.com/view/" + gif.getId(), "", "noopener")}
/>

<style lang="css">
    video {
        cursor: pointer;
        max-width: 130px;
        width: auto;
        height: auto;
        max-height: 90px;
        vertical-align: bottom;
        border-radius: 4px;
    }
</style>
