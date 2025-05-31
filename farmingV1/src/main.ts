import { Canvas } from "./application/canvas";
import { GameEvent } from "./application/gameEvent";
import { AssetLoader } from "./data-access/assetLoader";
import { Camera } from "./entities/camera";
import { PlayableType, Player } from "./entities/player";
import { MapObject, TileMap } from "./entities/tileMap";
import { _whatTile, isReachedEndTile } from "./utils";
import {
  DEV_FPS,
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./utils/constants";
import { Direction } from "./utils/types";

export class Game {
  canvas: Canvas;
  debugCanvas: HTMLCanvasElement;
  assetLoader: AssetLoader;
  isLoaded: boolean = false;
  map: TileMap;
  player: Player;
  camera: Camera;
  gameEvent: GameEvent;
  lastTime = 0;
  constructor() {
    this.canvas = new Canvas();
    this.gameEvent = new GameEvent();
    this.gameEvent.onInteraction(this.gatherResources.bind(this));
    this.debugCanvas = document.getElementById("debug") as HTMLCanvasElement;

    this.player = new Player(1, 1);
    this.camera = new Camera();

    this.assetLoader = new AssetLoader(
      [
        { key: "playerIdle", src: "assets/chars/Woman_Idle.png" },
        { key: "playerWalk", src: "assets/chars/Woman_Walk.png" },
        { key: "grassTile", src: "assets/backgrounds/Grass.png" },
        { key: "waterTile", src: "assets/backgrounds/Water.png" },
        { key: "dirtTile", src: "assets/backgrounds/Sand.png" },
        { key: "treeTrunkTile", src: "assets/objects/Trunk.png" },
        { key: "rockTile", src: "assets/objects/Rock.png" },
      ],
      () => {
        this.isLoaded = true;
        this.map = new TileMap(
          MAP_WIDTH,
          MAP_HEIGHT,
          this.assetLoader,
          this.canvas
        );
        if (this.isLoaded && this.map.getMap().length) this.init();
      }
    );
  }

  private init() {
    setTimeout(
      () => requestAnimationFrame((time) => this.gameLoop(time)),
      1000 / DEV_FPS
    );
  }

  private gatherResources() {
    const currentTile = _whatTile(
      this.player.getPlayable().position.x,
      this.player.getPlayable().position.y
    );

    const mapData = this.map.getMap();
    const tileValue = mapData[currentTile.col][currentTile.row];

    // Create a mapping for gatherable tiles:
    const gatherableTiles: {
      [key: number]: { resource: string; newTile: number };
    } = {
      [MapObject.STONE]: { resource: "stone", newTile: MapObject.DIRT },
      [MapObject.TREE]: { resource: "wood", newTile: MapObject.DIRT },
    };

    const action = gatherableTiles[tileValue];
    if (action) {
      // Update the tile and add the corresponding resource to the player.
      const newMap = this.map.getMap();
      newMap[currentTile.col][currentTile.row] = action.newTile;
      this.player.setResource(action.resource, 1);
      this.map.setMap(newMap);
    }
  }

  private updateCharacterMovement(deltaTime: number): void {
    const playable = this.player.getPlayable();
    const direction = this.gameEvent.getDirection();
    const moveAmount = (playable.speed * deltaTime) / 1000;
    const { x, y } = this.player.getPlayable().position;
    const newLocation: PlayableType = { ...playable };
    newLocation.direction = direction;
    newLocation.isMoving = direction !== Direction.NONE;
    switch (direction) {
      case Direction.UP:
        newLocation.position.y -= moveAmount;
        break;
      case Direction.DOWN:
        newLocation.position.y += moveAmount;
        break;
      case Direction.LEFT:
        newLocation.position.x -= moveAmount;
        break;
      case Direction.RIGHT:
        newLocation.position.x += moveAmount;
        break;
    }
    // Add Woods collision checking
    // Add boundary checking
    const tileCoord = _whatTile(x, y);

    // newLocation.position.x = Math.max(
    //   0,
    //   Math.min(newLocation.position.x, VIEWPORT_WIDTH - TILE_SIZE)
    // ); // Assuming playable width is 32
    // playable.position.y = Math.max(
    //   0,
    //   Math.min(newLocation.position.y, VIEWPORT_HEIGHT - TILE_SIZE)
    // ); // Assuming character height is 32
    // detect map movement
    const isReachedEnd = isReachedEndTile(
      tileCoord.row,
      tileCoord.col,
      this.map.getMap().length,
      this.map.getMap()[0].length
    );
    if (!isReachedEnd) {
      this.player.setPlayable(newLocation);
    }
  }

  private drawDebugInfo(): void {
    const { x, y } = this.player.getPlayable().position;
    const ctx = this.debugCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, 400, 50);
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    const tileCoord = _whatTile(x, y);

    ctx.fillText(
      `X: ${Math.floor(x)}, Y: ${Math.floor(y)}, whatTile ${
        MapObject[this.map.getMap()[tileCoord.col][tileCoord.row]]
      }, wood: ${this.player.inventory.wood} , stone: ${
        this.player.inventory.stone
      }`,
      15,
      25
    );
  }

  private gameLoop(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // this.player.update(deltaTime);
    this.updateCharacterMovement(deltaTime);

    this.drawDebugInfo();
    this.camera.update(this.player.getPlayable().position);
    this.map.draw(this.canvas.getCtx(), this.camera);
    this.player.update(currentTime, this.player.getPlayable().isMoving);

    if (this.player.getPlayable().isMoving) {
      this.player.draw(
        this.canvas.getCtx(),
        this.assetLoader,
        this.camera,
        this.assetLoader.getAsset("playerWalk")
      );
    } else {
      this.player.draw(
        this.canvas.getCtx(),
        this.assetLoader,
        this.camera,
        this.assetLoader.getAsset("playerIdle")
      );
    }

    setTimeout(
      () => requestAnimationFrame((time) => this.gameLoop(time)),
      1000 / DEV_FPS
    );
  }
}

