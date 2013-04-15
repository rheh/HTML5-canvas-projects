var Letter = function (x, bg, ballSettings) {
	this.vy = 0;
	this.vx = 0;
	this.vyAdjust = -13;
	this.width = ballSettings.width;
	this.height = ballSettings.height;
	this.x = x;
	this.y = ballSettings.top;
	this.originaly = ballSettings.top;
	this.imagex = ballSettings.bgimagex;
	this.imagey = ballSettings.bgimagey;
	this.bg = bg;
	this.bounceFactor = ballSettings.factor;
	this.bounces = 0;
	this.draw = function () {
		ctx.drawImage(this.bg,
			this.imagex, this.imagey,
			this.width, this.height,
			this.x, this.y,
			this.width, this.height
		);
	};
	this.impact = function () {
		this.vy = this.vyAdjust;
		this.bounces++;
	};
	this.move = function () {
		this.y += this.vy;
		this.vy += 0.25; //gravity
		// Bounce the ball when it hits the bottom
		if(this.bounces > 1) {
			if ((this.y + this.height) > canvas.height + 200) {
				this.bounces = 0;
				this.vyAdjust = -13;
				this.y = this.originaly;
			}
		}
		else if ((this.y + this.height) > canvas.height - 10) {
			this.impact();
			this.vyAdjust = (this.vyAdjust * this.bounceFactor);
		}
	};
};