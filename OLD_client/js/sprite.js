window.SPRITE_CHANGE_SPEED = 8;
window.SPRITE_SPEED = 18 * 8 / 1.75;

function Sprite(src, width, height, frames, speed) {
				
	this.image = new Image();
	this.image.src = src;
	//this.frames = this.image.width / width;
	this.frames = frames;
	this.width = width;
	this.height = height;
	
	this.draw = function(ctx) {
		var index = Math.round(new Date() * SPRITE_CHANGE_SPEED / 1000.0) % this.frames;
		ctx.save();
			ctx.scale(1 / SCALE, 1 / SCALE);
			ctx.drawImage(this.image,
				index * this.width, 0, this.width, this.height,
				-200 + (new Date() * SPRITE_SPEED / 1000.0) % 400 - this.width / 2, 42-this.height / 2, this.width * 2, this.height * 2
			);
		ctx.restore();
	};
	
}