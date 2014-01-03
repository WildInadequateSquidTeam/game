define([

	"js/console",
	"js/layerManager",
	"js/graphics",
	"js/player",
	"js/world",

	"js/lib/Box2D",

		

	"js/data/levels"

], function(Console, LayerManager, Graphics, Player, World, Box2D, levels) {



	function Game() {

		var that = this;

		// == Public ==



			this.getContainer = function() {
				return that.container;
			};



			this.loadTestLevel = function() {

				//that.world.clear() ???

				var level = levels[0];

				/*level.dynamicObjects.forEach(function(e) {
					var graphObj = that.graphics.createObject(e.shape, e.graphData, e.position);
					//var physObj  = game.physics.createDynamicObject(e.shape, e.physData, e.position);
					that.world.addObject(/ *physObj* / null, graphObj);
				});*/

				level.staticObjects.forEach(function(e) { 
					var graphObj = that.graphics.createObject(e.shape, e.graphData, e.position);
					//that.physics.createStaticObject(e.shape, e.physData, e.position);
					that.world.addObject(null, graphObj);
				});

				that.player = new Player(level.character.x, level.character.y);



			};



			this.start = function() {
				that.loadTestLevel();
				that.graphics.start();
				that.physics.start();
			};



			this.stop = function() {
				that.physics.stop();
				that.graphics.stop();
			};



		// ============



		// == Private ==

			var console      = new Console();
			var layerManager = new LayerManager();
			var graphics     = new Graphics();
			var world        = new World();

			var container = that.layerManager.getContainer();

		// =============



		// == Initialization ==

			layerManager.add(graphics.getContainer());
			layerManager.add(console.getContainer());

		// ====================
	}

	return Game;

});