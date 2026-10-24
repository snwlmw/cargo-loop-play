// Retires only this game's online/offline worker. Saved player data is preserved.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('Последний ящик ·-sw-cache-')).map(key => caches.delete(key)));
    await self.clients.claim();
    const windows = await self.clients.matchAll({type:'window', includeUncontrolled:true});
    for (const client of windows) {
      if (client.url.startsWith(self.registration.scope) &&
          !new URL(client.url).pathname.endsWith('/privacy.html') &&
          !new URL(client.url).searchParams.has('closed')) {
        await client.navigate(self.registration.scope + '?closed=1');
      }
    }
    await self.registration.unregister();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.href.startsWith(self.registration.scope) && /\.(wasm|pck)$/.test(url.pathname)) {
    event.respondWith(new Response('Browser version closed', {status:410}));
  }
});
