/*jslint plusplus: true, sloppy: true, indent: 4 */
(function () {
    "use strict";
    // this function is strict...
}());

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
    background = null,
    car_sprite = null,
    game_data = null,
    CAR_WIDTH = 100,
    CAR_HEIGHT = 37,
    STEP_COUNT_MILLISECONDS =  1000 / 30,
    RACE_LENGTH = 20,
    RACE_FINISH_LINE_X = 770,
    iTime = 0,
    iFinishPlace = 1;

function clearCanvas() {

    // clear canvas
    ctx.clearRect(0, 0, canvas.height, canvas.width);
}

function drawBackground() {

    clearCanvas();
    ctx.drawImage(background, 0, 0);
    
    loadCarSprite();
}

function loadBackground() {

    // Load the timer
    background = new Image();
    background.src = 'race-scence.png';
    background.onload = drawBackground;
}

function setupGameData() {

    var json = 
    {
        cars:
        [
            {
                "colour": 'blue',
                "x": 0,
                "y": 450,
                "spritex": 0,
                "spritey": 0,
                "graph": null,
                "step": 77,
                "position": null
            },
            {
                "colour": 'green',
                "x": 0,
                "y": 470,
                "spritex": 0,
                "spritey": 37,
                "graph": null,
                "step": 65,
                "position": null
            },
            {
                "colour": 'red',
                "x": 0,
                "y": 490,
                "spritex": 0,
                "spritey": 74,
                "graph": null,
                "step": 53,
                "position": null
            },
            {
                "colour": 'green',
                "x": 0,
                "y": 510,
                "spritex": 0,
                "spritey": 111,
                "graph": null,
                "step": 39,
                "position": null
            }
        ],
        graphs:
        [
            [0,5,10,20,40,60,70],
            [0,10,20,30,40,50,60],
            [0,20,39,40,50,55,58],
            [0,10,20,30,40,50,55],
            [0,25,45,47,49,50,52],
            [0,10,20,29,38,45,50],
            [0,15,20,25,30,40,45],
            [0,2,4,8,20,30,40],
            [0,5,10,15,20,25,30],
            [0,1,3,14,15,22,30],
            [0,5,11,14,17,22,25],
            [0,20,30,44,67,72,90],
            [0,2,7,24,47,52,65],
            [0,2,9,20,40,52,70]
        ]
    };

    return json;    
}

function drawCar(car) {
    
    // Draw the car onto the canvas
    ctx.drawImage(car_sprite,
        car.spritex, car.spritey,
        CAR_WIDTH, CAR_HEIGHT,
        car.x + car.step, car.y,
        CAR_WIDTH, CAR_HEIGHT);
        
     drawText(car);
}

function drawCars() {

    var iCarCounter;
    
    for(iCarCounter = 0; iCarCounter < game_data.cars.length; iCarCounter++) {
        
        drawCar(game_data.cars[iCarCounter]);
    }
}

function initCar(current_car) {
    
    current_car.graph = Math.floor(Math.random() * game_data.graphs.length);
       
}

function initGameState() {

    var iCarCounter;
    
    for(iCarCounter = 0; iCarCounter < game_data.cars.length; iCarCounter++) {

        initCar(game_data.cars[iCarCounter]);

    } 
}

function getPositionAtTime(graph_index, percentageElapsed) {
        
    var graph = game_data.graphs[graph_index],
        iNumberOfGraphPoints = graph.length,
        iGraphPosition = null,
        iFloor = null,
        iCeil = null,
        p = null;
        position = null;

    iGraphPosition = (iNumberOfGraphPoints / 100) * percentageElapsed;
    
    iFloor = Math.floor(iGraphPosition);
    iCeil = Math.ceil(iGraphPosition);
    
    if(iGraphPosition === iFloor) {
        
        position = graph[iFloor];
        
    } else if(iGraphPosition === iCeil) {
        
        position = graph[iCeil];
        
    } else {
                
        p = (graph[iCeil] - graph[iFloor]) / 100;
        
        position = ((iGraphPosition - iFloor) * 100) * p + graph[iFloor];

    }
  
    return position;

}

function redrawRoadSection() {
    
    ctx.drawImage(background, 0, 400, 1000, 200, 0, 400, 1000, 200);
    
}

function graphPosToScreenPos() {
    
    return (900 / 100)  * (position / 60 * 100);
    
}

function updateDebugWindow() {

    // Debug window
    var time = document.getElementById('time');

    if(time !== null)  {
       
       time.value = iTime / 1000;
    } 
}


function drawText(current_car) {

    if(current_car.position !== null) {
        
        ctx.strokeStyle = "black";
        ctx.font = "normal 12px Facebook Letter Faces";
        ctx.strokeText(current_car.position, RACE_FINISH_LINE_X + current_car.step + 110, current_car.y + 25);
    
    }
      
}

function moveCar(iCarCounter) {

    var current_car =  game_data.cars[iCarCounter],
        seconds = iTime / 1000,
        percentageElapsed = (seconds / RACE_LENGTH) * 100,
        a = 20,
        velocity = 2,
        position = getPositionAtTime(current_car.graph, percentageElapsed);
    
    if(current_car.x < RACE_FINISH_LINE_X) {
        
        current_car.x =  graphPosToScreenPos(position) + (velocity * seconds) + (1/2 * a * Math.pow(seconds, 2));
        
    }
    else {
        
        current_car.x = RACE_FINISH_LINE_X;
        
        if(current_car.position === null) {
            
            current_car.position = iFinishPlace++;
        }
    }
    
    drawCar(current_car);
}

function initCars() {
    
    game_data = setupGameData();
    
    initGameState();
    drawCars();
}

function stopLoop() {
 
    iTime = 0; 
    iFinishPlace = 1; 
}


function startRace() {
    
    var iCarCounter;

    redrawRoadSection();
    
    for(iCarCounter = 0; iCarCounter < game_data.cars.length; iCarCounter++) {

        moveCar(iCarCounter);
      
    } 

    updateDebugWindow();
    
    if(iFinishPlace > 4) {
    
        stopLoop();
        
    } else {
        
        iTime += STEP_COUNT_MILLISECONDS;
    
        requestAnimFrame(startRace);
    }
}

function startLoop() {
    
    stopLoop();
    
    requestAnimFrame(startRace);
}

function loadCarSprite() {

    // Load the timer
    car_sprite = new Image();
    car_sprite.src = 'car-sprite.gif';
    car_sprite.onload = initCars;
}

function draw() {

	// Main entry point got the motion canvas example
	canvas = document.getElementById('motion');

	// Canvas supported?
	if (canvas.getContext) {
	    
		ctx = canvas.getContext('2d');

        loadBackground();

	} else {
		alert("Canvas not supported!");
	}
}