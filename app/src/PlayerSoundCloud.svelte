<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import { Widget } from "./soundcloud";

    let trackID = "";

    export let checkpoint: MediaConsumptionCheckpoint;

    let updatePlayerVolumeIntervalHandle: number = null;

    onMount(() => {
        player = new Widget({
            iframe: playerIframe,
            useDefaultStyle: false,
        });

        document.addEventListener("visibilitychange", updatePlayerVolume);
    });

    onDestroy(() => {
        if (updatePlayerVolumeIntervalHandle != null) {
            clearInterval(updatePlayerVolumeIntervalHandle);
        }
        document.removeEventListener("visibilitychange", updatePlayerVolume);
    });

    let playerIframe: HTMLIFrameElement;
    let player: Widget;

    async function updatePlayerVolume() {
        if (typeof player !== "undefined") {
            //$playerVolume = (await player.isMuted()) ? 0 : (await player.getVolume()) / 100;
        }
    }

    function pickColor(): string {
        let colors = ["#4CBF4B", "#7C1CED", "#FBDD11"];
        return colors[Math.floor(Math.random() * colors.length)]
    }

    async function handleCheckpoint(checkpoint: MediaConsumptionCheckpoint) {
        let currentTimeFromServer = checkpoint.getCurrentPosition().getSeconds() * 1000;
        let newTrackID = checkpoint.getSoundcloudTrackData().getId();
        if (newTrackID != trackID) {
            trackID = newTrackID;
            player.loadFromURI("https://api.soundcloud.com/tracks/" + trackID, {
                autoPlay: true,
                visual: true,
                download: true,
                showUser: true,
                showArtwork: true,
                showPlayCount: true,
                showComments: true,
                color: pickColor(),
            });
        }
        let leniencyMillis = 3000;
        if (Math.abs(player.currentTime - currentTimeFromServer) > leniencyMillis) {
            player.currentTime = currentTimeFromServer;
        }
    }

    $: {
        if (typeof player !== "undefined" && checkpoint.getMediaPresent() && checkpoint.hasSoundcloudTrackData()) {
            handleCheckpoint(checkpoint);
        }
    }
</script>

<iframe
    scrolling="no"
    frameborder="0"
    allow="autoplay"
    title="SoundCloud player"
    class="h-full w-full"
    bind:this={playerIframe}
/>
