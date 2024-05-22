const version = 2;
const staticCache = `static-${version}`;
const imageCache = `image-${version}`;
const files = ['/', '/index.html', '/404.html', '/index.css', '/app.js'];
const imageFiles = ['/assets/404.png'];

/**------------------UTILITY FUNCTIONS--------------------- */
/**to setup during installation */
async function addInitialFiles() {
  try {
    const static = await caches.open(staticCache);
    await static.addAll(files);
    const images = await caches.open(imageCache);
    await images.addAll(imageFiles);
  } catch (err) {
    console.log('Failed to register static files');
  }
}
/**remove past version unused files */
async function removeUnusedFiles() {
  const keys = await caches.keys();
  return Promise.all(
    keys
      .filter((key) => key != staticCache && key != imageCache)
      .map((key) => caches.delete(key))
  );
}
/**store the fetch response in cache and return it */
async function storeInCache(cacheName, req, fetchResponse) {
  const cache = await caches.open(cacheName);
  cache.put(req, fetchResponse.clone());
  return fetchResponse;
}
/**find from cache just for readability */
function getFromCache(url) {
  return caches.match(url);
}
/**------------------UTILITY FUNCTIONS END--------------------- */

self.addEventListener('install', (e) => {
  console.time('installation');
  // setup the files
  e.waitUntil(addInitialFiles());
  console.timeEnd('installation');
  console.log(`Service worked installed ${staticCache}`);
});

self.addEventListener('activate', (e) => {
  console.time('activation');
  // scrapping the unused files
  e.waitUntil(removeUnusedFiles());
  console.timeEnd('activation');
  console.log('sw activated');
});

self.addEventListener('fetch', async (e) => {
  console.log('fetching', e.request.url);
  const cacheResponse = await getFromCache(e.request.url);

  if (cacheResponse) {
    console.log('Found in cache');
    return cacheResponse;
  }

  console.log('not in cache');
  try {
    const fetchResponse = await fetch(e.request);
    if (fetchResponse.ok) {
      let type = fetchResponse.headers.get('content-type');
      if (type.match(/^image\//)) {
        // if image
        console.log('stored in image cache');
        return storeInCache(imageCache, e.request, fetchResponse);
      }
      console.log('stored in static cache'); // else
      return storeInCache(staticCache, e.request, fetchResponse);
    } else {
      // if not ok response status other than 200
      if (e.request.url.match(/.html/)) {
        return getFromCache('/404.html');
      }
      if (e.request.url.match(/.png/)) {
        console.log('in image');
        return getFromCache(imageFiles[0]);
      }
    }
  } catch (err) {
    return getFromCache('/404.html');
  }
});

self.addEventListener('message', (ev) => {
  console.log('received message', ev);
});
