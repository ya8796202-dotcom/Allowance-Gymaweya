
const CACHE_NAME = 'fitness-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png' // تذكر إضافة الأيقونات
  // أضف أي صور أو فيديوهات تمارين أساسية هنا
];

// 1. تثبيت الـ Service Worker وحفظ الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. اعتراض طلبات الشبكة (لتقديم المحتوى من الكاش إذا كان متاحاً)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // العثور على الملف في الكاش، قم بإرجاعه
        if (response) {
          return response;
        }
        // لم يتم العثور عليه، اذهب للشبكة
        return fetch(event.request);
      })
  );
});

// 3. تفعيل الـ Service Worker وحذف الكاشات القديمة
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
