import AddressBox from "../src/uielements/AddressBox.svelte";
import ButtonButton from "../src/uielements/ButtonButton.svelte";
import registerWebComponent from "./svelte-web";

function buildShadowRootPreparer(hostVersion: string) {
    return function (shadow: ShadowRoot) {
        // note: if font-requiring stylesheets are not loaded in the document root too,
        // then they won't work properly!
        // https://medium.com/codex/using-fonts-in-web-components-6aba251ed4e5
        // https://stackoverflow.com/a/55360574
        // https://stackoverflow.com/a/60526280
        let cssDependencies = [
            "/build/bundle.css?v=" + hostVersion,
            "/assets/vendor/@fontawesome/fontawesome-free/css/all.min.css"
        ];
        for (let parent of [document.head, shadow]) {
            for (let d of cssDependencies) {
                // do not add element if one already exists for this dependency
                if (parent.querySelectorAll(`link[href='${d}']`).length == 0) {
                    let link = document.createElement("link");
                    link.setAttribute("rel", "stylesheet");
                    link.setAttribute("href", d);
                    parent.appendChild(link);
                }
            }
        }
    };
}

let cachedDarkMode = false;

type customElement = {
    component: any,
    name: string,
}

const customElements: customElement[] = [
    { component: ButtonButton, name: "button" },
    { component: AddressBox, name: "payment-address" },
];

export const defineCustomElements = function (hostVersion: string) {
    const shadowRootPreparer = buildShadowRootPreparer(hostVersion);
    const childrenUpdatedCallback = function (children: HTMLCollection) {
        for (let child of children) {
            if (cachedDarkMode) {
                child.classList.add("dark");
            } else {
                child.classList.remove("dark");
            }
        }
    }

    for (let e of customElements) {
        registerWebComponent(e.component, { name: "jungletv-" + e.name, mode: "open", shadowRootPreparer, childrenUpdatedCallback });
    }
}

function setShadowRootDarkMode(shadow: ShadowRoot, darkMode: boolean) {
    cachedDarkMode = darkMode;
    for (let child of shadow.children) {
        if (darkMode) {
            child.classList.add("dark");
        } else {
            child.classList.remove("dark");
        }
    }
}

export const setCustomElementsDarkMode = function (darkMode: boolean) {
    for (let customElementType of customElements) {
        for (let e of document.querySelectorAll("jungletv-" + customElementType.name)) {
            if (!e.shadowRoot || !e.shadowRoot.children) {
                continue;
            }
            setShadowRootDarkMode(e.shadowRoot, darkMode);
        }
    }
}