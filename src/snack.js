function Snack(pos,type){
    this.pos = pos;
    this.type = type;
    this.color = 'red'
    this.radius = 30;
    this.img = new Image();
    this.img.src = `./emojis/${type}.png`;
}

Snack.prototype.draw = function(ctx){
    ctx.drawImage(this.img,
        this.pos[0]-this.radius,
        this.pos[1]-this.radius,
        this.radius*2,this.radius*2);
}

Snack.prototype.move = function(){}

module.exports = Snack;