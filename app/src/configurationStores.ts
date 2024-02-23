import { get, writable, type StartStopNotifier, type Writable } from "svelte/store";
import ApplicationPage from "./ApplicationPage.svelte";
import { ConfigurationChange } from "./proto/jungletv_pb";
import { sidebarMode } from "./stores";
import { closeSidebarTab, openSidebarTab, sidebarTabs, type SidebarTab } from "./tabStores";

export const applicationName = writableWithInitialValue(globalThis.OVERRIDE_APP_NAME ? globalThis.OVERRIDE_APP_NAME : "JungleTV");
export const logoURL = writableWithInitialValue("/assets/brand/logo.svg");
export const faviconURL = writableWithInitialValue("/favicon.png");

export interface ConfigurableState {
    stateVersion: Date,
    applicationName: string,
    logoURL: string,
    faviconURL: string,
}

let processedStateFromOtherTabProducedAt: Date;
let processedOnlineChangesAt: Date;

export const resetConfigurationChanges = function () {
    applicationName.reset()
    logoURL.reset();
    faviconURL.reset();
    closeAllApplicationTabs();
}

export const processConfigurationChanges = function (changes: ConfigurationChange[]) {
    processedOnlineChangesAt = new Date();
    for (let change of changes) {
        switch (change.getConfigurationChangeCase()) {
            case ConfigurationChange.ConfigurationChangeCase.APPLICATION_NAME:
                applicationName.setOrUseDefaultIfEqualTo(change.getApplicationName(), "");
                break;
            case ConfigurationChange.ConfigurationChangeCase.LOGO_URL:
                logoURL.setOrUseDefaultIfEqualTo(change.getLogoUrl(), "");
                break;
            case ConfigurationChange.ConfigurationChangeCase.FAVICON_URL:
                faviconURL.setOrUseDefaultIfEqualTo(change.getFaviconUrl(), "");
                break;
            case ConfigurationChange.ConfigurationChangeCase.OPEN_SIDEBAR_TAB:
                let tabInfo = change.getOpenSidebarTab();
                let newTab: SidebarTab = {
                    id: tabInfo.getTabId(),
                    component: ApplicationPage,
                    tabTitle: tabInfo.getTabTitle(),
                    props: {
                        applicationID: tabInfo.getApplicationId(),
                        pageID: tabInfo.getPageId(),
                        mode: "sidebar",
                    },
                    closeable: false,
                    highlighted: false,
                    canPopout: false,
                    isApplicationTab: true,
                };
                openSidebarTab(newTab, tabInfo.getBeforeTabId(), true);
                break;
            case ConfigurationChange.ConfigurationChangeCase.CLOSE_SIDEBAR_TAB:
                closeSidebarTab(change.getCloseSidebarTab());
                break;
        }
    }
}

export const processStateFromOtherTab = function (state: ConfigurableState) {
    if (processedOnlineChangesAt) {
        return;
    }
    if (processedStateFromOtherTabProducedAt && state.stateVersion < processedStateFromOtherTabProducedAt) {
        return;
    }
    processedStateFromOtherTabProducedAt = state.stateVersion;

    applicationName.set(state.applicationName);
    logoURL.set(state.logoURL);
    faviconURL.set(state.faviconURL);
}

export const produceConfigurableState = function (): ConfigurableState | undefined {
    if (!processedOnlineChangesAt) {
        return undefined;
    }
    return {
        stateVersion: processedOnlineChangesAt,
        applicationName: get(applicationName),
        logoURL: get(logoURL),
        faviconURL: get(faviconURL),
    };
}

function closeAllApplicationTabs() {
    sidebarTabs.update((tabs) => {
        sidebarMode.update((currentMode) => {
            let currentTabIndex = tabs.findIndex((t) => currentMode == t.id);
            let foundNonApplicationTabToTheLeft = false;
            for (let i = currentTabIndex; i >= 0; i--) {
                if (!tabs[i].isApplicationTab) {
                    foundNonApplicationTabToTheLeft = true;
                    currentMode = tabs[i].id;
                    break;
                }
            }
            if (!foundNonApplicationTabToTheLeft) {
                currentMode = tabs.find(tab => !tab.isApplicationTab).id;
            }
            return currentMode;
        });
        return tabs.filter(tab => !tab.isApplicationTab);
    });
}

interface WritableWithInitialValue<T> extends Writable<T> {
    setOrUseDefaultIfEqualTo(this: void, value: T, defaultMarker: any): void;
    reset(this: void): void;
}

function writableWithInitialValue<T>(value?: T, start?: StartStopNotifier<T>): WritableWithInitialValue<T> {
    let initialValue = value;
    let w = writable(value, start);
    w["setOrUseDefaultIfEqualTo"] = function (this: void, value: T, defaultMarker: any): void {
        if (value === defaultMarker) {
            w.set(initialValue);
        } else {
            w.set(value);
        }
    }
    w["reset"] = function (this: void) {
        w.set(initialValue);
    }
    return w as WritableWithInitialValue<T>;
}