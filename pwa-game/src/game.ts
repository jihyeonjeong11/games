import { drawGrid } from "./drawGrid";

const WIDTH = 320;
const HEIGHT = 640;

const COLS = 10,
  ROWS = 20;
let board: number[][] = [];
const BLOCK_W = WIDTH / COLS,
  BLOCK_H = HEIGHT / ROWS;

const tetrominos = {
  I: [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
} as const;

const colors = ["cyan", "orange", "blue", "yellow", "red", "green", "purple"];

let raf: any = null;

export let gameState: "start" | "pause" = "pause";
let currentY = 0;
let currentX = 3;
type CurrentTetrominoType =
  | null
  | (typeof tetrominos)[keyof typeof tetrominos]
  | number[][];

// todo: 색깔
let currentTetrimino: CurrentTetrominoType = null;
let gameOver = false;
let count = 0;
export let score = 0;

function drawBlock(canvas: HTMLCanvasElement, x: number, y: number) {
  let ctx = canvas.getContext("2d")!;
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

function generateNewBoard() {
  const newBoard: number[][] = [];
  for (let y = 0; y < ROWS; ++y) {
    newBoard.push([]);
    for (let x = 0; x < COLS; ++x) {
      newBoard[y].push(0);
    }
  }
  board = newBoard;
}

function getRandomTetromino() {
  const keys = Object.keys(tetrominos);
  const random = keys[
    Math.floor(Math.random() * keys.length)
  ] as keyof typeof tetrominos;
  return tetrominos[random];
}

function freezeCurrentPiece() {
  if (!currentTetrimino) return;
  for (var y = 0; y < currentTetrimino.length; ++y) {
    for (var x = 0; x < currentTetrimino[0].length; ++x) {
      if (currentTetrimino[y][x]) {
        board[y + currentY][x + currentX] = currentTetrimino[y][x];
      }
    }
  }
  currentTetrimino = null;
  currentY = 0;
}

function generateNewTetromino() {
  currentTetrimino = getRandomTetromino();
  currentX = 3;
  currentY = 0;
  // todo: SOC
  if (!isValidMove(currentTetrimino, currentX, currentY)) {
    showGameOver();
  }
}

function showGameOver() {
  cancelAnimationFrame(raf);
  updateScoreDisplay(0);

  const button = document.querySelector("#button-start") as HTMLButtonElement;
  button.disabled = false;

  gameOver = true;
}

function updateScoreDisplay(score: number) {
  const scoreDisplay = document.querySelector<HTMLElement>("#score");
  if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
}

function clearLineForScore() {
  for (let i = 0; i < board.length; i++) {
    if (board[i].every((e) => e)) {
      board.splice(i, 1);
      board.unshift(new Array(COLS).fill(0));
      score++;
      updateScoreDisplay(score);
      i++;
    }
  }
}

function render() {
  const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas")!;

  let ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(canvas);

  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (board[y][x]) {
        drawBlock(canvas, x, y);
      }
    }
  }

  if (currentTetrimino) {
    // ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = "blue";

    for (let y = 0; y < currentTetrimino.length; ++y) {
      for (let x = 0; x < currentTetrimino[0].length; ++x) {
        if (currentTetrimino[y][x]) {
          drawBlock(canvas, currentX + x, currentY + y);
        }
      }
    }
  }

  if (gameOver) {
    ctx.font = "32px serif";
    ctx.fillStyle = "black";
    const text = "Game Over";
    const metrics = ctx.measureText(text);

    ctx.fillText("Game Over", (WIDTH - metrics.width) / 2, 100);
  }
}

// currentPiece, currentX, currentY
function isValidMove(
  current: CurrentTetrominoType,
  desiredX: number,
  desiredY: number
  // 방향 체크가 필요한지?
) {
  if (!current) return false;
  // 1. 피스 전체 for loop 두개
  for (let y = 0; y < current.length; y++) {
    for (let x = 0; x < current[0].length; x++) {
      if (current[y][x]) {
        if (
          // 보드 바깥인지
          desiredY + y >= board.length ||
          desiredX + x >= board[0].length ||
          desiredX + x < 0 ||
          // 다른 조각과 부딪히는지
          board[desiredY + y][desiredX + x]
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function loop() {
  raf = requestAnimationFrame(loop);

  // 35 프레임 이후 테트리스 피스 한칸 다운
  if (++count > 35) {
    count = 0;

    if (isValidMove(currentTetrimino, currentX, currentY + 1)) {
      currentY++;
    } else {
      freezeCurrentPiece();
      generateNewTetromino();
    }
    clearLineForScore();
    render();
  }
}

export function toggleGame(state: "start" | "pause") {
  gameState = state;
}

export function newGame() {
  cancelAnimationFrame(raf);
  document.addEventListener("keydown", keyboardEvent);
  gameOver = false;

  generateNewBoard();
  generateNewTetromino();
  render();
  raf = requestAnimationFrame(loop);
}

export function playButtonClick() {
  const button = document.querySelector("#button-start") as HTMLButtonElement;
  button.disabled = true;
  newGame();
}

// 90% 시계방향
function rotate(current: CurrentTetrominoType) {
  if (!current) return null;
  let newCurrent: number[][] = [];
  for (let y = 0; y < current.length; ++y) {
    newCurrent[y] = [];
    for (let x = 0; x < current[0].length; ++x) {
      newCurrent[y][x] = current[current.length - 1 - x][y];
    }
  }

  return newCurrent;
}

function keyboardEvent(event: KeyboardEvent) {
  event.preventDefault();

  if (event.code === "ArrowLeft") {
    if (isValidMove(currentTetrimino, currentX - 1, currentY)) {
      currentX--;
    }
  }
  if (event.code === "ArrowRight") {
    if (isValidMove(currentTetrimino, currentX + 1, currentY)) {
      currentX++;
    }
  }
  if (event.code === "ArrowDown") {
    if (isValidMove(currentTetrimino, currentX, currentY + 1)) {
      currentY++;
    } else {
      freezeCurrentPiece();
      generateNewTetromino();
    }
  }
  if (event.code === "ArrowUp") {
    const test = rotate(currentTetrimino);
    currentTetrimino = test;
  }
  render();
}

export function newGameTest() {
  document.addEventListener("keydown", keyboardEvent);
  generateNewBoard();
  generateNewTetromino();
  render();
}

export function pause() {
  console.log(pause);
}

// todo : 사운드
// todo: 블록 색
// todo: pause
