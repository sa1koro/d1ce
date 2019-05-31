# D1CE

"D1CE" means Draw 1 Cube Engine.

 * Embedded widgets give you the ability to embed web dice on your own website.


## Demo

The web app "Saikoro" (means dice in Japanese) is based on "D1CE" and released at https://saikoro.org/

 * This is a sample of progressive web app (PWA).
 * It can work offline if install (only add to home screen).


## Usage

### Open web dice.

Redirect to the URL.

```
 https://saikoro.org/
```

Or customize query parameters like the URL below if use options.

```
 https://saikoro.org/?app=dot&type=3d6
 https://saikoro.org/?app=dot&type=2d10&seed=0
 https://saikoro.org/?app=num&type=3d6&face=1,2m3
```

<details>
<summary>
See details of options.
</summary>

All query parameters are separated by `&` like below.

```
?app=dot&type=3d6
?app=num&type=2d10&seed=0
?app=dot&type=3d6&face=1,2,3
```

 * `app` parameter specifies dice faces pattern.
     * `dot` (dotted dice), The dice face numbers support `1` to `20`.
     * `num` (numbered dice), The dice face numbers support `1` to `10`.
     * *(experimental feature)* `card` (playing cards).
 * `type` parameter specifies type of dice.
     * Set `d` + dice face maximum number (ex. `d6`) in `type` parameter.
     * Or set dice count 1〜9 and `d` + dice face maximum number (ex. `2d6`) in `type` parameter.~~
 * `seed` parameter specifies random seed of dice face.
     * Set non zero number in `seed` parameter.
     * Or set 0 to use default random seed.
 * `face` parameters specify dice face numbers one by one.
     * Set numbers separated by `,` in `face` parameter.
     * Ignore `seed` parameter if `face` parameters are set.

</details>

### Embed web dice widget.

Copy and paste the code into the HTML of your website.

```
 <iframe src="https://saikoro.org/d1ce/app.html" width="300" height="300"></iframe>
```

Or customize query parameters like the code below if use options.

```
 <iframe src="https://saikoro.org/d1ce/app.html?app=dot&type=3d6" width="100" height="100"></iframe>
 <iframe src="https://saikoro.org/d1ce/app.html?app=num&type=2d10&seed=0" width="100" height="100"></iframe>
 <iframe src="https://saikoro.org/d1ce/app.html?app=num&type=3d6&face=1,2,3" width="100" height="100"></iframe>
```

<details>
<summary>
See details of options.
</summary>

All query parameters are separated by `&` like below.

```
?app=dot&type=3d6
?app=num&type=2d10&seed=0
?app=dot&type=3d6&face=1,2,3
```

 * `app` parameter specifies dice faces pattern.
     * `dot` (dotted dice), The dice face numbers support `1` to `20`.
     * `num` (numbered dice), The dice face numbers support `1` to `10`.
     * *(experimental feature)* `card` (playing cards).
 * `type` parameter specifies type of dice.
     * Set `d` + dice face maximum number (ex. `d6`) in `type` parameter.
     * Or set dice count 1〜9 and `d` + dice face maximum number (ex. `2d6`) in `type` parameter.~~
 * `seed` parameter specifies random seed of dice face.
     * Set non zero number in `seed` parameter.
     * Or set 0 to use default random seed.
 * `face` parameters specify dice face numbers one by one.
     * Set numbers separated by `,` in `face` parameter.
     * Ignore `seed` parameter if `face` parameters are set.

</details>

### Receive rolled dice faces.

Receive return values from message event.

<details>
<summary>
See details of return values.
</summary>

 * Recommend to check message origin for security.
 * Message body is URL query parameter format w/o `?`. All parameters in return values are separated by `&` like below.

```
face=1,2
```

 * `face` parameters return dice faces one by one.
     * Set numbers separated by `,` in `face` parameter.

</details>

Import `d1ce/engine.js` and construct `d1ce.Params("*", true)`, you can easily parse return values from message body like below.

```
 <script type="text/javascript" src="https://saikoro.org/d1ce/engine.js"></script>
 <script type="text/javascript">
     window.onload = async () => {
         let params = new d1ce.Params("*", true);
         while (true) {
             await params.WaitUpdatingValue();
             console.log("face:" + params.Value("face"));
         }
     }
 </script>
```

Or below for check message source.

```
 <script type="text/javascript" src="https://saikoro.org/d1ce/engine.js"></script>
 <script type="text/javascript">
     let applet = document.getElementById("main_applet");
     window.addEventListener("message", (evt) => {
         if (evt.source == applet.contentWindow) {
             let params = new d1ce.Params("*", true);
             console.log("face:" + params.Value("face"));
         }
     }
 </script>
```



## Build

<details>

<summary>
See details about build this engine.
</summary>

### Setup using nvm.

 1. Install nvm.
     * `apt-get update`
     * `apt-get install build-essential libssl-dev`
     * `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`
         * See: https://github.com/creationix/nvm#installation-and-update
 2. Install Node.js by nvm.
     * `nvm install stable`
 3. Install Node.js modules by npm.
     * `npm install`

### Setup without nvm.

 1. Install Node.js and npm.
     * See: https://nodejs.org/
 2. Install Node.js modules by npm.
     * `npm install`

### Test "D1CE" widgets.

 1. Open `src/app.html`
     *  Or start to publish source files by ngrok.
         * `npm run serve`
     *  Access `https://xxxxxx.ngrok.io/src/app.html` to open `src/app.html`

### Build packaged "D1CE" widgets and test.

 1. Build a package from source files.
     * `npm run build`
 2. Start to publish widgets by ngrok.
     * `npm run serve`
 3. Access `https://xxxxxx.ngrok.io/d1ce/app.html` to open `d1ce/app.html`

</details>


## License

"D1CE" is not licensed at the moment.

©︎ 2019 Saikoro.org
