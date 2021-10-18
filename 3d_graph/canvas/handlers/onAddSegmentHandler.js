import { isInside } from '../isInside.js';

let selectedPoint;

function getPointUnderCursor(points, mousePos) {
  return points.find((point) => {
    const rect = {
      x: point.x - 2.5,
      y: point.y - 2.5,
      width: 8,
      height: 8
    };

    return isInside(mousePos, rect);
  });
}

function highlightFirstPointOfSegment(mousePos, points) {
  const pointUnderCursor = getPointUnderCursor(points, mousePos);

  if (!pointUnderCursor) {
    return null;
  }

  selectedPoint = true;

  return {
    start: pointUnderCursor,
    intermediates: [],
    end: null
  };
}

function attemptToJoinToOpenSegment(mousePos, points) {
  const pointUnderCursor = getPointUnderCursor(points, mousePos);

  if (!pointUnderCursor) {
    return null;
  }

  return pointUnderCursor;
}

export function onAddSegmentHandler(mousePos, segments, points) {
  if (!selectedPoint) {
    const segment = highlightFirstPointOfSegment(mousePos, points);

    if (segment) {
      console.log(`Added segment`);
      segments.push(segment);
    }

    return  segments;
  }

  const point = attemptToJoinToOpenSegment(mousePos, points);

  if (point) {
    console.log(`Added segment end`);
    segments[segments.length - 1].end = point;
    selectedPoint = false;
  } else {
    console.log(`Added segment middle`);
    segments[segments.length - 1].intermediates.push({
      ...mousePos
    });
  }

  return segments;
}