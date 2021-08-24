<script lang="ts">
    import { apiClient } from "./api_client";
    import QrCode from "svelte-qrcode";
    import { PermissionLevel, QueueEntry, User } from "./proto/jungletv_pb";
    import { darkMode, permissionLevel } from "./stores";
    import { DateTime, DurationUnit } from "luxon";
    import { slide } from "svelte/transition";
    import { copyToClipboard } from "./utils";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let entry: QueueEntry;
    let requestedBy: User;

    $: {
        if (entry.hasRequestedBy() && entry.getRequestedBy().getAddress() != "") {
            requestedBy = entry.getRequestedBy();
        } else {
            requestedBy = undefined;
        }
    }

    let isChatModerator = false;
    permissionLevel.subscribe((level) => {
        isChatModerator = level == PermissionLevel.ADMIN;
    });

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

    function tipAuthor() {
        window.open("https://vault.banano.cc/send?to=" + requestedBy.getAddress());
    }

    function openExplorer() {
        window.open("https://www.yellowspyglass.com/account/" + requestedBy.getAddress());
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
</script>

<div class="flex flex-col px-2 py-1 shadow-inner bg-gray-200 dark:bg-black cursor-default" transition:slide|local>
    <p>
        Request cost:
        <span class="font-normal filter blur-sm hover:blur-none active:blur-none transition-all">
            {apiClient.formatBANPriceFixed(entry.getRequestCost())} BAN
        </span>
    </p>
    {#if requestedBy !== undefined}
        <p>Added to the queue {formatEnqueuedAt(entry)} by</p>
        <div class="flex flex-row">
            <img
                src="https://monkey.banano.cc/api/v1/monkey/{requestedBy.getAddress()}"
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
        <p>
            This video was automatically enqueued by JungleTV because the queue was empty. Since nobody paid for this
            video, it will pay no rewards.
        </p>
    {/if}
    <div class="grid grid-cols-6 gap-2 place-items-center">
        {#if isChatModerator}
            <div
                class="{commonButtonClasses} {requestedBy !== undefined ? 'col-span-2' : 'col-span-6'} "
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
                    class="{commonButtonClasses} col-span-3"
                    on:click={() => window.open("https://www.youtube.com/watch?v=" + entry.getYoutubeVideoData().getId())}
                >
                    <i class="fab fa-youtube" /> Watch on YouTube
                </div>
                <div class="{commonButtonClasses} col-span-3" on:click={openExplorer}>
                    <i class="fas fa-search-dollar" /> Explorer
                </div>
            {/if}
        {/if}
        {#if requestedBy !== undefined}
            <div class="{commonButtonClasses} col-span-3" on:click={copyAddress}>
                <i class="fas fa-copy" />
                {copied ? "Copied!" : "Copy address"}
            </div>
            <div class="{commonButtonClasses} col-span-3" on:click={tipAuthor}>
                <i class="fas fa-heart" /> Tip in BananoVault
            </div>
        {/if}
    </div>
</div>
