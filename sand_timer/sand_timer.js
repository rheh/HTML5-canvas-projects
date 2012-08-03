/*jslint plusplus: true, sloppy: true, indent: 4 */
( function() {"use strict";
        // this function is strict...
    }());

var sand_timer = null, 
    ctx = null, 
    canvas = null, 
    grid = [270], 
    gridBounds = [270], 
    leftBoundary = null, 
    rightBoundary = null, 
    ceiling = 52, 
    floor = 268,
    // http://en.wikipedia.org/wiki/Desert_sand_(color)
    sandColours = ["#967117", "#C2B280", "#F4A460", "#E1A95F"], 
    currentDrawPhase = 1, 
    iFirstRowOfSand = 159, 
    id = null, 
    debugX = 217, 
    debugY = 141, 
    iNilMoveCounter = 0;

function initBoundary() {

    leftBoundary = [
        [142, 51], [140, 54], [140, 59], [139, 64], [139, 69], [139, 74], [139, 79], [140, 84], [141, 89], [142, 94], 
        [144, 99], [146, 104], [150, 109], [153, 114], [158, 119], [160, 122], [162, 124], [165, 127], [167, 129], [169, 131], 
        [173, 134], [176, 136], [180, 139], [183, 141], [186, 144], [188, 146], [190, 149], [191, 150], [193, 154], [195, 159],
        // Middle
        [195, 164], [193, 169], [188, 174], [183, 179], [177, 184], [170, 189], [164, 194], [158, 199], [154, 204], [150, 209], 
        [147, 214], [145, 219], [142, 224], [141, 229], [140, 234], [139, 239], [139, 244], [139, 249], [139, 254], [139, 259], 
        [140, 264], [142, 269]
    ];

    rightBoundary = [
        [259, 51], [260, 54], [261, 59], [262, 64], [262, 69], [262, 74], [261, 79], [260, 84], [258, 89], [257, 94], 
        [255, 99], [253, 104], [251, 109], [247, 114], [243, 119], [239, 124], [237, 126], [234, 129], [229, 134], [226, 136], [224, 138], 
        [222, 139], [219, 141], [216, 144], [215, 144], [212, 147], [210, 149], [208, 151], [206, 154], [205, 159],
        // Middle
        [205, 164], [207, 169], [211, 174], [217, 179], [225, 184], [231, 189], [236, 194], [241, 199], [245, 204], [249, 209], [252, 214], 
        [255, 219], [257, 224], [259, 229], [260, 234], [261, 239], [261, 244], [261, 249], [260, 254], [260, 259], [259, 264], [257, 269]
    ];
}

function clearCanvas() {

    // clear canvas
    ctx.clearRect(0, 0, canvas.height, canvas.width);
}

function drawBoundary(boundary) {

    var iCounter = 0, current = null;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";

    for ( iCounter = 0; iCounter < boundary.length; iCounter++) {

        current = boundary[iCounter];

        if (iCounter === 0) {
            ctx.moveTo(current[0], current[1]);
        }

        ctx.lineTo(current[0], current[1]);
    }

    ctx.stroke();
}

function drawBoundaryLines(x1, x2, y) {

    ctx.beginPath();

    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);

    ctx.stroke();
}

function drawSandBoundary() {

    drawBoundary(rightBoundary);
    drawBoundary(leftBoundary);
    drawBoundaryLines(140, 259, ceiling);
    drawBoundaryLines(141, 259, floor);
}

function findXAtY(y, boundary) {

    var x = 0, iCounter = 0, current = null;

    for ( iCounter = 0; iCounter < boundary.length; iCounter++) {

        current = boundary[iCounter];

        if (y <= current[1]) {

            x = current[0];
            iCounter = boundary.length;
        }

    }

    return x;
}

function drawBackground() {

    clearCanvas();

    ctx.drawImage(sand_timer, 0, 0);
}

function initSandForRow(x1, x2, y) {

    var iXCounter = x1;

    for (iXCounter; iXCounter <= x2; iXCounter++) {

        grid[y][iXCounter] = {
            x : iXCounter,
            y : y,
            colour : sandColours[Math.floor((Math.random() * sandColours.length))],
            occupied : true
        };
    }
}

function initEmptyRow(x1, x2, y) {

    var iXCounter = x1;

    for (iXCounter; iXCounter <= x2; iXCounter++) {

        grid[y][iXCounter] = {
            x : iXCounter,
            y : y,
            colour : 'white',
            occupied : false
        };
    }
}

function initSand() {

    var iYCounter = 0, iXMin = 0, iXMax = 0;

    for ( iYCounter = floor; iYCounter >= ceiling; iYCounter--) {

        iXMin = findXAtY(iYCounter, leftBoundary);
        iXMax = findXAtY(iYCounter, rightBoundary);

        gridBounds[iYCounter] = [iXMin, iXMax];
        grid[iYCounter] = [iXMax - iXMin];

        if (iYCounter > ceiling + 50 && iYCounter <= 159) {

            initSandForRow(iXMin, iXMax, iYCounter);

        } else {

            initEmptyRow(iXMin, iXMax, iYCounter);

        }
    }
}

