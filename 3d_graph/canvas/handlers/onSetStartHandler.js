
import { drawPoints } from '../drawPoints.js';
import { isInside } from '../isInside.js';

function alreadyAtPoint(points, mousePos) {
  return points.find((point, index) => {
    const rect = {
      x: point.x - 2.5,
      y: point.y - 2.5,
      width: 8,
      height: 8
    };

    return isInside(mousePos, rect);
  });
}

export function onSetStartHandler(mousePos, points, context) {
  const hit = alreadyAtPoint(points, mousePos);

  if (!hit) {
    return points
  }

  const {x, y} = mousePos;

  console.log(`Start selected at X: ${x} Y: ${y}`, 10, 20);

  points = points.map((point, index) => {
    point.start = false;

    return point;
  });

  hit.start = true;

  drawPoints(context, points);

  return points;
}