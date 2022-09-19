const Snake = require("./snake.js")
const Snack = require("./snack.js")
const Util = require("./util.js");
const Obstacle = require("./obstacle.js");
const Level = require("./levels.js");
const ANIMALS = [
    "beaver","cat","dog","fish","frog","lizard","monkey","pig",
    "rabbit","raccoon","rat","snail","squirrel","turtle","snake"
];
const OBSTACLES = ["fire","ice","log","rock","water"];

function Game(dimX,dimY){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.snake = new Snake(this);
    this.snacks = [];
    this.obstacles = [];
    this.lives = 3;
    this.level = 1;
    this.over = false;
    this.img = new Image();
    this.img.src = "grass_background.png";
    this.menu = ANIMALS.slice(); //make a default menu

    new Level(this,1);
    this.makeSnack();
}

Game.prototype.randomPos = function(rad){
    return [Math.random()*this.DIM_X,Math.random()*this.DIM_Y];
}

Game.prototype.allObjects = function(){
    return [this.snake].concat(this.snacks).concat(this.obstacles);
}

Game.prototype.makeSnack = function(){
    let animal = this.menu[Math.floor(this.menu.length*Math.random())];
    let newSnack = new Snack([0,0],animal);
    while( Util.outOfBounds(newSnack.pos,this,newSnack.radius) ){
        newSnack.pos = this.randomPos(newSnack.rad);
    }
    this.snacks.push( newSnack );
}

Game.prototype.makeObstacle = function(pos,type){
    this.obstacles.push( new Obstacle( pos, type ));
}

Game.prototype.draw = function(context,info){
    context.drawImage(this.img,0,0);
    this.allObjects().forEach( (obj) => obj.draw(context) );

    this.drawInfo(info);
}

Game.prototype.drawInfo = function(info){
    const icons = this.setIcons();
    info.fillStyle = 'gray';
    info.fillRect(0,0,400,600);
    info.fillStyle = 'black';
    info.font = '24px serif';
    info.fillText('Lives:', 10, 25);
    for(let i=0;i<this.lives;i++){
        info.drawImage(icons["snake"],70+(35*i),2.5,30,30);
    }
    info.fillText(`Length: ${this.snake.maxLength} mm`, 10, 50);
    info.fillText('Menu:', 10, 75);
    for(let i=0;i<this.menu.length && i <9;i++){
        info.drawImage(icons[this.menu[i]],75+(35*i),52.5,30,30);
    }
    for(let i=9;i<this.menu.length && i<16;i++){
        info.drawImage(icons[this.menu[i]],75+(35*(i-9)),82.5,30,30);
    }
    info.fillText(`Stomach:`, 10, 145);
    for(let i=0;i<this.snake.stomach.length && i <8;i++){
        info.drawImage(icons[this.snake.stomach[i]],100+(35*i),122.5,30,30);
    }
    for(let i=8;i<this.snake.stomach.length && i<16;i++){
        info.drawImage(icons[this.snake.stomach[i]],100+(35*(i-8)),152.5,30,30);
    }
    info.fillText(`Powers:`, 10, 215);

}

Game.prototype.setIcons = function(){
    let icons = {}
    ANIMALS.forEach( function(animal) {
        icons[animal] = new Image();
        icons[animal].src = `./emojis/${animal}.png`;
    });
    return icons;
}

Game.prototype.moveObjects = function(){
    // this.allObjects().forEach(element => {
    //     element.move();
    // });
    this.snake.move();
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
        if(Util.hypotenuse(snack.pos,snake.pos)<snake.headRadius+snack.radius){
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