function Thing(mapX, mapY, x, y, canvas) {

    this.x = x;
    this.y = y;	
    this.mapX = mapX;
    this.mapY = mapY;
    this.height = 50;
    this.width = 50;
    this.direction = Math.floor((Math.random()*359));
    this.speed = Math.floor((Math.random()*50) + 5);
    this.erratic = (Math.floor((Math.random()* 4) + 1) === 1);
    this.gravitationalPull = 0;
    this.canvas = canvas;
    this.tick = 0;
    this.changeAt = Math.floor((Math.random()*50) + 1);
    this.correctXY();
    this.hit = false;
};

Thing.prototype.draw = function(ctx, sprite) {
    
    if(this.hit === false) {
	
	ctx.drawImage(sprite, this.getMapX(), this.getMapY(),
	    90, 90, 
	    this.getX(), this.getY(), 
	    this.getWidth(), this.getHeight());
    }
    
    return this;
};

Thing.prototype.correctXY = function() {

    if(this.x + this.width >= this.canvas.width) {
	this.x = this.canvas.width - this.width ;
    } else if(this.x < 0) {
	this.x = 0;
    } else if(this.y < 0) {
	this.y = 0;
    } else if(this.y + this.height >= this.canvas.height) {
	this.y = this.canvas.height - this.height ;
    }
};

Thing.prototype.getX = function() {
  return this.x;
};

Thing.prototype.getY = function() {
  return this.y;
};

Thing.prototype.getMapX = function() {
  return this.mapX;
};

Thing.prototype.getMapY = function() {
  return this.mapY;
};

Thing.prototype.getWidth = function() {
  return this.width;
};

Thing.prototype.getHeight = function() {
  return this.height;
};

Thing.prototype.setHit = function() {
  this.hit = true;
};

Thing.prototype.getHit = function() {
  return this.hit;
};


Thing.prototype.checkBoundaryCollision = function() {

    if (this.x + this.width > this.canvas.width ||
	this.x < 0) {
	this.direction = 2 * 0 - this.direction - 180;
    } else if(this.y < 0 ||
	this.y + this.height > this.canvas.height) {
	this.direction = 2 * 90 - this.direction - 180;
    }
};

Thing.prototype.move = function() {

    if(this.hit === true) {
	return;
    }
    var delta = 0.2;

    this.x += Math.cos(this.toRad(this.direction)) * delta * this.speed;
    this.y -= Math.sin(this.toRad(this.direction)) * delta * this.speed;

    this.checkBoundaryCollision();
    this.correctXY();

    this.direction+= this.gravitationalPull;

    if(this.direction < 0) {
	this.direction += 360;
    } else if(this.direction > 360) {
	this.direction -= 360;
    }

    this.tick++;

    if(this.tick > this.changeAt) {
	this.tick = 0;
	this.gravitationalPull = Math.floor((Math.random()*6));
	
	if(this.erratic) {
	    this.direction = Math.floor((Math.random()*359));
	    this.speed = Math.floor((Math.random()*50) + 5);
	}
    }

};

Thing.prototype.toRad = function(v) {
    /** Converts numeric degrees to radians */
    return v * Math.PI / 180;
};