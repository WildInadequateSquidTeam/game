requirejs([
	"js/context",
	"js/tools",
	"js/controls",//"js/InputSystem"
	"js/console",
	//"js/tiledLayer"
	//"js/sceneryManager"
	//"js/LayerManager"
]);



window.Game = function(containerId, width, height, fps) {

	this.init = function() {

		//this.console = new Console();
		//console.log("Console created", 5);

		//this.layerManager = new LayerManager();
		//console.log("Layer manager created", 5);
		//layerManager.add(console.element, 0);

		//this.input = new InputSystem();
		//console.log("Input system created");
		//layerManager.add(input.element, 1);

		//this.audio = new AudioSystem();
		//console.log("Audio system created");

		//this.graphics = new Graphics();
		//console.log("Graphics system created");
		//layerManager.add(graphics, -1);

		// load resources
		// display menu





	};

	this.start = function() {

	};

	this.init();


	
	this.containerParentNode = document.getElementById(containerId);
	
	if (!this.containerParentNode) {
	
		console.error("Element with ID \"" + containerId + "\" doesn't exist");
		return;
		
	} else {
		
		if (width  == undefined) { width  = 640; }
		if (height == undefined) { height = 480; }
		if (fps    == undefined) { fps    =  60; }
		
		this.width  = width;
		this.height = height;
		this.fps    = fps;
		
		// It means that 96 pixels equal to 1.9 meters
		this.scale  = 96 / 1.9;

		// Creatre structure:
		//   Given element
		//     Extra container
		//       Backgrounds container
		//       Shadows container
		//       Main canvas
		//       Foregrounds
		//       Fog
		//       Element for input
		//       Overlay messages
		//       Console
		
		this.ctx = new Context(this.width, this.height, 1, 1);
		
		// Import CSS - fonts, console style, layers
		importCSS("js/game/style/game.css");
		
		// Create container for all required elements
		this.container = document.createElement("div");
		this.container.className = "gameContainer";
		this.container.style.width  = this.width  + "px";
		this.container.style.height = this.height + "px";
		this.containerParentNode.appendChild(this.container);
		
		
		// Create container for backgrounds
		this.container.appendChild(
			this.container.backgrounds = document.createElement("div")
		);
		
		// Create canvas for shadows
		/*this.container.appendChild(
			(this.ctx.shadows = new Context(this.width, this.height)).canvas
		);*/
		
		// Append main canvas
		this.container.appendChild(this.ctx.canvas);
		
		// Create div for foregrounds
		this.container.appendChild(
			this.container.foregrounds = document.createElement("div")
		);
		
		/*this.sceneryManager = new SceneryManager(
			this.container.backgrounds,
			this.container.foregrounds,
			90
		);*/
		
		// Create canvas for darkmap
		/*this.container.appendChild(
			(this.ctx.darkmap = new Context(this.width, this.height)).canvas
		);*/
		
		// Create input for capturing controls
		this.controls = new Controls(
			this.container.appendChild((
				this.container.controls = document.createElement("input"),
				this.container.controls.readOnly = true,
				this.container.controls.className = "gameControls",
				this.container.controls
			)),
			this,
			true
		);
		
		// Create div for console
		this.console = new Console(
			this.container.appendChild((
				this.container.console = document.createElement("div"),
				this.container.console.className = "gameConsole",
				this.container.console
			)), function(str) {
				this.parent.console.log(str);
				console.log("Console: " + str);
			},
			this,
			this.controls.inputElement
		);
		
		// Create div for overlay messages
		/*this.container.appendChild((
			this.container.overlay = document.createElement("div"),
			this.container.overlay.className = "gameOverlay",
			this.container.overlay
		));*/
		
		
		/*this.controls.addListener("onkey", [
			[this.controls.KEYCODE_ENTER,  function() { this.parent.console.open();   }],
			[this.controls.KEYCODE_TILDA,  function() { this.parent.console.switch(); }],
			[this.controls.KEYCODE_ESCAPE, function() { this.parent.console.hide();   }]
		]);*/
		
		/*this.controls.inputElement.onkeydown = function(e) {
			if (e.keyCode == 13)  { game.console.open()   } else
			if (e.keyCode == 192) { game.console.switch() } else
			if (e.keyCode == 27)  { game.console.hide()   }
		};*/
		
		
		this.camera = {
			x: 0,
			y: 0
		};
		
		/*this.sceneryManager.addLayer(
			this.container.backgrounds.appendChild(
				(new Context(640, 480)).canvas
			),
			0
		);
		
		this.sceneryManager.layers[0].ctx.scale(this.scale, this.scale);
		this.sceneryManager.layers[0].ctx.lineWidth = 1 / this.scale;
		this.sceneryManager.layers[0].ctx.fillRect(-0.5, -0.5, 1, 1);*/
		
		
		
		this.frameInterval = setInterval(function(game) {
		
			with (game) {
			
				camera.x = (controls.mouse.x - controls.inputElement.clientWidth  / 2) / scale;
				camera.y = (controls.mouse.y - controls.inputElement.clientHeight / 2) / scale;
				
				//sceneryManager.updateParallax(camera.x, camera.y, scale);
				
				ctx.clear();
				
				ctx.save();
				
					ctx.scale(scale, scale);
					ctx.lineWidth = 1 / scale;
				
					ctx.centrify(camera.x, camera.y);
					
					ctx.beginPath();
						ctx.moveTo(   0, -100);
						ctx.lineTo(   0,  100);
						ctx.moveTo(-100,    0);
						ctx.lineTo( 100,    0);
					ctx.stroke();
					ctx.fillRect(-0.5, -0.5, 1, 1);
				
				ctx.restore();
			
			}
			
		}, 1000 / this.fps, this);
		
	}

};