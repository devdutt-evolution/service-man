const version = 'channel-message-sw-1';

self.addEventListener('install', (_ev) => {});
self.addEventListener('activate', (_ev) => {});
self.addEventListener('fetch', (_ev) => {});

self.addEventListener('message', (ev) => {
  //message from a client
  if (ev.data) {
    if ('port' in ev.data) {
      const port = ev.ports[0];
      self.port = port;
      self.port.onmessage = gotMessage;
    }
  }
});

function gotMessage(ev) {
  //received a message on a port
  console.log(ev.data);
  sendMessage();
}

function sendMessage() {
  //send a message on a port
  if ('port' in self) {
    self.port.postMessage({ message: 'Hello from port 2' });
  }
}
