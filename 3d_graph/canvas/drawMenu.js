import { drawButton } from './drawButton.js';

export function drawMenu(buttons, context) {
  buttons.forEach(drawButton.bind(null, context));
}