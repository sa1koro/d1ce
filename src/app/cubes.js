// javascript
// Dice cubes management script.

// Dice cubes.
class Cubes {

    // Constructor.
    constructor(screen) {
        this.screen = screen;
        this.sprites = null;

        this.query = new d1ce.Params("");
        this.storage = new d1ce.Params(d1ce.identifier + "-option");
        this.message = new d1ce.Params("*", true);
        this.numbers = [];

        this.random = new d1ce.Count();
        this.update = null;
        this.count = 0;

        this.app = "";
        this.type = "";
        this.type_count = 1;
        this.type_number = 6;
        this.seed = 0;
        this.face = "";

        this.fixed = null;
    }

    // Setup screen after load assets.
    async Load() {
        let sprite_file = "image/dot.png";
        let sprite_size = 192;

        // Load and save tag parameter from query or storage.
        if (this.query.Value("app")) {
            this.app = this.query.Value("app");
            this.message.UpdateValue("app", this.app, true);

            if (this.app.match(/^(\w+)@(\d+)/)) {
                this.app.replace(/^(\w+)@(\d+)/, (match, p1, p2) => {
                    (match);
                    sprite_file = "image/" + p1 + ".png";
                    sprite_size = Number(p2);
                });
            } else {
                sprite_file = "image/" + this.app + ".png";
                sprite_size = 192;
            }
        }

        // Load and save tag parameter from query or storage.
        if (this.query.Value("tag")) {
            let tag = this.query.Value("tag");
            this.message.UpdateValue("tag", tag, true);
        }

        // Create dice cubes sprites.
        this.sprites = [];
        for (let i = 0; i < Cubes.count_max; ++i) {
            this.sprites[i] = new d1ce.Sprite("cubes");
            this.sprites[i].LoadImage(sprite_file, sprite_size, sprite_size);
        }

        for (let i = 0; i < Cubes.count_max; ++i) {
            await this.sprites[i].WaitLoadingImage();
        }

        // // Load fixed parameter from storage.
        // if (this.storage.Value("fixed")) {
        //     this.fixed = this.storage.Value("fixed");
        // }

        // Load parameters from query.
        if (this.query.Value("type") != null
         || this.query.Value("seed") != null
         || this.query.Value("face") != null) {
            this.type = this.query.Value("type");
            this.seed = this.query.Value("seed");
            this.face = this.query.Value("face");
        }

        // Fixed parameter.
        if (this.query.Value("face")) {
            this.fixed = "face";
        } else if (this.query.Value("seed")) {
            this.fixed = "seed";
        } else if (this.query.Value("type")) {
            this.fixed = "type";
        }

        // Load type,seed,face from storage or defaults.
        if (this.type == "") {
            this.type = this.storage.Value("type");
            this.seed = this.storage.Value("seed");
            this.face = this.storage.Value("face");
        }

        // Parse face parameters.
        if (this.face != null) {
            let face_numbers = this.face.split(',');
            this.numbers = [];
            for (let i = 0; i < face_numbers.length; ++i) {
                if (isFinite(face_numbers[i])) {
                    this.numbers.push(Number(face_numbers[i]));
                }
            }
            this.type = "" + face_numbers.length + "d";
        }

        // Set cube count and face number max.
        if (this.type.match(/(\d*)d(\d*)/)) {
            this.type.replace(/(\d*)d(\d*)/, (match, p1, p2) => {
                (match);
                this.type_count = p1 > 0 ? Number(p1) : 1;
                this.type_number = p2 > 0 ? Number(p2) : 6;
            });

        // Set cube count only.
        } else if (isFinite(this.type)) {
            this.type_count = Number(this.type);
            this.type_number = 6;

        // Set default.
        } else {
            this.type = "";
            this.type_count = 1;
            this.type_number = 6;
        }

        // Type range check.
        if (this.type_count < 1) {
            this.type_count = 1;
        } else if (this.type_count > Cubes.count_max) {
            this.type_count = Cubes.count_max;
        }
        if (this.type_number < 1) {
            this.type_number = 1;
        } else if (this.type_number > Cubes.number_max) {
            this.type_number = Cubes.number_max;
        }

        // Seed range check.
        if (!isFinite(this.seed)) {
            this.seed = 0;
        }

        // Store current state.
        this.storage.UpdateValue("type", this.type);
        this.storage.UpdateValue("seed", this.seed);
        this.storage.UpdateValue("fixed", this.fixed);

        // Set random seed.
        this.random = new d1ce.Count(this.seed);

        // Setup sprites.
        for (let i = 0; i < Cubes.count_max; ++i) {
            this.sprites[i].Enable(this.screen, i < this.type_count);
            if (this.type_count == 1) {
                this.sprites[i].SetScale(1);
            } else if (this.type_count <= 4) {
                this.sprites[i].SetScale(0.75);
            } else if (this.type_count <= 9) {
                this.sprites[i].SetScale(0.5);
            } else {
                this.sprites[i].SetScale(0.375);
            }
        }

        if (this.fixed == "face") {
            this.StartRolled();
        } else if (this.fixed == "seed") {

            // Rolled dice cubes without saving parameters.
            this.numbers = [];
            for (let i = 0; i < this.type_count; ++i) {
                this.numbers.push(this.random.Random(this.type_number) + 1);
            }
            this.StartRolled();
        } else {
            this.StartSelecting();
        }

        console.log("type:" + this.type + " seed:" + this.seed);
    }

