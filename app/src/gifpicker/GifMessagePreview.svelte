<script lang="ts">
    import type { ChatGifSearchResult } from "../proto/jungletv_pb";
    export let gif: ChatGifSearchResult;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
{#key gif}
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
        on:click={() => window.open("https://tenor.com/view/" + gif.getId(), "", "noopener")}
    >
        <source src={gif.getPreviewUrl()} type="video/webm" />
        <source src={gif.getPreviewFallbackUrl()} type="video/mp4" />
    </video>
{/key}

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
