/* Komara Academy — installation + mises a jour automatiques */
(() => {
  "use strict";
  if (!("serviceWorker" in navigator)) return;

  let nouvelElement = null;

  function bandeau(texte, action, clic) {
    document.querySelectorAll(".pwa-bandeau").forEach((b) => b.remove());
    const b = document.createElement("div");
    b.className = "pwa-bandeau";
    const s = document.createElement("span");
    s.textContent = texte;
    b.appendChild(s);
    if (action) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = action;
      btn.addEventListener("click", clic);
      b.appendChild(btn);
    }
    const x = document.createElement("button");
    x.type = "button";
    x.className = "pwa-x";
    x.textContent = "✕";
    x.addEventListener("click", () => b.remove());
    b.appendChild(x);
    document.body.appendChild(b);
  }

  navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" })
    .then((reg) => {
      const verifier = () => reg.update().catch(() => {});
      verifier();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") verifier();
      });
      setInterval(verifier, 30 * 60 * 1000);

      reg.addEventListener("updatefound", () => {
        const n = reg.installing;
        if (!n) return;
        n.addEventListener("statechange", () => {
          if (n.state === "installed" && navigator.serviceWorker.controller) {
            bandeau("Nouvelle version du livre", "Recharger", () => location.reload());
          }
        });
      });
    })
    .catch(() => {});

  let invite = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    invite = e;
    nouvelElement = true;
    bandeau("Installer le livre sur ton écran d'accueil", "Installer", () => {
      if (!invite) return;
      invite.prompt();
      invite = null;
    });
  });
  window.addEventListener("appinstalled", () => {
    nouvelElement = null;
    document.querySelectorAll(".pwa-bandeau").forEach((b) => b.remove());
  });

  // ouverture directe du bot via raccourci
  window.addEventListener("load", () => {
    if (new URLSearchParams(location.search).get("bot") === "1") {
      setTimeout(() => {
        const b = document.getElementById("btn-bot");
        if (b) b.click();
      }, 600);
    }
  });
})();
