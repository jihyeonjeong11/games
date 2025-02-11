import { TILE_H, TILE_W } from "./enums";
import { GameCanvas } from "./gameCanvas";
import { GameMap } from "./mapGenerator";
import { MapPainter } from "./mapPainter";
import { isReachedEndTile } from "./utils";

export class MapRenderer {
  constructor(private canvas: GameCanvas) {}

  render(asset: HTMLImageElement, gameMap: GameMap): void {
    const ctx = this.canvas.getContext();
    const painter = new MapPainter();
    const rowCount = gameMap.length;
    const colCount = gameMap[0].length;

    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const tile = isReachedEndTile(row, col, rowCount, colCount)
          ? 3
          : gameMap[row][col];

        const { clipW, clipH } = painter.paint(tile);
        ctx.drawImage(
          asset,
          painter.tileImageSize * clipW,
          painter.tileImageSize * clipH,
          painter.tileImageSize,
          painter.tileImageSize,
          col * TILE_W,
          row * TILE_H,
          TILE_W,
          TILE_H
        );
      }
    }
  }
}
