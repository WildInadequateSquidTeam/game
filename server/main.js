// Tools

Math.D2R       = Math.PI / 180; // Multiply to convert degrees to radians.
Math.R2D       = 180 / Math.PI; // Multiply to convert radians to degrees.
Math.DOUBLE_PI = Math.PI * 2;   // 360 degrees in radians.



// Constants

var FPS = 30;
var BOX2D_VELOCITY_ITERATIONS = 10;
var BOX2D_POSITION_ITERATIONS = 10;

var PLAYER_SPEED = 0.5;
var GRAVITY = 9.8;

// TODO: make a freaking input system handle
// Key constants

var MOUSE_LMB   = 1;
var MOUSE_RMB   = 2;
var MOUSE_MMB   = 4;
var KEY_LEFT    = 1;
var KEY_RIGHT   = 2;
var KEY_UP      = 4;
var KEY_DOWN    = 8;
var KEY_ACTION1 = 16;
var KEY_ACTION2 = 32;
var KEY_ACTION3 = 64;
var KEY_ACTION4 = 128;

var MOUSE_LMB = 1;
var MOUSE_RMB = 2;
var MOUSE_MMB = 4;

// TODO: this should go to another module
// Clients handling

var CLIENTS_MAX = 10;
var clients = [];
clients.id = 0;

clients.broadcast = function(type, message) {
	for (var i = 0; i < this.length; i++) {
		this[i].socket.emit(type, message);
	}
};

clients.add = function(name, socket) {

	if (this.length < CLIENTS_MAX) {

		// Create client
		var c = new Client(this, this.id++, name, socket);
		
		// Notify everyone else about new player
		this.broadcast("playerJoin", {
			id: c.id,
			nickname: c.player.nickname,
			position: c.player.getPosition()
		});
		
		// Save client to base
		this.push(c);
		
		// Collect and send current state
		var currentState = {
			players: [],
			bodies: []
		};
		for (var i = 0; i < this.length; i++) {
			currentState.players.push({
				id: this[i].id,
				nickname: this[i].player.nickname,
				position: this[i].player.getPosition()
			});
		}
		// FIXME: fill currentState.bodies in _faster_ way with _correct_ info

		for (var i = 0; i < level.bodies.length; i++) {
			var l = level.bodies[i];
			currentState.bodies.push({
				id:       l.id,
				position: l.m_body.m_xf.position,
				angle:    l.m_body.m_sweep.a,
				isCircle: l.isCircle,
				data:     l.isCircle ?	{
					radius: l.GetShape().m_radius
				} : {
					vertices: l.GetShape().GetVertices()
				}
			});
		};
		
		c.socket.emit("initState", {
			yourId: c.id,
			players: currentState.players,
			bodies:  currentState.bodies
		});

		console.log("Client [" + c.id + "] \"" + c.player.nickname + "\" connected");
		
	} else {
		
		socket.emit("full");
		
	}
	
};

clients.remove = function(client) {
	var index = 0;
	// Notify everyone about player leaving
	for (var i = 0; i < this.length; i++) {
		if (this[i] != client) {
			this[i].socket.emit("playerLeft", {
				id: client.id
			});
		} else {
			index = i;
		}
	}
	//Remove client body from world
	world.DestroyBody(client.player.body.m_body);
	// Remove client from base
	delete this[index];
	this.splice(index, 1);
};


function Player(nickname, size, xmin, xmax, ymin, ymax, size) {
	// TODO: no min and max , take away the creation of the body
	// and well, the freaking keystate too, we have another way for this, arent we?
	if (size == undefined) {
		size = 0.5;
	}
	if (xmin == undefined) {
		xmin = -15;
		xmax =  15;
		ymin =  -5;
		ymax =  -5;
	}

	this.nickname = nickname;
	this.keyState = 0;
	this.mouse ={
		x: 0,
		y: 0,
		btnState: 0
	};

	this.body = world.createBox(
		xmin + (xmax - xmin) * Math.random(),
		ymin + (ymax - ymin) * Math.random(),
		size, size, false, true
	);
	
	this.getPosition = function() {
		return this.body.m_body.m_xf.position;
	};
	this.setPosition = function(position) {
		return this.body.m_body.SetPosition(position);
	};
	
	this.getLinearVelocity = function() {
		return this.body.m_body.GetLinearVelocity();
	};
	this.setLinearVelocity = function(velocity) {
		return this.body.m_body.SetLinearVelocity(velocity);
	};
	
	this.getAngle = function() {
		return this.body.m_body.GetAngle();
	};
	this.setAngle = function(angle) {
		return this.body.m_body.SetAngle(angle);
	};
	
}

