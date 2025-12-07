const CACHE_NAME = 'moazen-v2'; // قمت بتغيير الإصدار لتحديث الكاش
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    // أضف أي صور محلية هنا إذا كانت موجودة في مجلد المشروع
];

// 1. التثبيت (Install)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. التفعيل (Activate) - تنظيف الكاش القديم
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. الاستجابة للطلبات (Fetch) - هذا هو الجزء الناقص سابقاً
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // إرجاع الملف من الكاش إذا وجد، وإلا جلبه من الإنترنت
                return response || fetch(event.request);
            })
            .catch(() => {
                // (اختياري) صفحة بديلة في حالة انقطاع النت وعدم وجود كاش
            })
    );
});

// 4. الإشعارات (Push)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'حان موعد الصلاة',
        icon: 'https://cdn-icons-png.flaticon.com/512/4358/4358666.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/4358/4358666.png',
        vibrate: [200, 100, 200],
        actions: [
            {action: 'explore', title: 'فتح التطبيق'}
        ]
    };
    event.waitUntil(
        self.registration.showNotification(data.title || 'المؤذن', options)
    );
});

// 5. النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('./index.html')
    );
});
