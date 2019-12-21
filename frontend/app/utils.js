
var utils = {
    mouseInRect: function (r) {
        return scaledMouseX > r.x && scaledMouseX < r.x + r.w && scaledMouseY > r.y && scaledMouseY < r.y + r.h;
    },
    hash: function (x, y) {
        return abs(sin(x * 12.9898 + y * 4.1414) * 43758.5453) % 1;
    },
    pingPong: function(t) {
        t = abs(t);
        return t % 2 < 1 ? t % 1 : 1 - t % 1;
    }
}

var ease = {
    inQuad: function (t) { return t * t },
    outQuad: function (t) { return t * (2 - t) },
    inOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    inCubic: function (t) { return t * t * t },
    outCubic: function (t) { return (--t) * t * t + 1 },
    inOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    inQuart: function (t) { return t * t * t * t },
    outQuart: function (t) { return 1 - (--t) * t * t * t },
    inOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    inQuint: function (t) { return t * t * t * t * t },
    outQuint: function (t) { return 1 + (--t) * t * t * t * t },
    inOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
};
