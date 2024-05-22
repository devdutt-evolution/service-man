const APP = {
  SW: null,
  init() {
    APP.initServiceWorker();
    document
      .querySelector('#colorForm')
      .addEventListener('submit', APP.submitMessage);
  },
  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      // registering
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
      // if new version found
      navigator.serviceWorker.oncontrollerchange = () => {
        APP.SW = navigator.serviceWorker.controller;
      };
      // register event listener
      navigator.serviceWorker.addEventListener('message', APP.onMessage);
    } else {
      console.log('service worker is not supported');
    }
  },
  submitMessage(e) {
    e.preventDefault();
    let name = document.querySelector('#eventname');
    let color = document.querySelector('#color');
    name = name.value.trim();
    color = color.value.trim();
    const payload = {
      id: Date.now(),
      name,
      color,
    };
    console.log('sending', payload);
    APP.sendMessage({ addConfig: payload });
  },
  sendMessage(data) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(data);
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
  onMessage({ data }) {
    console.log('received', data);
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
