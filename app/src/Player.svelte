<script lang="ts">
    import YouTube from "./YouTube.svelte";
    import { apiClient } from "./api_client";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import { onDestroy, onMount } from "svelte";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import {
        activityChallengeReceived,
        currentlyWatching,
        mostRecentAnnouncement,
        playerConnected,
        playerCurrentTime,
        rewardBalance,
        rewardReceived,
        unreadAnnouncement,
        unreadChatMention,
    } from "./stores";

    const options: Options = {
        height: "100%",
        width: "100%",
        //  see https://developers.google.com/youtube/player_parameters
        playerVars: {
            autoplay: 1,
            playsinline: 1,
        },
    };

    export let fullSize: boolean;

    let videoId = "";
    let videoTitle = "";
    $: {
        if (fullSize && videoTitle != "") {
            document.title = videoTitle + " - JungleTV";
        } else {
            document.title = "JungleTV";
        }
    }

    let consumeMediaRequest: Request;
    let consumeMediaTimeoutHandle: number = null;
    let playerBecameReady = false;
    let firstSeekTo: number;
    let highestSeenLiveStreamCurrentTime: number;
    let highestSeenLiveStreamCurrentTimeIsForVideo: string;

    onMount(() => {
        consumeMedia();
        player.on("stateChange", (event) => {
            if (!playerBecameReady && event.data == 1 && firstSeekTo !== undefined) {
                playerBecameReady = true;
                player.seekTo(firstSeekTo, true);
            }
        });
    });
    function consumeMedia() {
        consumeMediaRequest = apiClient.consumeMedia(handleCheckpoint, (code, msg) => {
            playerConnected.update(() => false);
            activityChallengeReceived.update((_) => null);
            setTimeout(consumeMedia, 5000);
        });
    }
    function consumeMediaTimeout() {
        if (consumeMediaRequest !== undefined) {
            consumeMediaRequest.close();
        }
        consumeMedia();
    }
    onDestroy(() => {
        if (consumeMediaRequest !== undefined) {
            consumeMediaRequest.close();
        }
        if (consumeMediaTimeoutHandle != null) {
            clearTimeout(consumeMediaTimeoutHandle);
        }
        activityChallengeReceived.update((_) => null);
        document.title = "JungleTV";
    });

    async function handleCheckpoint(checkpoint: MediaConsumptionCheckpoint) {
        if (consumeMediaTimeoutHandle != null) {
            clearTimeout(consumeMediaTimeoutHandle);
        }
        consumeMediaTimeoutHandle = setTimeout(consumeMediaTimeout, 20000);
        playerConnected.update(() => true);
        if (checkpoint.getMediaPresent()) {
            let currentTimeFromServer = checkpoint.getCurrentPosition().getSeconds();
            playerCurrentTime.set(currentTimeFromServer);
            videoId = checkpoint.getYoutubeVideoData().getId();
            let currentPlayerTime = await player.getCurrentTime();
            if (!checkpoint.getLiveBroadcast()) {
                highestSeenLiveStreamCurrentTime = undefined;
                firstSeekTo = currentTimeFromServer;
                let leniencySeconds = 3;
                if (player.getVideoLoadedFraction() * player.getDuration() < 10) {
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
        } else {
            playerCurrentTime.set(0);
            player.stopVideo();
            if (videoId != "") {
                videoId = "cdwal5Kw3Fc"; // ensure whatever video was there is really gone
            } else {
                videoId = "";
            }
            videoTitle = "";
        }
        rewardReceived.update((_) => checkpoint.getReward());
        if (checkpoint.getRewardBalance() !== "") {
            rewardBalance.update((_) => checkpoint.getRewardBalance());
        }
        if (checkpoint.hasActivityChallenge()) {
            activityChallengeReceived.update((_) => checkpoint.getActivityChallenge());
        }
        if (checkpoint.hasLatestAnnouncement()) {
            unreadAnnouncement.set(
                parseInt(localStorage.getItem("lastSeenAnnouncement") ?? "-1") != checkpoint.getLatestAnnouncement()
            );
            mostRecentAnnouncement.set(checkpoint.getLatestAnnouncement());
        }
        if (checkpoint.hasHasChatMention() && checkpoint.getHasChatMention()) {
            unreadChatMention.set(true);
        }
        if (checkpoint.hasMediaTitle()) {
            videoTitle = checkpoint.getMediaTitle();
        }
        currentlyWatching.update((_) => checkpoint.getCurrentlyWatching());
    }

    let player: YouTubePlayer;
</script>

<YouTube {videoId} id="player" class="h-full w-full" {options} bind:player />
