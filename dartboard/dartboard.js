var DartBoard = (function () {

    var radius = 0;
    var center = null;
    var scaleWidth = 360;
    var scaleHeight = 360;

    var doubleTopMax;
    var doubleTopMin;
    var tripleMax;
    var tripleMin;
    var twentyFiveTopMin;
    var bullTopMin;

    var centerVector;
    var zeroDegreesVector;
    var lengthVector;
    var normVector;

    var PIECES = 360 / 20;
    var MAX = 0;

    function clearCanvas() {
         // clear canvas
        ctx.clearRect(0, 0, scaleWidth, scaleHeight);
    }

    function buildRing(min, max, startDeg, endDeg, colour) {
        ctx.beginPath();
        ctx.fillStyle = colour;
        ctx.strokeStyle = colour;

        for(var counter = startDeg; counter <= endDeg; counter += 1) {

            var doubleTopMaxPoint = centerVector
                .clone()
                .add(lengthVector
                  .clone()
                  .norm()
                  .rotateDeg(counter)
                  .multiply(new Victor(max, max))
                );

            ctx.lineTo(doubleTopMaxPoint.x,
              doubleTopMaxPoint.y);
        }

        for(counter = endDeg; counter >= startDeg; counter -= 1) {

            var doubleTopMinPoint = centerVector
                .clone()
                .add(lengthVector
                  .clone()
                  .norm()
                  .rotateDeg(counter)
                  .multiply(new Victor(min, min))
                );

            ctx.lineTo(doubleTopMinPoint.x,
              doubleTopMinPoint.y);
        }

        ctx.fill();
        ctx.stroke();

    }

    function drawCircle(radius, colour, fillColour) {

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = colour;

        if(fillColour) {
            ctx.fillStyle = fillColour;
            ctx.fill();
        }

        ctx.stroke();
    }

    function drawRadial(point) {

        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

    }

    function drawLabel(text, p1, p2, alignment, padding, rotate){

      alignment = alignment ||  'center';
      padding = padding || 0;
      rotate = rotate || false;

      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;

      var p, pad, left;

      if (alignment === 'center') {

        p = p1;
        pad = 1/2;

      } else {

        left = alignment === 'left';

        p = left ? p1 : p2;
        pad = padding / Math.sqrt(dx * dx + dy * dy) * (left ? 1 : -1);

      }

      ctx.save();
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'white';
      ctx.font="18px Arial";
      ctx.textAlign = alignment;
      ctx.translate(p.x + dx * pad, p.y + dy * pad);

      if (rotate) {
        ctx.rotate(Math.atan2(dy, dx));
      }

      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    function drawRadials() {

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';

        for(counter = 9; counter < 360; counter += PIECES) {

            var offSet = new Victor(0, 10);

            x = centerVector
                    .clone()
                    .add(lengthVector
                      .clone()
                      .norm()
                      .rotateDeg(counter)
                      .multiply(new Victor(doubleTopMax, doubleTopMax))
                    );

            drawRadial(x);
        }
    }

    function printLabel(counter, pos)
    {
        var labels = [ 20, 1, 18, 4, 13, 6, 10, 15, 2,
            17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5
        ];

        var firstWireOfPeice = counter + 9;
        var x = centerVector
                .clone()
                .add(lengthVector
                  .clone()
                  .norm()
                  .rotateDeg(firstWireOfPeice)
                  .multiply(new Victor(doubleTopMax, doubleTopMax))
                );

        var adjust;

        if (firstWireOfPeice < 55 || firstWireOfPeice > 295) {
            adjust = new Victor(radius - 10, radius - 10);
        } else if (firstWireOfPeice > 95 && firstWireOfPeice < 265) {
            adjust = new Victor(radius + 10, radius + 10);
        } else {
            adjust = new Victor(radius, radius);
        }

        var edge = centerVector
            .clone()
            .add(lengthVector
              .clone()
              .norm()
              .rotateDeg(firstWireOfPeice)
              .multiply(adjust)
            );

        drawLabel(labels[pos], edge, x);

    }

    function draw() {

        clearCanvas();

        var ratio = radius / 90;
        var count = 0;
        var pos = 0;

        drawCircle(radius, 'silver', 'black');

        for(counter = -9; counter < (360 - 9); counter += PIECES) {

            buildRing(doubleTopMin, doubleTopMax,
              counter, counter + PIECES,
              count++ % 2 ? 'red' : '#03ff03');

            buildRing(tripleMin, tripleMax,
              counter, counter + PIECES,
              count % 2 ? '#03ff03' : 'red');

            buildRing(doubleTopMin, tripleMax,
              counter, counter + PIECES,
              count % 2 ? 'white' : 'black');

            buildRing(tripleMin, twentyFiveTopMin,
              counter, counter + PIECES,
              count % 2 ? 'white' : 'black');

            printLabel(counter, pos++);

        }

        drawRadials();

        drawCircle(doubleTopMax, 'silver');
        drawCircle(doubleTopMin, 'silver');
        drawCircle(tripleMax, 'silver');
        drawCircle(tripleMin, 'silver');
        drawCircle(twentyFiveTopMin, 'silver', 'green');
        drawCircle(bullTopMin, 'silver', 'red');
    }

    function setBoundaries() {

        doubleTopMax = radius * 0.8;
        doubleTopMin = radius * 0.75;
        tripleMax = radius * 0.45;
        tripleMin = radius * 0.40;
        twentyFiveTopMin = radius * 0.08;
        bullTopMin = radius * 0.04;

    }

    return {
        init: function () {

            var canvas = document.getElementById('canvas');

            if (canvas.getContext('2d')) {

                ctx = canvas.getContext('2d');

                var scaleX = scaleWidth / canvas.width;
                var scaleY = scaleHeight / canvas.height;

                center = {
                    x: scaleWidth / 2,
                    y: scaleHeight / 2
                };

                MAX = scaleWidth > scaleHeight ? scaleWidth : scaleHeight;
                radius = MAX / 2;

                ctx.scale(scaleX, scaleY);
                ctx.translate(10, 10);

                setBoundaries();

                centerVector = new Victor(center.x, center.y);
                zeroDegreesVector = new Victor(center.x, center.y - radius);
                lengthVector = zeroDegreesVector.subtract(centerVector);
                normVector = new Victor(0, 0);

                // Start the change input monitor timer
                window.requestAnimationFrame(draw);

            } else {
                alert("Canvas not supported!");
            }
        }
    };
});
