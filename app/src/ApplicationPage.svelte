<script lang="ts">
    import { onDestroy } from "svelte";
    import { apiClient } from "./api_client";
    import NotFound from "./NotFound.svelte";
    import { pageTitleApplicationPage } from "./pageTitleStores";
    import type { ResolveApplicationPageResponse } from "./proto/application_runtime_pb";

    export let applicationID: string;
    export let pageID: string;

    async function resolvePage(applicationID: string, pageID: string): Promise<ResolveApplicationPageResponse> {
        let r = await apiClient.resolveApplicationPage(applicationID, pageID);
        pageTitleApplicationPage.set(r.getPageTitle());
        return r;
    }

    onDestroy(() => {
        pageTitleApplicationPage.set("");
    });
</script>

{#await resolvePage(applicationID, pageID)}
    Loading
{:then response}
    <iframe
        class="w-screen h-screen -mt-16 pt-16"
        title={response.getPageTitle()}
        src="/apppages/{applicationID}/{pageID}"
    />
{:catch}
    <NotFound />
{/await}
