<script lang="ts">
    import type { grpc } from "@improbable-eng/grpc-web";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { Connection, ParentHandshake, WindowMessenger } from "post-me";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { navigate } from "svelte-navigator";
    import type { Unsubscriber } from "svelte/store";
    import {
        BRIDGE_VERSION,
        ChildEvents,
        ChildMethods,
        MountEventArgs,
        ParentEvents,
        ParentMethods,
    } from "../appbridge/common/model";
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
    export let mode: "sidebar" | "page" = "page";
    let applicationVersion: Date;
    let originalPageTitle: string;

    const dispatch = createEventDispatcher();

    async function resolvePage(applicationID: string, pageID: string): Promise<ResolveApplicationPageResponse> {
        let r = await apiClient.resolveApplicationPage(applicationID, pageID);
        applicationVersion = r.getApplicationVersion().toDate();
        originalPageTitle = r.getPageTitle();
        if (mode == "page") {
            pageTitleApplicationPage.set(originalPageTitle);
        } else if (mode == "sidebar") {
            dispatch("setTabTitle", originalPageTitle);
        }
        return r;
    }

    let iframe: HTMLIFrameElement;
    let jsonCleaner = (key, value) => (key === "__proto__" ? undefined : value);

    onDestroy(() => {
        if (mode == "page") {
            pageTitleApplicationPage.set("");
        }
    });

    let connection: Connection<ParentMethods, ParentEvents, ChildMethods, ChildEvents>;

    let bridgeMethods: ParentMethods = {
        bridgeVersion() {
            return BRIDGE_VERSION;
        },
        hostVersion() {
            return apiClient.getClientVersion();
        },
        applicationID() {
            return applicationID;
        },
        applicationVersion() {
            return applicationVersion.getTime() + "";
        },
        pageID() {
            return pageID;
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
        } else if (!connected && hadConnectedPreviously) {
            hadConnectedPreviously = false;
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
        const messenger = new WindowMessenger({
            localWindow: window,
            remoteWindow: iframe.contentWindow,
            remoteOrigin: window.origin,
        });

        connection = await ParentHandshake(messenger, bridgeMethods);

        connection.remoteHandle().addEventListener("pageTitleUpdated", (t) => {
            let title = t ? t : originalPageTitle;
            if (mode == "page") {
                pageTitleApplicationPage.set(title);
            } else if (mode == "sidebar") {
                dispatch("setTabTitle", title);
            }
        });
        connection.remoteHandle().addEventListener("eventForServer", async (data) => {
            let jsonArgs: string[] = [];
            for (let arg of data.args) {
                jsonArgs.push(JSON.stringify(arg));
            }
            await apiClient.triggerApplicationEvent(applicationID, pageID, data.name, jsonArgs);
        });
        connection.remoteHandle().addEventListener("pageResized", (args) => {
            iframe.height = args.height + "";
        });

        await connection.remoteHandle().once("handshook");

        let role: MountEventArgs["role"] = mode == "page" ? "standalone" : mode;
        connection.localHandle().emit("mounted", {
            role: role,
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
        class="w-full"
        title={response.getPageTitle()}
        src="/assets/app/{applicationID}/*{pageID}?v={applicationVersion.getTime() + ''}"
        scrolling="no"
        sandbox="allow-forms allow-scripts allow-popups allow-modals allow-downloads allow-same-origin"
    />
{:catch}
    <NotFound />
{/await}
