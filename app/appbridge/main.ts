import { ChildHandshake, Connection } from 'post-me';
import { JungleTVWindowMessenger } from './common/messenger';
import { BRIDGE_VERSION as bridgeVersion, ChildEvents, ChildMethods, MountEventArgs, ParentEvents, ParentMethods } from './common/model';

export const BRIDGE_VERSION = bridgeVersion;

// event target for events sent from the server
export const server = document.createTextNode("");

// event target for events created by the parent
export const page = document.createTextNode("");

const messenger = new JungleTVWindowMessenger({
    localWindow: window,
    remoteWindow: window.parent,
    remoteOrigin: globalThis.EXPECTED_PARENT_WINDOW_ORIGIN,
});

let cachedApplicationID: string = "";

const connectionPromise: Promise<Connection<ChildMethods, ChildEvents, ParentMethods, ParentEvents>> = async function () {
    let childMethods: ChildMethods = {};
    let connection: Connection<ChildMethods, ChildEvents, ParentMethods, ParentEvents> = await ChildHandshake(messenger, childMethods);

    let h = connection.remoteHandle();

    if (await h.call("bridgeVersion") !== BRIDGE_VERSION) {
        throw new Error("Mismatched bridge version between parent and child. The loaded bridge script file may be out of date - attempt to bust the cache?");
    }

    cachedApplicationID = await h.call("applicationID");

    h.addEventListener("eventForClient", (args) => {
        server.dispatchEvent(new CustomEvent<any[]>(args.name, { detail: args.args }))
    })

    h.addEventListener("connected", () => {
        page.dispatchEvent(new Event("connected"));
    })
    h.addEventListener("disconnected", () => {
        page.dispatchEvent(new Event("disconnected"));
    })
    h.addEventListener("mounted", (args) => {
        beginObservingPageTitle();
        page.dispatchEvent(new CustomEvent<MountEventArgs>("mounted", { detail: args }));
    })
    h.addEventListener("destroyed", () => {
        stopObservingPageTitle();
        page.dispatchEvent(new Event("destroyed"));
    })

    connection.localHandle().emit("handshook", undefined);

    return connection;
}();

export const serverRequest = async function (method: string, ...args: any[]): Promise<string> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("serverRequest", method, args);
}

export const emitNet = async function (eventName: string, ...args: any[]): Promise<void> {
    let connection = await connectionPromise;
    connection.localHandle().emit("eventForServer", {
        name: eventName,
        args: args,
    });
}

export const resolveApplicationFileURL = async function (fileName: string): Promise<string> {
    await connectionPromise;
    return `/assets/app/${cachedApplicationID}/${fileName}`;
}

// #region Page title syncing

let pageTitleObserver: MutationObserver;

function beginObservingPageTitle() {
    if (typeof pageTitleObserver !== "undefined") {
        pageTitleObserver.disconnect();
    }

    pageTitleObserver = new MutationObserver(async function (_) {
        let connection = await connectionPromise;
        connection.localHandle().emit("pageTitleUpdated", document.title);
    });

    // we observe the head instead of the title element because the page might not have a title element at first,
    // but get one dynamically as it executes scripts
    pageTitleObserver.observe(document.getElementsByTagName("head")[0], {
        childList: true,
        subtree: true,
        attributes: true,
    });
}

function stopObservingPageTitle() {
    pageTitleObserver?.disconnect();
}

// #endregion