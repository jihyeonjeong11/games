// todo: 펑션들 전부 param 받는 식으로 가기
// todo: currentTetrimino 이름 좀더 테트리스스럽게 바꾸기
import { drawGrid } from "./drawGrid";

const COLS = 10,
  ROWS = 20;
let board: number[][] = [];
const BLOCK_W = 320 / COLS,
  BLOCK_H = 640 / ROWS;

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
// 스태틱한 피스, 회전한 피스 타입 두가지
type CurrentTetrominoType =
  | null
  | (typeof tetrominos)[keyof typeof tetrominos]
  | number[][];

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
}

function updateScoreDisplay(score: number) {
  const scoreDisplay = document.querySelector<HTMLElement>("#score");
  if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
}

function clearLineForScore() {
  for (let i = 0; i < board.length; i++) {
    if (board[i].every((e) => e)) {
      board.splice(i, 1); // Remove the filled row
      board.unshift(new Array(COLS).fill(0)); // Add an empty row at the top
      score++;
      updateScoreDisplay(score);
      i++; // Re-check the same index after shifting
    }
  }
}

function render() {
  const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas")!;

  let ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // testing grid line
  drawGrid(canvas);

  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (board[y][x]) {
        ctx.fillStyle = colors[board[y][x] - 1];
        drawBlock(canvas, x, y);
      }
    }
  }

  if (currentTetrimino) {
    for (let y = 0; y < currentTetrimino.length; ++y) {
      for (let x = 0; x < currentTetrimino[0].length; ++x) {
        if (currentTetrimino[y][x]) {
          ctx.fillStyle = colors[currentTetrimino[y][x] - 1];
          drawBlock(canvas, currentX + x, currentY + y);
        }
      }
    }
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
  // 회전, 움직임
  // todo: switch them to switch()
  if (event.code === "ArrowLeft") {
    // todo: move left
    if (isValidMove(currentTetrimino, currentX - 1, currentY)) {
      currentX--;
    } else {
      console.log("not happening");
    }
  }
  if (event.code === "ArrowRight") {
    // todo: move right
    if (isValidMove(currentTetrimino, currentX + 1, currentY)) {
      currentX++;
    } else {
      console.log("not happening");
    }
  }
  if (event.code === "ArrowDown") {
    // todo: go down to bottom and freeze
    if (isValidMove(currentTetrimino, currentX, currentY + 1)) {
      currentY++;
    } else {
      console.log("freeze happens");
      freezeCurrentPiece();
      generateNewTetromino();
    }
  }
  if (event.code === "ArrowUp") {
    // todo: rotate
    const test = rotate(currentTetrimino);
    currentTetrimino = test;
  }
  render();
}

export function newGameTest() {
  // SRS 로직 시작
  document.addEventListener("keydown", keyboardEvent);

  generateNewBoard();
  generateNewTetromino();
  render();
}

export function pause() {
  console.log(pause);
}

// 충돌, 회전 로직

// method 1: 직접 하나하나 좌표 계산
// https://www.reddit.com/r/programminghorror/comments/f7ym4a/how_to_do_tetris_collision_detection_in_only_800/

// method 2: Standard Rotation System
// https://harddrop.com/wiki/SRS

// todo: 부품 색깔
// todo: pause?
