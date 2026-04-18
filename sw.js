// Birdyard Service Worker - Web Push
const CACHE_NAME = 'birdyard-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// 푸시 알림 수신
self.addEventListener('push', e => {
  if (!e.data) return;
  let data = {};
  try { data = e.data.json(); } catch { data = { title: 'Birdyard', body: e.data.text() }; }

  const title = data.title || 'Birdyard';
  const options = {
    body: data.body || '',
    icon: data.icon || '/MyGolfNoteV01/icon-192.png',
    badge: '/MyGolfNoteV01/icon-72.png',
    data: { url: data.url || 'https://birdyard.app' },
    tag: data.tag || 'birdyard-notif',
    renotify: true,
    vibrate: [200, 100, 200],
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// 알림 클릭 시 앱으로 이동
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://birdyard.app';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes('birdyard.app'));
      if (existing) { existing.focus(); existing.navigate(url); }
      else clients.openWindow(url);
    })
  );
});
