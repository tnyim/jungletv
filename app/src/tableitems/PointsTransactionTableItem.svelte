<script lang="ts">
    import { DateTime } from "luxon";
    import { PointsTransaction, PointsTransactionType, PointsTransactionTypeMap } from "../proto/jungletv_pb";

    export let tx: PointsTransaction;

    function formatDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    }

    function formatType(t: PointsTransactionTypeMap[keyof PointsTransactionTypeMap]): string {
        switch (t) {
            case PointsTransactionType.POINTS_TRANSACTION_TYPE_ACTIVITY_CHALLENGE_REWARD:
                return "Reward for captcha solving";
            case PointsTransactionType.POINTS_TRANSACTION_TYPE_CHAT_ACTIVITY_REWARD:
                return "Reward for chat activity";
            case PointsTransactionType.POINTS_TRANSACTION_TYPE_MEDIA_ENQUEUED_REWARD:
                return "Reward for media enqueuing";
            case PointsTransactionType.POINTS_TRANSACTION_TYPE_CHAT_GIF_ATTACHMENT:
                return "GIF attachment in chat";
            case PointsTransactionType.POINTS_TRANSACTION_TYPE_MANUAL_ADJUSTMENT:
                return "Balance adjustment by the JungleTV team";
            case PointsTransactionType.POINTS_TRANSACTION_TYPE_MEDIA_ENQUEUED_REWARD_REVERSAL:
                return "Reversal of reward for media enqueuing";
            case PointsTransactionType.POINTS_TRANSACTION_TYPE_MEDIA_CONVERSION_FROM_BANANO:
                return "Acquisition with Banano";
            default:
                return "Unknown";
        }
    }
</script>

<tr>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 {tx.getValue() >= 0
            ? 'text-green-500'
            : 'text-red-700'} font-semibold"
    >
        {tx.getValue() >= 0 ? "+" : ""}{tx.getValue()}
    </td>
    <td
        class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-700 dark:text-white"
    >
        {formatDate(tx.getCreatedAt().toDate())}
        {#if tx.getCreatedAt().toDate().getTime() != tx.getUpdatedAt().toDate().getTime()}
            ~ {formatDate(tx.getUpdatedAt().toDate())}
        {/if}
    </td>
    <td class="border-t-0 px-4 sm:px-6 align-middle border-l-0 border-r-0 text-xs p-4 text-gray-700 dark:text-white">
        {formatType(tx.getType())}
    </td>
</tr>
