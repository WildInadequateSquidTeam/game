function Body(x, y, angle, isCircle, data) {
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.isCircle = isCircle;
	this.data = data;
	this.draw = function(ctx) {
		ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.beginPath();
				if (this.isCircle) {
					ctx.arc(0, 0, this.data.radius, 0, 2 * Math.PI);
				} else {
					var v = this.data.vertices;
					ctx.moveTo(v[0].x, v[0].y);
					for (var i = 1; i < v.length; i++) {
						ctx.lineTo(v[i].x, v[i].y);
					}
					ctx.closePath();
				}
			ctx.fill();
			ctx.stroke();
		ctx.restore();
	};
	
	this.hitAt = function(x, y) {
	
		if (this.isCircle) {
		
			var dx = x - this.x;
			var dy = y - this.y;
			return (
				dx * dx + dy * dy <=
				this.data.radius * this.data.radius
			);
			
		} else {
	
			var cosA = Math.cos(-this.angle);
			var sinA = Math.sin(-this.angle);
			var tx = (x - this.x) * cosA - (y - this.y) * sinA;
			var ty = (x - this.x) * sinA + (y - this.y) * cosA;						
			
			var v = this.data.vertices;
			
			var x1 = v[v.length - 1].x;
			var y1 = v[v.length - 1].y;
			
			var length = 0;
			
			for (var i = 0; i < v.length; i++) {
				var x2 = v[i].x;
				var y2 = v[i].y;
				// http://coderlife.ru/progr/polozhenie-tochki-otnositelno-pryamoj.html
				if (
					(x2 - x1) * (ty - y1) -
					(y2 - y1) * (tx - x1) > 0
				) {
					length++;
				}
				x1 = x2;
				y1 = y2;
			}
			
			return ((length == 0) || (length == v.length));
			
		}
	};
}