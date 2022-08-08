<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { cubicOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import RangeSlider from "./slider/RangeSlider.svelte";
    import { Widget } from "./soundcloud";
    import { playerVolume } from "./stores";

    let trackID = "";

    export let checkpoint: MediaConsumptionCheckpoint;
    export let fullSize;
    export let bigMinimizedPlayer;

    let updatePlayerVolumeIntervalHandle: number = null;
    let color = "";
    let darkerColor = "";
    let gradientColor = "";

    let showVolumeSlider = false;
    let volumeSliderContainer: HTMLElement;
    let volumeValuesArray = [$playerVolume * 100];
    let playerVolumeBeforeMute = 0.5;
    let pointerLeaveVolumeElementTimeout: number;
    let suppressIframePointerEvents = false; // only way to get pointerleft firing properly when the pointer moves over the iframe

    $: onPlayerVolumeStoreUpdated($playerVolume);

    function onPlayerVolumeStoreUpdated(volume: number) {
        if (typeof player !== "undefined") {
            player.setVolume(volume * 100);
        }
    }

    function onVolumeSliderChanged(e: CustomEvent) {
        $playerVolume = e.detail.values[0] / 100;
    }

    function initSlider() {
        volumeValuesArray = [$playerVolume * 100];
        cancelClosingVolumeSlider();
    }

    $: {
        if (showVolumeSlider) {
            initSlider();
        }
    }

    function onPointerEnterVolumeButton(ev: PointerEvent) {
        if (ev.pointerType != "touch") {
            showVolumeSlider = true;
            suppressIframePointerEvents = true;
        }
    }

    function onClickVolumeButton(ev: MouseEvent) {
        if (ev.screenX === 0 && ev.screenY === 0) {
            showVolumeSlider = !showVolumeSlider;
            suppressIframePointerEvents = showVolumeSlider;
        }
    }

    function onPointerDownVolumeButton(ev: PointerEvent) {
        if (ev.pointerType == "touch") {
            showVolumeSlider = !showVolumeSlider;
        } else {
            if ($playerVolume > 0) {
                playerVolume.update((oldVolume) => {
                    playerVolumeBeforeMute = oldVolume;
                    return 0;
                });
            } else {
                $playerVolume = playerVolumeBeforeMute;
            }
            volumeValuesArray = [$playerVolume * 100];
        }
    }

    function beginClosingVolumeSlider() {
        cancelClosingVolumeSlider();
        pointerLeaveVolumeElementTimeout = setTimeout(() => {
            if (!volumeSliderContainer.matches(":focus-within")) {
                // if the mouse is out but the slider is still focused, don't close it
                showVolumeSlider = false;
            }
            pointerLeaveVolumeElementTimeout = undefined;
        }, 1000);
    }

    function cancelClosingVolumeSlider() {
        if (typeof pointerLeaveVolumeElementTimeout !== "undefined") {
            clearTimeout(pointerLeaveVolumeElementTimeout);
            pointerLeaveVolumeElementTimeout = undefined;
        }
    }

    function onPointerEnterVolumeSlider(ev: PointerEvent) {
        cancelClosingVolumeSlider();
        if (ev.pointerType != "touch") {
            suppressIframePointerEvents = true;
        }
    }

    function onFocusOutVolumeSlider() {
        beginClosingVolumeSlider();
    }

    function onPointerLeaveVolumeElement(ev: PointerEvent) {
        if (ev.pointerType != "touch") {
            beginClosingVolumeSlider();
        }
        suppressIframePointerEvents = false;
    }

    onMount(() => {
        player = new Widget({
            iframe: playerIframe,
            useDefaultStyle: false,
            initialVolume: $playerVolume * 100,
        });
        updatePlayerVolumeIntervalHandle = setInterval(updatePlayerVolume, 10000);
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
            $playerVolume = (await player.getVolume()) / 100;
        }
    }

    function pickColor(): [string, string, string] {
        let colors = ["#4CBF4B", "#7C1CED", "#FBDD11"];
        let darkerColors = ["#399F38", "#6510C6", "#D8BC03"];
        let gradientColor = ["#63BF4A", "#A71DED", "#FBAE13"];
        let index = Math.floor(Math.random() * colors.length);
        return [colors[index], darkerColors[index], gradientColor[index]];
    }

    async function handleCheckpoint(checkpoint: MediaConsumptionCheckpoint) {
        let currentTimeFromServer = checkpoint.getCurrentPosition().getSeconds() * 1000;
        let newTrackID = checkpoint.getSoundcloudTrackData().getId();
        if (newTrackID != trackID) {
            trackID = newTrackID;
            [color, darkerColor, gradientColor] = pickColor();
            player.loadFromURI("https://api.soundcloud.com/tracks/" + trackID, {
                autoPlay: true,
                visual: true,
                download: true,
                showUser: true,
                showArtwork: true,
                showPlayCount: true,
                showComments: true,
                showTeaser: false, // allows the player to work on mobile instead of forcing usage of the app
                color: color,
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
    title=""
    class="h-full w-full"
    bind:this={playerIframe}
    style="pointer-events: {suppressIframePointerEvents ? 'none' : 'auto'}"
/>
{#if fullSize || bigMinimizedPlayer}
    <button
        on:pointerenter={onPointerEnterVolumeButton}
        on:pointerdown={onPointerDownVolumeButton}
        on:click={onClickVolumeButton}
        on:pointerleave={onPointerLeaveVolumeElement}
        class="volume-button z-20 flex-row text-white cursor-pointer text-xl text-center place-content-center items-center"
        style="background: linear-gradient(to bottom, {color}, {gradientColor}); border-color: {darkerColor};"
    >
        {#if $playerVolume == 0}
            <i class="fas fa-volume-mute" />
        {:else if $playerVolume < 1 / 3}
            <i class="fas fa-volume-off" />
        {:else if $playerVolume < 2 / 3}
            <i class="fas fa-volume-down" />
        {:else}
            <i class="fas fa-volume-up" />
        {/if}
    </button>
    {#if showVolumeSlider}
        <div
            transition:scale={{ duration: 500, delay: 0, opacity: 0.5, start: 0, easing: cubicOut }}
            on:pointerenter={onPointerEnterVolumeSlider}
            on:pointerleave={onPointerLeaveVolumeElement}
            on:focusout={onFocusOutVolumeSlider}
            class="volume-slider-container"
            style="transform-origin: left; --range-handle-inactive: {color}; --range-handle-focus: {darkerColor}"
            bind:this={volumeSliderContainer}
        >
            <RangeSlider
                id="soundcloudVolumeSlider"
                bind:values={volumeValuesArray}
                max={100}
                min={0}
                range={false}
                on:change={onVolumeSliderChanged}
            />
        </div>
    {/if}
{/if}

<style>
    .volume-button {
        display: flex;
        position: absolute;
        width: 43px;
        height: 43px;
        left: 11px;
        top: 74px;
        border-radius: 50%;
        border-width: 0.5px;
    }

    .volume-button:hover::after {
        content: "";
        background-color: rgba(0, 0, 0, 0.08);
        position: absolute;
        width: 43px;
        height: 43px;
        left: 0;
        top: 0;
        border-radius: 50%;
    }

    .volume-slider-container {
        background-color: white;
        border-radius: 0 15px 15px 0;
        position: absolute;
        z-index: 10; /* must show below button */
        left: 32px;
        top: 81px;
        width: 110px;
        height: 30px;
        padding-left: 25px;
        padding-right: 7px;
    }

    iframe:focus {
        outline: none;
    }
</style>
