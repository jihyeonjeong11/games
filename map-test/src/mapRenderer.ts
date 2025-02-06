import { GameCanvas } from "./gameCanvas";
import { MapGenerator } from "./mapGenerator";
import { MapPainter } from "./mapPainter";

export class MapRenderer {
  constructor(private canvas: GameCanvas) {}

  // this will be used rater to save pregenerated map after stage movement feature.
  render(asset: HTMLImageElement): void {
    const ctx = this.canvas.getContext();
    const gameMap = new MapGenerator(10, 10).getMap();
    const painter = new MapPainter();

    for (let row = 0; row < gameMap.length; row++) {
      for (let col = 0; col < gameMap[row].length; col++) {
        const tile = gameMap[row][col];
        const { clipW, clipH } = painter.paint(tile);

        ctx.drawImage(
          asset,
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
  }
}
