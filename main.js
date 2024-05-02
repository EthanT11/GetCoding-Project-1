// init canvas
var canvas = document.getElementById('main-canvas');
var ctx = canvas.getContext("2d");

canvas.width = innerWidth
canvas.height = innerHeight

// init player
class Player {
    constructor(x, y, colour) {
        this.x = x
        this.y = y
        this.colour = colour
    }
}