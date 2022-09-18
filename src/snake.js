// const Game = require("./game.js");
const Util = require("./util.js");

function Snake(game){
    this.game = game;
    this.headRadius = 10;
    this.color = '#0BDA51';
    
    this.pos = [this.game.DIM_X/2,this.game.DIM_Y-this.headRadius];
    this.vel = [0,-1];
    this.speed = 8;
    this.body = [];
    this.maxLength = 100;
}

Snake.prototype.move = function(){
    this.body.unshift(this.pos.slice())
    if(this.body.length>this.maxLength){this.body.pop()}
    this.pos[0] += this.speed * this.vel[0];
    this.pos[1] += this.speed * this.vel[1];
}

Snake.prototype.draw = function(ctx){
    
    let angle = Util.direction(this.vel); 
    
    // Draw snake's head
    ctx.fillStyle = this.color;
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
    if(this.game.over){ // X-eyes
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
        this.vel = newVel;
    }
}

Snake.prototype.outOfBounds = function(){
    // if(this.pos[0]<this.headRadius ||
    //     this.pos[1]<this.headRadius ||
    //     this.pos[0]>this.game.DIM_X-this.headRadius ||
    //     this.pos[1]>this.game.DIM_Y-this.headRadius){
    //         return true;
    //     }
    // return false;
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
    this.maxLength += 20;
    this.game.destroy(snack);
}

module.exports = Snake;