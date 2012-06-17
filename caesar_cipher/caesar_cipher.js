// Global variable
var img = null,
	dial = null,
	ctx = null,
	degrees = 0,
	bTurning = false,
	timer = null,
	bClockwise = true;

function clearCanvas() {
	 // clear canvas
	ctx.clearRect(0, 0, 500, 500);
}

function stopTimer() {
	// Stop the timer
	clearTimeout(timer);
	bTurning = false;
}

function startTimer() {
	// Start the timer
	clearTimeout(timer);
	bTurning = false;
}

function calculateNewAngle(iExpectedAngle) {

	// If we've hit the right place stop the timer
	if (iExpectedAngle === degrees) {
		stopTimer();
		return;
	}

	if (bClockwise) {
		// Increment the angle of the needle by 5 degrees
		degrees += 3;

		// Check if we have passed the 0/360 point and adjust
		if (degrees > 360) {
			degrees = 0;
		}

		// Check if we have moved past the target
		if (degrees > iExpectedAngle) {
			degrees = iExpectedAngle;
		}

	} else {

		// Decrement the angle of the needle by 5 degrees
		degrees -= 3;

		// Check if we have passed the 0/360 point and adjust
		if (degrees < 0) {
			degrees = (iExpectedAngle === 0 ? 0 : 360);
		}

		// Check if we have moved past the target
		if (degrees < iExpectedAngle) {
			degrees = iExpectedAngle;
		}
	}
}

function getRequiredAngle() {
	// Grab a handle to the shift input
	var shift = document.getElementById('shift'),
		iExpectedAngle = 0,
		iShiftInput = 0;

	if (shift !== null) {

		// Make sure we have a number
		iShiftInput = shift.value * 1.0;

		// Calculate the expected angle for the shift
		iExpectedAngle = Math.floor(((360 / 26) * (iShiftInput % 26)), 0);
	}

	return iExpectedAngle;
}

function draw() {

	var iExpectedAngle = getRequiredAngle();

	calculateNewAngle(iExpectedAngle);

	clearCanvas();

	// Draw the background onto the canvas
	ctx.drawImage(img, 0, 0);

	// Save the current drawing state
	ctx.save();

	// Now move across and down half the image
	ctx.translate(245, 264);

	// Rotate around this point
	ctx.rotate(degrees * (Math.PI / 180));

	// Draw the shifted letters
	ctx.drawImage(dial, -245, -264);

	// Restore the previous drawing state
	ctx.restore();

}
function checkForShiftChange() {
	// Get the angle related to the shift value
	var iExpectedAngle = getRequiredAngle();

	// If the currect angle is not the expected angle start the timer
	if (iExpectedAngle !== degrees) {

		if (bTurning) {
			stopTimer();
		}

		// Determine which way the rotation for move
		bClockwise = iExpectedAngle > degrees;

		// Star the timer
		timer = setInterval(draw, 50);
		bTurning = true;
	}
}

function init() {
	// Grab the compass element
	var canvas = document.getElementById('caesar');

	// Canvas supported?
	if (canvas.getContext('2d')) {
		ctx = canvas.getContext('2d');

		// Load the needle image
		dial = new Image();
		dial.src = 'caesar_cipher_dial.png';

		// Load the compass image
		img = new Image();
		img.src = 'caesar_cipher.png';
		img.onload = draw;

		// Start the change input monitor timer
		setInterval(checkForShiftChange, 1000);

	} else {
		alert("Canvas not supported!");
	}
}