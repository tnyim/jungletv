<script lang="ts">
    import { DateTime } from "luxon";
    import { openUserProfile } from "../profile_utils";
    import type { UserVerification } from "../proto/jungletv_pb";
    import { buildMonKeyURL } from "../utils";

    export let verification: UserVerification;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
    }

    function formatScope(): string {
        let places = [];
        if (verification.getSkipClientIntegrityChecks()) {
            places.push("Allow corrupted clients");
        }
        if (verification.getSkipIpAddressReputationChecks()) {
            places.push("Allow VPNs");
        }
        if (verification.getReduceHardChallengeFrequency()) {
            places.push("Fewer captchas");
        }
        return places.join(", ");
    }
</script>

<tr>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white font-mono"
    >
        {verification.getId()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white"
    >
        {formatDate(verification.getCreatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white font-mono"
    >
        {verification.getVerifiedBy().getAddress().substr(0, 14)}
    </td>
</tr>
<tr>
    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm pb-4 pt-1 text-gray-700 dark:text-white">
        {formatScope()}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pb-4 pt-1 text-gray-700 dark:text-white font-mono cursor-pointer"
        on:click={() => openUserProfile(verification.getAddress())}
    >
        <img
            src={buildMonKeyURL(verification.getAddress())}
            alt="&nbsp;"
            title=""
            class="inline h-7 -ml-1 -mt-4 -mb-3"
        />
        <span class="font-mono">{verification.getAddress().substr(0, 14)} </span>
    </td>
    <td
        colspan="2"
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm pb-4 pt-1 text-gray-700 dark:text-white"
    >
        {verification.getReason()}
    </td>
</tr>
