<script lang="ts">
    import type { UserVerification } from "../proto/jungletv_pb";
    import { formatDateForModeration } from "../utils";
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

<tr class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white">
    <td
        class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1 font-mono"
    >
        {verification.getId()}
    </td>
    <td
        class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1"
    >
        {formatDateForModeration(verification.getCreatedAt().toDate())}
    </td>
    <td
        class="px-6 align-middle text-xs whitespace-nowrap pt-4 pb-1"
    >
        <UserCellRepresentation user={verification.getVerifiedBy()} />
    </td>
</tr>
<tr class="text-gray-700 dark:text-white">
    <td class="px-6 align-middle text-sm pb-4 pt-1">
        {formatScope()}
    </td>
    <td
        class="px-6 align-middle text-xs whitespace-nowrap pb-4 pt-1 font-mono cursor-pointer"
    >
        <UserCellRepresentation user={verification} />
    </td>
    <td
        colspan="2"
        class="px-6 align-middle text-sm pb-4 pt-1"
    >
        {verification.getReason()}
    </td>
</tr>
