define([], function() {

	function Vec2(x, y) {

		this.x = (x != undefined) ? x : 0;
		this.y = (y != undefined) ? y : 0;

		this.squareDistanceTo = function(x, y) {
			if (y == undefined) {
				y = x.y;
				x = x.x;
			}
			var dx = this.x - x,
				dy = this.y - y;
			return dx * dx + dy * dy;
		};

	}

	return Vec2;

});