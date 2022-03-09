<script lang="ts">
    import { DateTime } from "luxon";
    import { RaffleDrawing, RaffleDrawingStatus } from "../proto/jungletv_pb";
    import { ordinalSuffix } from "../utils";
    import UserCellRepresentation from "./UserCellRepresentation.svelte";

    export let drawing: RaffleDrawing;

    function formatPeriod(): string {
        let date = DateTime.fromJSDate(drawing.getPeriodStart().toDate());
        return `${ordinalSuffix(date.weekNumber)} week of ${date.weekYear}`;
    }

    function formatStatus(): string {
        switch (drawing.getStatus()) {
            case RaffleDrawingStatus.RAFFLE_DRAWING_STATUS_ONGOING:
                return "Ongoing";
            case RaffleDrawingStatus.RAFFLE_DRAWING_STATUS_PENDING:
                return "Winner decided";
            case RaffleDrawingStatus.RAFFLE_DRAWING_STATUS_CONFIRMED:
                return "Winner confirmed";
            case RaffleDrawingStatus.RAFFLE_DRAWING_STATUS_COMPLETE:
                return "Prize paid";
            case RaffleDrawingStatus.RAFFLE_DRAWING_STATUS_VOIDED:
                return "Voided";
        }
        return "";
    }
</script>

<tr>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 p-4 text-gray-700 dark:text-white whitespace-nowrap text-xs sm:text-sm"
    >
        {formatPeriod()}
        {#if drawing.getDrawingNumber() > 1}
            <br /><small>{ordinalSuffix(drawing.getDrawingNumber())} drawing</small>
        {/if}
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white text-sm"
    >
        {formatStatus()}<br />
        <span class="text-xs">
            <a target="_blank" href={drawing.getInfoUrl()}>Info</a> |
            <a target="_blank" href={drawing.getEntriesUrl()}>Tickets list</a>
        </span>
    </td>
    <td
        class="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-2 text-gray-700 dark:text-white"
    >
        {#if drawing.hasWinner()}
            <UserCellRepresentation user={drawing.getWinner()} />
        {:else}
            <span class="text-xs">To be decided</span>
        {/if}
    </td>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {#if drawing.hasPrizeTxHash()}
            <a href="https://yellowspyglass.com/hash/{drawing.getPrizeTxHash()}" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt" />
            </a>
        {/if}
    </td>
</tr>
