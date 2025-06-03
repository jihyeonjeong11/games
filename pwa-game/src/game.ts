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
let lastTime = 0;

export let gameState: "start" | "pause" = "pause";
let currentY = 0;
let currentX = 3;
let currentBlock: null | (typeof tetrominos)[keyof typeof tetrominos] = null;

function drawBlock(canvas: HTMLCanvasElement, x: number, y: number) {
  let ctx = canvas.getContext("2d")!;
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

function createBoard() {
  const newBoard: number[][] = [];
  for (let y = 0; y < ROWS; ++y) {
    newBoard.push([]);
    for (let x = 0; x < COLS; ++x) {
      newBoard[y].push(0);
    }
  }
  return newBoard;
}

function getRandomTetromino() {
  const keys = Object.keys(tetrominos);
  const random = keys[
    Math.floor(Math.random() * keys.length)
  ] as keyof typeof tetrominos;
  return tetrominos[random];
}

function freezeCurrentPiece() {
  currentBlock = null;
  currentY = 0;
}

export function tick(currentTime: number) {
  const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas")!;
  // interval 1000
  if (!(currentTime >= lastTime + 1000)) {
    raf = requestAnimationFrame(tick);
  } else {
    lastTime = currentTime;
    let newBoard = [];
    // 보드 없을 때
    if (!board.length) {
      newBoard = createBoard();
    } else {
      // 없다면 이전 데이터 사용
      newBoard = board;
    }
    // 새 블락 생성
    if (!currentBlock) {
      currentBlock = getRandomTetromino();
      for (let i = 0; i < currentBlock.length; i++) {
        for (let j = 0; j < currentBlock[i].length; j++) {
          const row = currentBlock[i];
          if (row[j]) {
            newBoard[i + currentY][j + currentX] = 1;
          }
        }
      }

      // 블락 내려감 이전 보드 내용 지우기
    } else {
      // 1. 1칸 다운
      currentY++;
      // 2. 끝에 도달했다면 내리고 끝
      if (currentY >= 19) {
        freezeCurrentPiece();
        // 3. 부딪힌다면 안내리고 끝
      } else {
        // 1. Clear previous block position
        for (let i = 0; i < board.length && i <= currentY; i++) {
          for (let j = 0; j < board[i].length; j++) {
            newBoard[i][j] = 0;
          }
        }

        // 2. Redraw block in new position
        for (let i = 0; i < currentBlock.length; i++) {
          for (let j = 0; j < currentBlock[i].length; j++) {
            if (currentBlock[i][j]) {
              newBoard[currentY + i][currentX + j] = 1;
            }
          }
        }
      }
    }

    // 3. when collide currentY row has 1 value
    // newPosition에 1이 있을 경우 멈춤. 혹은 20 넘어갈 경우 멈춤

    // 3. when collide

    // 다 끝났다면 리드로우

    board = newBoard;

    let ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // testing grid line
    drawGrid(canvas);

    ctx.strokeStyle = "black";
    // board redraw
    for (let y = 0; y < board.length; ++y) {
      for (let x = 0; x < board[y].length; ++x) {
        if (board[y][x]) {
          ctx.fillStyle = colors[board[y][x] - 1];
          drawBlock(canvas, x, y);
        }
      }
    }

    raf = requestAnimationFrame(tick);
  }
}

export function toggleGame(state: "start" | "pause") {
  gameState = state;
}

export function newGame() {
  // todo: clear existing rafs
  // todo:
  raf = requestAnimationFrame(tick);
}

export function playButtonClick() {
  const button = document.querySelector("#button-start") as HTMLButtonElement;
  button.disabled = true;
  newGame();
}

export function pause() {
  console.log(pause);
}

// 게임 시작 스테이트
// interval 시작.
// 클리어캔서브
// 랜덤 피스 생성 후 드로우
// 1초에 한번씩 내려옴.
// 끝에 달하면 움직임 정지
// 다시 랜덤 피스 생성
