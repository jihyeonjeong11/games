import { Canvas } from "../application/canvas";
import { AssetLoader } from "../data-access/assetLoader";
import {
  PLAYER_SIZE,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "../utils/constants";
import { Camera } from "./camera";

export enum MapObject {
  STONE = 1,
  GRASS = 2,
  DIRT = 3,
  TREE = 4,
  WATER = 5,
}

export class TileMap {
  width: number;
  height: number;
  map: MapObject[][];
  assetLoader: AssetLoader;
  canvas: Canvas;

  constructor(width: number, height: number, assetLoader, canvas) {
    // too many?
    this.width = width;
    this.height = height; // do this need them?

    this.canvas = canvas;
    this.map = this.generateRandomMap(width, height);
    this.assetLoader = assetLoader;
  }

  private generateTile() {
    const rand = Math.random();
    if (rand < 0.2) return MapObject.STONE;
    if (rand < 0.5) return MapObject.GRASS;
    if (rand < 0.7) return MapObject.DIRT;
    if (rand < 0.9) return MapObject.TREE;
    return MapObject.WATER;
  }

  private generateRandomMap(maxX, maxY) {
    return Array.from({ length: maxY }, () =>
      Array.from({ length: maxX }, () => this.generateTile())
    );
  }

  public getMap() {
    return this.map;
  }

  public canMoveTo(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  private getTileImage(tileId: number): string | HTMLImageElement {
    return (
      {
        [MapObject.DIRT]: this.assetLoader.getAsset("dirtTile")!,
        [MapObject.STONE]: "#333",
        [MapObject.GRASS]: this.assetLoader.getAsset("grassTile")!,
        [MapObject.TREE]: "#666",
        [MapObject.WATER]: this.assetLoader.getAsset("waterTile")!,
      }[tileId] || "#000"
    );
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const startCol = Math.floor(camera.x / TILE_SIZE);
    const endCol = Math.ceil((camera.x + VIEWPORT_WIDTH) / TILE_SIZE);
    const startRow = Math.floor(camera.y / TILE_SIZE);
    const endRow = Math.ceil((camera.y + VIEWPORT_HEIGHT) / TILE_SIZE);

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (this.map[row] && this.map[row][col] !== undefined) {
          const imageOrColor = this.getTileImage(this.map[row][col]);
          if (typeof imageOrColor === "string") {
            ctx.fillStyle = imageOrColor;
            ctx.fillRect(
              col * PLAYER_SIZE - camera.x,
              row * PLAYER_SIZE - camera.y,
              PLAYER_SIZE,
              PLAYER_SIZE
            );
          } else {
            ctx.drawImage(
              imageOrColor,
              0,
              0,
              PLAYER_SIZE,
              PLAYER_SIZE,
              col * PLAYER_SIZE - camera.x,
              row * PLAYER_SIZE - camera.y,
              PLAYER_SIZE,
              PLAYER_SIZE
            );
          }
        }
      }
    }
  }
}