window.onload = () => new Game();

// const DEV_FPS = 10;
// const TILE_SIZE = 32;
// const MAP_WIDTH = 50; // 50 tiles wide
// const MAP_HEIGHT = 50; // 50 tiles tall
// const PLAYER_SIZE = TILE_SIZE;
// const VIEWPORT_WIDTH = 800; // Screen width
// const VIEWPORT_HEIGHT = 600; // Screen height

// class Game {
//   private canvas: HTMLCanvasElement;
//   private ctx: CanvasRenderingContext2D;
//   private player: Player;
//   private tileMap: TileMap;
//   private camera: Camera;
//   private lastTime: number = 0;
//   private assetLoader: AssetLoader;
//   private isLoaded: boolean = false;

//   constructor() {
//     this.canvas = document.createElement("canvas");
//     this.canvas.width = VIEWPORT_WIDTH;
//     this.canvas.height = VIEWPORT_HEIGHT;
//     document.body.appendChild(this.canvas);

//     this.assetLoader = new AssetLoader(
//       [
//         { key: "playerIdle", src: "assets/chars/Woman_Idle.png" },
//         { key: "playerWalk", src: "assets/chars/Woman_Walk.png" },
//         { key: "grassTile", src: "assets/backgrounds/Grass.png" },
//         { key: "waterTile", src: "assets/backgrounds/Water.png" },
//         { key: "dirtTile", src: "assets/backgrounds/Sand.png" },

//         //{ key: "tileset", src: "assets/tiles/MapTiles.png" }
//       ],
//       () => {
//         this.isLoaded = true;
//         if (this.isLoaded) this.init();
//       }
//     );

//     this.ctx = this.canvas.getContext("2d")!;
//     this.tileMap = new TileMap(this.assetLoader);
//     this.player = new Player(5, 5, this.tileMap, this.assetLoader);
//     this.camera = new Camera(this.player);
//   }

