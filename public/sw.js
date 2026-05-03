// MotoristAI - Service Worker (Notificações Push)
// O cache de assets é gerenciado automaticamente pelo workbox (generateSW)

const CACHE_NAME = 'motoristai-v2';

// Instalação
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Ativação - limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Buscar da rede (pode ser substituído por cache-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Mostrar notificação (vinda do app ou do push)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    // Se não for JSON, usa o texto como body
    data = {
      title: 'MotoristAI',
      body: event.data.text(),
    };
  }

  const title = data.title || 'Lembrete MotoristAI';
  const options = {
    body: data.body || 'Hora de registrar suas corridas!',
    icon: 'https://i.ibb.co/C7dMhXv/motoristai-192.png',
    badge: 'https://i.ibb.co/C7dMhXv/motoristai-192.png',
    tag: 'motoristai-reminder',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir MotoristAI',
      },
      {
        action: 'dismiss',
        title: 'OK, entendi',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        // Se já tem janela aberta, foca nela
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Navega para a URL correta
            if ('navigate' in client) {
              client.navigate(urlToOpen);
            }
            return client.focus();
          }
        }
        // Se não tem, abre nova janela
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});