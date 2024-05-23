const APP = {
  SW: null,
  DB: null,
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
  onMessage({ data }) {
    console.log('received', data);
  },
  showPeople() {},
  initDB() {
    let req = indexedDB.open('colorDB');
    req.onsuccess = (e) => {
      APP.DB = e.target.result;
      APP.showPeople();
    };
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
