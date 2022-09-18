const Game = require("./game.js");
const Snake = require("./snake.js");

function GameView(game,ctx){
    this.game = game;
    this.ctx = ctx;
    this.snake;
    const boundDraw = this.game.draw.bind(this.game)

}

GameView.prototype.start = function(){
    let that = this;
    const drawInt = setInterval(that.game.draw.bind(that.game,that.ctx),30);
    const stepInt = setInterval(that.game.step.bind(that.game),30);
    this.bindKeyHandlers();

    const img = new Image();
    img.onload = function() {
        context.drawImage(img, 0, 0);
    };
    img.src = "grass_background.png";
}



GameView.prototype.bindKeyHandlers = function(){
    this.snake = this.game.snake;

    key('w', () => { this.snake.turn([0,-1]) });
    key('a', () => { this.snake.turn([-1,0]) });
    key('s', () => { this.snake.turn([0,+1]) });
    key('d', () => { this.snake.turn([+1,0]) });
    key('up', () => { this.snake.turn([0,-1]) });
    key('left', () => { this.snake.turn([-1,0]) });
    key('down', () => { this.snake.turn([0,+1]) });
    key('right', () => { this.snake.turn([+1,0]) });
    key('esc', () => { alert('GAME PAUSED')});
}


module.exports = GameView;