import { MapGenerator } from "./mapGenerator";
import { AssetLoader } from "./assetLoader";
import { MapPainter } from "./mapPainter";

export class Renderer {
  private assetLoader: any;
  private mapPainter: any;
  private mapGenerator: any;

  constructor() {
    // Later given map size,
    const mapGenerator = new MapGenerator(10, 10);
    const mapPainter = new MapPainter();
    const assetLoader = new AssetLoader();
    this.assetLoader = assetLoader;
    this.mapGenerator = mapGenerator;
    this.mapPainter = mapPainter;
  }

  public drawMap() {
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    this.assetLoader.loadImage("map", "floortileset.png").then((image) => {
      if (!ctx) return;
      const map = this.mapGenerator.getMap();
      const painter = this.mapPainter;
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          const tile = map[row][col];
          const { clipW, clipH } = painter.paint(tile);
          ctx.drawImage(
            image,
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
    });
  }
}
