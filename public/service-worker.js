const FILES_TO_CAHE = [
    "/",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/css/styles.css",
    "/css/bootstrap.min.css",
    "/db.js",
    "/images/Show-me-the-money.png"
];

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// install Service Worker
self.addEventListener("install", function (event) {
    // pre cached all static assets
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Static files pre chached successfuly!");
            return cache.addAll(FILES_TO_CAHE)
        })
    );
    // tell the browser to activate this service worker immediately once it
    // has finished installing
    self.skipWaiting();
});

// activate Service Worker
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    // Service worker to be the "controller" for all clients within its scope
    self.clients.claim();
});

// fetch data
self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request).then(response => {
                    // Clone & store response in the cache if HTTP request status is OK/200
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                }).catch(error => {
                    // if HTTP request fails, retrieve request from cache
                    return cache.match(event.request);
                });
            }).catch(error => console.log(error))
        );
        return;
    }
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request);
            });
        })
    );
});
