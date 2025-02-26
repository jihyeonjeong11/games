import { AssetLoader } from "./assetLoader";
import { Camera } from "./camera";
import {
  MapObject,
  PLAYER_SIZE,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./constants";

class MapGenerator {
  generateTile(): MapObject {
    const rand = Math.random();
    if (rand < 0.2) return MapObject.STONE;
    if (rand < 0.5) return MapObject.GRASS;
    if (rand < 0.7) return MapObject.DIRT;
    if (rand < 0.9) return MapObject.TREE;
    return MapObject.WATER;
  }

  generate(width: number, height: number): MapObject[][] {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => this.generateTile())
    );
  }
}

class TileMapRenderer {
  private assetLoader: AssetLoader;

  constructor(assetLoader: AssetLoader) {
    this.assetLoader = assetLoader;
  }

  getTileImage(tileId: number): string | HTMLImageElement {
    return (
      {
        [MapObject.DIRT]: this.assetLoader.getAsset("dirtTile"),
        [MapObject.STONE]: this.assetLoader.getAsset("rockTile"),
        [MapObject.GRASS]: this.assetLoader.getAsset("grassTile"),
        [MapObject.TREE]: this.assetLoader.getAsset("treeTrunkTile"),
        [MapObject.WATER]: this.assetLoader.getAsset("waterTile"),
      }[tileId] || "#000"
    );
  }
}

export class TileMap {
  private map: MapObject[][];
  private renderer: TileMapRenderer;

  constructor(width: number, height: number, assetLoader: AssetLoader) {
    const generator = new MapGenerator();
    this.map = generator.generate(width, height);
    this.renderer = new TileMapRenderer(assetLoader);
  }

  public getMap() {
    return this.map;
  }

  public setMap(map: MapObject[][]) {
    this.map = map;
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    assetLoader: AssetLoader
  ): void {
    const startCol = Math.floor(camera.x / TILE_SIZE);
    const endCol = Math.ceil((camera.x + VIEWPORT_WIDTH) / TILE_SIZE);
    const startRow = Math.floor(camera.y / TILE_SIZE);
    const endRow = Math.ceil((camera.y + VIEWPORT_HEIGHT) / TILE_SIZE);

    // Leave this as it is for now since assets are not determined completely
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (this.map[row] && this.map[row][col] !== undefined) {
          const imageOrColor = this.renderer.getTileImage(this.map[row][col]);
          if (typeof imageOrColor === "string") {
            ctx.fillStyle = imageOrColor;
            ctx.fillRect(
              col * PLAYER_SIZE - camera.x,
              row * PLAYER_SIZE - camera.y,
              PLAYER_SIZE,
              PLAYER_SIZE
            );
          } else {
            if (this.map[row][col] === 4 || this.map[row][col] === 1) {
              // if treetrunks, draw dirt and trunk.
              ctx.drawImage(
                assetLoader.getAsset("dirtTile")!,
                0,
                0,
                PLAYER_SIZE,
                PLAYER_SIZE,
                col * PLAYER_SIZE - camera.x,
                row * PLAYER_SIZE - camera.y,
                PLAYER_SIZE,
                PLAYER_SIZE
              );
              ctx.drawImage(
                imageOrColor,
                0,
                0,
                97,
                97,
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
}
