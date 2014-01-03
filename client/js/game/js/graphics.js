define([

	"js/tools",
	"js/context",
	"js/thread",
	"js/lib/Vec2"

], function(Tools, Context, Thread, Vec2) {



	function Graphics() {

		var that = this;

		// == Public ==
		
			this.getContainer = function() {
				return container;
			};

			this.thread = null;

			this.addObject = function(o) {
				return objects.push(o) - 1;
			};
			this.removeObject = function(id) {
				delete objects[id];
			};



			this.createObject = function(shape, data, position) {
				var obj = {};
				if (shape.type == 0) {
					// sphere
					obj.type = shape.type;
					//obj.data = shape.data.clone();
					obj.data = {
						radius: shape.data.radius
					};
					obj.color = data.color;
					obj.position = new Vec2(position.x, position.y);
					obj.draw = function(ctx) {
						ctx.fillStyle = this.color;
						ctx.beginPath();
							ctx.arc(this.position.x, this.position.y, this.data.radius, 0, 2 * Math.PI);
						ctx.fill();
					};
				} else {
					// polygon, whatever
				}
				that.addObject(obj);
				return obj;
			};

		
		// ============



		// == Private ==

			var objects = [];

			var container = Tools.createElement("div.graphics");

			var ctx = new Context(640, 480);
		
		// =============



		// == Initialisation ==

			this.thread = new Thread(function() {
				for (var i = 0; i < objects.length; i++) {
					if (objects[i]) {
						objects[i].draw(ctx);
					}
				}
			}, 1000.0 / 60);
		
			container.appendChild(ctx.canvas);

			ctx.fillRect(-10, -10, 20, 20);
		
		// ====================

	}

	return Graphics;

});