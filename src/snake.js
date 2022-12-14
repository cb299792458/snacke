// const Game = require("./game.js");
const Util = require("./util.js");
const ANIMALS = [
    "beaver","cat","dog","fish","frog","lizard","monkey","pig",
    "rabbit","raccoon","rat","snail","squirrel","turtle","snake"
];
const REWARDS = [
    "cat","dog","squirrel","raccoon"
]

function Snake(game){
    this.game = game;
    this.headRadius = 20;
    this.color = '#0BDA51';
    this.color = '#549D00';
    this.sound = new Audio('nom.mp3');
    this.reset();
}

Snake.prototype.reset = function(){
    this.pos = [this.game.DIM_X/2,this.game.DIM_Y-50];
    this.vel = [0,-1];
    this.speed = 8;
    this.body = [];
    this.maxLength = 40;
    this.stomach = [];
    this.stomachSize = 8;
    this.invincible = false;
    this.powers = [];
    this.usedTurtle = false;
}

Snake.prototype.move = function(){
    this.body.unshift(this.pos.slice())
    if(this.body.length>=this.maxLength){this.body.pop()}
    this.pos[0] += this.speed * this.vel[0];
    this.pos[1] += this.speed * this.vel[1];
}

Snake.prototype.draw = function(ctx){
    
    let angle = Util.direction(this.vel); 
    
    // Draw snake's head
    if(this.invincible && Math.random() > 0.5){
        ctx.fillStyle = 'orange';
    } else if(this.frozen){
        ctx.fillStyle = '#ADD8E6';
    } else{
        ctx.fillStyle = this.color;
    }


    ctx.beginPath();
    ctx.arc(this.pos[0],this.pos[1],this.headRadius, angle+.3, angle + 3.5, false);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.pos[0],this.pos[1],this.headRadius, angle-.3, angle - 3.5, true);
    ctx.closePath();
    ctx.fill();
    
    // Draw snake's body
    let bodyRadius = this.headRadius/1.5;
    this.body.forEach( function(pos) {
        ctx.beginPath();
        ctx.arc(pos[0],pos[1],bodyRadius, 0, 6.28, false);
        ctx.closePath();
        ctx.fill();
    });

    // Draw snake's eye(s)
    ctx.fillStyle = 'black'

    let eyePos = this.pos.slice();
    if(Util.direction(this.vel) === 0){
        eyePos[0] += this.headRadius*this.vel[1]/2;
        eyePos[1] -= Math.abs(this.headRadius*this.vel[0]/2);
    } else {
        eyePos[0] += this.headRadius*this.vel[1]/2;// Offset eyes perpendicular
        eyePos[1] += this.headRadius*this.vel[0]/2;// to motion of snake.
    }
    if(this.game.over === "died"){ // X-eyes
        ctx.beginPath();
        ctx.moveTo(eyePos[0]+5, eyePos[1]+5);
        ctx.lineTo(eyePos[0]-5, eyePos[1]-5);
        ctx.stroke();  // X-eyes
        ctx.beginPath();
        ctx.moveTo(eyePos[0]-5, eyePos[1]+5);
        ctx.lineTo(eyePos[0]+5, eyePos[1]-5);
        ctx.stroke(); 
    } else { // regular eyes
        ctx.beginPath();
        ctx.arc(eyePos[0], eyePos[1], 2.5, 0, 6.28, false);
        ctx.closePath();
        ctx.fill();
    }
    
}

Snake.prototype.turn = function(newVel){
    if(JSON.stringify(Util.scale(newVel,-1)) != JSON.stringify(this.vel)){
        if(!this.frozen){this.vel = newVel;}
    }
}

Snake.prototype.outOfBounds = function(){
    return Util.outOfBounds(this.pos,this.game,this.headRadius)
}

Snake.prototype.selfBite = function(){
    let result = false;
    let headPos = this.pos;
    let speed = this.speed
    this.body.forEach( function(pos){
        if(Util.hypotenuse(pos,headPos)<speed){
            result = true;
        }
    })
    return result;
}

Snake.prototype.eat = function(snack){
    this.sound.play();
    this.maxLength += 20;
    this.game.score += 100*this.game.level
    this.stomach.unshift(snack.type);
    if(this.stomach.length>this.stomachSize){this.stomach.pop()};
    this.game.destroy(snack);
    this.checkPowers();
}

Snake.prototype.checkPowers = function(){
    let that = this;
    let powers = this.powers;
    let numRequired = 3;
    if(powers.includes("rabbit")){
        numRequired = 2;
    }
    
    let carryOver = []; //Keep rewards
    REWARDS.forEach( function(animal){
        if(powers.includes(animal)){
            carryOver.push(animal);
        }
    });

    powers = carryOver; //Add powers based on stomach
    ANIMALS.forEach( function(animal) {
        if(that.stomachContains(animal,numRequired) && !powers.includes(animal)){
            powers.push(animal);
        }
    });

    this.powers = powers;
    if(powers.includes("pig")){
        this.stomachSize = 16;
    } else {
        this.stomachSize = 8;
    }
    if(this.usedTurtle){ //prevent infinite turtle
        this.powers.splice(this.powers.indexOf("turtle"),1);
    }
    
}


Snake.prototype.stomachContains = function(animal,num){
    let count = 0;
    this.stomach.forEach( function(element){
        if(animal===element){count++;}
    });
    return count>=num;
}

Snake.prototype.hurt = function(selfbit){
    if(!this.invincible){
        if(!this.powers.includes("turtle")){
            if(selfbit){this.game.lives--;}
            this.game.lives--;
        } else  {
            this.usedTurtle = true;
        }
        this.powers.splice(this.powers.indexOf("turtle",1));

        this.invincible = true;
        let that = this;
        setTimeout( function(){ that.invincible = false;}, 1500)
    }
    if(this.game.lives <= 0){
        this.game.end();
        this.game.over = "died";
        this.game.message = "YOU DIED"
    }
}

Snake.prototype.nextLevel = function(){
    return this.maxLength >= this.game.winLength &&
    this.pos[0] > this.game.DIM_X/2-50 &&
    this.pos[0] < this.game.DIM_X/2+50 &&
    this.pos[1] < 20;
}

Snake.prototype.hit = function(obstacle){
    if(obstacle.type==="water"||obstacle.type==="fire"){
        this.hurt();
    }
    if(obstacle.type==="ice"){
        this.frozen = true;
        let that = this;
        clearTimeout(this.frozenTime);
        this.frozenTime = setTimeout( () => {
            that.frozen = false;
        }, 100);
    }
    if(obstacle.type==="tornado"){
        const vels = [[1,0],[-1,0],[0,1],[0,-1]]
        if(!this.tornadoProof){
            if(this.vel[0]===0){
                this.vel = vels[Math.floor(2*Math.random())];
            } else if(this.vel[1]===0){
                this.vel = vels[Math.floor(2+2*Math.random())];
            }
            this.tornadoProof = true;
            let that = this;
            clearTimeout(this.tornadoTime);
            this.tornadoTime = setTimeout( () => {
                that.tornadoProof = false;
            }, 800);
        }
    }
}

module.exports = Snake;