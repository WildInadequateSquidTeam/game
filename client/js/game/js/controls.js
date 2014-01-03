/*
	1. Нажал и держишь - перемещение вправо. Отпустил - персонаж остановился (moveright)
	2. Нажал - бросок гранаты. Срабатывает только на onkeydown (+/- moveright)
	3. Нажал и удерживаешь - высота прыжка зависит от того как долго держишь после keydown ??? (срабатывает один раз на keydown, много раз на keyhold, keyup?)
	4. нажал и переключил - изменить состояние стоя / в присяди ???
	5. double keydown - дэш
	6. keycombo (alt+enter)
	7. hotstring (IDDQD) + timeout. Юзкейс - doa
	8. mousebuttons, wheel, move, dnd. AXIS?
	9. multitouch ]:->
	10. ultimate key kombo ( (I+D)DQD mouse ) http://www.youtube.com/watch?v=eZeYVIWz99I
	11. mouse gestures. cuz why not, right? YOLO http://www.youtube.com/watch?v=T8r3cWM4JII
	12. key + dragndrop (amnesia: rotating objects)
*/


function Controls(inputElement, parent, proceedMouseEvents) {

// public
	
	
	//this.KEYCODE_ENTER = 13;
	//...
	
	this.minimalDragDistance = 2;
	this.doubleClickTimeout = 250;
	
	
	this.keys = [];
	
	this.mouse = {
		x: 0,
		y: 0,
		buttons: [],
		wheel: {
			x: 0,
			y: 0
		},
		
		extra: [],       // for drags
		lastButtons: [], // for double clicks
		counter: 0,
		
		toString: function() {
			return "<" + this.counter + "> (" + this.x + ", " + this.y + ") [" + this.buttons + "] (" + this.wheel.x + ", " + this.wheel.y + ")"; 
		}
	};
	
	
	this.addListener = function(eventType, callback, filter) {
		// eventType =
		//	onkeyup | onkeydown | onkeycombo |
		//	onmousemove | onmouseclick | onmousedoubleclick | onmousewheel |
		//	onmousedown | onmouseup | onmousedragstart | onmousedragmove |
		//	onmousedragend
		// callback = function(eventData)
		// filter = {
		//   key: [ [codes] | [chars] | [combos] ]
		//   button: btn
		// }
	};
	//this.removeListener = function() { };
	
	
	
	
	
	
// private
	
	this.parent = parent;
	this.inputElement = inputElement;
	this.inputElement.controls = this;
	this.inputElement.focus();
	this.getXY = function(e) {
		// FIXME: this won't work in firefox.
		return {
			x: e.offsetX,
			y: e.offsetY
		}
	};	
	
	
	// Fires keyDown, keyCombo
	this.inputElement.onkeydown = function(e) {
		
		var k = this.controls.keys;
		
		if (k[e.keyCode] == undefined) {
			k[e.keyCode] = 0;
		}
		
		// Second pass filter
		if (!k[e.keyCode]) {
		
			k[e.keyCode]++;
			
			// TODO: check listers
			
			
			//console.log("Key down: " + e.keyCode);
			
		}
		
	};
	
	
	// Fires keyUp
	this.inputElement.onkeyup = function(e) {
	
		var k = this.controls.keys;
		
		if (k[e.keyCode] == undefined) {
			k[e.keyCode] = 0;
		}
		
		// Second pass filter
		if (k[e.keyCode]) {
		
			k[e.keyCode] = Math.max(k[e.keyCode] - 1, 0);
			
			// TODO: check listers
			
			
			//console.log("Key up: " + e.keyCode);
			
		}
		
	};
	
	
	
	if (proceedMouseEvents) {
	
		this.inputElement.oncontextmenu = function() { return false; };
		
	
		// Fires mouseMove, dragStart, dragMove
		this.inputElement.onmousemove = function(e) {
		
			//console.log("mouse move");
			
			var p = this.controls.getXY(e);
			var m = this.controls.mouse;
			m.x = p.x;
			m.y = p.y;
			
			var m = this.controls.mouse;
			for (var i = 0, btn = 0; i < m.counter; btn++) {
				if (m.buttons[btn]) {
					i += m.buttons[btn];
					var extra = m.extra[btn][m.extra[btn].length - 1];
					if (extra.drag) {
						//console.log("Mouse drag of " + btn);
					} else
					if ((extra.doubleClick == undefined) && (extra.drag == undefined)) {
						if (
							(Math.abs(m.x - extra.x) >= this.controls.minimalDragDistance) ||
							(Math.abs(m.y - extra.y) >= this.controls.minimalDragDistance)
						) {
							extra.drag = true;
							//console.log("Drag start of " + btn);
						}
					}
					// FIXME: add mousemove
				}
			}
			
			//console.log(this.controls.mouse.toString());
			
		};
		
		
		// Fires mouseDown
		this.inputElement.onmousedown = function(e) {
		
			//console.log("mouse down: " + e.which);
			
			var t = new Date();
			var p = this.controls.getXY(e);
			var m = this.controls.mouse;
			if (m.buttons[e.which] == undefined) {
				m.buttons[e.which] = 0;
			}
			
			// Second pass filter
			if (!m.buttons[e.which]) {
			
				m.buttons[e.which]++;
			
				m.counter++;
				
				if (m.lastButtons[e.which] != undefined) {
					var l = m.lastButtons[e.which];
					if (
						(l.doubleClick == undefined) &&
						(p.x == l.x) && (p.y == l.y) &&
						(t - l.time <= this.controls.doubleClickTimeout)
					) {
						p.doubleClick = true;
					}
				}
				m.lastButtons[e.which] = {
					doubleClick: p.doubleClick,
					x: p.x,
					y: p.y,
					time: t
				};
				
				if (m.extra[e.which] == undefined) {
					m.extra[e.which] = [];
				}
				m.extra[e.which].push(p);
				
				// TODO: check listers
				
				
				//console.log("Mouse down of " + e.which);
				//console.log(this.controls.mouse.toString());
				
			}
			
			return false;
			
		};
		
		
		// Fires mouseUp, click, dblclick, dragEnd
		this.inputElement.onmouseup = function(e) {
		
			//console.log("mouse up: " + e.which);
			
			var p = this.controls.getXY(e);
			var m = this.controls.mouse;
			if (m.buttons[e.which] == undefined) {
				m.buttons[e.which] = 0;
			}
			
			// Second pass filter
			if (m.buttons[e.which]) {
			
				m.buttons[e.which] = Math.max(m.buttons[e.which] - 1, 0);
				
				m.counter = Math.max(m.counter - 1, 0);
				
				var extra = m.extra[e.which].pop();
				
				if (extra.doubleClick) {
					// double click
					//console.log("Double click of " + e.which);
				} else
				if (extra.drag) {
					// drag
					//console.log("Drag end of " + e.which);
				} else {
					// mouseup and mouseclick 
					//console.log("Mouse up / click of " + e.which);
				}
				
				//console.log(this.controls.mouse.toString());
				
			}			
			
		};
		
		
		// Fires mouseWheel
		this.inputElement.onmousewheel = function(e) {
		
			//console.log("wheel: " + e.wheelDeltaX + ", " + e.wheelDeltaY);
			
			var m = this.controls.mouse;
			m.wheel.x += e.wheelDeltaX;
			m.wheel.y += e.wheelDeltaY;
			
			
			
			//console.log("Mouse wheel");
			//console.log(this.controls.mouse.toString());
			
			return false;
			
		};
		
	}
	
}