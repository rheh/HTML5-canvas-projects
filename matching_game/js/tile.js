function tile(id) {
	this.id = id;
	this.backContentImage = null;

	this.setBackContentImage = function(sBackContentImage) {
		this.backContentImage = sBackContentImage;
	};
	
	this.setTileId = function(sIdOfTile) {
		this.id = sIdOfTile;
	};
	
	this.getHTML = function() {
		return '<div id="' + this.id + '" class="tile ' + this.backContentImage + '">' + '</div>';
	};
	
	this.getBackContent = function() {
		return '<img src="' + this.backContentImage + '"/>';
	};

	this.getBackContentImage = function() {
		return this.backContentImage;
	};
}