function Shadows(id, width, height, downsampling, reserve) {

	this.downSampling = downsampling;

	var c = document.createElement("canvas");
	var visualWidth  = width  * reserve;
	var visualHeight = height * reserve;
	var realWidth  = 1.0 * visualWidth  / downsampling;
	var realHeight = 1.0 * visualHeight / downsampling;
	c.setAttribute("width",  realWidth  + "px");
	c.setAttribute("height", realHeight + "px");
	c.style.width  = visualWidth + "px";
	c.style.height = visualHeight + "px";
	c.style.position = "relative";
	c.style.left   = -(visualWidth  - width ) / 2 + "px";
	c.style.top    = -(visualHeight - height) / 2 + "px";
	document.getElementById(id).appendChild(c);
	c = c.getContext("2d");
	this.ctx = c;
	this.width  = realWidth;
	this.height = realHeight;
	this.scaleX = 1.0 * realWidth  / visualWidth;
	this.scaleY = 1.0 * realHeight / visualHeight;
	this.fadingSpeed = 0;
	
	this.fade = function() {
		this.ctx.save();
			this.ctx.globalCompositeOperation = "lighter";
			this.ctx.globalAlpha = shadows.fadingSpeed / FPS;
			this.ctx.fillStyle = "#000";
			this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.restore();
	};
	
	// Prepares canvas to be worked in sizes that was announced in constructor
	this.beginDrawLights = function() {
		this.ctx.save();
		this.ctx.globalCompositeOperation = "destination-out";
		this.ctx.globalAlpha = 1;
		this.ctx.fillStyle = "#fff";
		this.ctx.translate(shadows.width / 2, shadows.height / 2);
		this.ctx.scale(this.scaleX, this.scaleY);
	};
	
	this.endDrawLights = function() {
		this.ctx.restore();
	};
	
	
	this.centerX = 0;
	this.centerY = 0;
	//this.lastShiftX = 0;
	//this.lastShiftY = 0;
	this.centrify = function(x, y) {
		//this.lastShiftX = this.centerX / this.scaleX - x;
		//this.lastShiftY = this.centerY / this.scaleY - y;
		var a = this.ctx.getImageData(0, 0, this.width, this.height);
		this.ctx.fillRect(0, 0, this.width, this.height);
		var dx = Math.round(this.centerX - x * this.scaleX);
		var dy = Math.round(this.centerY - y * this.scaleY);
		if (SHADOWS_FIX) {
			var errorX = ((this.centerX - x * this.scaleX) - dx) * this.downSampling;
			var errorY = ((this.centerY - y * this.scaleY) - dy) * this.downSampling;
			this.ctx.canvas.style.setProperty("-webkit-transform", "translate(" + errorX + "px, " + errorY + "px)");
		}
		this.ctx.putImageData(a, dx, dy);
		this.centerX -= dx;
		this.centerY -= dy;
	};
	
	this.setAmbientLight = function(value) {
		this.ctx.canvas.style.opacity = 1 - value;
	};
	
};