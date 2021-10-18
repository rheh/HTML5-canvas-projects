import findShortestPath from './dijkstras.js';
import { drawPoints } from './canvas/drawPoints.js';
import { addPathButton, resetButton, addPointButton, exportButton, importButton, setStartButton, setEndButton } from './canvas/buttons.js';
import { mousePosition } from './canvas/mouse/mousePosition.js';
import { isInside } from './canvas/isInside.js';
import isMenuArea from './canvas/isMenuArea.js';
import { onAddPointHandler } from './canvas/handlers/onClickHandler.js';
import { onAddSegmentHandler } from './canvas/handlers/onAddSegmentHandler.js';
import { onSetStartHandler } from './canvas/handlers/onSetStartHandler.js';
import { onSetEndHandler } from './canvas/handlers/onSetEndHandler.js';
import { onMouseOver } from './canvas/mouse/onMouseOver.js';
import { drawBackground, refreshBackground} from './canvas/background.js';
import { drawMenu } from './canvas/drawMenu.js';
import { drawSegments } from './canvas/drawSegments.js';

let img;
let canvas;
let context;
let segments = [];
let points = [];

const buttons = [
  addPathButton,
  resetButton,
  addPointButton,
  exportButton,
  importButton,
  setStartButton,
  setEndButton
];

const statefulButtons = [
  addPathButton,
  addPointButton,
  setStartButton,
  setEndButton
];

function setupMouseOver() {
  canvas.onmousemove = function(e) {
    onMouseOver(canvas, context, buttons, segments, points, e);
  };
}

function setupMouseClick() {
  canvas.addEventListener('click', function(e) {
    const mousePos = mousePosition(canvas, e);
    const {x, y} = mousePos;

    if (isMenuArea(x, y)) {
      let inside = false;

      statefulButtons.forEach((button) => {
        if (isInside(mousePos, button.rect)) {
          button.clicked = !button.clicked;
          inside = true
        } else {
          button.clicked = false;
        }
      });

      if (inside) {
        return drawMenu(buttons, context);
      }

      if (isInside(mousePos, resetButton.rect)) {
        addPathButton.clicked = false
        points = [];
        segments = [];

        refreshBackground(context);
        drawPoints(context, points);
        drawMenu(buttons, context);

        return;
      } else if (isInside(mousePos, exportButton.rect)) {
        window.plan = JSON.stringify({
          points,
          segments
        });

        console.log(window.plan);

        return;
      } else if (isInside(mousePos, importButton.rect)) {
        const importedData = window.plan;

        points = importedData.points || [];
        segments = importedData.segments || [];

        drawSegments(mousePos, segments, context);
        drawPoints(context, points);

        return;
      }
    }

    if (addPointButton.clicked) {
      points = onAddPointHandler(mousePos, points, context);
    } else if (addPathButton.clicked) {
      segments = onAddSegmentHandler(mousePos, segments, points, context);
      drawSegments(mousePos, segments, context);
    } else if (setStartButton.clicked) {
      onSetStartHandler(mousePos, points, context);
      setStartButton.clicked = false;

      drawMenu(buttons, context);
    } else if (setEndButton.clicked) {
      onSetEndHandler(mousePos, points, context);
      setEndButton.clicked = false;

      drawMenu(buttons, context);
    }

  }, false);
}

export function main() {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  drawBackground(context);
  setupMouseOver();
  setupMouseClick();
  drawMenu(buttons, context);
}