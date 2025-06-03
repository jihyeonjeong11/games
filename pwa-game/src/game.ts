const COLS = 10,
  ROWS = 20;
let board: number[][] = [];
const BLOCK_W = 320 / COLS,
  BLOCK_H = 640 / ROWS;

const shapes = [
  [1, 1, 1, 1],
  [1, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 1, 1],
  [0, 1, 0, 0, 1, 1, 1],
];

function drawBlock(canvas: HTMLCanvasElement, x: number, y: number) {
  let ctx = canvas.getContext("2d")!;

  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

const colors = ["cyan", "orange", "blue", "yellow", "red", "green", "purple"];

export function game(canvas: HTMLCanvasElement) {
  for (let y = 0; y < ROWS; ++y) {
    board[y] = [];
    for (let x = 0; x < COLS; ++x) {
      board[y][x] = 0;
    }
  }

  const testShape = shapes[3]; // [1, 1, 1, 1]
  for (let i = 0; i < testShape.length; i++) {
    if (testShape[i]) {
      board[0][i] = 1;
    }
  }

  let ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";

  for (let y = 0; y < ROWS; ++y) {
    for (let x = 0; x < COLS; ++x) {
      if (board[y][x]) {
        ctx.fillStyle = colors[board[y][x] - 1];
        drawBlock(canvas, x, y);
      }
    }
  }
}
