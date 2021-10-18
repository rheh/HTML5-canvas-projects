export function drawSegments(mousePos, segments, context) {
  if (!segments.length) {
    return;
  }

  console.log(`Drawing ${segments.length} segments`);

  const {x, y} = mousePos;
  context.save();
  context.lineWidth = 5;
  context.lineCap = "round";
  context.strokeStyle = "pink";

  segments.forEach((segment) => {
    context.beginPath();
    context.moveTo(segment.start.x, segment.start.y);

    segment.intermediates.forEach((intermediate) => {
      context.lineTo(intermediate.x, intermediate.y);
    });

    const end = segment.end || {
      x,
      y
    };

    context.lineTo(end.x, end.y);
    context.stroke();
  });

  context.restore();
}