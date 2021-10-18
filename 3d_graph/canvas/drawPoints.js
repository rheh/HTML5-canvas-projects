export function drawPoint(context, point) {
  context.beginPath();
  context.strokeStyle = (point.start || point.end) ? 'yellow' : point.highlight ? 'black' : 'red';
  context.fillStyle = 'white';
  context.arc(point.x, point.y, 5, 0, Math.PI * 2, true); // Outer circle
  context.fill();
  context.stroke();
}

export function drawPoints(context, points) {
  context.save();

  context.fillStyle = "blue"
  context.strokeStyle = "red";
  context.lineWidth = 3;

  points.forEach(drawPoint.bind(null, context));

  context.restore();
}