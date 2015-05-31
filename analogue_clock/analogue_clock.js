// Global variable
var clock_face = null,
	hour_hand = null,
	minute_hand = null,
	second_hand = null,
	ctx = null,
	degrees = 0;

var HEIGHT = 500;
var WIDTH = 500;
var HALF_HEIGHT = HEIGHT / 2;
var HALF_WIDTH = WIDTH / 2;
var FPS = 15;

var CIRCLE_TO_HOUR_RATIO = 360 / 12;
var CIRCLE_TO_MINUTES_RATIO = 360 / 60;
var CIRCLE_TO_MS_RATIO = 360 / 60000;

var DEGRESS_TO_RADIANS = Math.PI / 180;
var RADIANS_TO_DEGREES = 180 / Math.PI;

function clearCanvas() {
	 // clear canvas
	ctx.clearRect(0, 0, HEIGHT, WIDTH);
}

function getRequiredMinuteAngle(currentTime) {
	// Calculate the expected angle
	return Math.floor(CIRCLE_TO_MINUTES_RATIO * currentTime.getMinutes(), 0);
}

function getRequiredHourAngle(currentTime) {
	// Calculate the expected angle
	return Math.floor(CIRCLE_TO_HOUR_RATIO * currentTime.getHours(), 0);
}

function getRequiredSecondAngle(currentTime) {
	// Calculate the expected angle
	var secondsToMilliseconds = currentTime.getSeconds() * 1000;
	var totalMilliseconds = currentTime.getMilliseconds() + secondsToMilliseconds;
	return Math.floor(CIRCLE_TO_MS_RATIO * totalMilliseconds, 0);
}

function rotateAndDraw(image, angle) {
	// Rotate around this point
	ctx.rotate(angle * DEGRESS_TO_RADIANS);

	// Draw the image back and up
	ctx.drawImage(image, 0 - HALF_HEIGHT, 0 - HALF_WIDTH);
}

function draw() {
	var currentTime = new Date();

	clearCanvas();

	// Draw the clock onto the canvas
	ctx.drawImage(clock_face, 0, 0);

	// Save the current drawing state
	ctx.save();

	// Now move across and down half way
	ctx.translate(HALF_HEIGHT, HALF_WIDTH);

	rotateAndDraw(minute_hand, getRequiredMinuteAngle(currentTime));
	rotateAndDraw(hour_hand, getRequiredHourAngle(currentTime));
	rotateAndDraw(second_hand, getRequiredSecondAngle(currentTime));

	// Restore the previous drawing state
	ctx.restore();

	window.requestAnimationFrame(draw, 1000 / FPS);
}

function imgLoaded() {
	// Image loaded event complete.  Start the timer
	window.requestAnimationFrame(draw, 1000 / FPS);
}

function init() {
	// Grab the clock element
	var canvas = document.getElementById('clock');

	// Canvas supported?
	if (canvas.getContext('2d')) {
		ctx = canvas.getContext('2d');

		// Load the hor hand image
		hour_hand = new Image();
		hour_hand.src = 'hour_hand.png';

		// Load the minute hand image
		minute_hand = new Image();
		minute_hand.src = 'minute_hand.png';

		// Load the minute hand image
		second_hand = new Image();
		second_hand.src = 'second_hand.png';

		// Load the clock face image
		clock_face = new Image();
		clock_face.src = 'clock_face.png';
		clock_face.onload = imgLoaded;

	} else {
		alert("Canvas not supported!");
	}
}
