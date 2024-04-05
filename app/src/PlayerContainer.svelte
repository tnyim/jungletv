<script lang="ts">
    import { BroadcastChannel } from "broadcast-channel";
    import { beforeUpdate, onDestroy, onMount } from "svelte";
    import watchMedia from "svelte-media";
    import { navigate } from "svelte-navigator";
    import Player from "./Player.svelte";
    import { mainContentBottomPadding, rewardAddress } from "./stores";

    export let fullSize = false;
    export let fullSizePlayerContainer: HTMLElement = null;
    export let fullSizePlayerContainerWidth: number = 0;
    export let fullSizePlayerContainerHeight: number = 0;
    export let resizingSidebar = false;
    export let sidebarWidth = 384;

    let windowInnerHeight = 0;

    let playerOpen = false;
    let playerWasClosedManuallyOnce = false;
    let wasFullSize = false;
    let isFirstMaximize = false;
    beforeUpdate(() => {
        wasFullSize = fullSize;
        isFirstMaximize = fullSizePlayerContainerWidth == 0 && fullSizePlayerContainerHeight == 0;
    });

    let bigMinimizedPlayer = false;
    let largeEnoughToNotCollide = false;
    const media = watchMedia({
        bigMinimizedPlayer: "(min-width: 1024px) and (min-height: 800px)",
        largeEnoughToNotCollide: "(min-width: 1820px)",
    });
    const mediaUnsubscribe = media.subscribe((obj: any) => {
        bigMinimizedPlayer = obj.bigMinimizedPlayer;
        largeEnoughToNotCollide = obj.largeEnoughToNotCollide;
    });
    onDestroy(mediaUnsubscribe);

    let playerContainer: HTMLElement;

    const sidebarOpenCloseAnimDuration = 400;
    let sidebarOpeningOrClosing = false;

    export const onSidebarCollapseStart = () => {
        sidebarOpeningOrClosing = true;
        console.log("sidebarWidth", sidebarWidth);
        playerContainer.style.width = playerContainer.clientWidth + sidebarWidth + "px";
    };

    export const onSidebarCollapseEnd = () => {
        sidebarOpeningOrClosing = false;
    };

    export const onSidebarOpenStart = async () => {
        sidebarOpeningOrClosing = true;
        playerContainer.style.width = playerContainer.clientWidth - sidebarWidth + "px";
    };

    export const onSidebarOpenEnd = () => {
        sidebarOpeningOrClosing = false;
    };

    function minimizeOrMaximizePlayer() {
        if (wasFullSize && !fullSize) {
            playerContainer.classList.remove("player-maximized");
            playerContainer.classList.add("player-minimized");
            playerContainer.style.removeProperty("height");
            playerContainer.style.removeProperty("width");
            playerContainer.style.removeProperty("bottom");
            playerContainer.style.removeProperty("left");
        } else if (!wasFullSize && fullSize) {
            playerOpen = true;
            matchPlayerRectToFakeContainer(false);
        }
    }

    function matchPlayerRectToFakeContainer(becauseContainerDimensionsChanged: boolean) {
        if (playerContainer !== undefined && fullSizePlayerContainer != null) {
            if (!sidebarOpeningOrClosing) {
                if (becauseContainerDimensionsChanged) playerContainer.style.transitionProperty = "none";
                playerContainer.classList.remove("player-minimized");
                playerContainer.classList.add("player-maximized");
                playerContainer.style.height = fullSizePlayerContainerHeight + "px";
                playerContainer.style.width = fullSizePlayerContainerWidth + "px";
                let rect = fullSizePlayerContainer.getBoundingClientRect();
                playerContainer.style.bottom = window.innerHeight - rect.bottom - window.scrollY + "px";
                playerContainer.style.left = rect.left + "px";
                playerContainer.style.transitionProperty = "width, height, bottom, left";
            }
        }
    }

    function closePlayer() {
        if (!fullSize) {
            playerOpen = false;
            playerWasClosedManuallyOnce = true;
        }
    }

    function expandPlayer() {
        navigate("/");
    }

    // stupid way to control precisely what reactivity updates do what
    $: {
        fullSizePlayerContainerHeight;
        fullSizePlayerContainerWidth;
        windowInnerHeight;
        matchPlayerRectToFakeContainer(!isFirstMaximize);
    }
    $: {
        if (fullSizePlayerContainer) matchPlayerRectToFakeContainer(false);
    }
    $: {
        fullSize;
        minimizeOrMaximizePlayer();
    }
    $: {
        if (!fullSize && playerOpen) {
            if (bigMinimizedPlayer) {
                $mainContentBottomPadding = largeEnoughToNotCollide ? "" : "pb-64";
            } else {
                $mainContentBottomPadding = "pb-32";
            }
        } else {
            $mainContentBottomPadding = "";
        }
    }

    const playerPingMessage = "player ping";
    const playerPongMessage = "player pong";
    type playerPresenceMessage = "player ping" | "player pong";
    const playerPresenceBroadcastChannel = new BroadcastChannel<playerPresenceMessage>("playerPresence");
    let playerCheckTimeout: number;

    function onBroadcastChannelMessage(e: playerPresenceMessage) {
        if (e === playerPingMessage && playerOpen) {
            playerPresenceBroadcastChannel.postMessage(playerPongMessage);
        } else if (e === playerPongMessage) {
            if (!fullSize) {
                playerOpen = false;
            }
            if (typeof playerCheckTimeout !== "undefined") {
                clearTimeout(playerCheckTimeout);
                playerCheckTimeout = undefined;
            }
        }
    }

    // avoid duplicate miniplayers on other tabs
    $: if (fullSize && playerOpen) {
        playerPresenceBroadcastChannel.postMessage(playerPongMessage);
    }

    let rAddress = null;
    const rewardAddressUnsubscribe = rewardAddress.subscribe((a) => (rAddress = a));
    onDestroy(rewardAddressUnsubscribe);

    onMount(() => {
        playerPresenceBroadcastChannel.addEventListener("message", onBroadcastChannelMessage);
        playerPresenceBroadcastChannel.postMessage(playerPingMessage);
        playerCheckTimeout = setTimeout(() => {
            if (!playerWasClosedManuallyOnce) {
                playerOpen = true;
            }
        }, 100);
    });
    onDestroy(() => {
        if (typeof playerCheckTimeout !== "undefined") {
            clearTimeout(playerCheckTimeout);
        }
        playerPresenceBroadcastChannel.removeEventListener("message", onBroadcastChannelMessage);
        playerPresenceBroadcastChannel.close();
    });

    // doing this allows us to fix mousemove tracking getting lost over iframes on Blink-based browsers
    // which made it very hard to increase the size of the sidebar while media is playing
    $: if (playerContainer) {
        playerContainer.style.pointerEvents = resizingSidebar ? "none" : "auto";
    }
