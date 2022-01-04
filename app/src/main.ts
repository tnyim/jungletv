import App from "./App.svelte";

const app = new App({
  target: document.body
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