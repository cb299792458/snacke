const Snake = require("./snake.js")
const Snack = require("./snack.js")
const Util = require("./util.js")

function Game(dimX,dimY){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.snake = new Snake(this);
    this.snacks = [];
    this.over = false;

    this.makeSnack();
}

Game.prototype.randomPos = function(){
    return[Math.random()*this.DIM_X,Math.random()*this.DIM_Y]
}

Game.prototype.allObjects = function(){
    return [this.snake].concat(this.snacks);
}

Game.prototype.makeSnack = function(){
    this.snacks.push( new Snack(this.randomPos(),"apple" ));
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

    // Check for eating
    let snake = this.snake;
    let game = this;
    this.snacks.forEach( function(snack){
        if(Util.hypotenuse(snack.pos,snake.pos)<snake.headRadius*2){
            snake.eat(snack);
            game.makeSnack();
        }
    });
}

Game.prototype.destroy = function(obj){
    // This should find the object and remove it from the array
    this.snacks = [];
}

module.exports = Game;