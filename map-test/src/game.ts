// src/Game.ts
import { AssetLoader } from "./assetLoader";
import { GameCanvas } from "./gameCanvas";
import { GameRenderer } from "./gameRenderer";
import { GameEvent } from "./gameEvent";
import { FrameLimiter } from "./frameLimiter";
import { Playable, PlayableType } from "./entities/playable";
import { TILE_H, TILE_W } from "./enums";
import { Direction } from "./types";
import { Dog } from "./entities/dog";
import { GameMap, MapGenerator } from "./mapGenerator";
import { _whatTile, isCenterTile } from "./utils";
import TileMap from "./TileMap";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastUpdateTime: number = 0;
  private renderer: GameRenderer;
  private gameCanvas: GameCanvas;
  private isLoaded: boolean;
  private assetLoader: AssetLoader;
  private playable: Dog;
  private gameEvent: GameEvent;
  private frameLimiter: FrameLimiter;
  private mapGenerator: MapGenerator;
  private gameMap: GameMap;
  private debugCanvas: GameCanvas;
  private tileMap: TileMap;

  constructor(canvasId: string) {
    this.mapGenerator = new MapGenerator(10, 10);
    if (!this.gameMap) this.gameMap = this.mapGenerator.getMap();
    this.tileMap = new TileMap(this.mapGenerator.getMap());

    this.gameCanvas = new GameCanvas(canvasId);
    this.debugCanvas = new GameCanvas("debug");
    this.assetLoader = new AssetLoader();
    this.renderer = new GameRenderer(this.gameCanvas, this.assetLoader);
    this.playable = new Dog();

    if (!this.gameCanvas) {
      throw new Error(`Canvas with ID "${canvasId}" not found.`);
    }

    const context = this.gameCanvas.getContext();
    if (!context) {
      throw new Error("Failed to get 2D context from canvas.");
    }

    this.ctx = context;

    this.gameEvent = new GameEvent();

    this.frameLimiter = new FrameLimiter(10);

    this.start();
  }

  private async loadAssets() {
    await this.assetLoader.loadAll();
    this.isLoaded = true;
  }

  private async start(): Promise<void> {
    await this.loadAssets();
    if (this.isLoaded) {
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  private gameLoop(timestamp: number): void {
    if (this.frameLimiter.shouldProcessFrame(timestamp)) {
      const deltaTime = timestamp - this.lastUpdateTime;
      this.lastUpdateTime = timestamp;

      this.update(deltaTime);
      this.render();
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private update(deltaTime: number): void {
    this.updateCharacterMovement(deltaTime);
  }

  private updateCharacterMovement(deltaTime: number): void {
    const playable = this.playable.getPlayable();
    const direction = this.gameEvent.getDirection();
    const moveAmount = (playable.speed * deltaTime) / 1000;
    const { x, y } = this.playable.getPlayable().position;

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
    newLocation.position.x = Math.max(
      0,
      Math.min(newLocation.position.x, this.gameCanvas.canvasWidth - TILE_W)
    ); // Assuming playable width is 32
    playable.position.y = Math.max(
      0,
      Math.min(newLocation.position.y, this.gameCanvas.canvasHeight - TILE_H)
    ); // Assuming character height is 32

    // detect map movement
    const tileCoord = _whatTile(x, y);
    const movementDirection = isCenterTile(
      tileCoord.row,
      tileCoord.col,
      this.gameMap.length,
      this.gameMap[0].length
    );

    if (movementDirection) {
      const connectedMap = this.tileMap.connectMap(
        movementDirection,
        new MapGenerator(10, 10).getMap()
      );
      console.log(this.tileMap.getNeighbors(0, 0));
    } else {
      this.playable.setPlayable(newLocation);
    }
  }

  setGameSpeed(fps: number): void {
    this.frameLimiter.setFPS(fps);
  }

  enableFrameLimiter(): void {
    this.frameLimiter.enable();
  }

  disableFrameLimiter(): void {
    this.frameLimiter.disable();
  }

  // make this into another class
  private drawDebugInfo(): void {
    const { x, y } = this.playable.getPlayable().position;
    const ctx = this.debugCanvas?.getContext()!;
    ctx.clearRect(
      0,
      0,
      this.debugCanvas.canvasWidth,
      this.debugCanvas.canvasHeight
    );
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    const tileCoord = _whatTile(x, y);
    const canMoveAnotherMap = isCenterTile(
      tileCoord.row,
      tileCoord.col,
      this.gameMap.length,
      this.gameMap[0].length
    );
    ctx.fillText(
      `X: ${Math.floor(x)}, Y: ${Math.floor(
        y
      )}, isCenterTile: ${canMoveAnotherMap}`,
      15,
      25
    );
  }

  private async render(): Promise<any> {
    this.ctx.clearRect(
      0,
      0,
      this.gameCanvas.canvasWidth,
      this.gameCanvas.canvasHeight
    );
    this.renderer.renderMap(this.gameMap);
    this.drawDebugInfo();
    this.renderer.renderPlayable(
      this.playable.getPlayable(),
      this.playable.getPlayable().isMoving
        ? this.playable.walkAnimation(this.playable.getPlayable().direction)
        : this.playable.idleAnimation()
    );
  }
}
