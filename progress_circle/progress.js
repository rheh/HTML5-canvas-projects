var Progress = (function() {

  var radius = 0;
  var scaleWidth = 360;
  var scaleHeight = 360;

  var centerVector;
  var zeroDegreesVector;
  var lengthVector;

  var foregroundColour = '#289ACA';
  var arcBackgroundColour = '#efefef';
  var backgroundColour = '#202020';
  var backgroundImage = null;
  var progress = 0;

  var MAX = 0;
  var ctx;

  function clearCanvas() {
    ctx.clearRect(0, 0, scaleWidth, scaleHeight);
  }

  function colourBackground() {
    ctx.rect(0, 0, scaleWidth, scaleHeight);
    ctx.fillStyle = backgroundColour;
    ctx.fill();
  }

  function drawLabel(text, position) {

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = foregroundColour;
    ctx.fillStyle = foregroundColour;
    ctx.font = radius / 2 + 'px Arial';
    ctx.textAlign = 'center';
    ctx.translate(position.x, position.y);
    ctx.fillText(text, 0, 0);
    ctx.restore();

  }

  function drawProgressArc() {

    var counter = 0;
    var currentPoint = null;
    var max = (360 / 100) * progress;

    ctx.beginPath();
    ctx.strokeStyle = foregroundColour;
    ctx.lineWidth = 3;

    for (counter = 0; counter <= max; counter += 1) {

      currentPoint = centerVector
      .clone()
      .add(lengthVector
        .clone()
        .norm()
        .rotateDeg(counter)
        .multiply(new Victor(radius, radius))
      );

      ctx.lineTo(currentPoint.x,
       currentPoint.y);
    }

    ctx.stroke();
  }

  function drawProgressArcBackground() {

    ctx.beginPath();
    ctx.strokeStyle = arcBackgroundColour;
    ctx.arc(centerVector.x, centerVector.y,
      radius, 0, 2 * Math.PI);

    ctx.stroke();
  }

  function draw() {

    clearCanvas();

    if (backgroundImage !== null) {
      ctx.drawImage(backgroundImage, 0, 0, scaleWidth, scaleHeight);
    } else {
      colourBackground(backgroundColour);
    }

    drawProgressArcBackground();
    drawProgressArc();

    drawLabel(progress + '%', centerVector);

    window.requestAnimationFrame(draw);
  }

  return {
    init: function(canvasId) {

      var canvas = document.getElementById(canvasId);

      if (canvas.getContext('2d')) {

        ctx = canvas.getContext('2d');

        var scaleX = scaleWidth / canvas.width;
        var scaleY = scaleHeight / canvas.height;

        var center = {
          x: scaleWidth / 2,
          y: scaleHeight / 2
        };

        MAX = scaleWidth > scaleHeight ? scaleWidth : scaleHeight;
        radius = (MAX * 0.8) / 2;

        ctx.scale(scaleX, scaleY);
        ctx.translate(10, 10);

        centerVector = new Victor(center.x, center.y);
        zeroDegreesVector = new Victor(center.x, center.y - radius);
        lengthVector = zeroDegreesVector.subtract(centerVector);

        window.requestAnimationFrame(draw);

      } else {
        alert('Canvas not supported!');
      }

      return this;
    },

    setProgress: function(progression) {
      progress = progression;

      if (progress < 0) {
        progress = 0;
      } else if (progress > 100) {
        progress = 100;
      }

      window.requestAnimationFrame(draw);

      return this;
    },

    setBackgroundColour: function(colour) {
      backgroundColour = colour;
      window.requestAnimationFrame(draw);
      return this;
    },

    setArcBackgroundColour: function(colour) {
      arcBackgroundColour = colour;
      window.requestAnimationFrame(draw);
      return this;
    },

    setBackgroundImage: function(image) {

      backgroundImage = new Image();
      backgroundImage.src = image;

      backgroundImage.onload = function() {
        window.requestAnimationFrame(draw);
      };

      return this;
    },

    setForegroundColour: function(colour) {
      foregroundColour = colour;
      window.requestAnimationFrame(draw);
      return this;
    }
  };
});
