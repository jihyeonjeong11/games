// even though Rollup is bundling all your files together, errors and
// logs will still point to your original source modules
// console.log('if you have sourcemaps enabled in your devtools, click on main.js:5 -->');

import { MapGenerator } from "./mapGenerator.js";
import { MapPainter } from "./mapPainter.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function drawGame() {
  if (ctx === null) return;
  var sec = Math.floor(Date.now() / 1000);
  const map = new MapGenerator(10, 10).getMap();
  const painter = new MapPainter();
  const tileImage = new Image();
  tileImage.src = "floortileset.png";
  tileImage.onload = function () {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tile = map[row][col];
        const { clipW, clipH } = painter.paint(tile);
        ctx.drawImage(
          tileImage,
          painter.tileImageSize * clipW,
          painter.tileImageSize * clipH,
          painter.tileImageSize,
          painter.tileImageSize,
          col * painter.tileW,
          row * painter.tileH,
          painter.tileW,
          painter.tileH
        );
      }
    }
  };

  //requestAnimationFrame(drawGame);
}

window.onload = function () {
  drawGame();
  // requestAnimationFrame(drawGame);
  ctx.font = "bold 10pt sans-serif";
};
