<script lang="ts">
    import { Connection, ParentHandshake } from "post-me";
    import { onDestroy } from "svelte";
    import { navigate } from "svelte-navigator";
    import { JungleTVWindowMessenger } from "../appbridge/common/messenger";
    import { BRIDGE_VERSION, ChildEvents, ChildMethods, ParentEvents, ParentMethods } from "../appbridge/common/model";
    import { apiClient } from "./api_client";
    import { modalAlert, modalConfirm, modalPrompt } from "./modal/modal";
    import NotFound from "./NotFound.svelte";
    import { pageTitleApplicationPage } from "./pageTitleStores";
    import type { ResolveApplicationPageResponse } from "./proto/application_runtime_pb";

    export let applicationID: string;
    export let pageID: string;
    let applicationVersion: Date;
    let originalPageTitle: string;

    async function resolvePage(applicationID: string, pageID: string): Promise<ResolveApplicationPageResponse> {
        let r = await apiClient.resolveApplicationPage(applicationID, pageID);
        applicationVersion = r.getApplicationVersion().toDate();
        originalPageTitle = r.getPageTitle();
        pageTitleApplicationPage.set(originalPageTitle);
        return r;
    }

    let iframe: HTMLIFrameElement;
    $: if (typeof iframe !== "undefined") {
        iframeBound(iframe);
    }

    onDestroy(() => {
        pageTitleApplicationPage.set("");
    });

    let connection: Connection<ParentMethods, ParentEvents, ChildMethods, ChildEvents>;

    let bridgeMethods: ParentMethods = {
        applicationID() {
            return applicationID;
        },
        bridgeVersion() {
            return BRIDGE_VERSION;
        },
        async serverMethod(method, ...args): Promise<any> {
            let jsonArgs: string[] = [];
            for (let arg of args) {
                jsonArgs.push(JSON.stringify(arg));
            }
            let result = await apiClient.applicationServerMethod(applicationID, method, jsonArgs);
            return JSON.parse(result.getResult(), (key, value) => (key === "__proto__" ? undefined : value));
        },
        navigateToApplicationPage(newPageID, newApplicationID) {
            navigate(`/apps/${newApplicationID ?? applicationID}/${newPageID}`);
        },
        alert: modalAlert,
        confirm: modalConfirm,
        prompt: modalPrompt,
    };

    async function iframeBound(iframe: HTMLIFrameElement) {
        const messenger = new JungleTVWindowMessenger({
            localWindow: window,
            remoteWindow: iframe.contentWindow,
            remoteOrigin: "null",
        });

        connection = await ParentHandshake(messenger, bridgeMethods);

        connection.remoteHandle().addEventListener("pageTitleUpdated", (t) => {
            pageTitleApplicationPage.set(t ? t : originalPageTitle);
        });

        await connection.remoteHandle().once("handshook");

        connection.localHandle().emit("mounted", {
            applicationID: applicationID,
            applicationVersion: applicationVersion,
            pageID: pageID,
            role: "standalone",
        });
    }

    onDestroy(() => {
        if (typeof connection !== "undefined") {
            connection.localHandle().emit("destroyed", undefined);
        }
    });
</script>

{#await resolvePage(applicationID, pageID)}
    Loading
{:then response}
    <iframe
        bind:this={iframe}
        class="w-screen h-screen -mt-16 pt-16"
        title={response.getPageTitle()}
        src="/apppages/{applicationID}/{pageID}"
        sandbox="allow-forms allow-scripts allow-popups allow-modals allow-downloads"
    />
{:catch}
    <NotFound />
{/await}
