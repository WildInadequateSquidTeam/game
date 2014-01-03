define([], function() {

	var TYPE_SPHERE = 0;

	return [
		{
			character: { x: 0, y: 0 },
			dynamicObjects: [],
			staticObjects: [
				{
					shape: {
						type: TYPE_SPHERE,
						data: {radius: 15}
					},
					physData: {
						mass: 2,
						friction: 1,
						bouncy: 0.2
					},
					graphData: {
						color: "ff0000"
					},
					position: {
						x: 0,
						y: 20
					}
				}, { 
					shape: {
						type: TYPE_SPHERE,
						data: {radius: 5}
					},
					physData: {
						mass: 2,
						friction: 1,
						bouncy: 0.2
					},
					graphData: {
						color: "ff0000"
					},
					position: {
						x: 100,
						y: -20
					}
				},
			]
		}
	];

});