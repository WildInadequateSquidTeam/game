define(["js/tools"], function(Tools) {

	function LayerManager() {

		var that = this;

		// == Public ==
		
			this.add = function(element) {
				var layer = Tools.createElement("div.layer");
				layer.appendChild(element);
				container.appendChild(layer);
			}

			this.getContainer = function() {
				return container;
			}
			
		// ============

		// == Private ==
		
			var container = Tools.createElement("div.layersContainer");
		
		// =============

	}

	return LayerManager;

});