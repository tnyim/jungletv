import { writable } from 'svelte/store';
import Queue from "./Queue.svelte";
import Chat from "./Chat.svelte";
import Document from "./Document.svelte";

export type SidebarTab = {
    id: string;
    component: any;
    tabTitle: string;
    props: {};
    closeable: boolean;
};

export const sidebarTabs = writable([
    {
        id: "queue",
        component: Queue,
        tabTitle: "Queue",
        props: { mode: "sidebar" },
        closeable: false,
    },
    {
        id: "chat",
        component: Chat,
        tabTitle: "Chat",
        props: { mode: "sidebar" },
        closeable: false,
    },
    {
        id: "announcements",
        component: Document,
        tabTitle: "Announcements",
        props: { mode: "sidebar", documentID: "announcements" },
        closeable: false,
    },
] as SidebarTab[]);