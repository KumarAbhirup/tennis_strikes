
var cam = { x: 0, y: 0, scale: 1 };

cam.set = function () {
    push();
    translate(targetWidth / 2, targetHeight / 2);
    scale(cam.scale);
    translate(-cam.x, -cam.y);
}

cam.reset = function () {
    pop();
}
