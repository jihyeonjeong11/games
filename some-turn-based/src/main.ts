import { firstGameMap } from "./firstLevel";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function drawGame() {
  if (ctx === null) return;
  var sec = Math.floor(Date.now() / 1000);

  ctx.fillStyle = "#ff0000";
  ctx.fill;
  //ctx.fillText("FPS: " + framesLastSecond, 10, 20);

  requestAnimationFrame(drawGame);
}

window.onload = function () {
  requestAnimationFrame(drawGame);
  console.log("eiei");
  ctx.font = "bold 10pt sans-serif";
};
