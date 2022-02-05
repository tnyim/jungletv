import { apiClient } from "./api_client";
import App from "./App.svelte";

const app = new App({
  target: ((): ShadowRoot => {
    let shadowRoot = document.body.attachShadow({ mode: "closed" });

    // note: if these stylesheets are not loaded by index.html (index.template) too,
    // then they won't work properly! https://stackoverflow.com/a/55360574
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "/build/bundle.css?v=" + apiClient.getClientVersion());
    shadowRoot.appendChild(link);

    link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "/assets/vendor/@fontawesome/fontawesome-free/css/all.min.css");
    shadowRoot.appendChild(link);

    // we must handle this manually inside the shadow root
    let bringHashElementIntoView = function () {
      let hash = window.location.hash;
      if (hash.startsWith("#") && hash.length > 1 && !hash.endsWith("#")) {
        let element = shadowRoot.getElementById(hash.substring(1));
        if (element != null) {
          element.scrollIntoView();
          // we do this so that consecutive clicks to the same hash can work
          // (hashchange doesn't fire otherwise)
          window.location.hash += "#";
        }
      }
    }
    window.addEventListener("hashchange", bringHashElementIntoView);
    window.addEventListener("load", () => {
      window.location.hash = window.location.hash.replace(/#+$/, "");
      bringHashElementIntoView();
    });

    return shadowRoot;
  })(),
});

if ("serviceWorker" in navigator) {
  const metas = document.getElementsByTagName("meta");
  let versionHash = "";
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === "jungletv-version-hash") {
      versionHash = metas[i].getAttribute("content");
      break;
    }
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/build/swbundle.js?v=" + versionHash, { scope: "/" });
  });
}

export default app;