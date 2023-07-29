<script lang="ts">
    import { DateTime, Duration, type DurationUnit } from "luxon";
    import { createEventDispatcher } from "svelte";
    import QrCode from "svelte-qrcode";
    import { slide } from "svelte/transition";
    import MoveQueueEntryPrompt from "./MoveQueueEntryPrompt.svelte";
    import { apiClient } from "./api_client";
    import { formatBANPriceFixed, isPriceZero } from "./currency_utils";
    import { modalAlert, openModal } from "./modal/modal";
    import { openUserProfile } from "./profile_utils";
    import type { User } from "./proto/common_pb";
    import {
        PermissionLevel,
        QueueEntry,
        QueueEntryMovementDirection,
        type QueueEntryMovementDirectionMap,
    } from "./proto/jungletv_pb";
    import { darkMode, permissionLevel, rewardAddress } from "./stores";
    import DetailsButton from "./uielements/DetailsButton.svelte";
    import { buildMonKeyURL, copyToClipboard } from "./utils";

    const dispatch = createEventDispatcher();

    export let entry: QueueEntry;
    export let entryIndex: number;
    export let removalOfOwnEntriesAllowed: boolean;
    export let timeUntilStarting: Duration;
    let requestedBy: User;

    $: {
        if (entry.hasRequestedBy() && entry.getRequestedBy().getAddress() != "") {
            requestedBy = entry.getRequestedBy();
        } else {
            requestedBy = undefined;
        }
    }

    let isChatModerator = false;
    $: isChatModerator = $permissionLevel == PermissionLevel.ADMIN;

    const units: DurationUnit[] = ["year", "month", "week", "day", "hour", "minute", "second"];

    function formatEnqueuedAt(entry: QueueEntry): string {
        let ed = DateTime.fromJSDate(entry.getRequestedAt().toDate());
        const diff = ed.diffNow().shiftTo(...units);
        const unit: DurationUnit = units.find((unit) => diff.get(unit) !== 0) || "second";
        const relativeFormatter = new Intl.RelativeTimeFormat("en", {
            numeric: "auto",
        });
        return relativeFormatter.format(Math.trunc(diff.as(unit)), unit as Intl.RelativeTimeFormatUnit);
    }

    function roundedDurationString(d: Duration): string {
        if (d.as("days") >= 2) {
            return d.toFormat("d 'days'");
        }
        if (d.as("days") >= 1) {
            return d.toFormat("d 'day and' h 'hours'").replace("and 0 hours", "").replace("and 1 hours", "and 1 hour");
        }
        if (d.as("minutes") >= 110) {
            return d.toFormat("h 'hours'").replace(/^1 hours/, "1 hour");
        }
        return d.toFormat("m 'minutes'").replace(/^1 minutes/, "1 minute");
    }

    function playEstimateString(): string {
        let lowerBound = Duration.fromMillis(timeUntilStarting.toMillis() * 0.9);
        let upperBound = Duration.fromMillis(timeUntilStarting.toMillis() * 1.1);
        let lowerBoundStr = roundedDurationString(lowerBound);
        let upperBoundStr = roundedDurationString(upperBound);
        if (lowerBoundStr == upperBoundStr) {
            return "about " + lowerBoundStr;
        }
        // avoid repeating the units in strings like "between 10 minutes and 15 minutes" -> "between 10 and 15 minutes"
        let lSplit = lowerBoundStr.split(" ");
        let uSplit = upperBoundStr.split(" ");
        if (lSplit.length == 2 && uSplit.length == 2 && lSplit[1].replace(/s$/, "") == uSplit[1].replace(/s$/, "")) {
            return "between " + lSplit[0] + " and " + upperBoundStr;
        }
        return "between " + lowerBoundStr + " and " + upperBoundStr;
    }

    function openOutside() {
        let url = "";
        if (entry.hasYoutubeVideoData()) {
            url = "https://www.youtube.com/watch?v=" + entry.getYoutubeVideoData().getId();
        } else if (entry.hasSoundcloudTrackData()) {
            url = entry.getSoundcloudTrackData().getPermalink();
        }
        if (url) {
            window.open(url, "", "noopener");
        }
    }

    function openExplorer() {
        window.open("https://creeper.banano.cc/account/" + requestedBy.getAddress(), "", "noopener");
    }

    async function setCursor() {
        await apiClient.setQueueInsertCursor(entry.getId());
    }

    async function removeOwnEntry() {
        try {
            await apiClient.removeOwnQueueEntry(entry.getId());
        } catch (ex) {
            if (ex.includes("rate limit reached")) {
                await modalAlert(
                    "Queue entry not removed because you have removed too many of your own queue entries recently. This is a safeguard to prevent certain kinds of abuse.",
                    "Failed to remove queue entry"
                );
            }
        }
    }

    let copied = false;
    async function copyAddress() {
        await copyToClipboard(requestedBy.getAddress());
        copied = true;
    }

    function moveQueueEntry(direction: QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap]) {
        openModal({
            component: MoveQueueEntryPrompt,
            props: { direction: direction, entry: entry },
            options: {
                closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
                styleContent: {
                    padding: "0",
                },
            },
        });
    }
</script>

