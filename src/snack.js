function Snack(pos,type){
    this.pos = pos;
    this.type = type;
    this.color = 'red'
    this.radius = 30;
    this.img = new Image();
    this.img.src = `./emojis/${type}.png`;
}

Snack.prototype.draw = function(ctx){
    // ctx.fillStyle = this.color;
    // ctx.beginPath();
    // ctx.arc(this.pos[0],this.pos[1],this.radius, 0, 6.28, false);
    // ctx.closePath();
    // ctx.fill();

    ctx.drawImage(this.img,this.pos[0]-this.radius,this.pos[1]-this.radius,this.radius*2,this.radius*2);

}

Snack.prototype.move = function(){}

module.exports = Snack;