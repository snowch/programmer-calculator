// Programmer Calculator service worker — bump VERSION whenever index.html changes.
const VERSION = "pc-v11";
const CORE = ["./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-192-maskable.png", "./icon-512-maskable.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // App shell: cache first, refresh in background.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  // Google Fonts: cache whatever we manage to fetch; fall back to cache offline.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(VERSION).then(async (c) => {
      const hit = await c.match(req);
      try {
        const res = await fetch(req);
        if (res.ok || res.type === "opaque") c.put(req, res.clone());
        return res;
      } catch (_) { return hit || Response.error(); }
    }));
  }
});
