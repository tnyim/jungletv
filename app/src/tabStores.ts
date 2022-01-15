import { writable } from 'svelte/store';
import Queue from "./Queue.svelte";
import Chat from "./Chat.svelte";
import Document from "./Document.svelte";
import SkipAndTip from "./SkipAndTip.svelte";

export type SidebarTab = {
    id: string;
    component: any;
    tabTitle: string;
    props: {};
    closeable: boolean;
    highlighted: boolean;
};

export const defaultSidebarTabIDs = ["queue", "skipandtip", "chat", "announcements"];

export const sidebarTabs = writable([
    {
        id: "queue",
        component: Queue,
        tabTitle: "Queue",
        props: { mode: "sidebar" },
        closeable: false,
        highlighted: false,
    },
    {
        id: "skipandtip",
        component: SkipAndTip,
        tabTitle: "Skip\u200A&\u200ATip",
        props: { mode: "sidebar" },
        closeable: false,
        highlighted: false,
    },
    {
        id: "chat",
        component: Chat,
        tabTitle: "Chat",
        props: { mode: "sidebar" },
        closeable: false,
        highlighted: false,
    },
    {
        id: "announcements",
        component: Document,
        tabTitle: "Announcements",
        props: { mode: "sidebar", documentID: "announcements" },
        closeable: false,
        highlighted: false,
    },
] as SidebarTab[]);
