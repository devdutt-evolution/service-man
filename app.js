const APP = {
  SW: null,
  init() {
    APP.initServiceWorker();
  },
  initServiceWorker() {
    if ('serviceWorker' in navigator) {
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
    } else {
      console.log('service worker is not supported');
    }
  },
  storageInfo() {
    // info from storage it self
    if ('storage' in navigator) {
      if ('estimate' in navigator.storage) {
        navigator.storage.estimate().then(({ quota, usage }) => {
          usage = parseInt(usage / 1024);
          quota = parseInt(quota / 1024);
          console.log(`Have used ${usage} of ${quota}`);
        });
        navigator.storage.persist().then((doesAllow) => {
          console.log(`Browser ${doesAllow} persist`);
        });
      }
    }

    // checking the size of imageCache
    caches.open('imageCache').then((cache) => {
      cache.matchAll().then((matches) => {
        let storage = 0;
        matches.forEach((response) => {
          if (response.headers.has('content-length')) {
            storage += parseInt(response.headers.get('content-length'));
            console.log(`Adding the size of the ${response.url}`);
          }
        });
        console.log(`total size of image cache is ${storage}`);
      });
    });
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
