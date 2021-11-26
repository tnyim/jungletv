<script lang="ts">
    import { ConnectionService, ConnectionServiceMap } from "./proto/jungletv_pb";

    export let service: ConnectionServiceMap[keyof ConnectionServiceMap];
</script>

<div class="h-8 w-8">
    {#if service == ConnectionService.CRYPTOMONKEYS}
        <img src="/assets/3rdparty/cryptomonkeys.png" alt="cryptomonKeys" title="cryptomonKeys" class="w-full" />
    {/if}
</div>
