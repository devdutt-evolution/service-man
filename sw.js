const version = 'client-msg-1';

self.addEventListener('install', (ev) => {
  console.log('installed');
});
self.addEventListener('activate', (ev) => {
  console.log('activated');
});
self.addEventListener('fetch', (ev) => {
  console.log(`fetch request for ${ev.request.url}`);
  sendMessage('single tab sent the request', ev.clientId);
});

self.addEventListener('message', (ev) => {
  console.log('message received', ev.data, ev.source.id);
  sendMessage();
});

function sendMessage(msg, clientId) {
  if (clientId) {
    clients.get(clientId).then((client) => {
      client.postMessage(msg);
    });
  } else {
    clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          msg: 'This should be received by the all the tabs',
        });
      });
    });
  }
}
