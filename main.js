// init canvas
var canvas = document.getElementById('main-canvas');
var ctx = canvas.getContext("2d");

canvas.width = innerWidth
canvas.height = innerHeight

var playerX = canvas.width / 2
var playerY = canvas.height / 1.5
var enemyX = canvas.width / 2
var enemyY = canvas.height / 3.5
var actionX = canvas.width - canvas.width + 20
var actionY = canvas.height / 2

// init player
class Player {
    constructor(x, y, radius, colour) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
    };

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour
        ctx.fill()
    };

    drawText() {
        ctx.font = "30px Arial"
        ctx.fillText("Player name", this.x - 87, this.y + 100)
    }
};

class Enemy {
    constructor(x, y, radius, colour) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
    };

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour
        ctx.fill()
    };

    drawText() {
        ctx.font = "30px Arial"
        ctx.fillText("Enemy name", this.x - 87, this.y + 100)
    }
};

class Action {
    constructor(x, y, colour) {
        this.x = x
        this.y = y
        this.colour = colour
    };

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, 150, 100);
        ctx.fillStyle = this.colour
        ctx.fill();
    }

    drawText() {
        ctx.font = "30px Arial"
        ctx.fillText("Action name", this.x - 10, this.y + 130)
    }
};

var player = new Player(playerX, playerY, 50, 'black');
var enemy = new Enemy(enemyX, enemyY, 50, 'red')
var action = new Action(actionX, actionY, "purple")

player.draw();
player.drawText();
enemy.draw();
enemy.drawText();
action.draw();
action.drawText();

console.log(player);
console.log(enemy);
console.log(action);
console.log(canvas.width)
console.log(canvas.height)