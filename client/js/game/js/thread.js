define([], function() {

	function Thread(callback, interval, autostart) {

		var that = this;

		// == Params to save ==
		
			var callback = callback;
			var interval = interval ? interval : 24;
		
		// ====================



		// == Private ==
		
			var running = false;

			var intervalID = 0;

			var queue = [];
			var tasks = [];

			var func = function() {

				while(queue.length > 0) {
					queue.pop().call();
				}

				for (var key in tasks) {
					tasks[key].call();
				}

				callback();

			};

		// =============



		// == Public ==
			
			// == Flow control ==
			
				this.start = function(i) {
					running = true;
					clearInterval(intervalID);
					intervalID = setInterval(func, interval);
				};

				this.stop = function() {
					running = false;
					clearInterval(intervalID);
					intervalID = 0;
				};
			
			// ==================

			// == Change speed ==
			
				this.setInterval = function(i) {
					interval = i;
					if (running) {
						that.stop();
						that.start();
					}
				};

				this.setFPS = function(f) {
					that.setInterval(1000.0 / f);
				};

			// ==================

			this.setFunction = function(f) {
				callback = f;
			};

			this.runOnce = function() {
				func();
			};

			// == Tasks control ==

				this.queuePush  = function(f) {
					queue.push(f);
				};

				this.tasksAdd = function(f) {
					tasks[f] = f;
				};

				this.tasksRemove = function(f) {
					delete tasks[f];
				};

			// ===================

		// ============



		// == Init ==

			if (autostart) {
				that.start();
			}

		// ==========

	}

	return Thread;

});