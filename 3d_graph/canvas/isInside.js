export function isInside(pos, rect) {
  return pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y;
}