console.log('log from worker');
// service worker has access to self object which points to service worker it self
// so we can tap on to the events with registering the listeners on self/sw
self.addEventListener('install', (e) => {
  // console.log('Service worked installed');
  // extendable event
  e.waitUntil(
    Promise.resolve()
      .then(manual)
      .then(teja)
      .then(() => console.log('installed'))
  );
  // self.skipWaiting(); // don't wait until next new session skip waiting to activate
  // teja();
  // manual();
  // can be used to decide what to do with cached file from before and weather to create new
});

function teja() {
  return new Promise((res, _rej) => {
    setTimeout(() => {
      console.log('teja');
      res();
    }, 2000);
  });
}
function manual() {
  console.log('manual');
}

self.addEventListener('activate', (e) => {
  console.log('sw activated');
  // console.log('This worker will not be used until the page reloads');
  // clients.claim().then(() => {
  //   // all html files will use this new worker
  //   console.log('This means the clients/html file will use the new sw');
  // });
});

self.addEventListener('fetch', (e) => {
  console.log(
    'we can intercept the fetch calls from client and decide what to do with it',
    e
  );
});

self.addEventListener('message', (ev) => {
  console.log('received message', ev);
});
