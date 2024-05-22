const version = 2;
const staticCache = `static-${version}`;
const files = ['/', '/index.html', '/index.css', '/app.js'];

/**------------------UTILITY FUNCTIONS--------------------- */
/**to setup during installation */
async function addInitialFiles() {
  try {
    const static = await caches.open(staticCache);
    await static.addAll(files);
  } catch (err) {
    console.log('Failed to register static files');
  }
}
/**remove past version unused files */
async function removeUnusedFiles() {
  const keys = await caches.keys();
  return Promise.all(
    keys.filter((key) => key != staticCache).map((key) => caches.delete(key))
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
/** */
async function sendMessage(response, clientId) {
  let clientsList = [];
  if (clientId) {
    let client = await clients.get(clientId); // sending message to particular client/tab
    clientsList.push(client);
  } else {
    clientsList = await clients.matchAll({ includeUncontrolled: true });
  }
  return Promise.all(clientsList.map((client) => client.postMessage(response)));
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
      console.log('stored in static cache');
      return storeInCache(staticCache, e.request, fetchResponse);
    }
  } catch (err) {
    return fetch(e.request);
  }
});

self.addEventListener('message', (ev) => {
  console.log('received message', ev);
  const payload = ev.data;
  let clientId = ev.source.id;
  if ('addConfig' in payload) {
    sendMessage({ code: 0, message: 'Pretend i added config' }, clientId);
  }
  if ('otherAction' in payload) {
    sendMessage({ code: 0, message: 'broadcasting this message' });
  }
});
