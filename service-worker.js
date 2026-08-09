self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {

  let donnees = {};

  if (event.data) {
    try {
      donnees = event.data.json();
    } catch (e) {
      donnees = {};
    }
  }

  const titre =
    donnees.titre ||
    (donnees.notification && donnees.notification.title) ||
    'PLAYER 5M';

  const message =
    donnees.message ||
    (donnees.notification && donnees.notification.body) ||
    'Un nouvel événement est disponible ! 🎾';

  const url =
    donnees.url ||
    (donnees.data && donnees.data.url) ||
    './notifications.html';

  event.waitUntil(
    self.registration.showNotification(
      titre,
      {
        body: message,
        icon: './icon-192.png',
        badge: './icon-192.png',
        data: {
          url: url
        }
      }
    )
  );
});

self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  const url =
    event.notification.data &&
    event.notification.data.url
      ? event.notification.data.url
      : './notifications.html';

  event.waitUntil(
    clients.openWindow(url)
  );
});
