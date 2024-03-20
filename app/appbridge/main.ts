import { ChildHandshake, WindowMessenger, type Connection } from 'post-me';
import { BRIDGE_VERSION as bridgeVersion, type ChildEvents, type ChildMethods, type MountEventArgs, type ParentEvents, type ParentMethods } from './common/model';
import { defineCustomElements, setCustomElementsDarkMode } from './ui';

/**
 * Version of the bridge between the application page code and the host JungleTV page.
 * @public
 */
export const BRIDGE_VERSION = bridgeVersion;

/**
 * Event target for events sent from the JungleTV server.
 * @public
 */
export const server = new EventTarget();

/**
 * Event target for events sent from the host JungleTV page.
 * @public
 */
export const page = new EventTarget();

const messenger = new WindowMessenger({
    localWindow: window,
    remoteWindow: window.parent,
    remoteOrigin: window.origin,
});

let cachedInfo = {
    applicationID: (/^\/assets\/app\/(.*)\//g.exec(document.location.pathname) ?? ["", ""])[1],
    applicationVersion: new URLSearchParams(document.location.search).get("v") ?? "",
    hostVersion: "",
    pageID: "",
    pagePathname: "",
    role: "",
};

let resolveServerConnectionPromise: () => void;
let serverConnectionPromise = new Promise<void>((resolve) => {
    resolveServerConnectionPromise = resolve;
});

const connectionPromise: Promise<Connection<ChildMethods, ChildEvents, ParentMethods, ParentEvents>> = async function () {
    let childMethods: ChildMethods = {};
    let connection: Connection<ChildMethods, ChildEvents, ParentMethods, ParentEvents> = await ChildHandshake(messenger, childMethods);

    let h = connection.remoteHandle();

    if (await h.call("bridgeVersion") !== BRIDGE_VERSION) {
        throw new Error("Mismatched bridge version between parent and child. The loaded bridge script file may be out of date - attempt to bust the cache?");
    }

    cachedInfo.applicationID = await h.call("applicationID");
    cachedInfo.applicationVersion = await h.call("applicationVersion");
    cachedInfo.hostVersion = await h.call("hostVersion");
    cachedInfo.pageID = await h.call("pageID");
    cachedInfo.pagePathname = await h.call("pagePathname");
    defineCustomElements(cachedInfo.hostVersion);

    h.addEventListener("eventForClient", (args) => {
        server.dispatchEvent(new CustomEvent<any[]>(args.name, { detail: args.args }))
    });

    h.addEventListener("connected", () => {
        resolveServerConnectionPromise();
        page.dispatchEvent(new Event("connected"));
    });
    h.addEventListener("disconnected", () => {
        serverConnectionPromise = new Promise<void>((resolve) => {
            resolveServerConnectionPromise = resolve;
        });
        page.dispatchEvent(new Event("disconnected"));
    });
    h.addEventListener("mounted", (args: MountEventArgs) => {
        beginObservingPageTitle();
        beginObservingDocumentResizes();
        beginUpdatingMarkdownTimestamps();
        cachedInfo.role = args.role;
        page.dispatchEvent(new CustomEvent<MountEventArgs>("mounted", { detail: args }));
    });
    h.addEventListener("destroyed", () => {
        stopObservingPageTitle();
        stopObservingDocumentResizes();
        stopUpdatingMarkdownTimestamps();
        page.dispatchEvent(new Event("destroyed"));
    });
    h.addEventListener("themeChanged", (args) => {
        let body = document.getElementsByTagName("body")[0];
        if (args.darkMode) {
            body.classList.add("dark");
        } else {
            body.classList.remove("dark");
        }
        setCustomElementsDarkMode(args.darkMode);
    });

    connection.localHandle().emit("handshook", undefined);


    return connection;
}();

/**
 * Make a remote call to the application's server script.
 * @param method The remote method to call.
 * @param args The arguments of the call.
 * @returns The result of the call after JSON parsing.
 * @public
 */
export const serverMethod = async function <T>(method: string, ...args: any[]): Promise<T> {
    let connection = await connectionPromise;
    await serverConnectionPromise;
    return connection.remoteHandle().call("serverMethod", method, ...args);
}

/**
 * Emits an event for the server script.
 * @param eventName The name of the event to emit.
 * @param args The arguments of the event.
 * @public
 */
export const emitToServer = async function (eventName: string, ...args: any[]): Promise<void> {
    let connection = await connectionPromise;
    await serverConnectionPromise;
    connection.localHandle().emit("eventForServer", {
        name: eventName,
        args: args,
    });
}

/**
 * Instructs the JungleTV host page to navigate to a different page, in this or another application.
 * @param pageID The ID of the page to navigate to.
 * @param applicationID The ID of the application the page belongs to, can be omitted if the page belongs to the current application.
 * @public
 */
export const navigateToApplicationPage = async function (pageID: string, applicationID?: string): Promise<void> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("navigateToApplicationPage", pageID, applicationID);
}

