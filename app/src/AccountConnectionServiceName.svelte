<script lang="ts">
    import { ConnectionService, ConnectionServiceMap } from "./proto/jungletv_pb";

    export let service: ConnectionServiceMap[keyof ConnectionServiceMap];
</script>

{#if service == ConnectionService.CRYPTOMONKEYS}
    cryptomonKeys
{/if}
