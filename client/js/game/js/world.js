define([], function() {

	function World() {

		var that = this;

		// == Public ==
		
			this.addObject = function(graphObject, physObject) {

				if (graphObject || physObject) {

					if (graphObject && physObject) {
						//graphObject.coords = physObject.coords;
					} else
					if (graphObject) {

					} else {

					}

					objects.push({g: graphObject, p: physObject});

				}

				//return id?

			};

			//this.destroyObject = function(id) {}
		
		// ============



		// == Private ==
		
			var objects = [];
		
		// =============

	}

	return World;

});