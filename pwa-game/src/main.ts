import "./style.css";
// import typescriptLogo from "./typescript.svg";
// import appLogo from "/favicon.svg";
import { initPWA } from "./pwa.ts";
import { drawGrid } from "./drawGrid.ts";
import { game } from "./game.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <div>
    <h1>Tetris</h1>
    <div class="container">
      <outcome>Score: 0</outcome>
      <canvas width='320' height='640' id="game-canvas"></canvas>
    </div>
  </div>
`;

// testing purpose grid
drawGrid(document.querySelector<HTMLCanvasElement>("#game-canvas")!);

game(document.querySelector<HTMLCanvasElement>("#game-canvas")!);
initPWA(app);
