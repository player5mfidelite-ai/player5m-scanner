self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  let donnees = {
    titre: 'PLAYER 5M',
    message: 'Un nouvel événement est disponible ! 🎾'
  };

  if (event.data) {
    try {
      donnees = event.data.json();
    } catch (e) {
      donnees.message = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      donnees.titre || 'PLAYER 5M',
      {
        body: donnees.message || 'Un nouvel événement est disponible ! 🎾',
        icon: './icon-192.png',
        badge: './icon-192.png',
        data: {
          url: donnees.url || './notifications.html'
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
