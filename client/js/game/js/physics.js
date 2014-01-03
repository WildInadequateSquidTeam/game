define([

	"js/lib/Box2D",
	"js/physicFactory"

], function(Box2D, physicFactory) {

	function Physics() {

		var that = this;

		// == Public ==


		
			this.createSphere = function(x, y, radius, mass, friction, bouncy) {

				var bodyDef = new b2BodyDef;
				//bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
				bodyDef.type = b2Body.b2_staticBody;
				bodyDef.position.x = x;
				bodyDef.position.y = y;

				var fixDef = new b2FixtureDef;
			 	fixDef.density = 1.5;
			 	fixDef.friction = 0.5;
			 	fixDef.restitution = 0.25;

			 	if (circle) {
			 		var circleShape = new b2CircleShape;
					circleShape.m_radius = width;
					fixDef.shape = circleShape;
			 	} else {
					fixDef.shape = new b2PolygonShape;
					fixDef.shape.SetAsBox(width, height);
			 	}
				var body = this.CreateBody(bodyDef);
			 	var fixture = body.CreateFixture(fixDef);
			 	fixture.id = this.bodyCounter++;
			 	body.id = fixture.id;
			 	fixture.user_size = { 
			 		width: width,
			 		height: height
			 	};
			 	fixture.isCircle = circle;
			 	//console.log(fixture);
				return fixture;

			};
		
		// ============

		// == Initialisation ==
		
			var GRAVITY = 9.8;

			var
				b2Vec2          = Box2D.Common.Math.b2Vec2,
				b2BodyDef       = Box2D.Dynamics.b2BodyDef,
				b2AABB          = Box2D.Collision.b2AABB,
				b2Body          = Box2D.Dynamics.b2Body,
				b2FixtureDef    = Box2D.Dynamics.b2FixtureDef,
				b2Fixture       = Box2D.Dynamics.b2Fixture,
				b2World         = Box2D.Dynamics.b2World,
				b2MassData      = Box2D.Collision.Shapes.b2MassData,
				b2PolygonShape  = Box2D.Collision.Shapes.b2PolygonShape,
				b2CircleShape   = Box2D.Collision.Shapes.b2CircleShape,
				b2DebugDraw     = Box2D.Dynamics.b2DebugDraw,
				b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
				b2EdgeShape     = Box2D.Collision.Shapes.b2EdgeShape;

			var physWorld = new b2World(
				new b2Vec2(0, GRAVITY),
				false
			);


		
		// ====================

	}

	return Physics;

});