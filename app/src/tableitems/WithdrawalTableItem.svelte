<script lang="ts">
    import { DateTime, type DurationUnit } from "luxon";
    import { formatBANPriceFixed } from "../currency_utils";
    import type { Withdrawal } from "../proto/jungletv_pb";

    export let withdrawal: Withdrawal;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOptions().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    }

    const units: DurationUnit[] = ["year", "month", "week", "day", "hour", "minute", "second"];

    function formatDifference(earlierDate: Date, laterDate: Date): string {
        let ed = DateTime.fromJSDate(earlierDate);
        let ld = DateTime.fromJSDate(laterDate);
        const diff = ld.diff(ed).shiftTo(...units);
        const unit: DurationUnit = units.find((unit) => diff.get(unit) !== 0) || "second";
        const relativeFormatter = new Intl.RelativeTimeFormat("en", {
            numeric: "auto",
        });
        return relativeFormatter
            .format(Math.trunc(diff.as(unit)), unit as Intl.RelativeTimeFormatUnit)
            .replace("in ", "after ")
            .replace("now", "immediately");
    }
</script>

<tr>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white font-semibold"
    >
        {formatBANPriceFixed(withdrawal.getAmount())} BAN
    </td>
    <td class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white">
        {formatDate(withdrawal.getStartedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDifference(withdrawal.getStartedAt().toDate(), withdrawal.getCompletedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        <a href="https://creeper.banano.cc/hash/{withdrawal.getTxHash()}" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt" />
        </a>
    </td>
</tr>