//   private init() {
//     window.addEventListener("keydown", (e) => this.player.handleInput(e));
//     setTimeout(
//       () => requestAnimationFrame((time) => this.gameLoop(time)),
//       1000 / DEV_FPS
//     );
//   }

//   private gameLoop(currentTime) {
//     const deltaTime = currentTime - this.lastTime;
//     this.lastTime = currentTime;
//     this.player.isMoving = false;

//     this.player.update(deltaTime);
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     this.camera.update();
//     this.tileMap.render(this.ctx, this.camera);
//     this.player.render(this.ctx, this.camera);
//     setTimeout(
//       () => requestAnimationFrame((time) => this.gameLoop(time)),
//       1000 / DEV_FPS
//     );
//   }
// }

// class AssetLoader {
//   private assets: Map<string, HTMLImageElement> = new Map();
//   private loadedCount: number = 0;
//   private totalCount: number = 0;

//   constructor(
//     private assetList: { key: string; src: string }[],
//     private onLoadComplete: () => void
//   ) {
//     this.totalCount = assetList.length;
//     this.loadAssets();
//   }

//   private loadAssets() {
//     this.assetList.forEach(({ key, src }) => {
//       const img = new Image();
//       img.src = src;
//       img.onload = () => {
//         this.assets.set(key, img);
//         this.loadedCount++;
//         if (this.loadedCount === this.totalCount) {
//           this.onLoadComplete();
//         }
//       };
//     });
//   }

//   getAsset(key: string): HTMLImageElement | undefined {
//     return this.assets.get(key);
//   }

//   isLoaded(): boolean {
//     return this.loadedCount === this.totalCount;
//   }
// }

// class Camera {
//   private player: Player;
//   public x: number = 0;
//   public y: number = 0;

//   constructor(player: Player) {
//     this.player = player;
//     this.update();
//   }

//   update() {
//     this.x = Math.max(
//       0,
//       Math.min(
//         this.player.x - VIEWPORT_WIDTH / 2,
//         MAP_WIDTH * TILE_SIZE - VIEWPORT_WIDTH
//       )
//     );
//     this.y = Math.max(
//       0,
//       Math.min(
//         this.player.y - VIEWPORT_HEIGHT / 2,
//         MAP_HEIGHT * TILE_SIZE - VIEWPORT_HEIGHT
//       )
//     );
//   }
// }

// class Player {
//   public x: number;
//   public y: number;
//   private map: TileMap;
//   private sprite: HTMLImageElement;
//   private walking_sprite: HTMLImageElement;
//   private loaded: boolean = false;
//   public isMoving: boolean = false;
//   private assetLoader: AssetLoader;

//   private frameIndex: number = 0;
//   private frameCount: number = 9; // 총 9 프레임
//   private frameWidth: number = 24;
//   private frameHeight: number = 32;
//   private frameDuration: number = 100; // 0.1초마다 프레임 변경
//   private lastFrameTime: number = 0;

//   constructor(x: number, y: number, map: TileMap, assetLoader: AssetLoader) {
//     this.x = x * PLAYER_SIZE;
//     this.y = y * PLAYER_SIZE;
//     this.map = map;
//     this.assetLoader = assetLoader;
//     this.sprite = new Image();
//   }

//   update(deltaTime: number) {
//     // 0.1초마다 프레임 변경
//     this.lastFrameTime += deltaTime;
//     if (this.lastFrameTime >= this.frameDuration) {
//       this.frameIndex = (this.frameIndex + 1) % this.frameCount;
//       this.lastFrameTime = 0;
//     }
//   }

//   handleInput(event: KeyboardEvent) {
//     const move = { x: 0, y: 0 };
//     if (event.key === "ArrowUp" || event.key === "w") move.y = -PLAYER_SIZE;
//     if (event.key === "ArrowDown" || event.key === "s") move.y = PLAYER_SIZE;
//     if (event.key === "ArrowLeft" || event.key === "a") move.x = -PLAYER_SIZE;
//     if (event.key === "ArrowRight" || event.key === "d") move.x = PLAYER_SIZE;
//     this.isMoving = !!event.key;
//     const newX = this.clamp(
//       this.x + move.x,
//       0,
//       MAP_WIDTH * TILE_SIZE - PLAYER_SIZE
//     );
//     const newY = this.clamp(
//       this.y + move.y,
//       0,
//       MAP_HEIGHT * TILE_SIZE - PLAYER_SIZE
//     );
//     if (this.map.canMoveTo(newX, newY)) {
//       this.x = newX;
//       this.y = newY;
//     }
//   }

