define([

	"js/tools",
	"js/thread"

], function(Tools, Thread) {

	/*
		@callback - function to call when console gets input
		@focus    - element to focus when console blurs out
	*/

	function Console(callback, focus) {

		var that = this;

		// === public ===

			// === Fields ===

				this.autoClose = false;

				// Function to call when console gets input
				this.callback = callback;

				// Element to focus on self blur
				this.focus = focus;

			// ==============
			


			// === Methods ===

				this.getContainer = function() {
					return container;
				};

				this.setLogLevel = function(l) { logLevel = l;    };
				this.getLogLevel = function()  { return logLevel; };



				// === Overall visibility of console ===
				
					this.hide = function() {
						visible = false;
						that.close();
						Tools.addClassName(container, "hidden");
					};
					
					this.show = function() {
						visible = true;
						Tools.removeClassName(container, "hidden");
					};

					this.isVisible = function() {
						return visible;
					};
				
				// =====================================

				

				// === Ouput size ===
				
					this.minimize = function() {
						maximized = false;
						Tools.removeClassName(output, "maximized");
						output.scrollTop += output.scrollHeight;
					};
					
					this.maximize = function() {
						maximized = true;
						Tools.addClassName(output, "maximized");
					};
					
					this.switch = function() {
						if (visible) {
							if (maximized) {
								that.minimize();
							} else {
								that.maximize();
							}
						}
						that.show();
					};

					this.isMaximized = function() {
						return maximized;
					};

				// ==================
				

				
				// === Input visibility ===
				
					this.open = function() {
						that.show();
						Tools.removeClassName(input, "hidden");
						input.focus();
						inputHistory.index = -1;
					};
					
					this.close = function() {
						blur();
						Tools.addClassName(input, "hidden");
					};
				
				// ========================

				

				// === Logging static data ===

					this.error = function(message) { that.log(message, 5); }
					this.warn  = function(message) { that.log(message, 4); }
					this.info  = function(message) { that.log(message, 3); }
					this.debug = function(message) { that.log(message, 2); }
					this.trace = function(message) { that.log(message, 1); }

					this.log = function(message, l) {

						if (l == undefined) { l = 3; }

						var t = new Date();

						history.push({logLevel: l, time: t, message: message});

						if (l >= logLevel) {

							var scrolled = (
								(output.scrollHeight - output.scrollTop) == output.clientHeight
							);

							var div = document.createElement("div");
							div.appendChild(document.createTextNode("[" +
								t.toLocaleTimeString() +
							"] " + message));
							output.appendChild(div);

							if (scrolled) {
								output.scrollTop += output.scrollHeight;
							}

						}

					};
				
				// ===========================



				// === Logging dynamic data ===

					this.fix = function(callback, l) {

						if (l == undefined) { l = 3; }

						if (l >= logLevel) {

							var scrolled = (
								output.scrollHeight - output.scrollTop == output.clientHeight;
							);

							var div = document.createElement("div");
							div.appendChild(document.createTextNode("[" +
								(new Date()).toLocaleTimeString() +
							"] <" + fixed.length + "> "));
							var span = document.createElement("span");
							span.callback = callback;
							span.innerText = callback();
							fixed.add(span);
							div.appendChild(span);
							output.appendChild(div);

							if (scrolled) {
								output.scrollTop += output.scrollHeight;
							}

						}

						//return id;

					};
					
					

					this.release = function(id) {
						delete fixed[id];
						for (var i = 0; i < fixed.id.length; i++) {
							if (fixed.id[i] == id) {
								fixed.id.splice(i, 1);
								break;
							}
						}
					};
					


					this.releaseAll = function() {
						for (var i = 0; i < fixed.id.length; i++) {
							delete fixed[fixed.id[i]];
						}
						fixed.id.splice(0, fixed.id.length);
						fixed.counter = 0;
					};

					this.startUpdatingFixed = function() {
						clearInterval(fixed.intervalID);
						fixed.intervalID = setInterval(function() {
							for (var i = 0; i < fixed.id.length; i++) {
								fixed[fixed.id[i]].innerText = fixed[fixed.id[i]].callback();
							}
						}, fixed.interval);
					};

					this.stopUpdatingFixed = function() {
						clearInterval(fixed.intervalID);
						fixed.intervalID = 0;
					};

					this.setUpdateInterval = function(dt) {
						that.stopUpdatingFixed();
						fixed.interval = dt;
						that.startUpdatingFixed();
					};
				
				// ============================


				this.clear = function() {
					output.innerHTML = "";
					that.releaseAll();
					fixed.splice(0, fixed.length);
				};

				/*
					this.stopUpdatingFixed
					this.startUpdatingFixed
					this.getHistory
					this.getInputHistory
				*/

			// ===============
			
		// ==============
		
		

		// === Private ===

			// === Fields ===

				var container = Tools.createElement("div.console");
				var output    = Tools.createElement("div.gameConsoleOutput");
				var input     = Tools.createElement("input.gameConsoleInput"); // type = text
				input.setAttribute("type", "text");

				var visible   = false;
				var maximized = false;

				// 1: trace, 2: debug, 3: info, 4: warn, 5: error
				var logLevel = 3;

				
				var messageHistory = [];
				
				var inputHistory = [];
				inputHistory.current = "";
				inputHistory.index = 0;
				
				var fixed = [];
				fixed.counter = 0;
				fixed.id = [];
				fixed.intervalID = 0;
				fixed.interval = 1000 / 24;
				fixed.add = function(e) {
					fixed.id.push(fixed.counter);
					fixed[fixed.counter++] = e;
				};

			// ==============

			function blur() {
				if (that.focus) {
					that.focus.focus();
				}
			}

		// ===============



		// === Initialisation ===

			// Launch loop for updating fixed data
			this.startUpdatingFixed();
						
			output.onclick = input.onblur = blur;
			
			container.appendChild(output);
			container.appendChild(input);
			
			
			
			// Key handler
			
			input.onkeydown = function(e) {
			
				var str = this.value.replace(/^\s+/, "");
				var h = inputHistory;
				
				switch (e.keyCode) {
				
					// Enter:
					case 13:
						
						if (str) {
							if (callback) {
								h.push(str);
								h.index = -1;
								callback(str);
							}
						}
						this.value = "";
						if (autoClose) {
							that.close();
						}
						
						break;
					
					
					// Escape
					case 27:
						
						this.value = "";
						that.close();
						break;
					
					
					
					// History navigation
					
					// Up
					case 38:
					
						if (h.length > 0) {
					
							if (h.index == -1) {
								h.current = str;
								h.index = h.length - 1;
							}  else {
								h.index = Math.max(h.index - 1, 0);
							}
							this.value = h[h.index];
							
						}
						return false;
					
					// Down
					case 40:
					
						if (h.index != -1) {
							h.index = Math.min(h.length, h.index + 1);
							if (h.index == h.length) {
								h.index = -1;
								this.value = h.current;
							} else {
								this.value = h[h.index];
							}
						}				
						return false;
						
				}
				
			};


			this.hide();

		// ======================	
		
	}


	return Console;

});