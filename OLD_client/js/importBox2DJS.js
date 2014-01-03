// FIXME: put everything into 1 file

var urls = [
	"lib/prototype-1.6.0.2.js",
	"js/box2d/common/b2Settings.js",
	"js/box2d/common/math/b2Vec2.js",
	"js/box2d/common/math/b2Mat22.js",
	"js/box2d/common/math/b2Math.js",
	"js/box2d/collision/b2AABB.js",
	"js/box2d/collision/b2Bound.js",
	"js/box2d/collision/b2BoundValues.js",
	"js/box2d/collision/b2Pair.js",
	"js/box2d/collision/b2PairCallback.js",
	"js/box2d/collision/b2BufferedPair.js",
	"js/box2d/collision/b2PairManager.js",
	"js/box2d/collision/b2BroadPhase.js",
	"js/box2d/collision/b2Collision.js",
	"js/box2d/collision/Features.js",
	"js/box2d/collision/b2ContactID.js",
	"js/box2d/collision/b2ContactPoint.js",
	"js/box2d/collision/b2Distance.js",
	"js/box2d/collision/b2Manifold.js",
	"js/box2d/collision/b2OBB.js",
	"js/box2d/collision/b2Proxy.js",
	"js/box2d/collision/ClipVertex.js",
	"js/box2d/collision/shapes/b2Shape.js",
	"js/box2d/collision/shapes/b2ShapeDef.js",
	"js/box2d/collision/shapes/b2BoxDef.js",
	"js/box2d/collision/shapes/b2CircleDef.js",
	"js/box2d/collision/shapes/b2CircleShape.js",
	"js/box2d/collision/shapes/b2MassData.js",
	"js/box2d/collision/shapes/b2PolyDef.js",
	"js/box2d/collision/shapes/b2PolyShape.js",
	"js/box2d/dynamics/b2Body.js",
	"js/box2d/dynamics/b2BodyDef.js",
	"js/box2d/dynamics/b2CollisionFilter.js",
	"js/box2d/dynamics/b2Island.js",
	"js/box2d/dynamics/b2TimeStep.js",
	"js/box2d/dynamics/contacts/b2ContactNode.js",
	"js/box2d/dynamics/contacts/b2Contact.js",
	"js/box2d/dynamics/contacts/b2ContactConstraint.js",
	"js/box2d/dynamics/contacts/b2ContactConstraintPoint.js",
	"js/box2d/dynamics/contacts/b2ContactRegister.js",
	"js/box2d/dynamics/contacts/b2ContactSolver.js",
	"js/box2d/dynamics/contacts/b2CircleContact.js",
	"js/box2d/dynamics/contacts/b2Conservative.js",
	"js/box2d/dynamics/contacts/b2NullContact.js",
	"js/box2d/dynamics/contacts/b2PolyAndCircleContact.js",
	"js/box2d/dynamics/contacts/b2PolyContact.js",
	"js/box2d/dynamics/b2ContactManager.js",
	"js/box2d/dynamics/b2World.js",
	"js/box2d/dynamics/b2WorldListener.js",
	"js/box2d/dynamics/joints/b2JointNode.js",
	"js/box2d/dynamics/joints/b2Joint.js",
	"js/box2d/dynamics/joints/b2JointDef.js",
	"js/box2d/dynamics/joints/b2DistanceJoint.js",
	"js/box2d/dynamics/joints/b2DistanceJointDef.js",
	"js/box2d/dynamics/joints/b2Jacobian.js",
	"js/box2d/dynamics/joints/b2GearJoint.js",
	"js/box2d/dynamics/joints/b2GearJointDef.js",
	"js/box2d/dynamics/joints/b2MouseJoint.js",
	"js/box2d/dynamics/joints/b2MouseJointDef.js",
	"js/box2d/dynamics/joints/b2PrismaticJoint.js",
	"js/box2d/dynamics/joints/b2PrismaticJointDef.js",
	"js/box2d/dynamics/joints/b2PulleyJoint.js",
	"js/box2d/dynamics/joints/b2PulleyJointDef.js",
	"js/box2d/dynamics/joints/b2RevoluteJoint.js",
	"js/box2d/dynamics/joints/b2RevoluteJointDef.js"
];

urls.current = 0;
urls.next = function() {
	urls.current++;
	if (urls.current < urls.length) {
		urls.load(urls.current);
	}
};
urls.load = function(index) {
	var a = document.createElement("script");
	a.src = urls[index];
	document.body.appendChild(a);
	a.onload = urls.next;
};

urls.load(0);