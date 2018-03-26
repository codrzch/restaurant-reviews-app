// SERVICE WORKER
const cacheName = 'restaurantsVisited';
const filesToCache = [
    '/',
    '/css/styles.css',
    '/data/restaurants.json',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js'
];
self.addEventListener('install', function (e) {
    console.log('service worker installed');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('serviceWorker is caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    var CACHE_NAME = 'restaurantsVisited';
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // HANDLE RESPONSE FOR CACHE HIT
            if (response) {
                return response;
            }
            // CLONE REQUEST
            let fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(
                function (response) {
                    // VALID RESPONSE?
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    // CLONE RESPONSE
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                }
            );
        }).catch(function (error) {
            console.log(error);
        })
    );
});
