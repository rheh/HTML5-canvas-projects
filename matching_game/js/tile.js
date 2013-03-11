function tile(id) {
	
	this.id = id;
	this.frontColor = '#fcfcfc';
	this.backColor = '#fff';
	this.startAt = 1000;
	this.flipped = false;
	this.backContentImage = null;
	this.flipCompleteCallbacks = new Array();
	
	this.flip = function() {

		$("#" + this.id).flip({
			direction: this.flipMethod,
			color: this.backColor,
			content: this.getBackContent(),
			onEnd: this.onFlipComplete()
		});

		$("#" + this.id + " img").show();
		
		this.flipped = true;
	};
	
	this.onFlipComplete = function() {
	
		console.log("Flip complete");
		
		while(this.flipCompleteCallbacks.length > 0) {
			
			console.log("Running callback " + this.flipCompleteCallbacks[this.flipCompleteCallbacks.length - 1]);
			this.flipCompleteCallbacks[this.flipCompleteCallbacks.length - 1]();
			this.flipCompleteCallbacks.pop();
		}
	};
	
	this.revertFlip = function() {

		console.log("Reverting tile " + this.id);
		
		$("#" + this.id + " img").hide();
		
		$("#" + this.id).revertFlip();

		this.flipped = false;
	};
	
	this.setBackContentImage = function(sBackContentImage) {
		this.backContentImage = sBackContentImage;
	};
	
	this.setTileId = function(sIdOfTile) {
		this.id = sIdOfTile;
	};

	this.setStartAt = function(iStartAt) {
		this.startAt = iStartAt;
	};
	
	this.setFrontColor = function(sColor) {
		this.frontColor = sColor;
	};

	this.setBackColor = function(sColor) {
		this.backColor = sColor;
	};

	this.setFlipMethod = function(sFlipMethod) {
		this.flipMethod = sFlipMethod;
	};
	
	this.getHTML = function() {
		return '<div id="' + this.id + '" class="tile ' + this.frontColor + '">' + '</div>';
	};

	this.getStartAt = function() {
		return this.startAt;
	};

	this.getFlipped = function() {
		return this.flipped;
	};
	
	this.getBackContent = function() {
		return '<img src="' + this.backContentImage + '"/>';
	};

	this.getBackContentImage = function() {
		return this.backContentImage;
	};
	
	this.addFlipCompleteCallback = function(callback) {
		this.flipCompleteCallbacks.push(callback);
	};
}