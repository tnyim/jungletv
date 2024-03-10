<script lang="ts">
    import { onDestroy } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import { link } from "svelte-navigator";
    import PlayerApplicationPage from "./PlayerApplicationPage.svelte";
    import PlayerDocument from "./PlayerDocument.svelte";
    import PlayerSoundCloud from "./PlayerSoundCloud.svelte";
    import PlayerYouTube from "./PlayerYouTube.svelte";
    import { apiClient } from "./api_client";
    import { processConfigurationChanges, resetConfigurationChanges } from "./configurationStores";
    import { processClearedNotifications, processNotifications } from "./notifications";
    import { pageTitleMedia } from "./pageTitleStores";
    import type { MediaConsumptionCheckpoint } from "./proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "./rpcUtils";
    import {
        activityChallengeReceived,
        currentlyWatching,
        darkMode,
        playerConnected,
        playerCurrentTime,
    } from "./stores";

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
        },
    );

    onDestroy(() => {
        activityChallengeReceived.update((_) => null);
        $pageTitleMedia = "";
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
        if (checkpoint.hasActivityChallenge()) {
            activityChallengeReceived.update((_) => checkpoint.getActivityChallenge());
        }
        if (checkpoint.hasMediaTitle()) {
            $pageTitleMedia = checkpoint.getMediaTitle();
        }
        processConfigurationChanges(checkpoint.getConfigurationChangesList());
        processNotifications(checkpoint.getNotificationsList());
        processClearedNotifications(checkpoint.getClearedNotificationsList());
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
