import "./style.css";
// import typescriptLogo from "./typescript.svg";
// import appLogo from "/favicon.svg";
import { initPWA } from "./pwa.ts";
import { toggleGame, playButtonClick, pause } from "./game.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <div>
    <h1>Tetris</h1>
    <div class="container">
      <div class="controls">
        <outcome>Score: 0</outcome>
        <button id="button-start"><span>Start</span></button>
        <button id="button-stop"><span>Pause</span></button>
      </div>
      <canvas width='320' height='640' id="game-canvas"></canvas>
    </div>
  </div>
`;

const startButton = document.querySelector("#button-start");
const stopButton = document.querySelector("#button-stop");

startButton?.addEventListener("click", playButtonClick);

stopButton?.addEventListener("click", pause);

// testing purpose grid
//game(document.querySelector<HTMLCanvasElement>("#game-canvas")!);

initPWA(app);
