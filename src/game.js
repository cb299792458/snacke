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
const blurbs = {
    "rat": "more snacks spawn",
    "fish": "swim through water",
    "turtle": "block damage once",
    "pig": "hold more snacks",
    "cat": "extra life",
    "dog": "bonus points",
    "rabbit": "easier bonuses"
}

function Game(dimX,dimY){
    this.DIM_X = dimX;
    this.DIM_Y = dimY;
    this.snacks = [];
    this.obstacles = [];
    this.obstacleIcons = [];
    this.lives = 5;
    this.level = 0;
    this.over = "no";
    this.img = new Image();
    this.img.src = "grass.jpg";
    this.win = new Image();
    this.win.src = "win.png";
    this.menu = ["rat","fish","turtle","pig","cat","dog","rabbit"];
    this.paused = true;
    this.message = "SSPACE TO SSTART"
    this.topLogs = [];
    this.bottomLogs = [];
    this.maxSnacks = 3;
    this.winLength = 200;
    this.score = 0;
    this.winMusic = new Audio('win.mp3');
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
    this.levelCleanUp();
    this.snake.reset();
    
    this.drawBottomLogs = false;
    let that = this;
    setTimeout( () => that.drawBottomLogs = true, 1500);
}

Game.prototype.levelCleanUp = function(){
    const powers = this.snake.powers;
    if(powers.includes("cat")){ this.lives++; }
    if(powers.includes("dog")){ this.score += 1000*this.level; }
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

Game.prototype.end = function(){
    let name = prompt("Add your name to the Hall of Fame?");
    this.sendScore([this.score,name]);
    // this.level++;
    // this.message ="Congratulations!";

    setTimeout(()=>{
        location.reload();
    },"3000");
}

Game.prototype.draw = function(context,info){
    if(this.over==="no"){
        
        if(this.level===6){
            this.winMusic.play();
            this.score += 5000;
            this.over = "won";
            context.drawImage(this.win,0,0);
            this.end();
            return;
        }

        context.drawImage(this.img,0,0);
        this.allObjects().forEach( (obj) => obj.draw(context) );
        if(this.snake.maxLength < this.winLength){
            this.topLogs.forEach( (obj) => obj.draw(context) );
        }
        if(this.drawBottomLogs){
            this.bottomLogs.forEach( (obj) => obj.draw(context) );
        }
        
        this.drawInfo(info);
    }
    if(this.paused || this.over === "died"){
        context.textAlign = "center";
        context.fillStyle = "white";
        if(this.over === "died"){ 
            // this.end();
            context.fillStyle = "red"; 
        }
        context.font = "96px serif";
        context.fillText(this.message,this.DIM_X/2,this.DIM_Y/2);
    }
}

Game.prototype.drawInfo = function(info){
    const icons = this.setIcons();
    info.fillStyle = '#FEFEE2';
    info.fillRect(0,0,400,600);
    info.fillStyle = '#80c27d';
    info.font = '24px Caveat Brush';
    info.fillText(`Level: ${this.level}`, 10, 30);
    info.fillText(`Score: ${this.score}`, 10, 60);
    info.fillText(`Length: ${this.snake.maxLength/10} m / ${this.winLength/10} m (for next level)`, 10, 90);

    info.fillText('Lives:', 10, 120);
    for(let i=0;i<this.lives;i++){
        info.drawImage(icons["snake"],10+(35*i),130,30,30);
    }

    info.fillText('Snacks (eat these):', 10, 210);
    for(let i=0;i<this.menu.length && i <9;i++){
        info.drawImage(icons[this.menu[i]],10+(35*i),220,30,30);
    }
    // for(let i=9;i<this.menu.length && i<16;i++){
        // info.drawImage(icons[this.menu[i]],10+(35*(i-9)),280,30,30);
    // }

    info.fillText('Obstacles (avoid):', 10, 300);
    for(let i=0;i<OBSTACLES.length && i <9;i++){
        info.drawImage(icons[OBSTACLES[i]],10+(35*i),310,30,30);
    }
    // console.log(this.obstacles);

    info.fillText(`Stomach:`, 10, 390);
    for(let i=0;i<this.snake.stomach.length && i <8;i++){
        info.drawImage(icons[this.snake.stomach[i]],10+(35*i),400,30,30);
    }
    for(let i=8;i<this.snake.stomach.length && i<16;i++){
        info.drawImage(icons[this.snake.stomach[i]],10+(35*(i-8)),430,30,30);
    }

    info.fillText(`Powers:`, 10, 480);
    for(let i=0;i<this.snake.powers.length;i++){
        info.drawImage(icons[this.snake.powers[i]],10,490+(30*i),30,30);
        info.fillText(blurbs[this.snake.powers[i]],50,520+(30*i));
    }
}

Game.prototype.setIcons = function(){
    let icons = {}
    ANIMALS.forEach( function(animal) {
        icons[animal] = new Image();
        icons[animal].src = `./emojis/${animal}.png`;
    });
    OBSTACLES.forEach( function(obstacle) {
        icons[obstacle] = new Image();
        icons[obstacle].src = `./obstacles/${obstacle}.png`;
    });
    return icons;
}

Game.prototype.moveObjects = function(){
    this.snake.move();
}

Game.prototype.step = function(){
    if(this.over === "no" && !this.paused){
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
        snake.hurt(true);
    }

    // Check for eating
    this.snacks.forEach( function(snack){
        if(Util.hypotenuse(snack.pos,snake.pos)<snake.headRadius+snack.radius){
            snake.eat(snack);
        }
        if(game.snacks.length < game.maxSnacks || 
            (game.snake.powers.includes("rat") && game.snacks.length < game.maxSnacks + 2)){
                game.makeSnack();
        }
    });

    // Check for obstacles
    this.obstacles.forEach( function(obstacle){
        if(Util.hypotenuse(obstacle.pos,snake.pos)<snake.headRadius+obstacle.radius/2){
            if(obstacle.type==="water" && snake.powers.includes("fish")){
                
            } else {
                snake.hit(obstacle);
            }
        }
    })
}

Game.prototype.destroy = function(obj){
    this.snacks.splice(this.snacks.indexOf(obj),1);
}

Game.prototype.pause = function(){
    if(!this.paused && this.over==="no"){
        this.paused = true;
        this.message = "GAME PAUSED";
    } else { this.paused = false}
}

Game.prototype.makeHighScoreTable = async function(){
    let that = this;
    let arr = await this.getScore()
    this.scores = arr.slice();
    
    let sorted = this.scores.sort( function(a,b){
        return b["data"][0] - a["data"][0];
    });

    const table = document.getElementById("high-scores")
    for(let i=0;i<10;i++){
        if(sorted[i]){
            const row = document.createElement("tr");
            const name = document.createElement("td");
            const score = document.createElement("td");
            const nameText = document.createTextNode(sorted[i]["data"][1] || "A Sneaky Snake");
            const scoreText = document.createTextNode(sorted[i]["data"][0]);
            name.appendChild(nameText);
            score.appendChild(scoreText);
            row.appendChild(name);
            row.appendChild(score);
            table.appendChild(row);
        }
    }
}

module.exports = Game;