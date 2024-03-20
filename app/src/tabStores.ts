import { writable } from 'svelte/store';
import { sidebarMode } from './stores';

export type SidebarTab = {
    id: string;
    component: any;
    tabTitle: string;
    props: {};
    closeable: boolean;
    highlighted: boolean;
    canPopout: boolean;
    isApplicationTab: boolean;
};

export const defaultSidebarTabIDs = ["queue", "skipandtip", "chat", "announcements"];

export const sidebarTabs = writable([] as SidebarTab[]);

export const openSidebarTab = function (newTab: SidebarTab, relativeToTabID?: string, toTheLeft: boolean = false) {
    sidebarTabs.update((tabs) => {
        let relativeTabIndex = tabs.findIndex((t) => relativeToTabID === t.id);
        if (relativeTabIndex >= 0) {
            if (toTheLeft) {
                tabs.splice(relativeTabIndex, 0, newTab);
            } else {
                tabs.splice(relativeTabIndex + 1, 0, newTab);
            }
        } else {
            tabs.push(newTab);
        }
        return tabs;
    });
}

export const openAndSwitchToSidebarTab = function (newTab: SidebarTab, relativeToTabID?: string, toTheLeft = false) {
    openSidebarTab(newTab, relativeToTabID, toTheLeft);
    sidebarMode.update((_) => newTab.id);
}

export const closeSidebarTab = function (tabID: string) {
    sidebarTabs.update((tabs) => {
        let tabIndex = tabs.findIndex((t) => tabID == t.id);
        if (tabIndex >= 0) {
            tabs.splice(tabIndex, 1);
            sidebarMode.update((currentMode) => {
                if (currentMode == tabID) {
                    currentMode = tabs[Math.max(0, tabIndex - 1)].id;
                }
                return currentMode;
            })
        }
        return tabs;
    });
}

export const setSidebarTabTitle = function (tabID: string, title: string) {
    sidebarTabs.update((tabs) => {
        let tabIndex = tabs.findIndex((t) => tabID == t.id);
        if (tabIndex >= 0) {
            tabs[tabIndex].tabTitle = title;
        }
        return tabs;
    });
}

export const setSidebarTabHighlighted = function (tabID: string, highlighted = true) {
    sidebarTabs.update((tabs) => {
        let tabIndex = tabs.findIndex((t) => tabID == t.id);
        if (tabIndex >= 0) {
            tabs[tabIndex].highlighted = highlighted;
        }
        return tabs;
    });
}