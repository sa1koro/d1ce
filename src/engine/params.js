// javascript
// D1CE Parameters component.


/* Namespace - NOBUILD */
var d1ce = d1ce || {};
/* /NOBUILD - /Namespace */


// Parameters management class.
d1ce.Params = class {

    // Constructor.
    constructor(name=null, global=false) {
        this.name = name;
        this.keyvalues = {};
        this.global = global;
        this.updated = false;

        // Load parameters text from query string.
        if (this.name == null || this.name == "") {
            let query = window.location.search;
            if (query != null && query != "") {
                console.log("Load query:" + query);
                let text = query.slice(1);
                this.ParseText(text);
            }

        // Read parameters text from message.
        } else if (this.global) {
            if (d1ce.Params.global_params[name] == null) {
                d1ce.Params.global_params[name] = this;
                console.log("New message params:" + name);
            } else {
                this.keyvalues = d1ce.Params.global_params[name].keyvalues;
                console.log("Clone message params:" + name);
            }

        // Load parameters text from local storage.
        } else if (this.name != null) {
            let text = localStorage.getItem(this.name);
            if (text != null) {
                console.log("Load storage:" + text);
                this.ParseText(text);
            }
        }
    }

    // Parse text and update parameters.
    ParseText(text) {
        if (text.includes('&')) {
            text.split('&').forEach((q) => {
                let keyvalue = q.split('=');
                if (keyvalue[0] != null && keyvalue[1] != null) {
                    this.keyvalues[keyvalue[0]] = keyvalue[1];
                    // console.log("parameter:" + kv[0] + " = " + kv[1]);
                }
            });
        } else {
            let keyvalue = text.split('=');
            if (keyvalue[0] != null && keyvalue[1] != null) {
                this.keyvalues[keyvalue[0]] = keyvalue[1];
                // console.log("parameter:" + kv[0] + " = " + kv[1]);
            }
        }
    }

    // Get keys.
    Keys() {
        return Object.keys(this.keyvalues);
    }

    // Get value.
    Value(key) {
        this.updated = false;
        return this.keyvalues[key];
    }

    // Update parameters.
    UpdateValue(key, value, noflush=false) {
        if (value != null) {
            this.keyvalues[key] = value;
        } else {
            delete this.keyvalues[key];
        }

        // Do not send nor save.
        if (noflush) {
            return;
        }

        let keyvalues = [];
        for (let key in this.keyvalues) {
            if (key != null && this.keyvalues[key] != null) {
                keyvalues.push(key + "=" + this.keyvalues[key]);
            }
        }
        let text = keyvalues.join("&");

        // Save parameters text to query string.
        if (this.name == "") {
            let query = "?" + text;
            console.log("Save query:" + query);
            window.history.replaceState(null, "", query);
            // window.location.search = query;

        // Post parameters text to parent window.
        } else if (this.global) {
            if (window.parent != null) {
                if (this.name == "*"
                 || this.name.match(new RegExp("^https?:\/\/"))) {
                     console.log("Send message:" + text);
                     window.parent.postMessage(text, this.name);
                }
            }

        // Save parameters text to local storage.
        } else if (this.name != null) {
            console.log("Save storage:" + text);
            localStorage.setItem(this.name, text);
        }

        this.updated = true;
    }

    // Wait updating value.
    async WaitUpdatingValue() {
        while (!this.updated) {
            await new Promise(r => setTimeout(r, 10));
        }
    }


    // Get instance for message parameters.
    static Instance() {
        if (this.instance == null) {
            this.instance = new d1ce.Params("*", true);
        }
        return this.instance;
    }
}

// Global parameters list.
d1ce.Params.global_params = {};

// Receive parameters envent.
window.addEventListener("message", (evt) => {
    if (evt.origin != "null") {
        let params = d1ce.Params.global_params[evt.origin] || new d1ce.Params(evt.origin, true);
        params.ParseText(evt.data);
        params.updated = true;
    }
    params = d1ce.Params.global_params["*"] || new d1ce.Params("*", true);
    params.ParseText(evt.data);
    params.updated = true;
    console.log("Receive message:" + evt.data);
}, false);


/* Parameters component test - NOBUILD */
d1ce.ParamsTest = class {

    // Main.
    static async Main() {
        document.write("<pre>\n");

        document.write("Boot Parameters.\n"
            + " p=" + d1ce.Params.Instance().Value("p")
            + " q=" + d1ce.Params.Instance().Value("q")
            + "\n");

        d1ce.Params.Instance().UpdateValue("p",
            d1ce.Params.Instance().Value("p") ? null : 1);
        d1ce.Params.Instance().UpdateValue("q",
            d1ce.Params.Instance().Value("q") ? null : 1);
        document.write("Update Boot Parameters.\n"
            + " p=" + d1ce.Params.Instance().Value("p")
            + " q=" + d1ce.Params.Instance().Value("q")
            + "\n");

        let params1 = new d1ce.Params("test");
        for (let i = 0; i < 6; ++i) {
            params1.UpdateValue(i, "value" + i);
        }
        let keys1 = params1.Keys();
        document.write("Save Parameters: ");
        for (let i = 0; i < keys1.length; ++i) {
            document.write(keys1[i] + "=" + params1.Value(keys1[i]) + ",");
        }
        document.write("\n");

        let params2 = new d1ce.Params("test");
        let keys2 = params2.Keys();
        document.write("Load Parameters: ");
        for (let i = 0; i < keys2.length; ++i) {
            document.write(keys2[i] + "=" + params2.Value(keys2[i]) + ",");
        }
        document.write("\n");

        document.write("</pre>\n");
    }
}

window.onload = () => {}//d1ce.ParamsTest.Main()
/* /NOBUILD - /Test */