    // Store status on suspend.
    Store() {
    }

    // Start selecting.
    StartSelecting() {

        // Ignore rolling when seed,face parameter is fixed.
        if (this.fixed == "seed" || this.fixed == "face") {
            return;
        }

        if (this.update == this.UpdateSelecting) {
            this.update = this.UpdateSelecting;

            // Restart selecting animation.
            for (let i = 0; i < this.sprites.length; ++i) {
                this.sprites[i].SetAnime("reselecting");
            }
        } else {
            this.update = this.UpdateSelecting;

            // Restart selecting animation.
            for (let i = 0; i < this.sprites.length; ++i) {
                this.sprites[i].SetAnime("selecting");
            }
        }
    }

    // Start rolled.
    StartRolled() {
        this.update = this.UpdateRolled;
        this.count = 0;

        // Save storage parameters.
        this.storage.UpdateValue("type", this.type, true);
        this.storage.UpdateValue("seed", this.seed, true);
        this.storage.UpdateValue("face", this.face);

        // Save query parameters.
        this.query.UpdateValue("type", this.type, true);
        this.query.UpdateValue("seed", this.seed, true);
        this.query.UpdateValue("face", null);

        // Save result parameters.
        this.message.UpdateValue("type", this.type, true);
        this.message.UpdateValue("seed", this.seed, true);
        let results = this.numbers.join(",");
        this.message.UpdateValue("face", results);

        // Start rolled animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("rolled");
        }
    }

    // Start rolling.
    StartRolling() {

        // Ignore rolling when seed,face parameter is fixed.
        if (this.fixed == "seed" || this.fixed == "face") {
            return;
        }

        this.update = this.UpdateRolling;
        this.count = 30;

        // Start rolling animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("rolling");
        }
    }

    // Start holding.
    StartHolding(change) {

        // Ignore holding when seed,face parameter is fixed.
        if (this.fixed == "seed" || this.fixed == "face") {
            return;

        // Released when type parameter is fixed.
        } else if (this.fixed == "type") {
            this.StartReleased();
            return;
        }

        if (this.update != this.UpdateHolding) {
            this.update = this.UpdateHolding;
        }

        // Start holding animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (change > 0) {
                this.sprites[i].SetAnime("swiping_right");
            } else if (change < 0) {
                this.sprites[i].SetAnime("swiping_left");
            } else {
                this.sprites[i].SetAnime("holding");
            }
        }
    }

    // Start released.
    StartReleased() {

        // Ignore holding when seed,face parameter is fixed.
        if (this.fixed == "seed" || this.fixed == "face") {
            return;
        }

        this.update = this.UpdateSelecting;

        // Start released animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("released");
        }
    }

    // Start changing.
    StartChanging(change) {

        // Ignore changing when seed,face parameter is fixed.
        if (this.fixed == "seed" || this.fixed == "face") {
            return;

        // Released when type parameter is fixed.
        } else if (this.fixed == "type") {
            this.StartReleased();
            return;
        }

        this.update = this.UpdateSelecting;

        // Change dice cubes type and save parameters.
        if (change > 0) {
            if (this.type_count >= Cubes.count_max) {
                this.type_count = Cubes.count_max;
            } else {
                this.type_count = this.type_count + 1;
            }
        } else if (change < 0) {
            if (this.type_count <= 1) {
                this.type_count = 1;
            } else {
                this.type_count = this.type_count - 1;
            }
        }
        if (change != 0) {
            this.type = this.type_count + "d" + this.type_number;
            this.storage.UpdateValue("type", this.type);
            this.query.UpdateValue("type", this.type);
            this.message.UpdateValue("type", this.type, true);
        }

        // Change dice cubes count.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].Enable(this.screen, i < this.type_count);
            if (this.type_count == 1) {
                this.sprites[i].SetScale(1);
            } else if (this.type_count <= 4) {
                this.sprites[i].SetScale(0.75);
            } else if (this.type_count <= 9) {
                this.sprites[i].SetScale(0.5);
            } else {
                this.sprites[i].SetScale(0.375);
            }
        }

        // Start/continue changed animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("changed");
        }
    }

    // Update selecting.
    UpdateSelecting() {

        // Selecting dice cubes face.
        this.numbers = [];
        let number = Math.floor(this.count / 20) % this.type_number + 1;
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.type_count) {
                this.numbers.push(number);
            }
        }

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.type_count) {
                this.sprites[i].SetFrame(this.numbers[i] - 1);
            }
        }

        // Count up for dice cubes face.
        this.count += 1;
    }

    // Update rolling.
    UpdateRolling() {

        // Rolling dice cubes face.
        this.numbers = [];
        for (let i = 0; i < this.sprites.length; ++i) {
            let number = this.random.Random(this.type_number) + 1;
            if (i < this.type_count) {
                this.numbers.push(number);
            }
        }

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.numbers.length) {
                this.sprites[i].SetFrame(this.numbers[i] - 1);
            }
        }

        // Count down to stop rolling dice cubes.
        this.count -= 1;
        if (this.count <= 0) {

            // Rolled dice cubes without saving parameters.
            this.seed = this.random.Seed();
            this.numbers = [];
            for (let i = 0; i < this.type_count; ++i) {
                this.numbers.push(this.random.Random(this.type_number) + 1);
            }
            this.face = "";
            this.StartRolled();
        }
    }

    // Update rolled.
    UpdateRolled() {

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.numbers.length) {
                this.sprites[i].SetFrame(this.numbers[i] - 1);
            }
        }

        // Start/continue changed animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("rolled");
        }
    }

    // Update holding.
    UpdateHolding() {

        // Selecting dice cubes face.
        this.seed = 0;
        this.numbers = [];
        let number = Math.floor(this.count / 20) % this.type_number + 1;
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.type_count) {
                this.numbers.push(number);
            }
        }

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.type_count) {
                this.sprites[i].SetFrame(this.numbers[i] - 1);
            }
        }

        // Count up for dice cubes face.
        this.count += 1;
    }

    // Update.
    Update() {
        if (this.update != null) {
            this.update();
        }
    }
}

// Dice cubes maximum counts.
Cubes.count_max = 16;

// Dice cubes sprites maximum number.
Cubes.number_max = 54;
