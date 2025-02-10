import { GameMap, MapGenerator } from "./mapGenerator";
import { AssetLoader } from "./assetLoader";
import { MapPainter } from "./mapPainter";
import { DogPainter, SPRITE_HEIGHT, SPRITE_WIDTH } from "./dogPainter";
import { MapRenderer } from "./mapRenderer";
import { GameCanvas } from "./gameCanvas";
import { playableRenderer } from "./playableRenderer";
import { TILE_H, TILE_W } from "./enums";
import { Position } from "./types";
// holds pregenerated maps

export class GameRenderer {
  private assetLoader: any;
  private mapPainter: any;
  private dogPainter: any;
  private mapRenderer: MapRenderer;
  private gameCanvas: GameCanvas;
  private playableRenderer: playableRenderer;

  constructor(gameCanvas: GameCanvas, assetLoader: AssetLoader) {
    // Later given map size,
    const mapPainter = new MapPainter();
    const dogPainter = new DogPainter();
    this.assetLoader = assetLoader;
    this.mapPainter = mapPainter;
    this.dogPainter = dogPainter;
    this.mapRenderer = new MapRenderer(gameCanvas);
    this.playableRenderer = new playableRenderer(gameCanvas);
  }

  public renderMap(gameMap: GameMap) {
    this.mapRenderer.render(this.assetLoader.getImage("map"), gameMap);
  }

  public renderPlayable(char: any, position: Position) {
    this.playableRenderer.render(
      this.assetLoader.getImage("dog"),
      char,
      position
    );
  }

  public drawMap(map: GameMap) {
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    this.assetLoader.loadImage("map").then((image) => {
      if (!ctx) return;
      const painter = this.mapPainter;
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          const tile = map[row][col];
          const { clipW, clipH } = painter.paint(tile);
          const isCenter = ctx.drawImage(
            image,
            painter.tileImageSize * clipW,
            painter.tileImageSize * clipH,
            painter.tileImageSize,
            painter.tileImageSize,
            col * TILE_W,
            row * TILE_H,
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
