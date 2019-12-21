
class Ball {
    constructor() {
        this.bounceDist = 600;
        this.x = 800 + this.bounceDist;
        this.y = 620;
        this.z = this.getZ();
        this.w = 30;
        this.h = 30;
        this.xv = 0;
        this.yv = 0;
        this.speed = 450;
        this.lastHit = 'player';
    }

    update(dt) {
        this.x += this.xv * dt;
        this.y += this.yv * dt;
        this.z = this.getZ();

        if (this.x < 0 || this.x > 1600 || this.y - this.z < 256 - 50 || this.y - this.z > 900) {
            // opponent hit
            if (this.lastHit === 'opponent') {
                if (this.x < 800 + this.bounceDist / 2) {
                    game.player.score += 1;
                    game.showMessage(Koji.config.strings.outText, color(Koji.config.colors.positiveTextColor));
                    sfx.clap.play();
                } else {
                    game.opponent.score += 1;
                    game.showMessage(Koji.config.strings.pointText, color(Koji.config.colors.negativeTextColor));
                    sfx.boo.play();
                }
            } else { // player hit
                if (this.x > 800 - this.bounceDist / 2) {
                    game.opponent.score += 1;
                    game.showMessage(Koji.config.strings.outText, color(Koji.config.colors.negativeTextColor));
                    sfx.boo.play();
                } else {
                    game.player.score += 1;
                    game.showMessage(Koji.config.strings.pointText, color(Koji.config.colors.positiveTextColor));
                    sfx.clap.play();
                }
            }

            let playerScore = game.player.score;
            let opponentScore = game.opponent.score;
            game.load();
            game.player.score = playerScore;
            game.opponent.score = opponentScore;
        }
    }

    getZ() {
        return ease.outQuad(1 - utils.pingPong((this.x - 800) / (this.bounceDist / 2))) * 50;
    }

    draw() {
        // shadow
        fill(0, 120);
        ellipse(this.x, this.y, 20, 6);
        // ball
        image(gfx.ball, this.x - this.w / 2, this.y - this.z - this.h / 2, this.w, this.h);
    }
}
