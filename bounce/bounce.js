/*jslint plusplus: true, sloppy: true, indent: 4 */
var canvas = null,
	ctx = null,
	letters =  [],
	bg = null;

(function () {
    "use strict";
    // this function is strict...
    // RequestAnimFrame: a browser API for getting smooth animations
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
}());

function clearCanvas() {
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
	var i  = letters.length;
	clearCanvas();
	while (i--) {
		letters[i].move();
		letters[i].draw();
	}
}

function setUpLetterArray() {
	return [
		{
			/* G */
			bgimagex: 0,
			bgimagey: 0,
			factor: 1,
			height: 156,
			width: 130,
			top: (0 - Math.floor((Math.random() * 400) + 1))
		},
		{
			/* o */
			bgimagex: 133,
			bgimagey: 35,
			factor: 1,
			height: 100,
			width: 90,
			top: (0 - Math.floor((Math.random() * 400) + 1))
		},
		{
			/* o */
			bgimagex: 222,
			bgimagey: 35,
			factor: 1,
			height: 100,
			width: 90,
			top: (0 - Math.floor((Math.random() * 400) + 1))
		},
		{
			/* g */
			bgimagex: 315,
			bgimagey: 50,
			factor: 1,
			height: 142,
			width: 88,
			top: (0 - Math.floor((Math.random() * 400) + 1))
		},
		{
			/* l */
			bgimagex: 405,
			bgimagey: 0,
			factor: 1,
			height: 192,
			width: 40,
			top: (0 - Math.floor((Math.random() * 400) + 1))
		},
		{
			/* e */
			bgimagex: 450,
			bgimagey: 45,
			factor: 1,
			height: 100,
			width: 75,
			top: (0 - Math.floor((Math.random() * 400) + 1))
		}
	];
}

function loop() {
	update();
	window.requestAnimFrame(loop);
}

function setUpBalls() {
	var iCounter,
		x = 0,
		lettersConf = setUpLetterArray();

	for(iCounter = 0; iCounter < lettersConf.length; iCounter++) {
		letters.push(new Letter(x, bg, lettersConf[iCounter]));
		x += lettersConf[iCounter].width;
	}

	loop();
}

function loadBackground(callback) {
	// Load the background
	bg = new Image();
	bg.src = 'background.png';
	bg.onload = callback;
}

window.addEventListener('load', function () {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	loadBackground(function() {
		setUpBalls();
	});
}, false);