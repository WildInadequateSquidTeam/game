function Player(nickname, size, xmin, xmax, ymin, ymax, size) {
	// TODO: no min and max , take out the creation of the body
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

	this.setBody = function(body) {
		this.body = body;
	}
	
	/* WTH these work directly with box2d >:[ ,should be like physics.getInfoAboutMehBodyCuzIAmDumbfuck()
	*/
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