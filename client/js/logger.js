function Logger(id) {

	this.element = document.getElementById(id);
	this.fixedElements = [];
	
	/*setInterval(function() {
		for (var i = 0; i < log.fixedElements.length; i++) {
			log.fixedElements[i].innerText = log.fixedElements[i].callback();
		}
	}, 200);*/
	
	this.add = function(msg) {
		var scrolled = this.element.scrollHeight - this.element.scrollTop == this.element.clientHeight;
		this.element.innerText += "[" + (new Date()).toLocaleTimeString() + "] " + msg;
		this.element.appendChild(document.createElement("br"));
		if (scrolled) {
			this.element.scrollTop += this.element.scrollHeight;
		}
	};
	
	this.clear = function(msg) {
		this.element.innerText = "";
	};
	
	/*this.fix = function(val) {
		this.element.innerText += "[" + (new Date()).toLocaleTimeString() + "] ";
		var a = document.createElement("span");
		a.callback = val;
		this.fixedElements.push(a);
		this.element.appendChild(a);
		this.element.appendChild(document.createElement("br"));
	};*/
	
	this.active = false;
	
	this.switch = function() {
		this.element.className = this.active ? "" : "active";
		this.active = !this.active;
		this.element.scrollTop += this.element.scrollHeight;
	};
	
}