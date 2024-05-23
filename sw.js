self.addEventListener('install', (ev) => {
  console.log('installed');
});
self.addEventListener('activate', (ev) => {
  console.log('activated');
});

self.addEventListener('fetch', (ev) => {
  console.log('fetch request for', ev.request.url, ev.request);
  if (ev.request.url !== 'http://127.0.0.1:5500/indexasd.html') {
    let mode = ev.request.mode;
    let url = new URL(ev.request.url);
    let t = Date.now();
    if (mode === 'navigate' && url.origin === location.origin) {
      if (t % 2 === 0) {
        let resp = new Response(null, {
          status: 307,
          statusText: 'Temporary Redirect',
          headers: {
            'cache-control': 'Max-Age=0, no-store',
            location: './custom.html',
          },
        });
        ev.respondWith(resp);
      } else {
        ev.respondWith(fetch(ev.request));
      }
    } else {
      ev.respondWith(fetch(ev.request));
    }
  } else {
    let resp = new Response(null, {
      status: 307,
      statusText: 'Temporary Redirect',
      headers: {
        'cache-control': 'Max-Age=0, no-store',
        location: '/404.html',
      },
    });
    ev.respondWith(resp);
  }
});
