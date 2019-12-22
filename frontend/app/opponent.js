
class Opponent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 160;
        this.h = 160;
        this.speed = 180; // 350
        this.score = 0;
        this.hitTimer = 2;
        this.hitSpeed = 4; // animation speed
        this.targetX = x;
        this.targetY = y;
    }

    update(dt) {
        this.hitTimer += this.hitSpeed * dt;

        let bx = game.ball.x;
        let by = game.ball.y - game.ball.z;
        // normalized ball coordinates (0-1)
        let bnx;
        let bny = (by - (256 - 50)) / (900 - (256 - 50));
        // closer if ball is near edges
        this.targetX = 200 + pow(bny * 2 - 1, 2) * 400;
        // normalize x from target x to player position
        bnx = (bx - this.targetX) / (game.player.x - this.targetX);
        // middle by default
        this.targetY = ((256 - 50) + 900) / 2;
        // intersection of ball path with current target x
        // (will hit before ball gets there so tends to aim towards middle)
        let isectY;
        if (game.ball.xv === 0) {
            isectY = by;
        } else {
            isectY = by + (bx - this.targetX) / abs(game.ball.xv) * game.ball.yv;
        }
        // move from center to target when ball is closer
        this.targetY = lerp(isectY, this.targetY, ease.inOutQuart(bnx));
        this.targetX += (noise(gameTime * 0.5) * 2 - 1) * 100;
        // vary y more sometimes
        let variance = lerp(50, 300, bnx);
        variance = lerp(variance, 400, pow(noise(gameTime * 0.5, 100), 4));
        this.targetY += (noise(gameTime * 0.5, 200) * 2 - 1) * variance;

        let d = dist(this.x, this.y, this.targetX, this.targetY);
        this.x = lerp(this.x, this.targetX, min(this.speed * dt / d, 1));
        this.y = lerp(this.y, this.targetY, min(this.speed * dt / d, 1));
        this.x = constrain(this.x, 20, 780);
        this.y = constrain(this.y, 256, 870);

        if (bx < this.x - game.hitBox.x && bx > this.x - game.hitBox.x - game.hitBox.w
        && by < this.y - game.hitBox.y && by > this.y - game.hitBox.y - game.hitBox.h) {
            let a = atan2(by - this.y, bx - this.x);
            game.ball.xv = game.ball.speed;
            game.ball.yv = sin(a) * game.ball.speed;
            game.ball.lastHit = 'opponent';
            if (this.hitTimer > 1) {
                sfx.impact.play();
            }
            this.hitTimer = 0;
        }
    }

    draw() {
        push();
        translate(this.x, this.y);
        scale(-1, 1);

        let img = this.hitTimer < 1 ? gfx.opponentHit : gfx.opponent;
        let w = this.w;
        let h = this.h;
        if (touchUsed) {
            w *= 1.5;
            h *= 1.5;
        }
        image(img, -w / 2, -h / 2, w, h);
        // hit area
        /*
        fill(128, 0, 0, 120);
        rect(game.hitBox.x, game.hitBox.y, game.hitBox.w, game.hitBox.h);
        */

        pop();
    }
}
