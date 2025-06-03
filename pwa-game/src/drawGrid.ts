// https://codepen.io/loktar00/pen/BaGqXY
// https://github.com/dionyziz/canvas-tetris
let boardWidth = 320;
let boardHeight = 640;
let squareSize = 32;
let padding = 0.5;
// legacy
export function drawGrid(canvas: HTMLCanvasElement) {
  let context = canvas.getContext("2d")!;
  for (let x = 0; x * squareSize < boardWidth; x++) {
    if (x === 0) continue;
    const xpos = x * squareSize + padding;
    context.moveTo(xpos, 0);
    context.lineTo(xpos, boardHeight);
  }

  for (let y = 0; y * squareSize < boardHeight; y++) {
    if (y === 0) continue;

    const ypos = y * squareSize + padding;
    context.moveTo(0, ypos);
    context.lineTo(boardWidth, ypos);
  }

  context.strokeStyle = "black";
  context.stroke();
}