function drawSandParticle(current) {

    if (current !== undefined) {

        ctx.strokeStyle = current.colour;
        ctx.fillStyle = current.colour;
        ctx.fillRect(current.x, current.y, 1, 1);

    }
}

var bSandHitBottom = false;

function applyGravity(iXAdjust, iYAdjust) {

    var iYCounter = false, iXCounter = false, sand = null, cell = null, iXMin = null, iXMax = null, bRowHasSand = false, bHasMoved = false;

    if (iFirstRowOfSand >= floor) {
        iFirstRowOfSand = floor - 1;
    }

    for ( iYCounter = iFirstRowOfSand; iYCounter >= ceiling; iYCounter--) {

        iXMin = gridBounds[iYCounter + iYAdjust][0];
        iXMax = gridBounds[iYCounter + iYAdjust][1];

        bRowHasSand = false;

        for ( iXCounter = iXMin; iXCounter <= iXMax; iXCounter++) {

            sand = grid[iYCounter][iXCounter];
            cell = grid[iYCounter + iYAdjust][iXCounter + iXAdjust];

            bHasMoved = false;

            if (sand !== undefined && sand.occupied === true) {

                if (cell !== undefined && cell.occupied === false) {

                    // Sand in target cell?
                    if (sand.x >= iXMin && sand.x <= iXMax) {

                        //Swap the sand cells
                        grid[iYCounter + iYAdjust][iXCounter + iXAdjust].colour = sand.colour;
                        grid[iYCounter + iYAdjust][iXCounter + iXAdjust].occupied = true;

                        grid[iYCounter][iXCounter].colour = 'white';
                        grid[iYCounter][iXCounter].occupied = false;

                        bHasMoved = true;
                    }
                }

                bRowHasSand = true;
            }
        }

        //Exit the loop if the row has no sand
        if (bRowHasSand === false) {
            iYCounter = ceiling - 1;
        }
    }

    iFirstRowOfSand++;

    return bHasMoved;
}

function cleanUp() {

    var iCleanUpRows, iXCounter;

    // Have we hit the bottom?
    if (grid[floor][200].occupied === true) {

        // Clean up the sand that defies gravity :-)
        for ( iCleanUpRows = ceiling; iCleanUpRows < floor; iCleanUpRows++) {

            if (grid[iCleanUpRows][200].occupied === false) {

                iXMin = gridBounds[iCleanUpRows][0];
                iXMax = gridBounds[iCleanUpRows][1];

                // Iterate from left to right within the boundaries
                for ( iXCounter = iXMin; iXCounter <= iXMin + 4; iXCounter++) {

                    grid[iCleanUpRows][iXCounter].occupied = false;
                    grid[iCleanUpRows][iXCounter].colour = 'white';

                }

                // Iterate from right to left within the boundaries
                for ( iXCounter = iXMax; iXCounter >= iXMax - 4; iXCounter--) {

                    grid[iCleanUpRows][iXCounter].occupied = false;
                    grid[iCleanUpRows][iXCounter].colour = 'white';

                }
            }
        }
    }
}

function drawSandParticles() {

    var iYCounter = 0, 
        iXCounter = 0, 
        bComplete = false, 
        iStepCounter = 4;

    drawBackground();

    // Adjust the sand by x number of steps
    while (iStepCounter >= 0) {

        // Allow any particle to move down
        bHasMoved = applyGravity(0, 1);

        // Allow any particle to move left/right
        bHasMovedRight = applyGravity(1, 1);
        bHasMovedLeft = applyGravity(-1, 1);

        iStepCounter--;

        if (bHasMoved === false && bHasMovedRight === false && bHasMoved === false) {
            iNilMoveCounter++;
        }
    }

    cleanUp();

    // Draw the sand in the new location
    for ( iYCounter = floor; iYCounter >= ceiling; iYCounter--) {

        iXMin = gridBounds[iYCounter][0];
        iXMax = gridBounds[iYCounter][1];

        // Iterate from left to right within the boundaries
        for ( iXCounter = iXMin; iXCounter <= iXMax; iXCounter++) {

            drawSandParticle(grid[iYCounter][iXCounter]);

        }
    }

    // Draw the boundary line
    drawSandBoundary();

    return (iNilMoveCounter > 250);
}

function animate() {

    if (drawSandParticles() === false) {
        setTimeout(function() {
            animate();
        }, 100);
    }
}

function imgLoaded() {

    initBoundary();
    initSand();

    animate();
}

function init() {

    // Grab the canvas element
    canvas = document.getElementById('sand');

    // Canvas supported?
    if (canvas.getContext('2d')) {
        ctx = canvas.getContext('2d');

        // Load the timer
        sand_timer = new Image();
        sand_timer.src = 'hourglass.jpg';
        sand_timer.onload = imgLoaded;

    } else {
        alert("Canvas not supported!");
    }
}