</script>

<svelte:window bind:innerHeight={windowInnerHeight} />
<div
    class="{playerOpen ? '' : 'hidden'} player-minimized bg-black text-white z-30 player-container"
    style="transition-duration: {sidebarOpenCloseAnimDuration}ms"
    bind:this={playerContainer}
>
    {#if playerOpen}
        {#key rAddress}
            <Player {fullSize} {bigMinimizedPlayer} />
            {#if rAddress}
                <!-- stupid thing to make the key block depend on it, otherwise it doesn't actually recreate -->
            {/if}
        {/key}
    {/if}
    <button
        class="player-close-button flex-row shadow-md bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-700 w-10 h-10 z-40 text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
        on:click={closePlayer}
    >
        <i class="fas fa-times" />
    </button>
    <button
        class="player-expand-button flex-row shadow-md bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-700 w-10 h-10 z-40 text-xl text-center place-content-center items-center ease-linear transition-all duration-150"
        on:click={expandPlayer}
    >
        <i class="fas fa-external-link-alt" />
    </button>
</div>

<style>
    .player-container {
        transform-origin: center left;
        transition-property: width, height, bottom, left;
        transition-timing-function: cubic-bezier(0.21, 0.575, 0.394, 1.039);
        height: 6rem;
        width: 10.66rem;
        left: 1rem;
        bottom: 1rem;
    }

    .player-close-button,
    .player-expand-button {
        display: none;
    }

    .player-minimized > .player-close-button {
        display: flex;
        position: absolute;
        width: 2.5rem;
        height: 2.5rem;
        right: -2.5rem;
        top: 0;
    }

    .player-minimized > .player-expand-button {
        display: flex;
        position: absolute;
        width: 2.5rem;
        height: 2.5rem;
        right: -2.5rem;
        top: 2.5rem;
    }

    @media (min-width: 1024px) and (min-height: 800px) {
        .player-container {
            height: 12rem;
            width: 21.33rem;
            left: 3rem;
            bottom: 3rem;
        }
    }
</style>
