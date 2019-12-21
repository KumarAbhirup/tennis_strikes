
var menu = {};

menu.load = function () {
    menu.state = 'main';
    menu.playButton = {
        y: 500,
        w: 240,
        h: 80
    }
    menu.playButton.x = targetWidth / 2 - menu.playButton.w / 2;
}

menu.update = function (dt) {
    menu.playButton.x = targetWidth / 2 - menu.playButton.w / 2;
    if (utils.mouseInRect(menu.playButton) && touchTimer > 0.5) {
        document.body.style.cursor = 'pointer';
    }
}

menu.mousePressed = function () {
    if (utils.mouseInRect(menu.playButton)) {
        gameState = 'playing';
        sfx.music.play();
        uiPressed = true;
    }
}

menu.draw = function () {
    push();

    background(9, 10, 49);

    // title
    fill(255, 217, 90);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('Tennis Fury', targetWidth / 2, 160);

    // play button
    if (utils.mouseInRect(menu.playButton)) {
        fill(225, 187, 60);
    }
    let btn = menu.playButton;
    rect(targetWidth / 2 - btn.w / 2, btn.y, btn.w, btn.h, 10);
    fill(9, 10, 49);
    textSize(32);
    text('PLAY NOW', targetWidth / 2, 544);

    pop();
}
