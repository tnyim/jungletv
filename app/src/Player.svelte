<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import { link } from "svelte-navigator";
    import PlayerApplicationPage from "./PlayerApplicationPage.svelte";
    import PlayerDocument from "./PlayerDocument.svelte";
    import PlayerSoundCloud from "./PlayerSoundCloud.svelte";
    import PlayerYouTube from "./PlayerYouTube.svelte";
    import { apiClient } from "./api_client";
    import { processConfigurationChanges, resetConfigurationChanges } from "./configurationStores";
    import { pageTitleMedia } from "./pageTitleStores";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "./rpcUtils";
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

    consumeStreamRPCFromSvelteComponent(
        20000,
        5000,
        apiClient.consumeMedia.bind(apiClient),
        handleCheckpoint,
        (connected) => {
            playerConnected.set(connected);
            if (connected) {
                resetConfigurationChanges();
            } else {
                activityChallengeReceived.update((_) => null);
            }
        }
    );

    onDestroy(() => {
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
        processConfigurationChanges(checkpoint.getConfigurationChangesList());
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
    {:else if checkpoint.hasApplicationPageData()}
        <PlayerApplicationPage {checkpoint} />
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
