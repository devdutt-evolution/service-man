const APP = {
  SW: null,
  init() {
    APP.initServiceWorker();
    document
      .querySelector('#loadImage')
      .addEventListener('click', APP.loadImage);
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
  loadImage() {
    const img = document.createElement('img');
    const p = document.createElement('p');
    const output = document.querySelector('output');
    img.addEventListener('load', () => {
      p.append(img);
      output.append(p);
    });
    img.addEventListener('error', () => {
      p.textContent = 'Sorry failed to load your image it cant be found';
      output.append(p);
    });
    img.src = '/assets/404.png';
    img.alt = 'dynamically added image';
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
