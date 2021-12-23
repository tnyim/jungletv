<script lang="ts">
    import type { Options } from "youtube-player/dist/types";
    import { UserProfileResponse } from "./proto/jungletv_pb";
    import YouTube from "./YouTube.svelte";

    export let userProfile: UserProfileResponse;

    const options: Options = {
        height: "100%",
        width: "100%",
        //  see https://developers.google.com/youtube/player_parameters
        playerVars: {
            playsinline: 1,
        },
    };
</script>

{#if userProfile.getFeaturedMediaCase() == UserProfileResponse.FeaturedMediaCase.YOUTUBE_VIDEO_DATA}
    <YouTube videoId={userProfile.getYoutubeVideoData().getId()} {options} class="w-full h-full" />
{/if}
