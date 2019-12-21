
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 160;
        this.h = 160;
        this.speed = 350;
        this.score = 0;
        this.hitTimer = 2;
        this.hitSpeed = 4; // animation speed
        this.targetX = x;
        this.targetY = y;
        this.serving = true;
    }

    update(dt) {
        this.hitTimer += this.hitSpeed * dt;

        if (!touchUsed) {
            this.targetX = scaledMouseX;
            this.targetY = scaledMouseY;
        }

        let d = dist(this.x, this.y, this.targetX, this.targetY);
        this.x = lerp(this.x, this.targetX, min(this.speed * dt / d, 1));
        this.y = lerp(this.y, this.targetY, min(this.speed * dt / d, 1));
        if (this.serving) {
            let bx = game.ball.x;
            let by = game.ball.y - game.ball.z;
            this.x = constrain(this.x, bx + 40, bx - game.hitBox.x - 1);
            this.y = constrain(this.y, by + game.hitBox.y + 1, by + game.hitBox.y + game.hitBox.h - 1);
        } else {
            this.x = constrain(this.x, 820, 1580);
            this.y = constrain(this.y, 256, 870);
        }

        // hit immediately when possible if using touch
        if (touchUsed && !this.serving) {
            let bx = game.ball.x;
            let by = game.ball.y - game.ball.z;
            if (bx > this.x + game.hitBox.x && bx < this.x + game.hitBox.x + game.hitBox.w
            && by > this.y + game.hitBox.y && by < this.y + game.hitBox.y + game.hitBox.h) {
                let a = atan2(by - this.y, bx - this.x);
                game.ball.xv = -game.ball.speed;
                game.ball.yv = sin(a) * game.ball.speed;
                game.ball.lastHit = 'player';
                if (this.hitTimer > 1) {
                    sfx.impact.play();
                }
                this.hitTimer = 0;
            }
        }
    }

    mousePressed() {
        if (!touchUsed) {
            let bx = game.ball.x;
            let by = game.ball.y - game.ball.z;
            if (bx > this.x + game.hitBox.x && bx < this.x + game.hitBox.x + game.hitBox.w
            && by > this.y + game.hitBox.y && by < this.y + game.hitBox.y + game.hitBox.h) {
                let a = atan2(by - this.y, bx - this.x);
                game.ball.xv = -game.ball.speed;
                game.ball.yv = sin(a) * game.ball.speed;
                game.ball.lastHit = 'player';
                if (this.hitTimer > 1) {
                    sfx.impact.play();
                }
            }
            this.hitTimer = 0;
            this.serving = false;
        }
    }

    mouseReleased() {
        if (touchUsed && this.serving) {
            let bx = game.ball.x;
            let by = game.ball.y - game.ball.z;
            if (bx > this.x + game.hitBox.x && bx < this.x + game.hitBox.x + game.hitBox.w
                && by > this.y + game.hitBox.y && by < this.y + game.hitBox.y + game.hitBox.h) {
                let a = atan2(by - this.y, bx - this.x);
                game.ball.xv = -game.ball.speed;
                game.ball.yv = sin(a) * game.ball.speed;
                game.ball.lastHit = 'player';
                if (this.hitTimer > 1) {
                    sfx.impact.play();
                }
            }
            this.hitTimer = 0;
            this.serving = false;
        }
    }

    touchMoved() {
        if (touchUsed) {
            this.targetX += (mouseX - pmouseX) / scaleFactor;
            this.targetY += (mouseY - pmouseY) / scaleFactor;
            // limit to directing movement for 0.5 seconds
            this.targetX = constrain(this.targetX, this.x - this.speed * 0.5, this.x + this.speed * 0.5);
            this.targetY = constrain(this.targetY, this.y - this.speed * 0.5, this.y + this.speed * 0.5);
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        let img = this.hitTimer < 1 ? gfx.playerHit : gfx.player;
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
        if (mouseIsPressed) {
            rect(game.hitBox.x, game.hitBox.y, game.hitBox.w, game.hitBox.h);
        }
        */

        pop();
    }
}
