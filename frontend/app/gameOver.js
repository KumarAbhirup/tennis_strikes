
var gameOver = {};

gameOver.load = function () {
    gameOver.t = 0;
    gameOver.y = 910;
    gameOver.w = 600;
    gameOver.h = 160;
}

gameOver.resetGame = function () {
    gameTime = 0;
    countdownTimer = 3;
    game = new Game();
    game.load();
}

gameOver.update = function (dt) {
    if (gameState === 'gameOver') {
        gameOver.t = min(gameOver.t + dt, 1);
    }
    let y1 = 910;
    let y2 = 450 - gameOver.h / 2;
    gameOver.y = lerp(y1, y2, ease.inOutCubic(gameOver.t));
}

gameOver.mousePressed = function () {
    if (gameOver.t === 1) {
        gameState = 'playing';
        window.setScore(game.player.score);
        gameOver.resetGame();
        gameOver.load();
        sfx.music.stop();
        window.setAppView('setScore');
    }
}

gameOver.draw = function () {
    push();

    // background rect
    fill(Koji.config.colors.gameOverRectangleColor);
    rect(targetWidth / 2 - gameOver.w / 2, gameOver.y, gameOver.w, gameOver.h);

    // game over text
    fill(Koji.config.colors.gameOverTextColor);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(Koji.config.strings.gameOverText, targetWidth / 2, gameOver.y + 44);

    // win / lose / tie
    textSize(32);
    if (game.player.score > game.opponent.score) {
        text(Koji.config.strings.winText, targetWidth / 2, gameOver.y + 120);
    } else if (game.player.score < game.opponent.score) {
        text(Koji.config.strings.loseText, targetWidth / 2, gameOver.y + 120);
    } else {
        text(Koji.config.strings.tieText, targetWidth / 2, gameOver.y + 120);
    }

    pop();
}
