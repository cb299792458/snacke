const Snake = require("./snake.js")
const Snack = require("./snack.js")
const Util = require("./util.js");
const Obstacle = require("./obstacle.js");
const Level = require("./levels.js");
const ANIMALS = [
    "beaver","cat","dog","fish","frog","lizard","monkey","pig",
    "rabbit","raccoon","rat","snail","squirrel","turtle","snake"
];
const OBSTACLES = ["fire","ice","log","rock","water","tornado"];

function Game(dimX,dimY){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.snacks = [];
    this.obstacles = [];
    this.lives = 5;
    this.level = 0;
    this.over = false;
    this.img = new Image();
    this.img.src = "grass.jpg";
    this.menu = ANIMALS.slice(0,14); //make a default menu
    this.paused = false;
    this.message = ""
    this.topLogs = [];
    this.bottomLogs = [];
    this.maxSnacks = 3;
    this.winLength = 100;
    this.snake = new Snake(this);

    this.startLevel();
}

Game.prototype.randomPos = function(rad){
    return [Math.random()*this.DIM_X,Math.random()*this.DIM_Y];
}

Game.prototype.allObjects = function(){
    return this.obstacles.concat([this.snake]).concat(this.snacks);
}

Game.prototype.startLevel = function(){
    this.snacks = [];
    this.obstacles = [];
    this.topLogs = [];
    this.bottomLogs = [];
    this.level++;
    while(this.snacks.length<this.maxSnacks){this.makeSnack()}

    new Level(this,this.level);
    this.snake.reset();

    this.drawBottomLogs = false;
    let that = this;
    setInterval( () => that.drawBottomLogs = true, 1500);
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
    if(type!="log"){
        this.obstacles.push( new Obstacle( pos, type ));
    } else if(pos[1]<this.DIM_Y/2){
        this.topLogs.push( new Obstacle( pos, type ));
    } else {
        this.bottomLogs.push( new Obstacle( pos, type ));
    }
}

Game.prototype.draw = function(context,info){
    context.drawImage(this.img,0,0);
    this.allObjects().forEach( (obj) => obj.draw(context) );
    if(this.snake.maxLength < this.winLength){
        this.topLogs.forEach( (obj) => obj.draw(context) );
    }
    if(this.drawBottomLogs){
        this.bottomLogs.forEach( (obj) => obj.draw(context) );
    }

    this.drawInfo(info);
    if(this.paused || this.over){
        context.textAlign = "center";
        context.fillStyle = "white";
        if(this.over){ context.fillStyle = "red"; }
        context.font = "96px serif";
        context.fillText(this.message,this.DIM_X/2,this.DIM_Y/2);
    }
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
    info.fillText(`Length: ${this.snake.maxLength} mm`, 10, 265);
    info.fillText(`Level: ${this.level}`, 10, 315);

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
    this.snake.move();
}

Game.prototype.step = function(){
    if(!this.over && !this.paused){
        this.moveObjects();
        this.checkCollisions();
    }
}

Game.prototype.checkCollisions = function(){
    let snake = this.snake;
    let game = this;
    if(snake.nextLevel()){
        this.startLevel();
        return;
        }
    if(snake.outOfBounds()){
        snake.hurt();
    }
    if(snake.selfBite()){
        this.lives--;
        snake.hurt();
    }

    // Check for eating
    this.snacks.forEach( function(snack){
        if(Util.hypotenuse(snack.pos,snake.pos)<snake.headRadius+snack.radius){
            snake.eat(snack);
            game.makeSnack();
        }
    });

    // Check for obstacles
    this.obstacles.forEach( function(obstacle){
        if(Util.hypotenuse(obstacle.pos,snake.pos)<snake.headRadius+obstacle.radius/2){
            snake.hit(obstacle);
        }
    })
}

Game.prototype.destroy = function(obj){
    this.snacks.splice(this.snacks.indexOf(obj),1);
}

Game.prototype.pause = function(){
    if(!this.paused){
        this.paused = true;
        this.message = "GAME PAUSED";
    } else { this.paused = false}
}

module.exports = Game;