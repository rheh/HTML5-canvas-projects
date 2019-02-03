(function (window) {
	var letters_pink = null,
		letters_blue = null,
		sMessage = "",
		canvas = null,
		ctx = null,
		LETTER_HEIGHT = 343,
		LETTER_WIDTH = 267,
		iStep = 0,
		iDrawPhase = 0,
		job = null,
		bPink = true;

	let document = window.document;

	function drawLetter(iSpriteRow, iSpriteCol, iPos) {

		var xPos = (LETTER_WIDTH * iPos) - iStep;

		if ((xPos > 0 - LETTER_WIDTH) && (xPos < 1200 + LETTER_WIDTH)) {

			bPink = document.getElementById('pink').checked;

			if (bPink === true) {

				ctx.drawImage(letters_pink, iSpriteRow * LETTER_WIDTH, iSpriteCol * LETTER_HEIGHT, LETTER_WIDTH, LETTER_HEIGHT, xPos, 0, LETTER_WIDTH, LETTER_HEIGHT);

			} else {

				ctx.drawImage(letters_blue, iSpriteRow * LETTER_WIDTH, iSpriteCol * LETTER_HEIGHT, LETTER_WIDTH, LETTER_HEIGHT, xPos, 0, LETTER_WIDTH, LETTER_HEIGHT);

			}

		}

	}

	function draw() {

		var iCounter = 0,
			iCharCode = 0;

		for (iCounter = 0; iCounter < sMessage.length; iCounter++) {

			iCharCode = sMessage.charCodeAt(iCounter);

			if (iCharCode > 64 && iCharCode < 91) {
				iSpriteCol = Math.abs(65 - iCharCode) % 5;
				iSpriteRow = Math.floor(Math.abs(65 - iCharCode) / 5);
			} else {
				iSpriteCol = 1;
				iSpriteRow = 5;
			}

			drawLetter(iSpriteCol, iSpriteRow, iCounter);
		}

		iSpriteCol = 1;
		iSpriteRow = 5;

		for (iCounter; iCounter < sMessage.length + 10; iCounter++) {

			drawLetter(iSpriteCol, iSpriteRow, iCounter);
		}

		iDrawPhase += 1;
		iStopPoint = (27 * sMessage.length);

		if (iDrawPhase < iStopPoint) {
			iStep += 10;
		} else {
			clearInterval(job);
		}

	}

	function startAnim(document) {

		clearInterval(job);
		sMessage = document.getElementById('text').value.toUpperCase();
		iDrawPhase = 0;
		iStep = 0;

		if (sMessage.length === 0) {
			sMessage = "Please enter a phrase";
			document.getElementById('text').value = sMessage;
		} else {

			// Add 5 spaces padding so the text start off right
			sMessage = "     " + sMessage;
			// Start the timer
			job = setInterval(draw, 10);
		}
	}

	function init() {

		// Grab the clock element
		canvas = document.getElementById('led');

		// Canvas supported?
		if (canvas.getContext('2d')) {
			ctx = canvas.getContext('2d');

			letters_blue = new Image();
			letters_blue.src = 'letters-blue.jpg?v=10';

			letters_pink = new Image();
			letters_pink.src = 'letters-pink.jpg?v=10';
			letters_pink.onload = startAnim.bind(this, document);

		} else {
			alert("Canvas not supported!");
		}
	}

	init();
})(window);