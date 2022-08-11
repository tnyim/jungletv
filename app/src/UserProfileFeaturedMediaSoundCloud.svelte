<script lang="ts">
    import { onMount } from "svelte";

    import type { QueueSoundCloudTrackData } from "./proto/jungletv_pb";
    import { Widget } from "./soundcloud";
    import { playerVolume } from "./stores";

    export let data: QueueSoundCloudTrackData;

    let playerIframe: HTMLIFrameElement;
    let player: Widget;

    onMount(() => {
        player = new Widget({
            iframe: playerIframe,
            useDefaultStyle: false,
            initialVolume: $playerVolume * 100,
        });

        player.loadFromURI("https://api.soundcloud.com/tracks/" + data.getId(), {
            autoPlay: false,
            visual: true,
            download: true,
            showUser: true,
            showArtwork: true,
            showPlayCount: true,
            showComments: true,
            showTeaser: false, // allows the player to work on mobile instead of forcing usage of the app
        });
    });
</script>

<iframe scrolling="no" frameborder="0" title="" class="h-full w-full" bind:this={playerIframe} />
