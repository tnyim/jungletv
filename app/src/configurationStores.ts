import { StartStopNotifier, writable, Writable } from "svelte/store";
import { ConfigurationChange } from "./proto/jungletv_pb";

export const applicationName = writableWithInitialValue("JungleTV");
export const logoURL = writableWithInitialValue("/assets/brand/logo.svg");
export const faviconURL = writableWithInitialValue("/favicon.png");

export const resetConfigurationChanges = function () {
    applicationName.reset()
    logoURL.reset();
    faviconURL.reset();
}

export const processConfigurationChanges = function (changes: ConfigurationChange[]) {
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
        }
    }
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