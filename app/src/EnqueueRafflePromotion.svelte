<script lang="ts">
    import { DateTime } from "luxon";
    import { link } from "svelte-navigator";
    import type { OngoingRaffleInfo } from "./proto/jungletv_pb";

    export let ongoingRaffleInfo: OngoingRaffleInfo;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    }

    $: winningChance =
        ((ongoingRaffleInfo.getUserTickets() / ongoingRaffleInfo.getTotalTickets()) * 100).toFixed(1) + "%";

    $: drawDate = formatDate(ongoingRaffleInfo.getPeriodEnd().toDate());
</script>

<div class="shadow sm:rounded-md sm:overflow-hidden">
    <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6">
        <div class="grid grid-cols-3 gap-6">
            <div class="col-span-3">
                <p>
                    <span class="text-lg">Earn prizes for enqueuing videos!</span>
                    <a use:link href="/documents/weeklyraffle">Learn more</a>
                </p>
                {#if ongoingRaffleInfo.hasUserTickets()}
                    <p class="text-sm">
                        {#if ongoingRaffleInfo.getUserTickets() > 0}
                            You have {ongoingRaffleInfo.getUserTickets()}
                            ticket{ongoingRaffleInfo.getUserTickets() == 1 ? "" : "s"}
                            in the ongoing raffle, from a total of {ongoingRaffleInfo.getTotalTickets()}
                            - a <span class="font-bold">{winningChance}</span> chance of winning. Enqueue another video to
                            increase your chances! You'll get the corresponding ticket once it begins playing.
                        {:else}
                            You do not have any tickets in the ongoing raffle; enqueue a video to get a chance to win a
                            prize! You'll get the corresponding raffle ticket once it begins playing.
                        {/if}
                    </p>
                {/if}
                <p class="text-sm mt-4">
                    The current raffle will be drawn on {drawDate} (date presented in your local time).<br />
                    <a href={ongoingRaffleInfo.getEntriesUrl()} target="_blank" rel="noopener">List of tickets</a>
                    |
                    <a href={ongoingRaffleInfo.getInfoUrl()} target="_blank" rel="noopener">Raffle status</a>
                </p>
            </div>
        </div>
    </div>
</div>
