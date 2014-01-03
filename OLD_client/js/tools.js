function max(a, b) { return (a > b) ? a : b; }
function min(a, b) { return (a < b) ? a : b; }
Math.DOUBLE_PI = Math.PI * 2;

/*Array.__proto__.clearByID = function() {
	if ((this.id) && typeof(this.id) == Array) {
	for (var i = 0; i < this.id.length; i++) {
		delete this[this.id[i]];
	}
	this.id.splice(0, this.id.length);
};*/

// Images loader
function ImagesLoader() {
	this.list = [];
	this.add = function(obj) {
		this.list.push(obj);
	};
	this.completed = function() {
		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].complete == false)
				return false;
		}
		return true;
	};
}

// BackgroundsManager
function BackgroundsManager(fov) {
	this.__proto__ = [];
	// FIXME: add fov and scale support, remove direct reference to width / height
	/*if (fov == undefined) {
		fov = ???;
	}*/
	this.add = function(width, height, depth) {
		var c = document.createElement("canvas");
		c.setAttribute("width",  width  + "px");
		c.setAttribute("height", height + "px");
		c.style.zIndex = -depth;
		document.getElementById("backgroundsContainer").appendChild(c);
		c = c.getContext("2d");
		c.width = width;
		c.height = height;
		c.depth = depth;
		this.push(c);
	};
	this.removeAll = function() {
		// FIXME
	};
	this.updateParallax = function(camx, camy) {
		for (var i = 0; i < this.length; i++) {
			this[i].canvas.style.setProperty("-webkit-transform", "translate(" + 
				(-camx / this[i].depth - (this[i].width  - width ) >> 1) + "px, " +
				(-camy / this[i].depth - (this[i].height - height) >> 1) + "px)"
			);
			//this[i].canvas.style.left = (((-camx / this[i].depth - (this[i].width  - width ) >> 1) | 0)) + "px";
			//this[i].canvas.style.top  = (((-camy / this[i].depth - (this[i].height - height) >> 1) | 0)) + "px";
		}
	};
	/*this.scale = function(value) {
		for (var i = 0; i < this.length; i++) {
			this[i].canvas.style.width  = ((this[i].width  * value) | 0) + "px";
			this[i].canvas.style.height = ((this[i].height * value) | 0) + "px";
		}
	};*/
}