/**
 * Instructs the JungleTV host page to navigate to a different JungleTV app route using svelte-navigator.
 * @param to The destination to navigate to.
 * @public
 */
export const navigate = async function (to: string): Promise<void> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("navigate", to);
}

/**
 * Resolves the URL that can be used to reference a public file of this application, within the context of the page.
 * @param fileName The name of the file to resolve.
 * @returns The resolved URL, or undefined if the connection between the page and the host JungleTV page has not been established yet.
 * @public
 */
export const resolveApplicationFileURL = async function (fileName: string): Promise<string> {
    await connectionPromise;
    return `/assets/app/${cachedInfo.applicationID}/${cachedInfo.applicationVersion}/${fileName}`;
}

/**
 * Resolves the ID of the application to which the page being executed belongs.
 * @returns The application ID.
 * @public
 */
export const getApplicationID = async function (): Promise<string> {
    await connectionPromise;
    return cachedInfo.applicationID;
}

/**
 * Resolves the version of the application to which the page being executed belongs.
 * @returns The application version, represented as a number of milliseconds since midnight, January 1, 1970 UTC.
 * Should equal `process.versions.application` as available to server-side scripts.
 * @public
 */
export const getApplicationVersion = async function (): Promise<string> {
    await connectionPromise;
    return cachedInfo.applicationVersion;
}

/**
 * Resolves the ID of the application page being executed.
 * @returns The page ID.
 * @public
 */
export const getApplicationPageID = async function (): Promise<string> {
    await connectionPromise;
    return cachedInfo.pageID;
}

/**
 * Resolves the path name of the application page being executed, if the page is being rendered in `standalone` mode.
 * @returns The page path name, that is, the part of the containing page's path that follows the page ID.
 * @public
 */
export const getApplicationPagePathname = async function (): Promise<string> {
    await connectionPromise;
    return "/" + cachedInfo.pagePathname;
}

/**
 * Resolves the "search" portion of the containing page's URL, if the page is being rendered in `standalone` mode.
 * @returns The `window.location.search` of the containing page.
 * @public
 */
export const getApplicationPageSearch = async function (): Promise<string> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("pageSearch");
}

/**
 * Resolves the "hash" portion of the containing page's URL, if the page is being rendered in `standalone` mode.
 * @returns The `window.location.hash` of the containing page.
 * @public
 */
export const getApplicationPageHash = async function (): Promise<string> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("pageHash");
}

/**
 * Shows an alert modal to the user.
 * @param message The message to show.
 * @param title The title of the modal.
 * @param buttonLabel The label of the button to dismiss the message.
 * @returns A promise that resolves when the user closes the modal.
 * @public
 */
export const alert = async function (message: string, title: string = "", buttonLabel: string = "OK"): Promise<void> {
    let connection = await connectionPromise;
    await connection.remoteHandle().call("alert", message, title, buttonLabel);
}

/**
 * Shows a confirmation modal to the user.
 * @param question The question to show.
 * @param title The title of the modal.
 * @param positiveAnswerLabel The label of the button to accept the confirmation.
 * @param negativeAnswerLabel The label of the button to reject the confirmation.
 * @returns Whether the user accepted the confirmation.
 * @public
 */
export const confirm = async function (question: string, title: string = "", positiveAnswerLabel: string = "Yes", negativeAnswerLabel: string = "No"): Promise<boolean> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("confirm", question, title, positiveAnswerLabel, negativeAnswerLabel);
}

/**
 * Shows a prompt modal to the user, allowing them to enter text.
 * @param question The question to show.
 * @param title The title of the modal.
 * @param placeholder The placeholder value of the text input.
 * @param initialValue The initial value of the text input.
 * @param positiveAnswerLabel The label of the button to submit the input.
 * @param negativeAnswerLabel The label of the button to cancel the prompt.
 * @returns The text entered by the user, or null if the user cancelled the prompt.
 * @public
 */
export const prompt = async function (question: string,
    title: string = "",
    placeholder: string = "",
    initialValue: string = "",
    positiveAnswerLabel: string = "OK",
    negativeAnswerLabel: string = "Cancel"): Promise<string> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("prompt", question, title, placeholder, initialValue, positiveAnswerLabel, negativeAnswerLabel);
}

