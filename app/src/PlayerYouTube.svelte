<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import { playerVolume } from "./stores";
    import YouTube from "./YouTube.svelte";

    const options: Options = {
        height: "100%",
        width: "100%",
        //  see https://developers.google.com/youtube/player_parameters
        playerVars: {
            autoplay: 1,
            playsinline: 1,
        },
    };

    let videoId = "";

    export let checkpoint: MediaConsumptionCheckpoint;

    let updatePlayerVolumeIntervalHandle: number = null;
    let playerBecameReady = false;
    let firstSeekTo: number;
    let highestSeenLiveStreamCurrentTime: number;
    let highestSeenLiveStreamCurrentTimeIsForVideo: string;

    onMount(() => {
        player.on("stateChange", (event) => {
            if (!playerBecameReady && event.data == 1 && firstSeekTo !== undefined) {
                playerBecameReady = true;
                updatePlayerVolumeIntervalHandle = setInterval(updatePlayerVolume, 10000);
                if ($playerVolume > 0){
                    player.unMute();
                    player.setVolume($playerVolume * 100);
                } else {
                    player.mute();
                }
                player.seekTo(firstSeekTo, true);
            }
        });

        document.addEventListener("visibilitychange", updatePlayerVolume);
    });

    onDestroy(() => {
        if (updatePlayerVolumeIntervalHandle != null) {
            clearInterval(updatePlayerVolumeIntervalHandle);
        }
        document.removeEventListener("visibilitychange", updatePlayerVolume);
    });

    let player: YouTubePlayer;

    async function updatePlayerVolume() {
        if (typeof player !== "undefined") {
            $playerVolume = (await player.isMuted()) ? 0 : (await player.getVolume()) / 100;
        }
    }

    async function handleCheckpoint(checkpoint: MediaConsumptionCheckpoint) {
        let currentTimeFromServer = checkpoint.getCurrentPosition().getSeconds();
        videoId = checkpoint.getYoutubeVideoData().getId();
        let currentPlayerTime = await player.getCurrentTime();
        if (!checkpoint.getLiveBroadcast()) {
            highestSeenLiveStreamCurrentTime = undefined;
            firstSeekTo = currentTimeFromServer;
            let leniencySeconds = 3;
            if ((await player.getVideoLoadedFraction()) * (await player.getDuration()) < 10) {
                leniencySeconds = 10;
            }
            if (Math.abs(currentPlayerTime - currentTimeFromServer) > leniencySeconds) {
                player.seekTo(currentTimeFromServer, true);
            }
        } else {
            if (
                highestSeenLiveStreamCurrentTime === undefined ||
                highestSeenLiveStreamCurrentTime < currentPlayerTime ||
                highestSeenLiveStreamCurrentTimeIsForVideo != videoId
            ) {
                highestSeenLiveStreamCurrentTime = currentPlayerTime;
                highestSeenLiveStreamCurrentTimeIsForVideo = videoId;
            } else if (currentPlayerTime < highestSeenLiveStreamCurrentTime) {
                player.seekTo(Number.MAX_VALUE, true);
            }
        }
    }

    $: {
        if (typeof player !== "undefined" && checkpoint.getMediaPresent() && checkpoint.hasYoutubeVideoData()) {
            handleCheckpoint(checkpoint);
        }
    }
</script>

<YouTube {videoId} id="player" class="h-full w-full" {options} bind:player />