//   private clamp(value: number, min: number, max: number) {
//     return Math.max(min, Math.min(max, value));
//   }

//   render(ctx: CanvasRenderingContext2D, camera: Camera) {
//     ctx.drawImage(
//       this.assetLoader.getAsset("playerIdle")!,
//       22 * this.frameIndex,
//       0,
//       24,
//       32,
//       this.x - camera.x,
//       this.y - camera.y,
//       PLAYER_SIZE,
//       PLAYER_SIZE
//     );
//   }
// }

// enum MapObject {
//   STONE = 1,
//   GRASS = 2,
//   DIRT = 3,
//   TREE = 4,
//   WATER = 5,
// }

// class TileMap {
//   private map: number[][];
//   private tileSize: number = TILE_SIZE;
//   private assetLoader: AssetLoader;

//   constructor(assetLoader: AssetLoader) {
//     this.assetLoader = assetLoader;
//     this.map = Array.from({ length: MAP_HEIGHT }, () =>
//       Array.from({ length: MAP_WIDTH }, () => this.generateTile())
//     );
//   }

//   private generateTile(): number {
//     const rand = Math.random();
//     if (rand < 0.2) return MapObject.STONE;
//     if (rand < 0.5) return MapObject.GRASS;
//     if (rand < 0.7) return MapObject.DIRT;
//     if (rand < 0.9) return MapObject.TREE;
//     return MapObject.WATER;
//   }

//   private getTileImage(tileId: number): string | HTMLImageElement {
//     return (
//       {
//         [MapObject.DIRT]: this.assetLoader.getAsset("dirtTile")!,
//         [MapObject.STONE]: "#333",
//         [MapObject.GRASS]: this.assetLoader.getAsset("grassTile")!,
//         [MapObject.TREE]: "#666",
//         [MapObject.WATER]: this.assetLoader.getAsset("waterTile")!,
//       }[tileId] || "#000"
//     );
//   }

//   canMoveTo(x: number, y: number): boolean {
//     const col = Math.floor(x / TILE_SIZE);
//     const row = Math.floor(y / TILE_SIZE);
//     return this.map[row]?.[col] !== MapObject.WATER;
//   }

//   render(ctx: CanvasRenderingContext2D, camera: Camera): void {
//     const startCol = Math.floor(camera.x / TILE_SIZE);
//     const endCol = Math.ceil((camera.x + VIEWPORT_WIDTH) / TILE_SIZE);
//     const startRow = Math.floor(camera.y / TILE_SIZE);
//     const endRow = Math.ceil((camera.y + VIEWPORT_HEIGHT) / TILE_SIZE);

//     for (let row = startRow; row < endRow; row++) {
//       for (let col = startCol; col < endCol; col++) {
//         if (this.map[row] && this.map[row][col] !== undefined) {
//           const imageOrColor = this.getTileImage(this.map[row][col]);
//           if (typeof imageOrColor === "string") {
//             ctx.fillStyle = imageOrColor;
//             ctx.fillRect(
//               col * this.tileSize - camera.x,
//               row * this.tileSize - camera.y,
//               this.tileSize,
//               this.tileSize
//             );
//           } else {
//             ctx.drawImage(
//               imageOrColor,
//               0,
//               0,
//               this.tileSize,
//               this.tileSize,
//               col * this.tileSize - camera.x,
//               row * this.tileSize - camera.y,
//               this.tileSize,
//               this.tileSize
//             );
//           }
//         }
//       }
//     }
//   }
// }

// window.onload = () => new Game();
