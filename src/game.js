const Snake = require("./snake.js")
const Snack = require("./snack.js")

function Game(dimX,dimY){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.snake = new Snake(this);
    this.snacks = [];
    this.over = false;
}

Game.prototype.allObjects = function(){
    return [this.snake];
}

Game.prototype.draw = function(context){
    // context.clearRect(0,0,this.DIM_X,this.DIM_Y);
    context.fillStyle = 'gray';
    context.fillRect(0,0,this.DIM_X,this.DIM_Y);

    this.allObjects().forEach( (obj) => obj.draw(context) );
}

Game.prototype.moveObjects = function(){
    this.allObjects().forEach(element => {
        element.move();
    });
}

Game.prototype.step = function(){
    if(!this.over){
        this.moveObjects();
        this.checkCollisions();
    }
}

Game.prototype.checkCollisions = function(){
    if(this.snake.outOfBounds()){
        this.over = true;
    }
    if(this.snake.selfBite()){
        this.over = true;
    }
}

module.exports = Game;