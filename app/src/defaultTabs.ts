import Chat from "./Chat.svelte";
import Document from "./Document.svelte";
import Queue from "./Queue.svelte";
import SkipAndTip from "./SkipAndTip.svelte";

// these have been moved here to avoid a circular dependency involving tabStores
export const defaultTabs = [
    {
        id: "queue",
        component: Queue,
        tabTitle: "Queue",
        props: { mode: "sidebar" },
        closeable: false,
        highlighted: false,
        canPopout: true,
        isApplicationTab: false,
    },
    {
        id: "skipandtip",
        component: SkipAndTip,
        tabTitle: "Skip\u200A&\u200ATip",
        props: { mode: "sidebar" },
        closeable: false,
        highlighted: false,
        canPopout: true,
        isApplicationTab: false,
    },
    {
        id: "chat",
        component: Chat,
        tabTitle: "Chat",
        props: { mode: "sidebar" },
        closeable: false,
        highlighted: false,
        canPopout: true,
        isApplicationTab: false,
    },
    {
        id: "announcements",
        component: Document,
        tabTitle: "Announcements",
        props: { mode: "sidebar", documentID: "announcements" },
        closeable: false,
        highlighted: false,
        canPopout: true,
        isApplicationTab: false,
    },
];