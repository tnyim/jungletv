<script lang="ts">
    import type { grpc } from "@improbable-eng/grpc-web";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { Connection, ParentHandshake } from "post-me";
    import { onDestroy } from "svelte";
    import { navigate } from "svelte-navigator";
    import type { Unsubscriber } from "svelte/store";
    import { JungleTVWindowMessenger } from "../appbridge/common/messenger";
    import { BRIDGE_VERSION, ChildEvents, ChildMethods, ParentEvents, ParentMethods } from "../appbridge/common/model";
    import { apiClient } from "./api_client";
    import { modalAlert, modalConfirm, modalPrompt } from "./modal/modal";
    import NotFound from "./NotFound.svelte";
    import { pageTitleApplicationPage } from "./pageTitleStores";
    import type { ApplicationEventUpdate, ResolveApplicationPageResponse } from "./proto/application_runtime_pb";
    import type { PermissionLevelMap } from "./proto/jungletv_pb";
    import { consumeStreamRPC, StreamRequestController } from "./rpcUtils";
    import { darkMode, permissionLevel, rewardAddress } from "./stores";

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
    let jsonCleaner = (key, value) => (key === "__proto__" ? undefined : value);

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
            let result = await apiClient.applicationServerMethod(applicationID, pageID, method, jsonArgs);
            return JSON.parse(result.getResult(), jsonCleaner);
        },
        navigateToApplicationPage(newPageID, newApplicationID) {
            navigate(`/apps/${newApplicationID ?? applicationID}/${newPageID}`);
        },
        navigate(to) {
            navigate(to);
        },
        alert: modalAlert,
        confirm: modalConfirm,
        prompt: modalPrompt,
        userAddress: () => rewardAddressPromise,
        userPermissionLevel: () => permissionLevelPromise,
    };

    let rewardAddressPromise = new Promise((resolve: (address: string) => void) => {
        let unsub = rewardAddress.subscribe((address) => {
            if (address !== null) {
                unsub();
                resolve(address === "" ? undefined : address);
            }
        });
    });

    const permissionLevelMapping: Record<PermissionLevelMap[keyof PermissionLevelMap], string> = {
        0: "unauthenticated",
        1: "user",
        2: "admin",
    };

    let permissionLevelPromise = new Promise((resolve: (level: string) => void) => {
        let unsub = permissionLevel.subscribe((level) => {
            if (level !== null) {
                unsub();
                resolve(permissionLevelMapping[level]);
            }
        });
    });

    function consumeApplicationEventsRequestBuilder(
        onUpdate: (update: ApplicationEventUpdate) => void,
        onEnd: (code: grpc.Code, msg: string) => void
    ): Request {
        return apiClient.consumeApplicationEvents(applicationID, pageID, onUpdate, onEnd);
    }

    async function handleApplicationEventUpdate(update: ApplicationEventUpdate) {
        if (update.hasApplicationEvent()) {
            try {
                let decodedArgs: any[] = [];
                for (let arg of update.getApplicationEvent().getArgumentsList()) {
                    decodedArgs.push(JSON.parse(arg, jsonCleaner));
                }
                connection.localHandle().emit("eventForClient", {
                    name: update.getApplicationEvent().getName(),
                    args: decodedArgs,
                });
            } catch (e) {
                console.log("exception caught while transmitting event from server:", e);
            }
        }
    }

    let hadConnectedPreviously = false;
    function handleApplicationEventRequestStatusChanged(connected: boolean) {
        if (connected && !hadConnectedPreviously) {
            hadConnectedPreviously = true;
            connection.localHandle().emit("connected", undefined);
        } else if (hadConnectedPreviously) {
            connection.localHandle().emit("disconnected", undefined);
        }
    }

    let eventsRequestController: StreamRequestController;

    let darkModeUnsubscriber: Unsubscriber;

    async function onIframeLoaded() {
        if (typeof eventsRequestController !== "undefined") {
            eventsRequestController.disconnect();
            eventsRequestController = undefined;
            hadConnectedPreviously = false;
        }
        if (typeof darkModeUnsubscriber !== "undefined") {
            darkModeUnsubscriber();
        }
        const messenger = new JungleTVWindowMessenger({
            localWindow: window,
            remoteWindow: iframe.contentWindow,
            remoteOrigin: "null",
        });

        connection = await ParentHandshake(messenger, bridgeMethods);

        connection.remoteHandle().addEventListener("pageTitleUpdated", (t) => {
            pageTitleApplicationPage.set(t ? t : originalPageTitle);
        });
        connection.remoteHandle().addEventListener("eventForServer", async (data) => {
            let jsonArgs: string[] = [];
            for (let arg of data.args) {
                jsonArgs.push(JSON.stringify(arg));
            }
            await apiClient.triggerApplicationEvent(applicationID, pageID, data.name, jsonArgs);
        });

        await connection.remoteHandle().once("handshook");

        connection.localHandle().emit("mounted", {
            applicationID: applicationID,
            applicationVersion: applicationVersion,
            pageID: pageID,
            role: "standalone",
        });

        darkModeUnsubscriber = darkMode.subscribe((dark) => {
            connection.localHandle().emit("themeChanged", {
                darkMode: dark,
            });
        });

        eventsRequestController = consumeStreamRPC(
            20000,
            5000,
            consumeApplicationEventsRequestBuilder,
            handleApplicationEventUpdate,
            handleApplicationEventRequestStatusChanged
        );

        eventsRequestController.rebuildAndReconnect();
    }

    onDestroy(() => {
        if (typeof eventsRequestController !== "undefined") {
            eventsRequestController.disconnect();
        }
        if (typeof connection !== "undefined") {
            connection.localHandle().emit("destroyed", undefined);
        }
        if (typeof darkModeUnsubscriber !== "undefined") {
            darkModeUnsubscriber();
        }
    });
</script>

{#await resolvePage(applicationID, pageID)}
    Loading
{:then response}
    <iframe
        bind:this={iframe}
        on:load={onIframeLoaded}
        class="w-screen h-screen -mt-16 pt-16"
        title={response.getPageTitle()}
        src="/apppages/{applicationID}/{pageID}"
        sandbox="allow-forms allow-scripts allow-popups allow-modals allow-downloads"
    />
{:catch}
    <NotFound />
{/await}
