// javascript
// User hand management script.


// User hand.
class Hand {

    // Constructor.
    constructor(screen) {
        this.screen = screen;
        this.input = new d1ce.Input(screen);
        this.count = 0;
        // this.arrow = null;
        // this.point = null;

        this.touching = null;
        this.holding = null;
        this.tapped = null;
        this.swiping = null;
        this.released = null;
    }

    // Setup screen after load assets.
    async Load() {
        // this.arrow = new d1ce.Sprite("arrow");
        // this.arrow.LoadImage("data:image/svg+xml;charset=utf8,<svg viewBox='0 0 128 128' width='128' xmlns='http://www.w3.org/2000/svg'><path d='M96,64l-32,-8l0,16Z' stroke='none' fill='silver'/></svg>");
        // this.point = new d1ce.Sprite("point");
        // this.point.LoadImage("data:image/svg+xml;charset=utf8,<svg viewBox='0 0 128 128' width='128' xmlns='http://www.w3.org/2000/svg'><circle cx='64' cy='64' r='32' stroke='silver' stroke-width='8' fill='none'/></svg>");
    }

    // Get point.
    Point() {
        return this.input.Point();
    }

    // Get touching.
    Touching() {
        return this.touching;
    }

    // Start touching.
    StartTouching() {
        this.touching = this.input.Dirs(true);
        if (this.input.Point()) {
            // this.arrow.SetAnime("selecting");
            // this.point.SetAnime("selecting");
        }
    }

    // Get holding.
    Holding() {
        return this.holding;
    }

    // Start holding.
    StartHolding() {
        this.holding = this.input.Dirs(true);
        if (this.input.Point()) {
            // this.arrow.SetAnime("holding");
            // this.point.SetAnime("holding");
        }
    }

    // Get swiping.
    Swiping() {
        return this.swiping;
    }

    // Start swiping.
    StartSwiping() {
        this.swiping = this.input.Dirs(true);
        if (this.input.Point()) {
            // let dir = this.input.Point().Sub(this.input.Point(true));
            // this.arrow.SetDir(dir);
            // this.arrow.SetAnime("swiping");
            // this.point.SetAnime("swiping");
        }
    }

    // Get tapped.
    Tapped() {
        return this.tapped;
    }

    // Start tapped.
    StartTapped() {
        this.tapped = this.input.Dirs();
        if (this.input.Point()) {
            // this.arrow.SetAnime("decided");
            // this.point.SetAnime("decided");
        }
    }

    // Get released.
    Released() {
        return this.released;
    }

    // Start released.
    StartReleased() {
        this.released = this.input.Dirs();
        if (this.input.Point()) {
            // this.arrow.SetAnime("released");
            // this.point.SetAnime("released");
        }
    }

    // Update.
    Update() {
        const tap_timeout = 1000;
        const tap_radius2 = 50 * 50;
        const press_depth = 0.5;

        // Update flags.
        this.touching = null;
        this.holding = null;
        this.tapped = null;
        this.swiping = null;
        this.released = null;

        // Update input directions.
        this.input.UpdateDirs(tap_timeout, tap_radius2, press_depth);
        if (this.input.Dirs() != null) {

            // Tapped.
            if (this.input.Dirs().IsEmpty()) {
                console.log("Tapped:" + this.count);
                this.StartTapped();

            // Released.
            } else {
                console.log("Released:" + this.count);
                this.StartReleased();
            }
        } else if (this.input.Dirs(true) != null) {

            // Swiping.
            if (this.input.Dirs(true).Right() ||
                this.input.Dirs(true).Left() ||
                this.input.Dirs(true).Down() ||
                this.input.Dirs(true).Up()) {
                console.log("Swiping:" + this.count);
                this.StartSwiping();

            // Holding.
            } else if (this.input.Dirs(true).Far()) {
                console.log("Holding:" + this.count);
                this.StartHolding();

            // Touching.
            } else {
                console.log("Touching:" + this.count);
                this.StartTouching();
            }
        }


        // Pointing.
        if (this.input.Point()) {
            // this.arrow.SetPos(this.input.Point(true));
            // this.point.SetPos(this.input.Point());
            // this.arrow.Enable(this.screen, true);
            // this.point.Enable(this.screen, true);
        }
    }
}
