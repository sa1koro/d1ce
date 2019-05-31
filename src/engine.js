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
    static UpdateValue(key, value, noflush=false) {
        d1ce.Params.Instance().UpdateValue(key, value, noflush);
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
