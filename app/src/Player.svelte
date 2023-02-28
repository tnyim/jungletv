<script lang="ts">
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { onDestroy, onMount } from "svelte";
    import Moon from "svelte-loading-spinners/dist/ts/Moon.svelte";
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { pageTitleMedia } from "./pageTitleStores";
    import PlayerDocument from "./PlayerDocument.svelte";
    import PlayerSoundCloud from "./PlayerSoundCloud.svelte";
    import PlayerYouTube from "./PlayerYouTube.svelte";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import {
        activityChallengeReceived,
        currentlyWatching,
        darkMode,
        mostRecentAnnouncement,
        playerConnected,
        playerCurrentTime,
        playerVolume,
        rewardBalance,
        rewardReceived,
        unreadAnnouncement,
        unreadChatMention,
    } from "./stores";
    import { ttsAudioAlert } from "./utils";

    export let fullSize: boolean;
    export let bigMinimizedPlayer: boolean;

    let checkpoint: MediaConsumptionCheckpoint;
    let consumeMediaRequest: Request;
    let consumeMediaTimeoutHandle: number = null;

    onMount(() => {
        consumeMedia();
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
        $pageTitleMedia = "";
    });

    let lastTTSAlertAt = 0;

    function onVisibilityChange() {
        if (document.hidden) {
            lastTTSAlertAt = 0;
        }
    }

    $: {
        if (!fullSize) {
            lastTTSAlertAt = 0;
        }
    }

    onMount(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);
    });

    onDestroy(() => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
    });

    async function handleCheckpoint(cp: MediaConsumptionCheckpoint) {
        if (consumeMediaTimeoutHandle != null) {
            clearTimeout(consumeMediaTimeoutHandle);
        }
        consumeMediaTimeoutHandle = setTimeout(consumeMediaTimeout, 20000);
        playerConnected.update(() => true);
        checkpoint = cp;
        if (checkpoint.getMediaPresent()) {
            playerCurrentTime.set(cp.getCurrentPosition().getSeconds());
        } else {
            playerCurrentTime.set(0);
            $pageTitleMedia = "";
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
            let now = new Date().getTime();
            if (
                (document.hidden || document.fullscreenElement != null || !fullSize) &&
                $playerVolume > 0 &&
                now - lastTTSAlertAt > 30000
            ) {
                ttsAudioAlert("New Jungle TV chat reply");
                lastTTSAlertAt = now;
            }
        }
        if (checkpoint.hasMediaTitle()) {
            $pageTitleMedia = checkpoint.getMediaTitle();
        }
        currentlyWatching.update((_) => checkpoint.getCurrentlyWatching());
    }
</script>

{#if typeof checkpoint == "undefined"}
    <div class="flex h-full w-full justify-center items-center">
        <Moon size="80" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" />
    </div>
{:else if checkpoint.getMediaPresent()}
    {#if checkpoint.hasYoutubeVideoData()}
        <PlayerYouTube {checkpoint} />
    {:else if checkpoint.hasSoundcloudTrackData()}
        <PlayerSoundCloud {checkpoint} {fullSize} {bigMinimizedPlayer} />
    {:else if checkpoint.hasDocumentData()}
        <PlayerDocument {checkpoint} />
    {:else}
        <div class="flex h-full w-full justify-center items-center text-xl">
            <div class="text-center">
                <p class="text-4xl"><i class="fas fa-ban" /></p>
                <p class="mt-3 text-xl">Unknown media type</p>
            </div>
        </div>
    {/if}
{:else}
    <div class="flex h-full w-full justify-center items-center">
        <div class="text-center">
            <p class="text-4xl"><i class="far fa-stop-circle" /></p>
            <p class="mt-3 text-xl">Nothing playing</p>
            {#if fullSize || bigMinimizedPlayer}
                <p class="mt-3"><a href="/enqueue" use:link>Get something going!</a></p>
            {/if}
        </div>
    </div>
{/if}
