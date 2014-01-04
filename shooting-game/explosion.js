
function Explosion(x, y, audio) {

    this.x = x;
    this.y = y;
    this.drawing = true;
    this.explosionFrame = 15;
    this.width = 200;
    this.height = 200;
    
    audio.play();
    
};

Explosion.prototype.getDrawing = function() {

    return this.drawing;
    
};

Explosion.prototype.checkHits = function(things) {
  	
    if(this.drawing === false) {
	return 0;
    }
    
    var centreX = (this.x - 100)  + (this.width / 2),
	centreY = (this.y - 90) + (this.height / 2),
	hits = 0;

    for(i = 0; i < things.length; i++) {
	
	if(centreX > things[i].getX() &&
	    centreX < things[i].getX() + things[i].getWidth() &&
	    centreY > things[i].getY() &&
	    centreY < things[i].getY() + things[i].getHeight() &&
	    things[i].getHit() === false) {
	
	    things[i].setHit();
	    
	    hits++;

	}
     }
     
     return hits;
};  

Explosion.prototype.draw = function(ctx, explosion) {

    if(this.drawing === false) {
	return this;
    }
    
    try {

	if(this.explosionFrame-- <= 0) {
	    this.drawing = false;
	}
	
	//Draw explostion
	ctx.drawImage(explosion, ((this.explosionFrame % 10) -1) * 65, 0,
	    65, 65, 
	    this.x - 100, this.y - 90, 
	    this.width, this.height);
	
    }
    catch(e) {
	
    }
    return this;
    
};

