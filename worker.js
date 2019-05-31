// javascript
// D1CE engine.


// Namespace.
var d1ce = d1ce || {};


// Name.
d1ce.name = "d1ce";

// Version.
d1ce.version = "0.5.190601+4";

// Identifier.
d1ce.identifier = d1ce.name + "-" + d1ce.version;

// Timestamp.
d1ce.timestamp = d1ce.version.match(/\d+\+\d+$/);


// Engine class.
d1ce.Engine = class {

    // Wait time.
    static async Wait(time) {
        await d1ce.Count.Instance().Wait(time);
    }

    // Get time count.
    static Time() {
        return d1ce.Count.Instance().Time();
    }

    // Get random count.
    static Random(max) {
        return d1ce.Count.Instance().Random(max);
    }

    // Get parameters value.
    static Value(key) {
        return d1ce.Params.Instance().Value(key);
    }

    // Update parameters value.
    static UpdateValue(key, value) {
        d1ce.Params.Instance().UpdateValue(key, value);
    }

    // Print text to screen.
    static Print(text) {
        d1ce.Screen.Instance().Print(text);
    }

    // Clear screen.
    static Clear() {
        d1ce.Screen.Instance().Clear();
    }

    // Update input directions.
    static async UpdateDirs() {
        d1ce.Input.Instance().UpdateDirs();
    }

    // Get input directions.
    static Dirs(raw=false) {
        return d1ce.Input.Instance().Dirs(raw);
    }
}
// javascript
// Service worker for web app.


// Name.
const name = "d1ce";

// Version.
const version = "0.5.190601+4";

// Identifier.
const identifier = name + "-" + version;

// Cache files.
// (need to set relative path "./" or absolute path "/")
const cachefiles = ["./style.css", "./d1ce/app.html", "./d1ce/app.css", "./d1ce/cubes.png", "./d1ce/engine.js", "./d1ce/app.js"];


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
