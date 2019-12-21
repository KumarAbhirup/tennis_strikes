
class Pickup {
    constructor() {
        this.w = 60;
        this.h = 60;
        this.x = 800 - this.w / 2;
        this.y = random(290, 870) - this.h / 2;
        this.spawnTimer = random(4, 12);
        this.active = false;
        this.activeTimer = 0;
        this.activeLength = 8;
        this.side = 'left';
    }

    update(dt) {
        this.spawnTimer -= dt;

        let bx = game.ball.x - game.ball.w / 2;
        let by = game.ball.y - game.ball.z - game.ball.h / 2;
        if (this.spawnTimer < 0 && !this.active
        && bx + game.ball.w > this.x && bx < this.x + this.w
        && by + game.ball.h > this.y && by < this.y + this.h) {
            this.active = true;
            this.side = game.ball.xv > 0 ? 'right' : 'left';
        }

        if (this.active) {
            this.activeTimer += dt;
            if (this.activeTimer > 0.2) {
                if (this.side === 'right') {
                    if (game.ball.x < 800) {
                        game.ball.x = 800;
                        game.ball.xv = abs(game.ball.xv);
                        sfx.impact.play();
                    }
                } else {
                    if (game.ball.x > 800) {
                        game.ball.x = 800;
                        game.ball.xv = -abs(game.ball.xv);
                        sfx.impact.play();
                    }
                }
            }
            if (this.activeTimer > this.activeLength) {
                game.pickup = new Pickup();
            }
        }
    }

    draw() {
        push();
        if (this.active) {
            stroke('#B20000');
            strokeWeight(12);
            line(800, 190, 800, 900);
        } else if (this.spawnTimer < 0) {
            image(gfx.wallPickup, this.x, this.y, this.w, this.h);
        }
        pop();
    }
}