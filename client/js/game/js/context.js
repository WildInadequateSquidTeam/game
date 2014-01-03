define([], function() {

	// Advanced context
	// @extra - multiplier for offscreen purposes

	function Context(width, height, extra, downsampling) {

		if (width  == undefined) { width  = 640; }
		if (height == undefined) { height = 480; }
		if (extra  == undefined) { extra  = 1;   }
		if (downsampling == undefined) {
			downsampling = 1;
		}
		
		
		var visualWidth  = width  * extra;
		var visualHeight = height * extra;
		var realWidth  = visualWidth  / downsampling;
		var realHeight = visualHeight / downsampling;
		
		var c = document.createElement("canvas");
		c.width  = realWidth;
		c.height = realHeight;
		c.style.left = -(visualWidth  - width ) / 2 + "px";
		c.style.top  = -(visualHeight - height) / 2 + "px";
		c.style.width  = visualWidth  + "px";
		c.style.height = visualHeight + "px";
		c = c.ctx = c.getContext("2d");
		c.width  = width;
		c.height = height;
		c.extra = extra;
		c.downsampling = downsampling;
		
		
		// Wrapper for context. New public methods: resetTransform, getCurrentTransform
		// http://stackoverflow.com/questions/7395813/html5-canvas-get-transform-matrix
		// http://simonsarris.com/blog/471-a-transformation-class-for-canvas-to-keep-track-of-the-transformation-matrix
		var spr = c.__proto__;
		c.__proto__ = {
		
			__proto__: spr,
			
			transformMatrixStack: [],
			currentTransform: [1, 0, 0, 1, 0, 0],
			
			
			// Overriding default methods
			
			save: function() {
				this.__proto__.transformMatrixStack.push(this.__proto__.currentTransform);
				this.__proto__.currentTransform = this.__proto__.currentTransform.slice(0);
				return spr.save.call(this);
			},
			
			
			translate: function(x, y) {
				var m = this.__proto__.currentTransform;
				m[4] += m[0] * x + m[2] * y;
				m[5] += m[1] * x + m[3] * y;
				return spr.translate.call(this, x, y);
			},
			
			
			rotate: function(angle) {
				var m = this.__proto__.currentTransform;
				var c = Math.cos(angle);
				var s = Math.sin(angle);
				var m11 = m[0] *  c + m[2] * s;
				var m12 = m[1] *  c + m[3] * s;
				var m21 = m[0] * -s + m[2] * c;
				var m22 = m[1] * -s + m[3] * c;
				m[0] = m11;
				m[1] = m12;
				m[2] = m21;
				m[3] = m22;
				return spr.rotate.call(this, angle);
			},
			
			
			scale: function(x, y) {
				var m = this.__proto__.currentTransform;
				m[0] *= x;
				m[1] *= x;
				m[2] *= y;
				m[3] *= y;
				return spr.scale.call(this, x, y);
			},
			
			
			transform: function(a, b, c, d, e, f) {
			
				if (a instanceof Array) {
					b = a[1];
					c = a[2];
					d = a[3];
					e = a[4];
					f = a[5];
					a = a[0];
				}
				
				var m = this.__proto__.currentTransform;
				var m11 = m[0] * a + m[2] * c;
				var m12 = m[1] * a + m[3] * c;

				var m21 = m[0] * e + m[2] * b;
				var m22 = m[1] * e + m[3] * b;

				var dx = m[0] * d + m[2] * f + m[4];
				var dy = m[1] * d + m[3] * f + m[5];

				m[0] = m11;
				m[1] = m12;
				m[2] = m21;
				m[3] = m22;
				m[4] = dx;
				m[5] = dy;
				
				return spr.transform.call(this, a, b, c, d, e, f);
				
			},
			
			
			setTransform: function(a, b, c, d, e, f) {
				if (a instanceof Array) {
					b = a[1];
					c = a[2];
					d = a[3];
					e = a[4];
					f = a[5];
					a = a[0];
				}
				this.__proto__.currentTransform = [a, b, c, d, e, f];
				return spr.setTransform.call(this, a, b, c, d, e, f);
			},
			
			
			restore: function() {
				this.__proto__.currentTransform = this.__proto__.transformMatrixStack.pop();
				return spr.restore.call(this);
			},
			
			
			
			// New methods
			
			resetTransform: function() {
				this.__proto__.currentTransform = [1, 0, 0, 1, 0, 0];
				spr.setTransform.call(this, 1, 0, 0, 1, 0, 0);
				return;
			},
			
			getCurrentTransform: function() {
				return this.__proto__.currentTransform.slice(0);
			},
			
			
			detranslate: function() {
				var m = this.__proto__.currentTransform;
				this.setTransform(m[0], m[1], m[2], m[3], 0, 0);
			},
			
			derotate: function() {
				var m = this.__proto__.currentTransform;
				this.setTransform(m[0], 0, 0, m[3], m[4], m[5]);
			},
			
			descale: function() {
				var m = this.__proto__.currentTransform;
				this.setTransform(1, m[1] / m[0], m[2] / m[3], 1, m[4], m[5]);
			},
			
			
			clear: function() {
				this.save();
					this.resetTransform();
					this.clearRect(0, 0,
						this.width  * this.extra / this.downsampling,
						this.height * this.extra / this.downsampling
					);
				this.restore();
			},
			
			
			centrify: function(x, y) {
				this.translate(x, y);
			}
			
		};
		
		c.translate(realWidth / 2, realHeight / 2);
		c.scale(1 / downsampling, 1 / downsampling);
		
		return c;
		
	}

	return Context;

});