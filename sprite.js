function Srite(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;


    this.draw = function(xCanvas, yCanvas) {
        ctx.drawImage(img, this.x, this.y, this.width, this.height, xCanvas, yCanvas, this.width, this.height);

    }
}

var bg = new Sprite(0, 0, 600, 600),
spriteCharacter = new Sprite()