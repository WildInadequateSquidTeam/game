define([

	"js/lib/Box2D"

], function(Box2D) {

	var that = this;

	// == Public ==

		this.TYPE_SPHERE   = 1;
		this.TYPE_BOX      = 2;
		this.TYPE_POLYGON  = 3;
		this.TYPE_COMPOSED = 4;

		this.create = function(details) {

			if (details.type) {

				if (details.fixed == undefined) {
					details.fixed = false;
				}



			}



		};

		/*
	
		OBJECT == {
			type: SPHERE | BOX | POLYGON | COMPOSED, // Required
			fixed: Boolean,
			data:
				LOCATION + ORIENTATION + (
					SPHERE_DATA {
						radius: NUMBER
					} |
					BOX_DATA {
						width:  NUMBER
						height: NUMBER
					} |
					POLYGON {
						dots:
					}
				) + [MOVEMENT]
		}

		*/
	
	// ============

});