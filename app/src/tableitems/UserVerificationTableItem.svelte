<script lang="ts">
    import { openUserProfile } from "../profile_utils";
    import type { UserVerification } from "../proto/jungletv_pb";
    import { buildMonKeyURL, formatDateForModeration } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let verification: UserVerification;

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
        {formatDateForModeration(verification.getCreatedAt().toDate())}
    </td>
    <td
        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap pt-4 pb-1 text-gray-700 dark:text-white"
    >
        <UserCellRepresentation user={verification.getVerifiedBy()} />
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
            class="inline h-7 w-7 -ml-1 -mt-4 -mb-3"
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
