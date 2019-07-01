// javascript
// Service worker for web app.


// Name.
const name = "d1ce";

// Version.
const version = "0.6.190608+4";

// Identifier.
const identifier = name + "-" + version;

// Cache files.
// (need to set relative path "./" or absolute path "/")
const cachefiles = ["./style.css", "./d1ce/app.html", "./d1ce/app.css", "./d1ce/image/dot.png", "./d1ce/image/num.png", "./d1ce/image/card.png", "./d1ce/engine.js", "./d1ce/app.js"];


// Event on installing service worker.
self.addEventListener("install", (evt) => {
    evt.waitUntil(caches.open(identifier)
                  .then((cache) => {

        // Cache files and activate.
        return cache.addAll(cachefiles)
               .then(() => self.skipWaiting());
    }));
});

// Event on activating service worker.
self.addEventListener("activate", (evt) => {

    // Remove old cache if updated cache version.
    evt.waitUntil(caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => {
            if (key != identifier) {
                return caches.delete(key);
            }
        }));
    }));
});

// Event on fetching network request.
self.addEventListener("fetch", (evt) => {
    evt.respondWith(

        // Return caches if matched the request.
        caches.match(evt.request.clone(), {ignoreSearch:true}).then((response) => {

            // Fetch if not found.
            return response || fetch(evt.request.clone()).then((response) => {

                // // Cache refetched file.
                // if (response.ok) {
                //     var response_cache = response.clone();
                //     caches.open(cache_name).then((cache) => {
                //         cache.put(evt.request, response_cache);
                //     });
                // }

                // Return fetched file.
                return response;
            });
        })
    );
});
