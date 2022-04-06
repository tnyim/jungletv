<script lang="ts">
import { createEventDispatcher } from "svelte";

    import AccountConnectionIcon from "./AccountConnectionIcon.svelte";
    import AccountConnectionServiceName from "./AccountConnectionServiceName.svelte";
    import { apiClient } from "./api_client";

    import type { Connection, ServiceInfo } from "./proto/jungletv_pb";
    export let connections: Connection[];
    export let services: ServiceInfo[];

    const dispatch = createEventDispatcher();

    let servicesWhichCanBeConnected: ServiceInfo[] = [];

    $: {
        if (services !== undefined) {
            servicesWhichCanBeConnected = services.filter(
                (s) =>
                    !s.hasMaxConnections() ||
                    connections.filter((c) => c.getService() == s.getService()).length < s.getMaxConnections()
            );
        }
    }

    async function connectToService(serviceInfo: ServiceInfo) {
        let response = await apiClient.createConnection(serviceInfo.getService());
        window.location.href = response.getAuthUrl();
    }

    async function removeConnection(connection: Connection) {
        await apiClient.removeConnection(connection.getId());
        dispatch("needsUpdate");
    }

    // this is a workaround
    // stuff like dark: and hover: doesn't work in the postcss @apply
    // https://github.com/tailwindlabs/tailwindcss/discussions/2917
    const commonButtonClasses =
        "text-purple-700 dark:text-purple-500 px-1.5 py-1 rounded hover:shadow-sm " +
        "hover:bg-gray-100 dark:hover:bg-gray-800 outline-none focus:outline-none " +
        "ease-linear transition-all duration-150 cursor-pointer";
</script>

<p class="text-lg font-semibold text-gray-800 dark:text-white">Account connections</p>
{#if servicesWhichCanBeConnected.length > 0}
    <div class="rounded-lg bg-gray-100 dark:bg-gray-900 p-3 pt-2">
        <p>Connect your accounts</p>
        <p class="text-xs">
            Connect these accounts to receive extra rewards, like NFTs. The terms of the external services apply.
        </p>
        <div class="flex flex-row mt-3">
            {#each servicesWhichCanBeConnected as serviceInfo}
                <div
                    on:click={() => connectToService(serviceInfo)}
                    class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black dark:text-white bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:shadow-lg ease-linear transition-all duration-150 cursor-pointer"
                >
                    <AccountConnectionIcon service={serviceInfo.getService()} />
                </div>
            {/each}
        </div>
    </div>
{/if}
{#each connections as connection}
    <div class="mt-2 rounded-lg bg-gray-200 dark:bg-gray-850 p-3 pt-2">
        <div class="flex flex-row space-x-2">
            <div class="self-center"><AccountConnectionIcon service={connection.getService()} /></div>
            <div class="flex-grow">
                <p class="font-semibold">{connection.getName()}</p>
                <p class="text-sm"><AccountConnectionServiceName service={connection.getService()} /></p>
            </div>
            <div class="{commonButtonClasses} self-center" on:click={() => removeConnection(connection)}>
                <i class="fas fa-trash" />
            </div>
        </div>
    </div>
{/each}
