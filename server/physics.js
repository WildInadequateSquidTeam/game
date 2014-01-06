var GRAVITY = 9.8;
var PLAYER_SPEED = 0.5;
var FPS = 30;
var BOX2D_VELOCITY_ITERATIONS = 10;
var BOX2D_POSITION_ITERATIONS = 10;


var Box2D = require("./box2d.js");
var async = require("async");

// Shorthand "imports"
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

var bodyCounter = 0;

var world = new b2World(
	new b2Vec2(0, GRAVITY),
	false
);

// if you wonder why not setInterval? using this leaves a way to callback on error
// more callbacks for the god of callbacks
// Executor service needed
async.forever(function(cb){
	world.Step(
		1 / FPS,
		BOX2D_VELOCITY_ITERATIONS,
		BOX2D_POSITION_ITERATIONS
	);
	setTimeout(cb, 1000 / FPS);
},
	function(err){
		console.log("world.step failed. that means physics is no longer works, folks.");
	}
);

/* *meditating on this usecase*
 this should return fixture reference which is stored in level or player, but should it be like this?
 + good for pimpMehPlayer(player){ player.body.m_body do stuff}
 - help?
*/
exports.createBox = function(x, y, width, height, static, circle){
	var bodyDef = new b2BodyDef;
	bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
	bodyDef.position.x = x;
	bodyDef.position.y = y;

	var fixDef = new b2FixtureDef;
 	fixDef.density = 1.5;        //
 	fixDef.friction = 0.5;      // parametrise these
 	fixDef.restitution = 0.25; //

 	if (circle) {
 		var circleShape = new b2CircleShape;
		circleShape.m_radius = width;
		fixDef.shape = circleShape;
 	} else {
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(width, height);
 	}
	var body = world.CreateBody(bodyDef);
 	var fixture = body.CreateFixture(fixDef);
 	fixture.id = bodyCounter++;
 	body.id = fixture.id;
 	fixture.user_size = { 
 		width: width,
 		height: height
 	};
 	fixture.isCircle = circle;
 	//console.log(fixture);
	return fixture;
}