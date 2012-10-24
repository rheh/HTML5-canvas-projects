/*jslint plusplus: true, sloppy: true, indent: 4 */
( function() {"use strict";
        // this function is strict...
    }()
);

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

var gravity = 0.2,
    canvas = null, 
    ctx = null,
    balls =  [],
    bg = null;
           
// Objects
var Ball = function(x, ballSettings) {

    this.vy = 0;
    this.vx = 0;

    this.vyAdjust = -13;
    
    this.width = ballSettings.width;
    this.height = ballSettings.height;

    this.x = x;
    this.y = ballSettings.top;
    this.image = ballSettings.image;
    this.bounceFactor = ballSettings.factor;

    //Function to draw it
    this.draw = function() {

        ctx.drawImage(this.image, 
            this.x, this.y, 
            this.width, this.height);

    };

    this.impact = function() {
        
        this.vy = this.vyAdjust;
    
    };
    
    this.move = function() {
    
        this.y += this.vy;
        this.vy += gravity;
    
        // Bounce the ball when it hits the bottom
        if ((this.y + this.height) > canvas.height - 10) {
         
            this.impact();

            this.vyAdjust = (this.vyAdjust * this.bounceFactor);
        }

    };
    
};

function clearCanvas() {

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackground() {
    
    // Draw the car onto the canvas
    ctx.drawImage(bg, 0, 0, 1000, 800);
}

function update() {
   
    var i;
    
    clearCanvas();
    
    drawBackground();
    
    for (i = 0; i < balls.length; i++) {
        
        balls[i].move();
        balls[i].draw();
        
    }    
}

function getRandomBallSettings(iBallTop) {
    
    var iImageRnd = Math.floor((Math.random() * 4) + 1),
        ballImage = {
                        image: null, 
                         bounce: null, 
                         top: iBallTop,
                         height: 90,
                         width: 90
                    };
        
    if(iImageRnd === 1) {
    
        ballImage.image = document.getElementById("basketballImage");
        ballImage.factor = 0.8;
        ballImage.height = 50;
        ballImage.width = 50;
           
    } else if(iImageRnd === 2) {
        
        ballImage.image = document.getElementById("footballImage");
        ballImage.factor = 0.7;
        ballImage.height = 45;
        ballImage.width = 45;
        
    } else if(iImageRnd === 3) {
        
        ballImage.image = document.getElementById("tennisballImage");
        ballImage.factor = 0.6;
        ballImage.height = 20;
        ballImage.width = 20;
        
    } else {
        
        ballImage.image = document.getElementById("cannonballImage");
        ballImage.factor = 0.35;
        ballImage.top = -460;
        ballImage.height = 60;
        ballImage.width = 60;
    
    }
       
    return ballImage;
         
}

function setUpBalls() {
    
    var iBallTop,
        i,
        ball = null,
        x = 0;
    
    while(x < 950) {
        
        iBallTop = (0 - Math.floor((Math.random() * 400) + 1));
        ball = getRandomBallSettings(iBallTop);
        
        balls.push(new Ball(x, ball));

        x += ball.width + 10;
    }
    
}

function loop() {
        
    update();
    requestAnimFrame(loop);

}

function loadBackground() {

    // Load the background
    bg = new Image();
    bg.src = 'background.gif';
    bg.onload = loop;
}

function init() {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setUpBalls();
    loadBackground();

}

