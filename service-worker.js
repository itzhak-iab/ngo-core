// Self-cleaning service worker — replaces the old caching SW.
// On install, activates immediately and clears all caches.
// On fetch, passes through to the network without caching.
// Then unregisters itself so the next page load is fully native.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clear all old caches
    try {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    } catch (e) { /* ignore */ }
    // Take control of any open clients
    try { await self.clients.claim(); } catch (e) {}
    // Unregister this service worker
    try {
      const reg = await self.registration.unregister();
      // Force-reload all controlled clients to drop the SW
      const clientsList = await self.clients.matchAll({ type: 'window' });
      clientsList.forEach(client => { try { client.navigate(client.url); } catch(e){} });
    } catch (e) {}
  })());
});

// Pass-through fetch — no caching
self.addEventListener('fetch', (event) => {
  // Don't intercept; let browser handle it natively
  return;
});
