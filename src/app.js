// javascript
// App main script.


// App main.
class App {

    // Constructor.
    constructor() {

        // Print timestamp.
        let info_screen = new d1ce.Screen("info_screen");
        info_screen.Print("#D1CE" + d1ce.timestamp + "(c)Saikoro.org");

        // Create screens.
        this.log_screen = new d1ce.Screen("log_screen");
        this.main_screen = new d1ce.Screen("main_screen");
        this.touch_screen = new d1ce.Screen("touch_screen");

        // Create sprites.
        this.hand = new Hand(this.touch_screen);
        this.cubes = new Cubes(this.main_screen);
        this.touching = null;

        // Select mode parameter from query.
        let query = new d1ce.Params("");
        if (query.Value("flag") != null) {
            this.mode = "widget/flag";
        } else if (query.Value("face") != null) {
            this.mode = "widget/link";
        } else if (query.Value("seed") != null) {
            this.mode = "web";
        } else if (query.Value("type") != null) {
            if (query.Value("type").match(/([\+\-])(\d*)d(\d*)/)) {
                this.mode = "widget/flag";
            } else {
                this.mode = "widget/free";
            }
        } else {
            this.mode = "app";
        }

        console.log("mode:" + this.mode);
    }

    // Setup screen after load assets.
    async Load() {

        await this.hand.Load();
        await this.cubes.Load();

        // Show cubes.
        if (this.mode == "app") {
            this.cubes.StartReleased();

        // Show cubes.
        } else if (this.mode == "widget/free") {
            this.cubes.StartReleased();

        // Roll cubes.
        } else {
            this.cubes.StartRolling();
        }
    }

    // Store status on suspend.
    Store() {
        this.cubes.Store();
    }

    // Update.
    Update() {
        this.hand.Update();

        // Tapped.
        if (this.hand.Tapped()) {

            // Reroll cubes.
            if (this.mode == "app") {
                this.cubes.StartRerolling();

            // Reroll cubes.
            } else if (this.mode == "widget/free") {
                this.cubes.StartRerolling();

            // Flag cube.
            } else if (this.mode == "widget/flag") {
                this.cubes.StartFlagged(this.touching);
            }

            // Touch end.
            this.touching = null;

        // Released.
        } else if (this.hand.Released()) {

            // Change cube types.
            if (this.mode == "app") {
                if (this.hand.Released().Right()) {
                    this.cubes.StartChanging(1);
                } else if (this.hand.Released().Left()) {
                    this.cubes.StartChanging(-1);
                } else {
                    this.cubes.StartReleased();
                }

            // Canceled cube.
            } else if (this.mode == "widget/free") {
                this.cubes.StartReleased();

            // Flagged cubes.
            } else if (this.mode == "widget/flag") {
                this.cubes.StartFlagged();

            // Released cubes.
            } else {
                this.cubes.StartReleased();
            }

            // Touch end.
            this.touching = null;

        // Swiping.
        } else if (this.hand.Swiping()) {

            // Holding cubes.
            if (this.mode == "app") {
                if (this.hand.Swiping().Right()) {
                    this.cubes.StartHolding(1);
                } else if (this.hand.Swiping().Left()) {
                    this.cubes.StartHolding(-1);
                } else {
                    this.cubes.StartHolding(0);
                }

            // Canceled cube.
            } else if (this.mode == "widget/free") {
                this.cubes.StartReleased();

            // Unflagged cube.
            } else if (this.mode == "widget/flag") {
                this.cubes.StartUnselecting(this.touching);
            }

        // Holding.
        } else if (this.hand.Holding()) {

            // Holding cubes.
            if (this.mode == "app") {
                this.cubes.StartHolding(0);

            // Canceled cube.
            } else if (this.mode == "widget/free") {
                this.cubes.StartReleased();

            // Unflagged cubes.
            } else if (this.mode == "widget/flag") {
                this.cubes.StartUnselecting(this.touching);
            }

        // Touching.
        } else if (this.hand.Touching()) {

            // Touch start.
            this.touching = this.hand.Point();

            // Touch cubes.
            if (this.mode == "app" || this.mode == "widget/free") {
                this.cubes.StartTouching();

            // Flag cube.
            } else if (this.mode == "widget/flag") {
                this.cubes.StartSelecting(this.touching);
            }
        }

        this.cubes.Update();
    }

    // Draw.
    Draw() {
    }

    // Main.
    async Main() {
        console.log("Load.");
        await this.Load();
        while (true) {
            if (!this.suspend) {
                this.Update();
                this.Draw();
                await d1ce.Engine.Wait(1000 / 60);
            } else {
                this.Store();
            }
        }
    }

    // Suspend.
    async Suspend() {
        console.log("Suspend.");
        this.suspend = true;
        while (this.suspend) {
            await d1ce.Engine.Wait(1000 / 60);
        }
    }

    // Get instance.
    static Instance() {
        if (this.instance == null) {
            this.instance = new App();
        }
        return this.instance;
    }
}

// Main on load event, create instance on boot event.
window.onload = () => App.Instance().Main();

// Suspend on visibilitychange event.
document.visibilitychange = () => App.Instance().Suspend();
