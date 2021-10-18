import { mousePosition } from '../mouse/mousePosition.js';
import { refreshBackground} from '../background.js';
import { drawPoints } from '../drawPoints.js';
import { drawMenu } from '../drawMenu.js';
import { drawSegments } from '../drawSegments.js';
import { isInside } from '../isInside.js';

function drawPosition(context, x, y) {
  context.save();
  context.fillStyle = "#000000";
  context.font = '12px serif';
  context.fillText(`X: ${x} Y: ${y}`, 10, 20);
  context.restore();
}

function markHighlighthedPoints(points, mousePos) {
  return points.map((point, index) => {
    const rect = {
      x: point.x - 2.5,
      y: point.y - 2.5,
      width: 8,
      height: 8
    };

    point.highlight = isInside(mousePos, rect);

    if (point.highlight) {
      console.log(`Over: ${index}`);
    }

    return point;
  });
}

export function onMouseOver(canvas, context, buttons, segments, points, e) {
  refreshBackground(context);

  const mousePos = mousePosition(canvas, e);
  const {x, y} = mousePos;
  const highlightedPoints = markHighlighthedPoints(points, mousePos);

  drawSegments(mousePos, segments, context);
  drawPoints(context, highlightedPoints);
  drawMenu(buttons, context);

  drawPosition(context, x, y);
}