function Client(clients, id, name, socket) {

	// Link to clients array
	this.clients = clients;
	
	this.id = id;

	this.player = new Player(name);
	this.socket = socket;
	this.socket.client = this;
	
	this.socket.on("key", function(data) {
		this.client.player.keyState = parseInt(JSON.parse(data)[0]);
		//console.log("Client [" + this.client.player.nickname + "] KeyState:<" + this.client.player.keyState + ">");
	});
	
	this.socket.on("disconnect", function() {
		console.log("Client [" + this.client.id + "] \"" + this.client.player.nickname + "\" disconnected");
		this.client.clients.remove(this.client);
	});

	this.socket.on("mouse", function(data){
		var parsedData = JSON.parse(data)[0];
		this.client.player.mouse = parsedData;
	});

	this.socket.on("mouseDown", function(data){
		var parsedData = JSON.parse(data)[0];
		this.client.player.mouse = {
			x: parsedData.x,
			y: parsedData.y,
			btnState: parsedData.btnState
		};
		var plPos = this.client.player.getPosition();
		if((parsedData.button == MOUSE_LMB) || (parsedData.button == MOUSE_RMB)){
			level.bodies.add(
				world.createBox(
					parsedData.x, 
					parsedData.y,
					Math.random() + 0.3,
					Math.random() + 0.3,
					parsedData.button == MOUSE_RMB,
					Math.random() > 0.5
				));
		}else{
			for (var i = 0; i < level.bodies.length; i++) {
				if(level.bodies[i].TestPoint(new b2Vec2(parsedData.x,parsedData.y))){
					level.bodies.remove(level.bodies[i]);
					break;
				}
			};
		}
	});

	this.socket.on("mouseUp", function(data){
		var parsedData = JSON.parse(data)[0];		
		this.client.player.mouse = {
			x: parsedData.x,
			y: parsedData.y,
			btnState: parsedData.btnState
		};
	});


	this.socket.on("svRunCommand", function(data) {
		var command = JSON.parse(data)[0]
		console.log(this.client.player.nickname + " commands: " + command);
		try {
			eval(command + ";");
		} catch(e) {
			console.log("Error: " + e.message);
			this.emit("say", {
				nickname: "server",
				message: "Error" + e.message
			});
		}
	});
	
	this.socket.on("svBroadcastCommand", function(data) {
		var command = JSON.parse(data)[0];
		console.log(this.client.player.nickname + " broadcasts command: " + command);
		this.client.clients.broadcast("runCommand", {
			nickname: this.client.player.nickname,
			command: command
		});
	});
	
	this.socket.on("say", function(data) {
		var message = JSON.parse(data)[0];
		console.log(this.client.player.nickname + ": " + message);
		clients.broadcast("say", {
			nickname: this.client.player.nickname,
			message: message
		});
	});

	this.socket.on("listPlayers", function(data) {
		var message = "";
		for (var i = 0; i < clients.length; i++) {
			if(i != 0) message += ","
				message += " [" + clients[i].id + "] " + clients[i].player.nickname;
		};
		this.emit("say", {
			nickname: "server",
			message: message
		});
	});
	
	this.toSendable = function() {
		//console.log(this.player.getAngle());
		return {
			id: this.id,
			position: this.player.getPosition(),
			angle: this.player.getAngle(),
			mouse: this.player.mouse
		};
	};
	
}




function Level() {

	this.bodies = [];
	this.bodies.add = function(body) {
		clients.broadcast("bodyCreate", {
				id:       body.id,
				position: body.m_body.m_xf.position,
				angle:    body.m_body.m_sweep.a,
				isCircle: body.isCircle,
				data:     body.isCircle ?	{
					radius: body.GetShape().m_radius
				} : {
					vertices: body.GetShape().GetVertices()
				}
		});
		this.push(body);
		return body;
	};
	this.bodies.remove = function(body) {
		//Remove body from client
		clients.broadcast("bodyDestroy",{
			id: body.id
		});
		//Remove body from world
		world.DestroyBody(body.m_body);
		var index;
		for (var i = 0; i < this.length; i++) {
			if(this[i] == body){
				index = i;
				break;
			}
		};
		delete this[index];
		this.splice(index, 1);
	};
	
}

