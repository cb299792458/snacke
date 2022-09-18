function Snack(pos,type){
    this.pos = pos;
    this.type = type;
    this.color = 'red'
    this.radius = 100;
}

Snack.prototype.draw = function(ctx){
    // console.log(`There's a snack at ${this.pos}`)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0],this.pos[1],this.radius, 0, 6.28, false);
    ctx.closePath();
    ctx.fill();
}

Snack.prototype.move = function(){}

module.exports = Snack;