<script lang="ts">
    import { apiClient } from "./api_client";
    import QrCode from "svelte-qrcode";
    import {
        PermissionLevel,
        QueueEntry,
        QueueEntryMovementDirection,
        QueueEntryMovementDirectionMap,
        User,
    } from "./proto/jungletv_pb";
    import { darkMode, modal, permissionLevel, rewardAddress } from "./stores";
    import { DateTime, Duration, DurationUnit } from "luxon";
    import { slide } from "svelte/transition";
    import { buildMonKeyURL, copyToClipboard } from "./utils";
    import { createEventDispatcher } from "svelte";
    import { openUserProfile } from "./profile_utils";
    import MoveQueueEntryPrompt from "./MoveQueueEntryPrompt.svelte";

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
                alert(
                    "Queue entry not removed because you have removed too many of your own queue entries recently. This is a safeguard to prevent certain kinds of abuse."
                );
            }
        }
    }

    let copied = false;
    async function copyAddress() {
        await copyToClipboard(requestedBy.getAddress());
        copied = true;
    }

    // this is a workaround
    // stuff like dark: and hover: doesn't work in the postcss @apply
    // https://github.com/tailwindlabs/tailwindcss/discussions/2917
    const commonButtonClasses =
        "text-purple-700 dark:text-purple-500 px-1.5 py-1 rounded hover:shadow-sm " +
        "hover:bg-gray-100 dark:hover:bg-gray-800 outline-none focus:outline-none " +
        "ease-linear transition-all duration-150 cursor-pointer";

    function moveQueueEntry(direction: QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap]) {
        modal.set({
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
            {apiClient.formatBANPriceFixed(entry.getRequestCost())} BAN
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
                class="h-20"
            />
            <div class="flex-grow">
                {#if requestedBy.hasNickname()}
                    <span class="font-semibold text-md">{requestedBy.getNickname()}</span>
                    <br />
                {/if}
                <span class="font-mono text-md">
                    {requestedBy.getAddress().substr(0, 14)}
                </span>
            </div>
            <QrCode
                value={"ban:" + requestedBy.getAddress()}
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
        <p class="mt-2">
            This video was automatically enqueued by JungleTV. Since nobody paid for this video, it will pay no rewards.
        </p>
    {/if}
    <div class="grid grid-cols-6 gap-2 place-items-center">
        {#if isChatModerator}
            <div
                class="{commonButtonClasses} {requestedBy !== undefined ? 'col-span-2' : 'col-span-3'} "
                on:click={() => dispatch("remove")}
            >
                <i class="fas fa-trash" /> Remove
            </div>
            {#if requestedBy !== undefined}
                <div class="{commonButtonClasses} col-span-2" on:click={() => dispatch("disallow")}>
                    <i class="fas fa-ban" /> Disallow
                </div>
                <div class="{commonButtonClasses} col-span-2" on:click={() => dispatch("changeNickname")}>
                    <i class="fas fa-edit" /> Nickname
                </div>
                <div
                    class="{commonButtonClasses} col-span-2"
                    on:click={() =>
                        window.open(
                            (() => {
                                if (entry.hasYoutubeVideoData()) {
                                    return "https://www.youtube.com/watch?v=" + entry.getYoutubeVideoData().getId();
                                } else if (entry.hasSoundcloudTrackData()) {
                                    return entry.getSoundcloudTrackData().getPermalink();
                                }
                            })(),
                            "",
                            "noopener"
                        )}
                >
                    {#if entry.hasYoutubeVideoData()}
                        <i class="fab fa-youtube" /> YouTube
                    {:else if entry.hasSoundcloudTrackData()}
                        <i class="fab fa-soundcloud" /> SoundCloud
                    {/if}
                </div>
                <div class="{commonButtonClasses} col-span-2" on:click={openExplorer}>
                    <i class="fas fa-search-dollar" /> Explorer
                </div>
            {/if}
            {#if entryIndex > 0}
                <div
                    class="{commonButtonClasses} {requestedBy !== undefined ? 'col-span-2' : 'col-span-3'}"
                    on:click={setCursor}
                >
                    <i class="fas fa-i-cursor" /> Set cursor
                </div>
            {/if}
        {/if}
        {#if requestedBy !== undefined}
            <div class="{commonButtonClasses} col-span-3" on:click={copyAddress}>
                <i class="fas fa-copy" />
                {copied ? "Copied!" : "Copy address"}
            </div>
            <div class="{commonButtonClasses} col-span-3" on:click={() => openUserProfile(requestedBy.getAddress())}>
                <i class="fas fa-id-card" /> Profile
            </div>
            {#if requestedBy.getAddress() === $rewardAddress && !isChatModerator && removalOfOwnEntriesAllowed}
                <div class="{commonButtonClasses} col-span-6" on:click={removeOwnEntry}>
                    <i class="fas fa-trash" /> Remove
                </div>
            {/if}
        {/if}
        {#if entry.getCanMoveUp()}
            <div
                class="{commonButtonClasses} col-span-3"
                on:click={() => moveQueueEntry(QueueEntryMovementDirection.QUEUE_ENTRY_MOVEMENT_DIRECTION_UP)}
            >
                <i class="fas fa-arrow-circle-up" /> Move up
            </div>
        {/if}
        {#if entry.getCanMoveDown()}
            <div
                class="{commonButtonClasses} col-span-3"
                on:click={() => moveQueueEntry(QueueEntryMovementDirection.QUEUE_ENTRY_MOVEMENT_DIRECTION_DOWN)}
            >
                <i class="fas fa-arrow-circle-down" /> Move down
            </div>
        {/if}
    </div>
</div>
