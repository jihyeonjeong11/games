import { MapGenerator } from "./mapGenerator";
import { AssetLoader } from "./assetLoader";
import { MapPainter } from "./mapPainter";
import { DogPainter, SPRITE_HEIGHT, SPRITE_WIDTH } from "./dogPainter";

export class Renderer {
  private assetLoader: any;
  private mapPainter: any;
  private mapGenerator: any;
  private dogPainter: any;

  constructor() {
    // Later given map size,
    const mapGenerator = new MapGenerator(10, 10);
    const mapPainter = new MapPainter();
    const assetLoader = new AssetLoader();
    const dogPainter = new DogPainter();
    this.assetLoader = assetLoader;
    this.mapGenerator = mapGenerator;
    this.mapPainter = mapPainter;
    this.dogPainter = dogPainter;
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

  public drawDog() {
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    this.assetLoader.loadImage("map", "dogtileset.png").then((image) => {
      if (!ctx) return;
      const dog = this.dogPainter.spritePositionToImagePosition(0, 1);
      ctx.drawImage(
        image,
        dog.x,
        dog.y,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        0,
        0,
        40,
        40
      );
    });
  }
}
