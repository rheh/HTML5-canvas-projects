/*jslint plusplus: true, sloppy: true, indent: 4 */
(function() {
    "use strict";
    // this function is strict...
}());

(function() {
    
    // RequestAnimFrame: a browser API for getting smooth animations
    window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
		    window.setTimeout(callback, 1000 / 60);
		};
    })();

    // Globals
    var canvas = null,
	ctx = null,
	sprite = null,
	target = null,
	explosion = null;
	sprites = [],
	spriteMap = null,
	targetX = 0,
	targetY = 0,
	bang = null,
	explosions = [],
	shots = 0, hits = 0, accuracy = 0;
    	html = null,
	body = null;
	
    function resizeCanvas() {
	
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

    }
  
    function clearCanvas() {
	
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
    }
    
    function start() {

	var i;
	
	try {
	    
	    clearCanvas();

	    for(i = 0; i < sprites.length; i++) {
		sprites[i].draw(ctx, sprite).move();
	    }

	    for(i =0; i < explosions.length; i++) {
		explosions[i].draw(ctx, explosion);
		hits += explosions[i].checkHits(sprites);
	    }

	    if(shots > 0) {
		accuracy = Math.round((hits / shots) * 100);
	    }

	    ctx.fillStyle = "#cfcfcf";
	    ctx.font = "bold 16pt Arial";
	    ctx.fillText("Shots: " + shots + " Hits: " + hits + 
		    " Accuracy: " + accuracy + "%", 10, 30);

	    //Draw target
	    ctx.drawImage(target, 0,0, 512, 512, 
		targetX - 50, targetY - 50, 
		100, 100);
	}
	catch (e) {
	    
	}
	requestAnimFrame(start);
	 
    }

    function loadSprite() {

	sprite = new Image();
	sprite.src = 'sprite.png';

	target = new Image();
	target.src = 'target.gif';
	
	explosion = new Image();
	explosion.src = 'explosion.png';
	
    }

    function createThings() {
	
	var i;
	
	spriteMap =  [
	    [0, 120], [140, 120], [270, 120] ,[270, 250],
	    [400, 120], [400, 250], [530, 250], [530, 120]
	];
	
	for(i = 0; i < 10; i++) {
	    sprites.push(createThing(spriteMap));
	}
    }
    
    function createThing(spriteMap) {
	
	var cur, map = spriteMap[Math.floor(Math.random() * 
			(spriteMap.length - 1))];
	    
	cur = new Thing(
	    map[0],
	    map[1],
	    Math.floor((Math.random()*canvas.width)+1),
	    Math.floor((Math.random()*canvas.height)+1),
	    canvas
	);

	return cur;
    }
    
    function checkKey(e) {

	e = e || window.event;

	if (e.keyCode === 38) {
	    sprites.push(createThing(spriteMap));
	}
	else if (e.keyCode === 40) {
	    sprites.pop();
	}
    }
    
    function loadMusic() {
	
	var myAudio = new Audio('background-music.wav');
	myAudio.loop = true;
	//myAudio.play();

	// Pre-load
	bang = new Audio('bang.wav');
    }
    
    function init() {
		
	ctx = canvas.getContext('2d');
	document.onkeydown = checkKey;
	
	resizeCanvas();
	loadSprite();
	loadMusic();
	createThings();	
    }
    
    function fixPageXY(e) {
	
	if (e.pageX === null && e.clientX !== null ) {
	    
	  e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
	  e.pageX -= html.clientLeft || 0;

	  e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
	  e.pageY -= html.clientTop || 0;
	}
    }

    function moveTarget(e) {
	
	e = e || window.event;
	fixPageXY(e);
	targetX = e.pageX;
	targetY = e.pageY;

    }
    
    function fire() {

	explosions.push(new Explosion(targetX, targetY, new Audio('bang.wav')));
	shots++;
    }
        
    html = document.documentElement;
    body = document.body;
    canvas = document.getElementById('canvas');
    
    if(canvas !== null) {	
	init();
	start();
    }
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    canvas.onmousemove = moveTarget;
    canvas.onclick = fire;

})();