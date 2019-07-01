// javascript
// D1CE Screen components.


/* Namespace - NOBUILD */
var d1ce = d1ce || {};
/* /NOBUILD - /Namespace */


// Screen management class.
d1ce.Screen = class {

    // Constructor.
    constructor(type=null) {
        this.root = null;

        // Setup screen.
        if (type != null) {
            let screens = document.getElementsByClassName(type);
            if (screens.length > 0) {
                for (let i = 0; i < screens.length; ++i) {
                    if (!d1ce.Screen.Instance().screens.includes(screens[i])) {
                        this.root = screens[i];
                        d1ce.Screen.Instance().screens.push(this.root);
                        break;
                    }
                }
            }
        }
        if (this.root == null){
            this.root = document.createElement("pre");
            if (type != null) {
                this.root.setAttribute("class", type);
                d1ce.Screen.Instance().screens.push(this.root);
            }
            document.body.appendChild(this.root);
        }
    }

    // Print text to screen.
    Print(text) {
        if (this.root != null) {
            this.root.appendChild(document.createTextNode(text + "\n"));
        }
    }

    // Clear screen.
    Clear() {
        if (this.root != null) {
            this.root.textContent = null;
        }
    }

    // Get instance for single screen app.
    static Instance() {
        if (this.instance == null) {
            this.instance = new d1ce.Screen();
            this.instance.screens = [];
        }
        return this.instance;
    }
}


// Sprite management class.
d1ce.Sprite = class {

    // Constructor.
    constructor(type=null) {
        this.root = null;
        this.sprite = null;
        this.frames = 0;
        this.width = 0;
        this.height = 0;
        this.type = null;
        this.anime = null;
        this.pos = null;
        this.dir = null;
        this.angle = 0;
        this.scale = 1;
        this.alpha = 1;

        // Copy asset data.
        this.root = document.createElement("div");
        this.sprite = document.createElement("div");
        this.root.appendChild(this.sprite);
        if (type != null) {
            this.sprite.setAttribute("class", type);
        }
    }

    // Load image.
    LoadImage(name, width_, height_) {
        if (this.root != null) {
            if (this.sprite != null) {
                var image = new Image() ;
                image.onload = () => {
                    this.width = width_ > 0 ? width_ : image.naturalWidth;
                    this.height = height_ > 0 ? height_ : width_ > 0 ? width_ : image.naturalHeight;
                    this.frames = Math.floor(image.naturalWidth / this.width);
                    this.sprite.style.width = this.width;
                    this.sprite.style.height = this.height;
                    let sizex = image.naturalWidth / this.width * 100;
                    let sizey = image.naturalHeight / this.height * 100;
                    this.sprite.style.backgroundSize = "" + sizex + "%" + " " + sizey + "%";
                    let url = "url(\"" + name + "\")";
                    this.sprite.style.backgroundImage = url;
                }
                image.src = name;
            }
        }
    }

    // Wait loading image.
    async WaitLoadingImage() {
        while (this.frames <= 0) {
            await new Promise(r => setTimeout(r, 10));
        }
    }

    // Enable or disable sprite.
    Enable(screen, enable) {
        if (this.root != null && screen.root != null) {
            if (enable) {
                if (!screen.root.contains(this.root)) {
                    screen.root.appendChild(this.root);
                }
            } else {
                if (screen.root.contains(this.root)) {
                    screen.root.removeChild(this.root);
                }
            }
        }
    }

    // Check pos is in sprite rect.
    IsInRect(pos) {
        if (this.root != null && pos != null) {
            let rect = this.root.getBoundingClientRect();
            return pos.x > rect.left && pos.x < rect.right &&
                   pos.y > rect.top && pos.y < rect.bottom;
        }
        return false;
    }

    // Set sprite position vector.
    SetPos(pos) {
        if (this.root != null) {
            this.pos = pos;
            this.root.style.position = "fixed";
            this.root.style.top = this.pos.y - (this.root.clientHeight　/ 2);
            this.root.style.left = this.pos.x - (this.root.clientWidth　/ 2);
        }
    }

    // Set sprite direction vector.
    SetDir(dir) {
        if (this.root != null) {
            this.dir = dir;
            const angle_radian = 180 / Math.PI;
            this.angle = Math.atan2(this.dir.y, this.dir.x) * angle_radian;
            this.root.style.transform = "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
        }
    }

    // Set sprite angle.
    SetAngle(angle) {
        if (this.root != null) {
            this.dir = null; // Can not set direction vector.
            this.angle = angle;
            this.root.style.transform = "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
        }
    }

    // Set sprite scale.
    SetScale(scale) {
        if (this.root != null) {
            this.scale = scale;
            this.root.style.transform = "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
            this.root.style.marginLeft = this.root.clientWidth * (scale - 1) / 2;
            this.root.style.marginRight = this.root.clientWidth * (scale - 1) / 2;
            this.root.style.marginTop = this.root.clientHeight * (scale - 1) / 2;
            this.root.style.marginBottom = this.root.clientHeight * (scale - 1) / 2;
        }
    }

    // Set sprite aplha.
    SetAlpha(alpha) {
        if (this.root != null) {
            this.alpha = alpha;
            this.root.style.opacity = this.alpha;
        }
    }

    // Set sprite type.
    SetType(type) {
        if (this.root != null) {
            if (this.sprite != null && !this.sprite.classList.contains(type)) {
                this.sprite.classList.remove(this.type);
                this.sprite.classList.add(type);
                this.type = type;
            }
        }
    }

    // Set texture frame.
    SetFrame(frame) {
        if (this.root != null) {
            if (this.sprite != null && this.frames > 0) {
                let x = (frame % this.frames) * this.width;
                let y = Math.floor(frame / this.frames) * this.height;
                this.sprite.style.backgroundPosition = "" + (-x) + " " + (-y);
            }
        }
    }

    // Set texture frame.
    SetFrame2(x, y, w, h) {
        if (this.root != null) {
            if (this.sprite != null && this.width != null && this.height != null) {
                this.sprite.style.width = w;
                this.sprite.style.height = h;
                this.sprite.style.backgroundPosition = "" + (-x) + " " + (-y);
                let nx = (this.sprite.naturalWidth / w);
                let ny = (this.sprite.naturalHeight / h);
                 this.sprite.style.backgroundSize = "" + nx + " " + ny;
            }
        }
    }

    // Set animation state.
    SetAnime(anime) {
        if (this.root != null) {
            if (this.sprite != null && !this.sprite.classList.contains(anime)) {
                this.sprite.classList.remove(this.anime);
                this.sprite.classList.add(anime);
                this.anime = anime;
            }
        }
    }
}


