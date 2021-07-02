<script lang="ts">
    import YouTube from "./YouTube.svelte";
    import { apiClient } from "./api_client";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import type { YouTubePlayer } from "youtube-player/dist/types";
    import { onDestroy, onMount } from "svelte";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { activityChallengeReceived, currentlyWatching, playerConnected, rewardReceived } from "./stores";
    import { pow_callback, pow_initiate, pow_terminate } from "./pow";

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
    let workers: Worker[];

    function shouldDoWorkGeneration() {
        return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    onMount(() => {
        consumeMedia();
        player.on("stateChange", (event) => {
            if (!playerBecameReady && event.data == 1) {
                playerBecameReady = true;
                player.seekTo(firstSeekTo, true);
            }
        });
    });
    function consumeMedia() {
        consumeMediaRequest = apiClient.consumeMedia(shouldDoWorkGeneration(), handleCheckpoint, (code, msg) => {
            playerConnected.update(() => false);
            activityChallengeReceived.update((_) => "");
            setTimeout(consumeMedia, 5000);
        });
    }
    onDestroy(() => {
        if (consumeMediaRequest !== undefined) {
            consumeMediaRequest.close();
        }
        activityChallengeReceived.update((_) => "");
        if (workers !== undefined && workers.length > 0) {
            try {
                pow_terminate(workers);
            } catch (e) {
                console.log("pow_terminate", e);
            }
        }
    });

    let videoId = "";

    function dec2hex(str) {
        // .toString(16) only works up to 2^53
        var dec = str.toString().split(""),
            sum = [],
            hex = [],
            i,
            s;
        while (dec.length) {
            s = 1 * dec.shift();
            for (i = 0; s || i < sum.length; i++) {
                s += (sum[i] || 0) * 10;
                sum[i] = s % 16;
                s = (s - sum[i]) / 16;
            }
        }
        while (sum.length) {
            hex.push(sum.pop().toString(16));
        }
        return hex.join("");
    }

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
        if (checkpoint.hasPowTask()) {
            try {
                workers = pow_initiate(undefined, "/assets/vendor/pow/");
                if (workers === undefined || workers.length == 0) {
                    return;
                }

                let task = checkpoint.getPowTask();
                // convert the bytes to hex strings
                let previous = task
                    .getPrevious_asU8()
                    .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
                let target = task.getTarget_asU8().reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
                let workTimeout = setTimeout(() => {
                    if (workers !== undefined) {
                        pow_terminate(workers);
                    }
                }, 10000);
                pow_callback(
                    workers,
                    previous,
                    target,
                    () => {},
                    async (work) => {
                        clearTimeout(workTimeout);
                        // convert the hex string to a Uint8Array
                        let workArray = new Uint8Array(work.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
                        await apiClient.submitProofOfWork(task.getPrevious_asU8(), workArray);
                    }
                );
            } catch (e) {
                console.log("pow task", e);
            }
        }
        currentlyWatching.update((_) => checkpoint.getCurrentlyWatching());
    }

    let player: YouTubePlayer;
</script>

<YouTube {videoId} id="player" class="h-full w-full" {options} bind:player />
