const APP = {
  init() {
    APP.messagebox = document.getElementById('messages');
    //register the service worker
    navigator.serviceWorker.register('./sw.js');
    //add click listeners
    document
      .getElementById('btnOpenTab')
      .addEventListener('click', APP.openTab);
    document
      .getElementById('btnSend')
      .addEventListener('click', APP.sendMessage);
    //add message listener
    //for receiving a message from another tab
    window.addEventListener('message', APP.gotMessage);

    //for receiving a message from the service worker
    navigator.serviceWorker.addEventListener('message', APP.gotMessage);
  },
  openTab(ev) {
    //open a new tab with message.html
    //and send a message to the new tab
    APP.win = window.open('/index.html');
    APP.win.addEventListener('load', (ev) => {
      APP.win.postMessage({ openTab: 'you have been opened by me' });
    });
  },
  sendMessage(ev) {
    //send a message to the service worker
    navigator.serviceWorker.ready.then((registered) => {
      registered.active.postMessage({ currentTime: Date.now() });
    });
  },
  gotMessage(ev) {
    //receive a message from another client
    console.warn(ev.data);
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
