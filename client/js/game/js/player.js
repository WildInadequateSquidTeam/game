define([

	"js/lib/Vec2"

], function(Vec2) {
	
	function Player(x, y) {

		var that = this;

		this.position = new Vec2(x, y);

	}

	return Player;

});