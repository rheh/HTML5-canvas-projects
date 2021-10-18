export function drawButton(context, button) {
  context.save();
  context.beginPath();
  context.fillStyle = '#dddddd';
  context.strokeStyle = '#cdcdcd';
  context.rect(
    button.rect.x,
    button.rect.y,
    button.rect.width,
    button.rect.height
  );
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = '#cdcdcd';
  context.stroke();
  context.closePath();

  context.fillStyle = "#333";
  context.font = '18px serif';

  const title = !button.clicked ? button.title.text : button.title.alt;
  context.fillText(title, button.title.x, button.title.y);
  context.restore();
}