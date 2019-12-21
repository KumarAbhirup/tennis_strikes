
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
        gameState = 'menu';
        gameOver.resetGame();
        gameOver.load();
        sfx.music.stop();
    }
}

gameOver.draw = function () {
    push();

    // background rect
    fill(9, 10, 49);
    rect(targetWidth / 2 - gameOver.w / 2, gameOver.y, gameOver.w, gameOver.h);

    // game over text
    fill(255, 217, 90);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('GAME OVER', targetWidth / 2, gameOver.y + 44);

    // win / lose / tie
    textSize(32);
    if (game.player.score > game.opponent.score) {
        text('YOU WON!', targetWidth / 2, gameOver.y + 120);
    } else if (game.player.score < game.opponent.score) {
        text('YOU LOST!', targetWidth / 2, gameOver.y + 120);
    } else {
        text('TIE!', targetWidth / 2, gameOver.y + 120);
    }

    pop();
}
