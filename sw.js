const version = 1;
const staticCache = `static-${version}`;
const imageCache = `image-${version}`;
const files = ['/', '/index.html', '/index.css', '/app.js'];

self.addEventListener('install', (e) => {
  console.log(`Service worked installed ${staticCache}`);
  // setup the files
  // e.waitUntil(
  //   caches.open(staticCache).then(
  //     (cache) => {
  //       return cache.addAll(files);
  //     },
  //     (err) => {
  //       console.error('failed to update', err);
  //     }
  //   )
  // );
});

self.addEventListener('activate', (e) => {
  console.log('sw activated');
  // scrapping the unused files
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key != staticCache && key != imageCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

const storeInCache = (cacheName, req, fetchResponse) => {
  return caches.open(cacheName).then((cache) => {
    cache.put(req, fetchResponse.clone());
    return fetchResponse;
  });
};

self.addEventListener('fetch', (e) => {
  console.log('fetching', e.request.url);
  return caches.match(e.request.url).then((cacheResponse) => {
    if (cacheResponse) {
      console.log('Found in cache');
      return cacheResponse;
    }

    return fetch(e.request).then((fetchResponse) => {
      let type = fetchResponse.headers.get('content-type');
      if (type.match(/^image\//)) {
        console.log('stored in image cache');
        return storeInCache(imageCache, e.request, fetchResponse);
      }
      console.log('stored in static cache');
      return storeInCache(staticCache, e.request, fetchResponse);
    });
  });
});

self.addEventListener('message', (ev) => {
  console.log('received message', ev);
});
