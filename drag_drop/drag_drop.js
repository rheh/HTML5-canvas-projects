var canvas,
    ctx,
    renderItems = [],
    dragIdx,
    dragOffsetX,
    dragOffsetY,
    mouseHelper;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawStuff();
    }

    function intersectHelper() {

        this.between = function (min, p, max) {

            var result = false;

            if (min < max) {
                if (p > min && p < max) {
                    result = true;
                }
            }

            if (min > max) {
                if (p > max && p < min) {
                    result = true;
                }
            }

            if (p == min || p == max) {
                result = true;
            }

            return result;
        };

        this.pointInRect = function (x, y, left, top, right, bottom) {
            return (this.between(left, x , right) && this.between(top, y, bottom));
        };

        this.check = function (shape, comparitor) {

           var points = shape.getBoundingBoxPoints();

           for (var counter = 0, l = points.length; counter < l; counter++) {

               var point = points[counter];

               if (this.pointInRect(point.x, point.y,
                    comparitor.getLeft(), comparitor.getTop(),
                    comparitor.getRight(), comparitor.getBottom()) === true) {
                        return true;
                }
           }

            return false;
        };
    }

    function MouseHelper(doc, canvas, collisionCheckCallback) {

        this.doc = doc;
        this.canvas = canvas;
        this.collisionCheckCallback = collisionCheckCallback;

        this.update = function (handle) {
            this.doc.body.style.cursor = handle;
        };

        this.mousedown = function (e) {

            var mouseX = e.layerX - mouseHelper.canvas.offsetLeft,
                mouseY = e.layerY - mouseHelper.canvas.offsetTop;

            for (var i = 0, l = renderItems.length; i < l; i++) {

                dx = mouseX - renderItems[i].getCenterX();
                dy = mouseY - renderItems[i].getCenterY();

                if (Math.sqrt((dx*dx) + (dy*dy)) < renderItems[i].getRadius()) {

                    dragIdx = i;
                    dragOffsetX = dx;
                    dragOffsetY = dy;
                    renderItems[dragIdx].setSelected(true);

                    canvas.addEventListener("mousemove", mouseHelper.mousemove);
                    canvas.addEventListener("mouseup", mouseHelper.mouseup);

                    drawStuff();
                    mouseHelper.update('move');

                    return;
                }
            }
        };

        this.mousemove = function (e) {

            var mouseX = e.layerX - mouseHelper.canvas.offsetLeft,
                mouseY = e.layerY - mouseHelper.canvas.offsetTop;

            renderItems[dragIdx].setCenterX(mouseX - dragOffsetX);
            renderItems[dragIdx].setCenterY(mouseY - dragOffsetY);

            drawStuff(); 
        };

        this.mouseup = function (e) {

            var mouseX = e.layerX - mouseHelper.canvas.offsetLeft,
                mouseY = e.layerY - mouseHelper.canvas.offsetTop;

            canvas.removeEventListener("mousemove", mouseHelper.mousemove);
            canvas.removeEventListener("mouseup", mouseHelper.mouseup);

            renderItems[dragIdx].setCenterX(mouseX - dragOffsetX);
            renderItems[dragIdx].setCenterY(mouseY - dragOffsetY);

            renderItems[dragIdx].setSelected(false);
            mouseHelper.update('default');

            collisionCheckCallback();
            drawStuff(); 

            dragIdx = -1;
        };


    }

    function Thing(x, y) {

        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 106;

        this.isSelected = false;
        this.isOverlapping = false;

        this.draw = function (ctx) {

            ctx.beginPath();
            ctx.lineWidth=3;
            ctx.strokeStyle = "red";

            ctx.moveTo(this.x, this.y + 20);
            ctx.bezierCurveTo(this.x, this.y, this.x + this.width, this.y, this.x + this.width, this.y + 20);

            ctx.moveTo(this.x, this.y + 20);
            ctx.lineTo(this.x, this.y + 90);

            ctx.bezierCurveTo(this.x, this.y + 110,this.x + 60,this.y + 110,this.x + 60,this.y + 90);

            ctx.lineTo(this.x + 60,this.y + 20);

            if (this.isOverlapping) {
                ctx.fillStyle = "rgba(255, 00, 00, 0.2)";
                ctx.fill();
            }

            ctx.stroke();

            this.drawBoundingBox(ctx);
            this.drawDragZone(ctx);
            this.drawCenter(ctx);
        };

        this.drawBoundingBox = function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle= "rgb(55, 55, 55)";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        };

        this.getBoundingBoxPoints = function () {
            return ([{ x: this.x, y: this.y },
                     { x: this.x + this.width, y: this.y },
                     { x: this.x + this.width, y: this.y + this.height },
                     { x: this.x,  y: this.y + this.height }
                    ]);
        };

        this.drawDragZone = function (ctx) {

            var radius = this.width / 2;

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle= "rgb(cc, cc, cc)";
            ctx.arc(this.getCenterX(), this.getCenterY(), radius, 0, 2 * Math.PI, false);

            if (this.isSelected) {
                ctx.fillStyle = "rgba(32, 45, 21, 0.3)";
                ctx.fill();
            }

            ctx.stroke();
        };

        this.drawCenter = function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;

            if (this.isSelected) {
                ctx.strokeStyle= "white";
                ctx.fillStyle = "white";
            } else {
                ctx.strokeStyle= "rgb(55, 55, 55)";
                ctx.fillStyle = "rgb(55, 55, 55)";
            }
            ctx.fillRect(this.getCenterX() - 5, this.getCenterY() - 5, 10, 10);
            ctx.stroke();
        };

        this.setCenterX = function (newX) {
            this.x = newX - (this.width / 2);
        };

        this.setCenterY = function (newY) {
            this.y = newY - (this.height / 2);
        };

        this.setX = function (newX) {
            this.x = newX;
        };

        this.setY = function (newY) {
            this.y = newY;
        };

        this.getX = function () {
            return this.x;
        };

        this.getY = function () {
            return this.y;
        };

        this.getLeft = function () {
            return this.getX();
        };

        this.getTop = function () {
            return this.getY();
        };

        this.getRight = function () {
            return this.getX() + this.width;
        };

        this.getBottom = function () {
            return this.getY() + this.height;
        };

        this.getCenterX = function () {
            return this.x + (this.width / 2);
        };

        this.getCenterY = function () {
            return this.y + (this.height / 2);
        };

        this.getRadius = function () {
            return this.width / 2;
        };

        this.setSelected = function (selected) {
            this.isSelected = selected;
        };

        this.setOverlapping = function (overlap) {
            this.isOverlapping = overlap;
        };
    }

    function drawStuff() {

        clear();

        for (var i = 0, l = renderItems.length; i < l; i++) {
            renderItems[i].draw(ctx);
        }
    }

    function clear() {

        ctx.save();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.restore();
    }

    function generateRandom(max) {
        return Math.floor((Math.random() * max) + 1);
    }

    var collisionCheckCallback = function () {
        var intersect = new intersectHelper();

        for (var indexCounter = 0, outer = renderItems.length; indexCounter < outer; indexCounter++) {

            var item = renderItems[indexCounter];
            renderItems[indexCounter].setOverlapping(false);

            for (var renderCounter = 0, inner = renderItems.length; renderCounter < inner; renderCounter++) {

                if (indexCounter !== renderCounter) {

                    var comparitor = renderItems[renderCounter];

                    if (intersect.check(item, comparitor) === true) {
                        renderItems[renderCounter].setOverlapping(true);
                        renderItems[indexCounter].setOverlapping(true);
                    }
                }
            }
        }
    };

    function init () {

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);

        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        mouseHelper = new MouseHelper(document, canvas, collisionCheckCallback);

        //start with only the mousedown event attached
        canvas.addEventListener("mousedown", mouseHelper.mousedown);

        resizeCanvas();

        for (var spawnCounter = 0, itemsCount = 5 + generateRandom(10); spawnCounter < itemsCount; spawnCounter++) {
            renderItems.push(new Thing(generateRandom(canvas.width - 100), generateRandom(canvas.height - 100), mouseHelper));
            collisionCheckCallback();
        }

        resizeCanvas();
    }

