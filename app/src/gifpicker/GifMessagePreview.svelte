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
