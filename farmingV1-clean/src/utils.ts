export function _whatTile(x, y) {
  return {
    col: Math.floor(x / 32),
    row: Math.floor(y / 32),
  };
}
