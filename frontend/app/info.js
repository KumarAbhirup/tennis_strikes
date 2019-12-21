
var info = {};

info.load = function () {
    info.t = 0;
}

info.update = function (dt) {
    info.t += dt;
}

info.draw = function () {
    if (info.t < 5) {
        let y1 = 910;
        let y2 = 650;
        let y = y1;
        if (info.t < 4) {
            y = lerp(y1, y2, ease.outCubic(min(info.t, 1)));
        } else {
            y = lerp(y2, y1, ease.inCubic(info.t - 4));
        }
        let img = touchUsed ? gfx.infoTouch : gfx.info;
        image(img, targetWidth / 2 - img.width / 2, y);
    }
}
