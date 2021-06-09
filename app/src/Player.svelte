<script lang="ts">
    import YouTube from "./YouTube.svelte";
    import { apiClient } from "./api_client";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import type { YouTubePlayer } from "youtube-player/dist/types";
    import { onDestroy, onMount } from "svelte";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { activityChallengeReceived, currentlyWatching, playerConnected, rewardReceived } from "./stores";

    const options = {
        height: "100%",
        width: "100%",
        //  see https://developers.google.com/youtube/player_parameters
        playerVars: {
            autoplay: 1,
        },
    };

    let consumeMediaRequest: Request;
    let playerBecameReady = false;
    let firstSeekTo = 0;

    onMount(() => {
        consumeMedia();
        player.on("stateChange", (event) => {
            if (!playerBecameReady && (event.data == 1)) {
                playerBecameReady = true;
                player.seekTo(firstSeekTo, true);
            }
        });
    });
    function consumeMedia() {
        consumeMediaRequest = apiClient.consumeMedia(handleCheckpoint, (code, msg) => {
            playerConnected.update(() => false);
            setTimeout(consumeMedia, 5000);
        });
    }
    onDestroy(() => {
        if (consumeMediaRequest !== undefined) {
            consumeMediaRequest.close();
        }
    });

    let videoId = "";

    async function handleCheckpoint(checkpoint: MediaConsumptionCheckpoint) {
        playerConnected.update(() => true);
        if (checkpoint.getMediaPresent()) {
            videoId = checkpoint.getYoutubeVideoData().getId();
            let currentTimeFromServer = checkpoint.getCurrentPosition().getSeconds();
            firstSeekTo = currentTimeFromServer;
            let currentPlayerTime = await player.getCurrentTime();
            if (Math.abs(currentPlayerTime - currentTimeFromServer) > 3) {
                player.seekTo(currentTimeFromServer, true);
            }
        } else {
            videoId = "";
        }
        if (checkpoint.getReward() !== "") {
            rewardReceived.update((_) => checkpoint.getReward());
        }
        if (checkpoint.getActivityChallenge() !== "") {
            activityChallengeReceived.update((_) => checkpoint.getActivityChallenge());
        }
        currentlyWatching.update((_) => checkpoint.getCurrentlyWatching());
    }

    let player: YouTubePlayer;
</script>

<YouTube {videoId} id="player" class="h-full w-full" {options} bind:player />
