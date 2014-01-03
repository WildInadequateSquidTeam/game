function GraphicalInput(width, height) {
	
	var result = document.createElement("canvas");

// public
	
	result.getData = function() {
		var result = [];
		for (var i = 0; i < this.points.length; i++) {
			result.push({
				x: this.points[i].x,
				y: this.points[i].y,
			});
		}
		return result;
	};
	
	result.setData = function(data) {
		this.points.splice(0, this.points.length);
		for (var i = 0; i < data.length; i++) {
			this.points.add(data[i].x, data[i].y);
		}
		this.redraw();
		if (this.onchage) {
			this.onchange(this.getData());
		}
	};
	
	result.onchange = null;
	
	
	
// private
	
	result.ctx = result.getContext("2d");
	result.ctx.width  = result.width  = width;
	result.ctx.height = result.height = height;
	
	
	
	result.points = new (function() {
	
		this.__proto__ = new Array();
		
		this.Point = function(x, y) {
			this.x = x ? x : 0;
			this.y = y ? y : 0;
			this.hitAt = function(x, y, r) {
				var dx = this.x - x;
				var dy = this.y - y;
				return dx * dx + dy * dy <= r * r;
			};
		};
		
		this.add = function(x, y) {
			this.push(new this.Point(x, y));
			this.sort(function(a, b) {
				return a.x - b.x;
			});
		};
		
		this.add(0, 0);
		this.add(1, 1);
		
		this.movingIndex = -1;
		
	})();
	
	
	
	result.redraw = function() {
	
		with (this.ctx) {
		
			clearRect(0, 0, width, height);
			
			beginPath();
			
				moveTo(0, 0);
				
				for (var i = 0; i < this.points.length; i++) {
					var x = this.points[i].x * width;
					var y = this.points[i].y * height;
					lineTo(x, y);
					moveTo(x + 5, y);
					arc(x, y, 5, 0, 2 * Math.PI);
					moveTo(x, y);
				}
				
				lineTo(width, height);
				
			stroke();
			
		}
		
	};
	
	
	
	result.getXY = function(e) {
		return {
			x: e.offsetX / e.srcElement.clientWidth,
			y: e.offsetY / e.srcElement.clientHeight
		};
	};	
	
	
	
	result.mouseHandlers = {
	
	
		move: function(e) {
		
			var g = e.srcElement;
			var mouse = g.getXY(e);
			var p = g.points;
			var i = p.movingIndex;
			if (i == -1) {
				g.redraw();
				for (i = 0; i < p.length; i++) {
					if (p[i].hitAt(mouse.x, mouse.y, 10 / g.clientWidth)) {
						g.ctx.beginPath();
							g.ctx.arc(p[i].x * g.ctx.width, p[i].y * g.ctx.height, 5, 0, 2 * Math.PI);
						g.ctx.fill();
					}
				}
			} else {
			
				if ((mouse.x != p[i].x) && (mouse.y != p[i].y)) {
				
					if (i == 0) {
						p[i].x = 0;
					} else
					if (i == p.length - 1) {
						p[i].x = 1;
					} else {
						p[i].x = Math.max(
							Math.min(
								mouse.x,
								p[i + 1] ? p[i + 1].x : 1
							),
							p[i - 1] ? p[i - 1].x : 0
						);
					}
					
					p[i].y = Math.max(
						Math.min(
							mouse.y,
							1
						),
						0
					);
					g.redraw();
					
					if (g.onchange) {
						g.onchange(g.getData());
					}
					
				}
				
			}
			
		},
		
		
		down: function(e) {
		
			var g = e.srcElement;
			var mouse = g.getXY(e);
			var hitIndex = -1;
			var p = g.points;
			for (var i = 0; i < p.length; i++) {
				if (p[i].hitAt(mouse.x, mouse.y, 10 / e.srcElement.clientWidth)) {
					hitIndex = i;
					break;
				}
			}
			if (e.which == 1) {
				if (hitIndex >= 0) {
					p.movingIndex = hitIndex;
				} else {
					g.points.add(mouse.x, mouse.y);
					if (g.onchange) {
						g.onchange(g.getData());
					}
				}
			} else
			if (e.which == 3) {
				if (hitIndex >= 0) {
					p.splice(hitIndex, 1);
				}
			}
			
			g.redraw();
		},
		
		
		up: function(e) {
			var g = e.srcElement;
			g.points.movingIndex = -1;
			g.redraw();
			if (g.onchange) {
				g.onchange(g.getData());
			}
		}
	};
	
	result.onmousemove = result.mouseHandlers.move;
	result.onmousedown = result.mouseHandlers.down;
	result.onmouseup   = result.mouseHandlers.up;
	result.draggable = true;
	result.ondragstart =
	result.oncontextmenu = function() { return false; };
	
	result.redraw();
	return result;
	
}