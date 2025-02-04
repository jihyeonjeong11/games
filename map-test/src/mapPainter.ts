import { TileType } from "./mapGenerator";
// public/floortileset.png

export class MapPainter {
  public tileImageSize: number;
  public tileW: 40;
  public tileH: 40;
  private tileCoord: Record<TileType, { clipW: number; clipH: number }> = {
    0: { clipW: 1, clipH: 7 }, // dirt
    1: { clipW: 1, clipH: 3 }, // grass
    2: { clipW: 6, clipH: 7 }, // woods
  };

  constructor() {
    this.tileImageSize = 32;
    this.tileW = 40;
    this.tileH = 40;
  }

  paint(tile: TileType): (typeof this.tileCoord)[keyof typeof this.tileCoord] {
    return this.tileCoord[tile];
  }
}
