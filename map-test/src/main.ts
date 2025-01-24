import update from "./update.js";
import { FirstMap } from "./firstLevel.js";

// even though Rollup is bundling all your files together, errors and
// logs will still point to your original source modules
// console.log('if you have sourcemaps enabled in your devtools, click on main.js:5 -->');

// import { firstGameMap } from "./firstLevel";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function drawGame() {
  if (ctx === null) return;
  var sec = Math.floor(Date.now() / 1000);

  ctx.fillStyle = "blue";
  //ctx.fillText("FPS: " + framesLastSecond, 10, 20);

  requestAnimationFrame(drawGame);
}

window.onload = function () {
  requestAnimationFrame(drawGame);
  console.log(FirstMap);
  ctx.font = "bold 10pt sans-serif";
};
