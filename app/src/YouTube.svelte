<script context="module">
    /**
     * Expose PlayerState constants for convenience. These constants can also be
     * accessed through the global YT object after the YouTube IFrame API is instantiated.
     * https://developers.google.com/youtube/iframe_api_reference#onStateChange
     */
    export const PlayerState = {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5,
    };
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import YoutubePlayer from "youtube-player";
    import type { YouTubePlayer } from "youtube-player/dist/types";

    export { className as class }; // HTML class names for container element (optional)
    export let id = undefined; // HTML element ID for player (optional)
    export let videoId; // Youtube video ID (required)
    export let options = undefined; // YouTube player options (optional)

    let className; // HTML class names for container element
    let playerElem; // player DOM element reference

    export let player: YouTubePlayer; // player API instance (bind)

    // Create and tear down player as component mounts or unmounts
    onMount(() => createPlayer());

    // Update videoId and load new video if URL changes
    $: play(videoId);

    function createPlayer() {
        player = YoutubePlayer(playerElem, options);

        // Register event handlers
        player.on("ready", onPlayerReady);
        player.on("error", onPlayerError);
        player.on("stateChange", onPlayerStateChange);
        player.on("playbackRateChange", onPlayerPlaybackRateChange);
        player.on("playbackQualityChange", onPlayerPlaybackQualityChange);

        // Tear down player when done
        return () => player.destroy();
    }

    function play(videoId) {
        // this is needed because the loadVideoById function always starts playing,
        // even if you have set autoplay to 1 whereas the cueVideoById function
        // never starts autoplaying
        if (player && videoId) {
            if (
                options &&
                options.playerVars &&
                options.playerVars.autoplay === 1
            ) {
                player.loadVideoById(videoId);
            } else {
                player.cueVideoById(videoId);
            }
        }
    }

    // -------------------------------------------
    // Event handling
    // -------------------------------------------
    const dispatch = createEventDispatcher();

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onReady
     *
     * @param {Object} event
     */
    function onPlayerReady(event) {
        dispatch("ready", event);

        // Start playing
        play(videoId);
    }

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onError
     *
     * @param {Object} event
     *   @param {Integer} data  - error type
     */
    function onPlayerError(event) {
        dispatch("error", event);
    }

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onStateChange
     *
     * @param {Object} event
     *   @param {Integer} data  - status change type
     */
    function onPlayerStateChange(event) {
        dispatch("stateChange", event);

        switch (event.data) {
            case PlayerState.ENDED:
                dispatch("end", event);
                break;

            case PlayerState.PLAYING:
                dispatch("play", event);
                break;

            case PlayerState.PAUSED:
                dispatch("pause", event);
                break;

            default:
        }
    }

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange
     *
     * @param {Object} event
     *   @param {Float} data    - playback rate
     */
    function onPlayerPlaybackRateChange(event) {
        dispatch("playbackRateChange", event);
    }

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange
     *
     * @param {Object} event
     *   @param {String} data   - playback quality
     */
    function onPlayerPlaybackQualityChange(event) {
        dispatch("playbackQualityChange", event);
    }
</script>

<div class={className}>
    <div {id} bind:this={playerElem} />
</div>
