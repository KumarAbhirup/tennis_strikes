
class Game {
    constructor() {
        this.netColor = color(Koji.config.colors.tennisNetRodColor);
        this.courtLineWidth = 10;
        let w1 = 400;
        let w2 = 300;
        this.courtLines = [
            [800 - (w1 + w2), 256 + 10, 800 + (w1 + w2), 256 + 10],
            [800 - (w1 + w2), 900 - 10, 800 + (w1 + w2), 900 - 10],
            [800 - (w1 + w2), 256 + 10, 800 - (w1 + w2), 900 - 10],
            [800 + (w1 + w2), 256 + 10, 800 + (w1 + w2), 900 - 10],
            [800 - w1, 256 + 10, 800 - w1, 900 - 10],
            [800 + w1, 256 + 10, 800 + w1, 900 - 10],
            [800 - w1, (256 + 900) / 2, 800 + w1, (256 + 900) / 2]
        ];

        this.hitBox = { x: -120, y: -80, w: 160, h: 160 };

        this.message = Koji.config.strings.pointText;
        this.messageColor = color(0);
        this.messageTimer = 2;
        this.messageSpeed = 1;

        // game length in seconds
        this.timer = 120;
    }

    load() {
        this.ball = new Ball();
        this.player = new Player(this.ball.x - this.hitBox.x / 2, this.ball.y - this.ball.z);
        this.opponent = new Opponent(250, this.player.y);
        this.pickup = new Pickup();
    }

    update(dt) {
        this.messageTimer += this.messageSpeed * dt;

        if (this.messageTimer > 1) {
            this.player.update(dt);
            this.ball.update(dt);
            this.opponent.update(dt);

            if (!this.player.serving) {
                this.pickup.update(dt);
                this.timer = max(this.timer - dt, 0);
                if (this.timer === 0) {
                    gameState = 'gameOver';
                }
            }
        }
    }

    showMessage(msg, msgColor) {
        this.message = msg;
        this.messageColor = msgColor;
        this.messageTimer = 0;
    }

    mousePressed() {
        if (this.messageTimer > 1) {
            this.player.mousePressed();
        }
    }

    mouseReleased() {
        if (this.messageTimer > 1) {
            this.player.mouseReleased();
        }
    }

    touchMoved() {
        if (this.messageTimer > 1) {
            this.player.touchMoved();
        }
    }
    
    draw() {
        push();

        // audience
        image(gfx.audience, 0, 256 - 90 - gfx.audience.height)
        // console.log(gfx.audience.height)

        // logos
        {
            let logos = [gfx.logo1, gfx.logo2];
            let h = 90;
            let x = 0;
            let y = 256 - h;
            for (let i = 0; x < 1600; i++) {
                let img = logos[i % logos.length];
                let s = h / img.height;
                let w = img.width * s;
                image(img, x, y, w, h);
                x += w;
            }
        }

        // scoreboard
        {
            let w = 354;
            let h = 256 - 90;
            fill(Koji.config.colors.scoreboardBackgroundColor);
            rect(800 - w / 2, 0, w, h, 20);
            fill(Koji.config.colors.scoreboardForegroundColor);
            rect(800 - 100, 0, 200, h / 2 - w / 32, 20);
            rect(800 - w * 15 / 32, h / 2, w * 14 / 32, h / 2 - w / 32, 20);
            rect(800 + w / 32, h / 2, w * 14 / 32, h / 2 - w / 32, 20);
            fill(Koji.config.colors.scoreboardTextColor);
            textAlign(CENTER, CENTER);
            textSize(48);
            let sMinutes = String(floor(this.timer / 60)).padStart(2, '0');
            let sSeconds = String(floor(this.timer % 60)).padStart(2, '0');
            text(sMinutes + ':' + sSeconds, 800, h / 4);
            textSize(64);
            text(this.opponent.score, 800 - 354 / 4, h * 3 / 4);
            text(this.player.score, 800 + 354 / 4, h * 3 / 4);
        }

        // court
        let grassScale = max(1600 / gfx.grass.width, (900 - 256) / gfx.grass.height);
        image(gfx.grass, 0, 256, gfx.grass.width * grassScale, gfx.grass.height * grassScale);
        // lines
        stroke(255);
        strokeWeight(this.courtLineWidth);
        strokeCap(PROJECT);
        for (let v of this.courtLines) {
            line(v[0], v[1], v[2], v[3]);
        }
        strokeCap(ROUND);
        noStroke();

        // net shadow
        image(gfx.netShadow, 797, 270);

        // referee
        let refScale = 156 / gfx.referee.height;
        image(gfx.referee, 800 - gfx.referee.width / 2 * refScale, 125, gfx.referee.width * refScale, gfx.referee.height * refScale);

        // net line
        stroke(this.netColor);
        strokeWeight(10);
        line(800, 190, 800, 900);
        noStroke();

        this.pickup.draw();
        this.player.draw();
        this.opponent.draw();
        this.ball.draw();

        // message (hit / out)
        if (this.messageTimer <= 1) { 
            let t = ease.outCubic(utils.pingPong(this.messageTimer * 2));
            this.messageColor.setAlpha(min(t * 8, 1) * 255);
            fill(this.messageColor);
            textSize(lerp(60, 120, t))
            textAlign(CENTER, CENTER);
            text(this.message, 800, 450);
        }

        pop();
    }
}
