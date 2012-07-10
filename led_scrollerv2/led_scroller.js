var letters_pink = null, 
	letters_blue = null, 
	sMessage = "", 
	canvas = null, 
	ctx = null, 
	LETTER_HEIGHT = 350, 
	LETTER_WIDTH = 266.7, 
	iStep = 0, 
	iDrawPhase = 0, 
	job = null, 
	bPink = true;

function drawLetter(iSpriteRow, iSpriteCol,  iPos) {

	var xPos = (LETTER_WIDTH * iPos) - iStep;

	
	if ((xPos > 0 - LETTER_WIDTH) && (xPos < 1200 + LETTER_WIDTH)) {


		bPink = document.getElementById('pink').checked;
		
		if (bPink === true) {

			ctx.drawImage(letters_pink, iSpriteCol * LETTER_WIDTH, iSpriteRow, LETTER_WIDTH, LETTER_HEIGHT, xPos, 0, LETTER_WIDTH, LETTER_HEIGHT);

		} else {

			ctx.drawImage(letters_blue,  iSpriteCol * LETTER_WIDTH, iSpriteRow, LETTER_WIDTH, LETTER_HEIGHT, xPos, 0, LETTER_WIDTH, LETTER_HEIGHT);

		}

	}

}

function draw() {

	var iCounter = 0, 
		iCharCode = 0;

	for ( iCounter = 0; iCounter < sMessage.length; iCounter++) {

		iCharCode = sMessage.charCodeAt(iCounter);

		if (iCharCode > 64 && iCharCode < 91) {
			iSpriteCol = Math.abs(65 - iCharCode) ;
			iSpriteRow = 0;
		} else {
			iSpriteCol = 26;
			iSpriteRow = 0;	
		}

console.log("r:" + iSpriteRow + " c:" + iSpriteCol + " p:" + iCounter + " c:" + sMessage.charAt(iCounter));

		drawLetter(iSpriteRow, iSpriteCol, iCounter);
	}

	iSpriteCol = 1;
	iSpriteRow = 5;

	for (iCounter; iCounter < sMessage.length + 10; iCounter++) {

		drawLetter(iSpriteCol, iSpriteRow, iCounter);
	}

	iDrawPhase += 1;
	iStopPoint = (27 * sMessage.length);

	if (iDrawPhase < iStopPoint) {
		iStep += 38.2;
	} else {
		clearInterval(job);
	}

}

function startAnim() {

	clearInterval(job);
	sMessage = document.getElementById('text').value.toUpperCase();
	iDrawPhase = 0;
	iStep = 0;

	if (sMessage.length === 0) {
		sMessage = "Please enter a phrase";
		document.getElementById('text').value = sMessage;
	} else {

		// Add 5 spaces padding so the text start off right
		sMessage = "    " + sMessage;
		// Start the timer
		job = setInterval(draw, 100);
	}
}

function init() {

	// Grab the clock element
	canvas = document.getElementById('led');

	// Canvas supported?
	if (canvas.getContext('2d')) {
		ctx = canvas.getContext('2d');

		letters_blue = new Image();
		letters_blue.src = 'letters-blue.jpg?v=1';

		letters_pink = new Image();
		letters_pink.src = 'letters-pink.jpg?v=5';
		letters_pink.onload = startAnim;

	} else {
		alert("Canvas not supported!");
	}
}