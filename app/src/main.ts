import { apiClient } from "./api_client";
import App from "./App.svelte";

const app = new App({
  target: ((): ShadowRoot => {
    let shadowRoot = document.body.attachShadow({ mode: "closed" });
    // move loading message into shadow root so it keeps showing even though we've turned the contents of the body tag into a shadow root
    let loadingMessage = document.getElementById("loading-message");
    shadowRoot.appendChild(loadingMessage);

    // we load CSS asynchronously, after JS is loaded, to ensure that the loading message appears while JS is loading
    // make sure the loading message keeps showing until all CSS is loaded
    let loadedCSS = 0;
    let onCSSloaded = () => {
      loadedCSS++;
      if (loadedCSS >= 4) {
        loadingMessage.parentNode.removeChild(loadingMessage);
        // remove the body style defined for the loading message
        document.body.setAttribute("style", "");
      }
    };

    // note: if these stylesheets are not loaded in the document root too,
    // then they won't work properly!
    // https://stackoverflow.com/a/55360574
    // https://stackoverflow.com/a/60526280
    for (let parent of [document.head, shadowRoot]) {
      let link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", "/build/bundle.css?v=" + apiClient.getClientVersion());
      link.addEventListener("load", onCSSloaded);
      parent.appendChild(link);

      link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", "/assets/vendor/@fontawesome/fontawesome-free/css/all.min.css");
      link.addEventListener("load", onCSSloaded);
      parent.appendChild(link);
    }

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