/**
 * Get the reward address of the currently logged in user.
 * @returns The reward address of the currently logged in user, or undefined if the user is not authenticated.
 * @public
 */
export const getUserAddress = async function (): Promise<string | undefined> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("userAddress");
}

/**
 * Get the permission level of the current user.
 * @returns The permission level of the current user.
 * @public
 */
export const getUserPermissionLevel = async function (): Promise<string> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("userPermissionLevel");
}

/**
 * Shows a modal containing the profile of a user.
 * The modal may not be opened immediately if a modal is presently being displayed, but the promise is resolved regardless.
 * @param userAddress The reward address of the user.
 * @public
 */
export const showUserProfile = async function (userAddress: string): Promise<void> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("showUserProfile", userAddress);
}

/**
 * Parses JungleTV Flavored Markdown into HTML.
 * @param markdown The markdown to parse.
 * @returns The resulting HTML.
 * @public
 */
export const markdownToHTML = async function (markdown: string): Promise<string> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("parseMarkdown", markdown);
}

/**
 * Parses a limited subset of JungleTV Flavored Markdown into HTML.
 * @param markdown The markdown to parse.
 * @returns The resulting HTML.
 * @public
 */
export const limitedMarkdownToHTML = async function (markdown: string): Promise<string> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("parseLimitedMarkdown", markdown);
}

/**
 * Shows a notification on the navigation bar
 * @param message The message to show
 * @param duration The length of time for which the notification should show, in milliseconds. Must not be greater than 15000
 * @param href An optional internal website link to navigate to
 */
export const showNavigationBarNotification = async function (message: string, duration?: number, href?: string) {
    if (typeof duration === "undefined") {
        duration = 7000;
    }
    if (duration > 15000) {
        throw new Error("Duration cannot be greater than 15000");
    } else if (duration <= 0) {
        throw new Error("Duration must be greater than 0");
    }
    let connection = await connectionPromise;
    return connection.remoteHandle().call("showNavbarToast", message, duration, href);
}

/**
 * Get the current player volume being used by playing media.
 * @returns The current volume as a fraction between 0 and 1.
 */
export const getPlayerVolume = async function (): Promise<number> {
    let connection = await connectionPromise;
    return connection.remoteHandle().call("playerVolume");
}

/**
 * Set the current player volume being used by playing media.
 * Application pages may only use this method when mounted as playing media.
 * @param volume The volume to set as a fraction between 0 and 1.
 */
export const setPlayerVolume = async function (volume: number): Promise<void> {
    if (volume < 0 || volume > 1) {
        throw new Error("Volume must be between 0 and 1");
    }
    if (cachedInfo.role !== "playingmedia") {
        throw new Error("This method may only be used when mounted as playing media");
    }
    let connection = await connectionPromise;
    return connection.remoteHandle().call("setPlayerVolume", volume);
}

// #region Page title syncing

let pageTitleObserver: MutationObserver;

async function beginObservingPageTitle() {
    if (typeof pageTitleObserver !== "undefined") {
        pageTitleObserver.disconnect();
    }

    let connection = await connectionPromise;
    connection.localHandle().emit("pageTitleUpdated", document.title);

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

// #region Page dimensions syncing

let pageResizeObserver: ResizeObserver;

function beginObservingDocumentResizes() {
    pageResizeObserver = new ResizeObserver(async (changes) => {
        let connection = await connectionPromise;
        let rect = document.body.getBoundingClientRect();
        connection.localHandle().emit("pageResized", {
            width: rect.width,
            height: rect.height,
        });
    })

    pageResizeObserver.observe(document.body);
}

function stopObservingDocumentResizes() {
    pageResizeObserver?.disconnect();
}

// #endregion

// #region Markdown timestamp updating

let markdownTimestampUpdatingInterval: number;

function beginUpdatingMarkdownTimestamps() {
    if (typeof markdownTimestampUpdatingInterval !== "undefined") {
        clearInterval(markdownTimestampUpdatingInterval);
    }
    markdownTimestampUpdatingInterval = setInterval(async () => {
        let connection = await connectionPromise;
        document.querySelectorAll(".markdown-timestamp.relative").forEach(async (e) => {
            if (!(e instanceof HTMLElement)) {
                return;
            }
            e.innerText = await connection.remoteHandle().call(
                "formatTimestampFromDatasetData",
                parseInt(e.dataset.timestamp),
                e.dataset.timestampType);
        });
    }, 1000);
}

function stopUpdatingMarkdownTimestamps() {
    clearInterval(markdownTimestampUpdatingInterval);
    markdownTimestampUpdatingInterval = undefined;
}

// #endregion