<div class="flex flex-col px-2 py-1 shadow-inner bg-gray-200 dark:bg-black cursor-default" transition:slide|local>
    <p>
        Request cost:
        <span class="font-normal filter blur-sm hover:blur-none active:blur-none transition-all">
            {formatBANPriceFixed(entry.getRequestCost())} BAN
        </span>
    </p>
    {#if timeUntilStarting.as("minutes") > 45}
        <p class="text-sm">Estimated to play {playEstimateString()} from now.</p>
    {:else if entryIndex > 0 && timeUntilStarting.as("seconds") > 0}
        <p class="text-sm">Estimated to play within the next hour.</p>
    {/if}
    {#if requestedBy !== undefined}
        <p>Added to the queue {formatEnqueuedAt(entry)} by</p>
        <div class="flex flex-row">
            <img
                src={buildMonKeyURL(requestedBy.getAddress())}
                alt="&nbsp;"
                title="monKey for this user's address"
                class="h-20 w-20"
            />
            <div class="grow">
                {#if requestedBy.hasNickname()}
                    <span class="font-semibold text-md">{requestedBy.getNickname()}</span>
                    <br />
                {/if}
                <span class="font-mono text-md">
                    {requestedBy.getAddress().substr(0, 14)}
                </span>
            </div>
            <QrCode
                value={(requestedBy.getAddress().startsWith("nano_") ? "nano:" : "ban:") + requestedBy.getAddress()}
                size="80"
                padding="0"
                background={$darkMode ? "#000000" : "#e5e7eb"}
                color={$darkMode ? "#e5e7eb" : "#000000"}
            />
        </div>
    {:else}
        <p>
            Added to the queue {formatEnqueuedAt(entry)}.
        </p>
        {#if isPriceZero(entry.getRequestCost())}
            <p class="mt-2">
                This video was automatically enqueued by JungleTV. Since nobody paid for this video, it will pay no
                rewards.
            </p>
        {/if}
    {/if}
    <div class="grid grid-cols-6 gap-2 place-items-center">
        {#if isChatModerator}
            <DetailsButton
                extraClasses={requestedBy !== undefined ? "col-span-2" : "col-span-3"}
                iconClasses="fas fa-trash"
                label="Remove"
                on:click={() => dispatch("remove")}
            />
            {#if requestedBy !== undefined}
                <DetailsButton
                    extraClasses="col-span-2"
                    iconClasses="fas fa-ban"
                    label="Disallow"
                    on:click={() => dispatch("disallow")}
                />
                <DetailsButton
                    extraClasses="col-span-2"
                    iconClasses="fas fa-edit"
                    label="Nickname"
                    on:click={() => dispatch("changeNickname")}
                />
                {#if entry.hasYoutubeVideoData()}
                    <DetailsButton
                        extraClasses="col-span-2"
                        iconClasses="fab fa-youtube"
                        label="YouTube"
                        on:click={openOutside}
                    />
                {:else if entry.hasSoundcloudTrackData()}
                    <DetailsButton
                        extraClasses="col-span-2"
                        iconClasses="fab fa-soundcloud"
                        labelClasses="text-xs"
                        label="SoundCloud"
                        on:click={openOutside}
                    />
                {/if}
                <DetailsButton
                    extraClasses="col-span-2"
                    iconClasses="fas fa-search-dollar"
                    label="Explorer"
                    on:click={openExplorer}
                />
            {/if}
            {#if entryIndex > 0}
                <DetailsButton
                    extraClasses={requestedBy !== undefined ? "col-span-2" : "col-span-3"}
                    iconClasses="fas fa-i-cursor"
                    label="Set cursor"
                    on:click={setCursor}
                />
            {/if}
        {/if}
        {#if requestedBy !== undefined}
            <DetailsButton
                extraClasses="col-span-3"
                iconClasses="fas fa-copy"
                label={copied ? "Copied!" : "Copy address"}
                on:click={copyAddress}
            />
            <DetailsButton
                extraClasses="col-span-3"
                iconClasses="fas fa-id-card"
                label="Profile"
                on:click={() => openUserProfile(requestedBy.getAddress())}
            />
            {#if requestedBy.getAddress() === $rewardAddress && !isChatModerator && removalOfOwnEntriesAllowed}
                <DetailsButton
                    extraClasses="col-span-6"
                    iconClasses="fas fa-trash"
                    label="Remove"
                    on:click={removeOwnEntry}
                />
            {/if}
        {/if}
        {#if entry.getCanMoveUp()}
            <DetailsButton
                extraClasses="col-span-3"
                iconClasses="fas fa-arrow-circle-up"
                label="Move up"
                on:click={() => moveQueueEntry(QueueEntryMovementDirection.QUEUE_ENTRY_MOVEMENT_DIRECTION_UP)}
            />
        {/if}
        {#if entry.getCanMoveDown()}
            <DetailsButton
                extraClasses="col-span-3"
                iconClasses="fas fa-arrow-circle-down"
                label="Move down"
                on:click={() => moveQueueEntry(QueueEntryMovementDirection.QUEUE_ENTRY_MOVEMENT_DIRECTION_DOWN)}
            />
        {/if}
    </div>
</div>
