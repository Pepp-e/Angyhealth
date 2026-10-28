// Messaging only: no app-shell caching and no navigation interception.
self.addEventListener("push", (event) => {
  event.waitUntil((async () => {
    const payload = event.data?.json();
    if (!payload || payload.title !== "AngyHealth" || payload.body !== "Come stai oggi?" || Date.now() > payload.expiresAt) return;
    const preference = await caches.open("angyhealth-push-preference");
    const state = await preference.match("/__angyhealth_push_enabled");
    if (state && (await state.text()) === "off") return;
    const seen = await caches.open("angyhealth-push-delivery");
    const key = `/__angyhealth_push_day/${payload.day}`;
    if (await seen.match(key)) return;
    await seen.put(key, new Response("seen"));
    for (const old of await seen.keys()) if (new URL(old.url).pathname !== key) await seen.delete(old);
    await self.registration.showNotification("AngyHealth", {
      body: "Come stai oggi?", icon: "/icon-512.png", badge: "/favicon.png",
      tag: "angyhealth-daily", data: { path: "/" },
    });
  })());
});
self.addEventListener("message", (event) => {
  if (event.data?.type !== "angyhealth-push-preference") return;
  event.waitUntil((async () => {
    const cache = await caches.open("angyhealth-push-preference");
    await cache.put("/__angyhealth_push_enabled", new Response(event.data.enabled ? "on" : "off"));
    if (!event.data.enabled) for (const notification of await self.registration.getNotifications()) notification.close();
    event.ports[0]?.postMessage({ ok: true });
  })());
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) return existing.focus();
    return self.clients.openWindow("/");
  })());
});