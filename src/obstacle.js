function Obstacle(pos,type){
    this.pos = pos;
    this.type = type;
    this.radius = 20;
    this.img = new Image();
    this.img.src = `./obstacles/${type}.png`;
}

Obstacle.prototype.draw = function(ctx){
    ctx.drawImage(this.img,this.pos[0]-this.radius,this.pos[1]-this.radius,this.radius*2,this.radius*2);
}

Obstacle.prototype.move = function(){}

module.exports = Obstacle;