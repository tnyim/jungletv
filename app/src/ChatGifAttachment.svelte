<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ChatMessageTenorGifAttachment } from "./proto/jungletv_pb";
    import VisibilityGuard from "./uielements/VisibilityGuard.svelte";

    export let attachment: ChatMessageTenorGifAttachment;

    const dispatch = createEventDispatcher();

    let titleMinusGIF = "";
    $: {
        titleMinusGIF = attachment.getTitle();
        if (titleMinusGIF.endsWith(" GIF")) {
            titleMinusGIF = titleMinusGIF.substring(0, titleMinusGIF.length - 4);
        }
    }

    function openOnTenor(): boolean {
        window.open("https://tenor.com/view/" + attachment.getId(), "", "noopener");
        return true;
    }
</script>

<div class="relative" style="height: {attachment.getHeight()}px;">
    <VisibilityGuard let:visible>
        {#if visible}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
                title={attachment.getTitle()}
                width={attachment.getWidth()}
                height={attachment.getHeight()}
                autoplay={true}
                muted={true}
                controls={false}
                loop={true}
                playsinline={true}
                class="gif"
                on:load
                on:click={() => window.open("https://tenor.com/view/" + attachment.getId(), "", "noopener")}
            >
                <p>{attachment.getTitle()}</p>
                <source src={attachment.getVideoUrl()} type="video/webm" />
                <source src={attachment.getVideoFallbackUrl()} type="video/mp4" />
            </video>
            <div
                role="button"
                tabindex="0"
                class="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 focus:opacity-100 ease-linear transition-all duration-150"
                on:click={openOnTenor}
                on:keydown={(e) => {
                    ((e.key == "Enter" || e.key == "Space") && openOnTenor()) ||
                        (e.key == "Escape" && dispatch("collapse"));
                }}
            >
                <div class="p-1 mr-8 text-xs text-gray-100" style="text-shadow: 0px 0px 2.2px black">
                    <span class="font-bold">{titleMinusGIF}</span>
                    <br />Click to view on Tenor
                </div>
                <button
                    type="button"
                    class="absolute flex flex-row right-0 top-0 w-8 h-8 bg-gray-500 opacity-70 hover:opacity-100 text-white text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
                    title="Collapse GIF"
                    on:click={() => dispatch("collapse")}
                >
                    <i class="fas fa-times" />
                </button>
            </div>
        {:else}
            <div class="placeholder" style="height: {attachment.getHeight()}px;" />
        {/if}
    </VisibilityGuard>
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
    div.relative,
    .placeholder {
        width: fit-content;
        max-height: 200px;
    }
</style>