/* Screen components test - NOBUILD */
d1ce.ScreenTest = class {

    // Constructor.
    constructor() {

        this.main_screen = new d1ce.Screen("screen");
        this.log_screen = new d1ce.Screen("screen");

        // Create sprites.
        this.cube1 = new d1ce.Sprite("cube");
        this.cube1.LoadImage("screen.png", 96, 96);
        this.cube2 = new d1ce.Sprite("cube");
        this.cube2.LoadImage("screen.png", 96, 96);
        this.cube3 = new d1ce.Sprite("cube");
        this.cube3.LoadImage("screen.png", 96, 96);
    }

    // Main.
    async Main() {

        // Display sprite.
        this.log_screen.Print("Draw sprite.");
        await this.cube1.WaitLoadingImage();
        this.cube1.SetFrame(1);
        this.cube1.Enable(this.main_screen, true);

        // Transform sprite.
        this.log_screen.Print("Transform sprite.");
        await this.cube2.WaitLoadingImage();
        this.cube2.SetFrame(2);
        this.cube2.SetAngle(45);
        this.cube2.SetScale(1.5);
        this.cube2.SetAlpha(0.5);
        this.cube2.SetPos(new d1ce.Vec(100,100));
        this.cube2.Enable(this.main_screen, true);

        // Animate sprite.
        this.log_screen.Print("Animate sprite.");
        await this.cube3.WaitLoadingImage();
        this.cube3.SetFrame(3);
        this.cube3.SetAlpha(0.5);
        this.cube3.SetAnime("scaling");
        this.cube3.Enable(this.main_screen, true);
    }

    // Get instance.
    static Instance() {
        if (this.instance == null) {
            this.instance = new d1ce.ScreenTest();
        }
        return this.instance;
    }
}

window.onload = () => d1ce.ScreenTest.Instance().Main();
/* /NOBUILD - /Test */
