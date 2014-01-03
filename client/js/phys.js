function Box2DWorld(x0, y0, x1, y1, grav) {

	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(x0, y0);
	worldAABB.maxVertex.Set(x1, y1);
	var gravity = new b2Vec2(0, grav);
	var doSleep = false;
	// FIXME: this probably sux and won't work in other browsers but chrome.
	this.__proto__ = new b2World(worldAABB, gravity, doSleep);
	
	this.createBall = function(x, y, r) {
		
		var ballSd = new b2CircleDef();
		ballSd.density = 1.0;
		ballSd.radius = r;
		ballSd.restitution = 0.5;
		ballSd.friction = 0.5;
		var ballBd = new b2BodyDef();
		ballBd.AddShape(ballSd);
		ballBd.position.Set(x, y);
		return this.CreateBody(ballBd);
		
	};
	
	this.createBox = function(x, y, width, height, fixed) {

		if (typeof(fixed) == "undefined") fixed = true;
		var boxSd = new b2BoxDef();
		if (!fixed) boxSd.density = 1.0; 
		boxSd.restitution = 0.0;
		boxSd.friction = 1.0;
		boxSd.extents.Set(width, height);
		var boxBd = new b2BodyDef();
		boxBd.AddShape(boxSd);
		boxBd.position.Set(x, y);
		
		return this.CreateBody(boxBd);
		
	};
	
	this.draw = function(context) {
		for (var b = this.m_bodyList; b; b = b.m_next) {
			for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
				this.drawShape(s, context);
			}
		}
	};
	
	this.drawShape = function(shape, context) {
	
		context.strokeStyle = "#fff";
		if (shape.density == 1.0) {
			context.fillStyle = "red";
		} else {
			context.fillStyle = "black";
		}
		
		context.beginPath();
		
			switch(shape.m_type) {
			
				case b2Shape.e_circleShape:

					context.arc(shape.m_position.x, shape.m_position.y, shape.m_radius, 0, 2 * Math.PI);
					break;
					
				case b2Shape.e_polyShape:
				
					context.save();
					
						context.translate(shape.m_position.x, shape.m_position.y);
						
						context.moveTo(shape.m_vertices[0].x, shape.m_vertices[0].y);
						for (var i = 0; i < shape.m_vertexCount; i++) {
							context.lineTo(shape.m_vertices[i].x, shape.m_vertices[i].y);
						}
						context.lineTo(shape.m_vertices[0].x, shape.m_vertices[0].y);
						
					context.restore();
					break;
					
			}
			
		context.fill();
		context.stroke();
	
	};
	
}
