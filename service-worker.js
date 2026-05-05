// Service worker — disabled. Pass-through only, no caching, no interference.
// Old caching SW was holding stale content; this replacement does nothing.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clear old caches once, silently
    try {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    } catch (e) {}
    try { await self.clients.claim(); } catch (e) {}
  })());
});

// Pass-through fetch — never intercept, let browser handle natively
self.addEventListener('fetch', (event) => {
  // Intentionally do nothing — browser default behavior applies
});
