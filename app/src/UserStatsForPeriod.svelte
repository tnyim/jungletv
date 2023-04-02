<script lang="ts">
    import { Duration } from "luxon";
    import { formatBANPriceFixed } from "./currency_utils";
    import type { UserStatsForPeriod } from "./proto/jungletv_pb";

    export let stats: UserStatsForPeriod;

    let totalPlayTime = "";

    $: {
        let pt = stats.getRequestedMediaPlayTime();
        let r = Duration.fromMillis(pt.getSeconds() * 1000 + pt.getNanos() / 1000000);
        totalPlayTime = r.toFormat("d'd 'h'h 'm'm'").replace(/^0d /, "").replace(/^0h /, "");
    }
</script>

<p>Total spent: {formatBANPriceFixed(stats.getTotalSpent())} BAN</p>
<p>Total withdrawn: {formatBANPriceFixed(stats.getTotalWithdrawn())} BAN</p>
<p>Entries enqueued: {stats.getRequestedMediaCount()}</p>
<p>Play time paid for: {totalPlayTime}</p>
