define([], function() {

	Math.DOUBLE_PI = Math.PI * 2;

	function Tools() {

		var that = this;

		this.importCSS = function(url) {
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = url;
			document.head.appendChild(link);
		};


		// === Classname manipulations ===

			this.hasClassName = function(element, className) {
				return element.className.match(
					new RegExp("\\b" + className + "\\b", "i")
				);
			};

			this.addClassName = function(element, className) {
				if (!element.className.match(
					new RegExp("\\b" + className + "\\b", "i")
				)) {
					element.className = (
						element.className + " " + className
					).replace(/\s+/, " ");
				}
			};

			this.removeClassName = function(element, className) {
				element.className = (
					element.className.replace(
						new RegExp("\\b" + className + "\\b", "i"), ""
					)
				).replace(/\s+/, " ");
			};

		// ===============================



		this.createElement = function(what, style) {

			var tag, className, id, element;
			
			if (tag = what.match(/^\w+/)) {

				element = document.createElement(tag[0]);

				if (className = what.match(/\.\w+/g)) {
					className.forEach(function(e) {
						that.addClassName(element, e.substr(1));
					});
				}

				if (id = what.match(/#\w+/)) {
					element.id = id[0];
				}

				return element;

			}

		};

	}

	return (new Tools());

});