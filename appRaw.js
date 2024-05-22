const APP = {
  cacheName: 'asset',
  SW: null,
  init() {
    APP.startCache();
    APP.initServiceWorker();
  },
  initServiceWorker() {
    // check if service worker in navigator support
    // it will be called after the DOMContent is loaded
    if ('serviceWorker' in navigator) {
      // register one by providing file path and configs
      navigator.serviceWorker
        .register('./sw.js', {
          scope: '/',
        })
        .then((registration) => {
          APP.SW =
            registration.installing ||
            registration.waiting ||
            registration.active;
          console.log('service worker registered');
        });
      // if the page has sw
      // if (navigator.serviceWorker.controller) {
      //   console.log('sw is installed');
      // }
      // listen to new sw registered installed or active
      // navigator.serviceWorker.oncontrollerchange = (ev) => {
      //   console.log('New service worker activated');
      // };
      // unregister
      // navigator.serviceWorker.getRegistrations().then((registrations) => {
      //   for (let reg of registrations) {
      //     reg.unregister().then(console.log);
      //   }
      // });
    } else {
      console.log('service worker is not supported');
    }
  },
  startCache() {
    document
      .querySelector('.button')
      .addEventListener('click', APP.deleteCache);

    // 1.open the cache
    caches
      .open(APP.cacheName)
      .then((cache) => {
        // console.log(`Cache ${cache} opened`);

        // 2. add files to cache
        let base = 'http://127.0.0.1:5500';
        let stringUrl = '/assets/cache.png';
        cache.add(stringUrl); // FETCH + PUT in cache

        let urlObj = new URL(base + stringUrl + '?req=1');
        cache.add(urlObj);

        let reqObj = new Request(base + stringUrl + '?req=2');
        cache.add(reqObj);

        // 3. read the files
        /** cache.keys().then((keys) => {
          keys.forEach((key, i) => {
            console.log(key, i);
          });
        }); */

        return cache;
      })
      .then((cache) => {
        // 4. check is cache exists
        /** caches.has(APP.cacheName).then((hasCache) => {
          console.log(`Does ${APP.cacheName} has cache?  ${hasCache}`);
        }); */

        // 5. match the file in the cache or the caches
        // cache.match or cache.matchAll or caches.match
        let newImage = '/assets/post.png';
        return caches.match(newImage).then((cacheResponse) => {
          // if in cache
          if (
            cacheResponse &&
            cacheResponse.status < 400 &&
            cacheResponse.headers.has('content-type') &&
            cacheResponse.headers.get('content-type').match(/^image\//)
          ) {
            console.log('Found in cache');
            return cacheResponse;
          }
          // else call fetch and save and return
          return fetch(newImage).then((fetchResponse) => {
            if (!fetchResponse.ok) throw fetchResponse.statusText;
            console.log('Found in fetch');

            cache.put(newImage, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .then((response) => {
        console.log(response);
        const blob = response.blob();
        return blob;
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        let img = document.createElement('img');
        img.src = url;
        document.querySelector('output').append(img);
      });
  },
  deleteCache(_ev, fullCache = false) {
    if (fullCache) {
      debugger;
      caches
        .delete(APP.cacheName)
        .then((isGone) => console.log(`Deleted ${isGone}`));
      return;
    }
    caches.open(APP.cacheName).then((cache) => {
      let deleteLast = '/assets/post.png';
      cache
        .delete(deleteLast)
        .then((isGone) => console.log(`Deleted ${deleteLast} ${isGone}`));
    });
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
