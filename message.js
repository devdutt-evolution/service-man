const APP = {
  port: null,
  init() {
    navigator.serviceWorker.register('./sw.js');
    //add DOM listeners
    let btnSend = document.getElementById('btnSend');
    btnSend.addEventListener('click', APP.sendMessage);
    let btnPort = document.getElementById('btnPort');
    btnPort.addEventListener('click', APP.sendPort);

    //add standard message listener
    window.addEventListener('message', APP.gotMessage);
  },
  sendPort(ev) {
    //send port 2 to the service worker using standard msg
    let channel = new MessageChannel();
    APP.port = channel.port1;
    APP.port.onmessage = APP.gotMessage;

    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage({ port: 'receiveIt' }, [channel.port2]);
    });
    window.removeEventListener('message', APP.gotMessage);
  },
  sendMessage(ev) {
    //send message to service worker using port 2
    APP.port.postMessage({ message: 'Hello from port 1' });
  },
  gotMessage(ev) {
    //message from service worker (or port 2)
    console.log(ev.data);
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
