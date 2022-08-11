<script lang="ts">
    import type { Options } from "youtube-player/dist/types";
    import type { QueueYouTubeVideoData } from "./proto/jungletv_pb";
    import YouTube from "./YouTube.svelte";

    export let data: QueueYouTubeVideoData;

    const options: Options = {
        height: "100%",
        width: "100%",
        //  see https://developers.google.com/youtube/player_parameters
        playerVars: {
            playsinline: 1,
        },
    };
</script>

<YouTube videoId={data.getId()} {options} class="w-full h-full" />
