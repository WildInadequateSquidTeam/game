var GRAVITY = 9.8;
var PLAYER_SPEED = 0.5;

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

	
var world = new b2World(
	new b2Vec2(0, GRAVITY),
	false
);

world.bodyCounter = 0;

// create a queue object with concurrency 2

var q = async.queue(function (task, callback) {
    console.log('whatsup ' + task.name);
    callback();
}, 2);


// assign a callback
q.drain = function() {
    console.log('all items have been processed');
}

// add some items to the queue

q.push({name: '1'}, function (err) {
    console.log('finished processing foo');
});
q.push({name: '2'}, function (err) {
    console.log('finished processing bar');
});

// add some items to the queue (batch-wise)

q.push([{name: '1'},{name: '2'},{name: '3'}], function (err) {
    console.log('finished processing bar');
});

// add some items to the front of the queue

q.unshift({name: 'z'}, function (err) {
    console.log('finished processing bar');
});