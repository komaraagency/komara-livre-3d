/* Komara Academy — service worker
   Pages en reseau d'abord, assets en cache + revalidation.
   Aucune version a incrementer : le contenu se met a jour seul. */

const CACHE = "komara-livre-v1";
const PAGES = CACHE + "-pages";
const ASSETS = CACHE + "-assets";

const NOYAU = [
  "./",
  "./index.html",
  "./livre.css",
  "./livre.js",
  "./pages-data.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./offline.html",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const c = await caches.open(ASSETS);
    await Promise.all(NOYAU.map((u) =>
      c.add(new Request(u, { cache: "reload" })).catch(() => null)
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const noms = await caches.keys();
    await Promise.all(noms.filter((n) => n !== PAGES && n !== ASSETS).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => { if (e.data === "skip-waiting") self.skipWaiting(); });

const statique = (u) => /\.(css|js|mjs|png|jpe?g|webp|svg|ico|woff2?|webmanifest)$/i.test(u.pathname);

self.addEventListener("fetch", (event) => {
  const r = event.request;
  if (r.method !== "GET") return;
  const url = new URL(r.url);
  if (url.origin !== self.location.origin) return;

  if (r.mode === "navigate" || (r.headers.get("accept") || "").includes("text/html")) {
    event.respondWith((async () => {
      try {
        const rep = await fetch(r, { cache: "no-store" });
        const c = await caches.open(PAGES);
        c.put(r, rep.clone());
        return rep;
      } catch (_) {
        const c = await caches.open(PAGES);
        return (await c.match(r, { ignoreSearch: true })) ||
               (await (await caches.open(ASSETS)).match("./offline.html")) ||
               new Response("Hors ligne", { status: 503 });
      }
    })());
    return;
  }

  if (statique(url)) {
    event.respondWith((async () => {
      const c = await caches.open(ASSETS);
      const enCache = await c.match(r);
      const reseau = fetch(r).then((rep) => {
        if (rep && rep.ok) c.put(r, rep.clone());
        return rep;
      }).catch(() => null);
      return enCache || (await reseau) || new Response("", { status: 504 });
    })());
  }
});