var level = new Level();


// TODO: another module
// === Init Box2D ===

var Box2D = require("./box2d.js");

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

world.createBox = function(x, y, width, height, static, circle) {

	var bodyDef = new b2BodyDef;
	bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
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
	
}


// TODO: make a proper level format and load function, in other module (logic etc)
// Create boundaries
level.bodies.add(world.createBox(   0,   10, 500,   1, true));
level.bodies.add(world.createBox(   0, -490, 500,   1, true));
level.bodies.add(world.createBox( 250, -250,   1, 500, true));
level.bodies.add(world.createBox(-250, -250,   1, 500, true));


// Create random init bodies
for (var i = 0; i < 150; i++) {
	var fixed = Math.random() > 0.5;
	var width = fixed ? Math.random()*10 + 4 : Math.random() + 0.3 ;
	var height = fixed ? Math.random()*10 + 4: Math.random() + 0.3 ;
	level.bodies.add(
		world.createBox(
			-200 + 400 * Math.random(),
			-480 + 470 * Math.random(), 
			width, height,
			fixed,
			Math.random() > 0.5
		)
	);
}


//TODO: take away into other module
// === Launch physics ===
// TODO: Optimize. This shit consumes bandwidth 
// like little black pet from futurama eats shit
setInterval(function() {

	// Update world
	world.Step(
		1 / FPS,
		BOX2D_VELOCITY_ITERATIONS,
		BOX2D_POSITION_ITERATIONS
	);
	
	
	// Collect and send current state
	
	var currentState = {
		players: [],
		bodies: []
	};
	
	// Collect and update players state
	for (var i = 0; i < clients.length; i++) {
	
		currentState.players.push(clients[i].toSendable());
		
	
		var p = clients[i].player;
		var vel = p.getLinearVelocity();
		var ks = p.keyState;
		
		if ((ks & KEY_LEFT ) != 0) { vel.x -= PLAYER_SPEED; }
		if ((ks & KEY_RIGHT) != 0) { vel.x += PLAYER_SPEED;	}
		if ((ks & KEY_UP   ) != 0) { vel.y -= PLAYER_SPEED;	}
		if ((ks & KEY_DOWN ) != 0) { vel.y += PLAYER_SPEED;	}
		if ((ks & KEY_ACTION1) != 0) {
			vel.x = vel.y = 0;
			// FIXME: this doesn"t work
			//p.body.SetAngularVelocity(vel);
			p.setPosition(new b2Vec2(0, 0));
		}
		if ((ks & KEY_ACTION2) != 0) {
			vel.x *= 0.5;
			vel.y *= 0.5;
		}
		p.setLinearVelocity(vel);
		
	}
	
	// Collect bodies state
	for (var i = 0; i < level.bodies.length; i++) {
		currentState.bodies.push({
			id:       level.bodies[i].id,
			position: level.bodies[i].m_body.m_xf.position,
			angle:    level.bodies[i].m_body.m_sweep.a
		});
	}
	
	// Send 
	clients.broadcast("currentState", {
		players: currentState.players,
		bodies:  currentState.bodies
	});

}, 1000 / FPS);


// TODO: take out to networking
// === Launch server ===

var app = require("http").createServer();
var io = require("socket.io").listen(app);

io.set("log level", 1);
app.listen(1337);
// TODO: make auth or something
io.sockets.on("connection", function(socket) {
	socket.on("name", function(data) {
		clients.add(JSON.parse(data)[0], this);
	});
	
});

io.sockets.on("disconnect", function() {	
	console.log("Some client disconnected. Total clients: " + clients.length);
});



// Special server commands
function debug() {

	var debugBodies = [];

	for (var b = world.m_bodyList; b; b = b.m_next) {
		debugBodies.push({
			position: b.GetPosition()
		});
	}

	clients.broadcast("debug", {
		bodies: debugBodies
	});
	
}


function bodyDeleteById(id) {

	for (var i = 0; i < level.bodies.length; i++) {
		if(level.bodies[i].id == id){
			level.bodies.remove(level.bodies[i]);
		}
	};
};

function bodyDeleteAll(){ // wont remove all bodies actually
	for (var i = 4; i < level.bodies.length; i++) {
			level.bodies.remove(level.bodies[i]);
	}; 
}