
var gfx = {};
var sfx = {};

var targetWidth = 1600;
var targetHeight = 900;
var scaleFactor;
var fullX, fullY, fullW, fullH;
var scaledMouseX, scaledMouseY;
var defaultVolume = 0.5;
var uiPressed = false;
var gameState = 'playing';
var gameTime = 0;
var fixedDt = 1 / 60;
var dtTimer = 0;
var touchUsed = false;
var touchIsPressed = false;
var touchTimer = 1; // disable mouse if touch use in last 0.5s

var game;
var countdownTimer = 3;

function preload() {
    gfx.speaker = loadImage(Koji.config.images.sound);
    gfx.speakerMute = loadImage(Koji.config.images.soundMute);
    gfx.info = loadImage(Koji.config.images.infoDesktop);
    gfx.infoTouch = loadImage(Koji.config.images.infoMobile);
    gfx.player = loadImage(Koji.config.strings.players.user.playerImage);
    gfx.playerHit = loadImage(Koji.config.strings.players.user.playerImageWhenHitting);
    gfx.opponent = loadImage(Koji.config.strings.players.computer.playerImage);
    gfx.opponentHit = loadImage(Koji.config.strings.players.computer.playerImageWhenHitting);
    gfx.ball = loadImage(Koji.config.images.ball);
    gfx.grass = loadImage(Koji.config.images.lawnBackground);
    gfx.netShadow = loadImage(Koji.config.images.netShadow);
    gfx.logo1 = loadImage(Koji.config.images.sponsorship.sponsor1);
    gfx.logo2 = loadImage(Koji.config.images.sponsorship.sponsor2);
    gfx.audience = loadImage(Koji.config.images.audience);
    gfx.referee = loadImage(Koji.config.images.referee);
    gfx.wallPickup = loadImage(Koji.config.images.wallPickup);

    sfx.music = loadSound(Koji.config.sounds.backgroundMusic);
    sfx.music.setLoop(true);
    sfx.music.setVolume(0.5);
    sfx.boo = loadSound(Koji.config.sounds.boo);
    sfx.clap = loadSound(Koji.config.sounds.clap);
    sfx.impact = loadSound(Koji.config.sounds.impact);

    masterVolume(defaultVolume);
}

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);

    strokeJoin(ROUND);
    scaleFactor = min(width / targetWidth, height / targetHeight);
    fullW = width / scaleFactor;
    fullH = height / scaleFactor;
    fullX = targetWidth / 2 - fullW / 2;
    fullY = targetHeight / 2 - fullH / 2;

    menu.load();
    volume.load();
    info.load();
    gameOver.load();

    game = new Game();
    game.load();

    cam.x = targetWidth / 2;
    cam.y = targetHeight / 2;

    sfx.music.play()
}

function update() {
    document.body.style.cursor = 'default';
    scaledMouseX = (mouseX - width / 2) / scaleFactor + targetWidth / 2;
    scaledMouseY = (mouseY - height / 2) / scaleFactor + targetHeight / 2;
    
    let dt = min(1 / frameRate(), 1 / 10);
    dtTimer += dt;
    while (dtTimer > 0) {
        dtTimer -= fixedDt;
        fixedUpdate(fixedDt);
    }

    if (touchIsPressed) {
        touchTimer = 0;
    } else {
        touchTimer += dt;
    }
}

function fixedUpdate(dt) {
    switch (gameState) {
        case 'menu':
            menu.update(dt);
            volume.update(dt);
            break;
        case 'playing':
            volume.update(dt);
            info.update(dt);
            countdownTimer -= dt;
            if (countdownTimer < 0) {
                gameTime += dt;
                game.update(dt);
            }
            break;
        case 'gameOver':
            volume.update(dt);
            info.update(dt);
            gameOver.update(dt);
            break;
    }
}

function pressed() {
    switch (gameState) {
        case 'menu':
            menu.mousePressed();
            volume.mousePressed();
            break;
        case 'playing':
            volume.mousePressed();
            if (!uiPressed && countdownTimer < 0) {
                game.mousePressed();
            }
            break;
        case 'gameOver':
            volume.mousePressed();
            if (!uiPressed) {
                gameOver.mousePressed();
            }
            break;
    }
}
function released() {
    switch (gameState) {
        case 'playing':
            if (!uiPressed && countdownTimer < 0) {
                game.mouseReleased();
            }
            break;
    }
    uiPressed = false;
}

function mousePressed() {
    if (touchTimer > 0.5) {
        pressed();
    }
}
function touchStarted() {
    if (touches.length === 1) {
        touchUsed = true;
        touchIsPressed = true;
        mouseX = touches[0].x;
        mouseY = touches[0].y;
        scaledMouseX = (mouseX - width / 2) / scaleFactor + targetWidth / 2;
        scaledMouseY = (mouseY - height / 2) / scaleFactor + targetHeight / 2;
        pressed();
    }
}

function mouseReleased() {
    if (touchTimer > 0.5) {
        released();
    }
}
function touchEnded() {
    if (touches.length === 0) {
        touchIsPressed = false;
        released();
    }
}

function mouseDragged() { }
function touchMoved() {
    switch (gameState) {
        case 'playing':
            if (!uiPressed && countdownTimer < 0) {
                game.touchMoved();
            }
            break;
    }
}

function draw() {
    update();
    noStroke();

    push();
    translate(width / 2, height / 2);
    scale(scaleFactor, scaleFactor);
    translate(-targetWidth / 2, -targetHeight / 2);

    background('#1F1F1F');

    switch (gameState) {
        case 'menu':
            menu.draw();
            break;
        case 'playing':
        case 'gameOver':
            cam.set();

            game.draw();

            cam.reset();

            // countdown
            if (countdownTimer >= 0) {
                fill(Koji.config.colors.gameCountdownColor);
                textSize(lerp(64, 96, ease.outCubic(utils.pingPong(countdownTimer * 2))));
                textAlign(CENTER, CENTER);
                text(floor(countdownTimer) + 1, targetWidth / 2, targetHeight / 2);
            }

            if (gameState === 'gameOver') {
                gameOver.draw();
            }
            
            info.draw();
            break;
    }

    // cover top/bottom off-screen graphics
    fill('#1F1F1F');
    rect(fullX, fullY, fullW, 0 - fullY);
    rect(fullX, targetHeight, fullW, fullY + fullH - targetHeight);
    // cover sides
    rect(fullX, fullY, 0 - fullX, fullH);
    rect(targetWidth, fullY, fullX + fullW - targetWidth, fullH);

    volume.draw();

    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    scaleFactor = min(width / targetWidth, height / targetHeight);
    fullW = width / scaleFactor;
    fullH = height / scaleFactor;
    fullX = targetWidth / 2 - fullW / 2;
    fullY = targetHeight / 2 - fullH / 2;
}
