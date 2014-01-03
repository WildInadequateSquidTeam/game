function create_phys_world(x0, y0, x1, y1, grav) {

		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(x0, y0);
		worldAABB.maxVertex.Set(x1, y1);
		var gravity = new b2Vec2(0, grav);
		var doSleep = false;
		world = new b2World(worldAABB, gravity, doSleep);
		//createGround(world);
		return world;
}

function createBall(world, x, y) {

		var ballSd = new b2CircleDef();
		ballSd.density = 1.0;
		ballSd.radius = 10;
		ballSd.restitution = 0.5;
		ballSd.friction = 0.5;
		var ballBd = new b2BodyDef();
		ballBd.AddShape(ballSd);
		ballBd.position.Set(x,y);
		return world.CreateBody(ballBd);
}
 
function createBox(world, x, y, width, height, fixed) {

		if (typeof(fixed) == 'undefined') fixed = true;
		var boxSd = new b2BoxDef();
		if (!fixed) boxSd.density = 1.0; 
		boxSd.restitution = 0.0;
		boxSd.friction = 1.0;
		boxSd.extents.Set(width, height);
		var boxBd = new b2BodyDef();
		boxBd.AddShape(boxSd);
		boxBd.position.Set(x,y);
		return world.CreateBody(boxBd);
}

function phys_step(){

		var stepping = false;
		var timeStep = 1.0/60;
		var iteration = 10;
		world.Step(timeStep, iteration);
		ctx.clearRect(0, 0, width, heigth);
}

function phys_update(){
		world.Step(timeStep, iteration);
		
		for (var b = world.m_bodyList; b; b = b.m_next) {
				for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
						drawShape(s, ctx);
				}
		}
}

function drawShape(shape, context) {
		context.strokeStyle = '#ffffff';
		if (shape.density == 1.0) {
				context.fillStyle = "red";
		} else {
				context.fillStyle = "black";
		}
		context.beginPath();
		switch (shape.m_type) {
		case b2Shape.e_circleShape:
				{
						var circle = shape;
						var pos = circle.m_position;
						var r = circle.m_radius;
						var segments = 16.0;
						var theta = 0.0;
						var dtheta = 2.0 * Math.PI / segments;

						// draw circle
						context.beginPath();
							context.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
						context.stroke();
						context.fill();
						/*context.moveTo(pos.x + r, pos.y);
						for (var i = 0; i < segments; i++) {
								var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
								var v = b2Math.AddVV(pos, d);
								context.lineTo(v.x, v.y);
								theta += dtheta;
						}
						context.lineTo(pos.x + r, pos.y);*/

						
				}
				break;
		case b2Shape.e_polyShape:
				{
						context.save();
							var poly = shape;
							context.translate(poly.m_position.x, poly.m_position.y);
							context.moveTo(poly.m_vertices[0].x, poly.m_vertices[0].y);
							for (var i = 0; i < poly.m_vertexCount; i++) {
									context.lineTo(poly.m_vertices[i].x, poly.m_vertices[i].y);
							}
							context.lineTo(poly.m_vertices[0].x, poly.m_vertices[0].y);
						context.restore();
						/*var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
						context.moveTo(tV.x, tV.y);
						for (var i = 0; i < poly.m_vertexCount; i++) {
								var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
								context.lineTo(v.x, v.y);
						}
						context.lineTo(tV.x, tV.y);
						*/
						
				}
				break;
		}
		context.fill();
		context.stroke();
}
