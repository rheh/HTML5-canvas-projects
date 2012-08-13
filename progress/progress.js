/*jslint plusplus: true, sloppy: true, indent: 4 */
( function() {"use strict";
        // this function is strict...
    }()
);

var img, 
    iHEIGHT = 161, 
    iWIDTH = 670, 
    canvas = null, 
    ctx = null, 
    slider = null;

function drawBase(ctx) {

    ctx.drawImage(img, 0, 0, iWIDTH, iHEIGHT, 0, 0, iWIDTH, iHEIGHT);

}

function drawProgress(ctx) {

    var x1 = 214, // X position where the progress segment starts
        x2 = 546, // X position where the progress segment ends
        s = slider.value, 
        x3 = 0,
        x4 = 144,
        y1 = 63;
        
    // Calculated x position where the overalyed image should end

    x3 = (x1 + ((x2 - x1) / 100) * s);

    ctx.drawImage(img, 0, iHEIGHT, x3, iHEIGHT, 0, 0, x3, iHEIGHT);

    // Text to screen
    ctx.fillStyle = "grey";
    ctx.font = "14pt Arial";
    ctx.fillText(s + " %", x4, y1);
}

function drawImage() {

    // Draw the base image - no progress
    drawBase(ctx);

    // Draw the progress segment level
    drawProgress(ctx);

}

function init() {

    canvas = document.getElementById('progress');

    // Create the image resource
    img = new Image();

    // Canvas supported?
    if (canvas.getContext) {

        ctx = canvas.getContext('2d');
        slider = document.getElementById('slider');

        // Setup the onload event
        img.onload = drawImage;

        // Load the image
        img.src = 'progress-tiles.jpg';

    } else {
        alert("Canvas not supported!");
    }
}