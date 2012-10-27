/*jslint plusplus: true, sloppy: true, indent: 4 */
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
    var gravity = 0.2,
        canvas = null,
        ctx = null,
        balls =  [],
        bg = null;
               
    // Objects
    var Ball = function (x, ballSettings) {
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
        this.draw = function () {
            ctx.drawImage(this.image,
                this.x, this.y,
                this.width, this.height
            );
        };
        this.impact = function () {
            this.vy = this.vyAdjust;
        };
        this.move = function () {
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
        var i  = balls.length;
        clearCanvas();
        drawBackground();
        while (i--) {
            balls[i].move();
            balls[i].draw();
        }
    }

    function getRandomBallSettings(iBallTop) {
        var iImageRnd = Math.floor((Math.random() * 4) + 1),
            balls = {
                1: {
                    image: document.getElementById("basketballImage"),
                    factor: 0.8,
                    height: 50,
                    top: iBallTop,
                    width: 50
                },
                2: {
                    image: document.getElementById("footballImage"),
                    factor: 0.7,
                    top: iBallTop,
                    height: 50,
                    width: 50
                },
                3: {
                    image: document.getElementById("tennisballImage"),
                    factor: 0.6,
                    top: iBallTop,
                    height: 20,
                    width: 20
                },
                4: {
                    image: document.getElementById("cannonballImage"),
                    factor: 0.35,
                    top: -460,
                    width: 60,
                    height: 60
                }
            };
        return balls[iImageRnd];
    }

    function setUpBalls() {
        var iBallTop,
            i,
            ball = null,
            x = 0;
        while (x < 950) {
            iBallTop = (0 - Math.floor((Math.random() * 400) + 1));
            ball = getRandomBallSettings(iBallTop);
            balls.push(new Ball(x, ball));
            x += ball.width + 10;
        }
    }

    function loop() {
        update();
        window.requestAnimFrame(loop);
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

    window.addEventListener('load', function (ev) {
        init();
    }, false);

}());