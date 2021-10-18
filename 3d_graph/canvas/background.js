let img;

export function drawBackground(context) {
  img = new Image();
  img.onload = function() {
    context.drawImage(img, 0, -140, 800, 800);
  };

  img.src = './background.jpg';
}

export function refreshBackground(context) {
  context.drawImage(img, 0, -140, 800, 800);
}