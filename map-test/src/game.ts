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

  constructor(canvasId: string) {
    this.gameCanvas = new GameCanvas(canvasId);
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
    const moveAmount = (playable.speed * deltaTime) / 1000; // Convert to seconds

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

    // Add boundary checking
    newLocation.position.x = Math.max(
      0,
      Math.min(newLocation.position.x, this.gameCanvas.canvasWidth - TILE_W)
    ); // Assuming playable width is 32
    playable.position.y = Math.max(
      0,
      Math.min(newLocation.position.y, this.gameCanvas.canvasHeight - TILE_H)
    ); // Assuming character height is 32
    this.playable.setPlayable(newLocation);
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

  private async render(): Promise<any> {
    this.ctx.clearRect(
      0,
      0,
      this.gameCanvas.canvasWidth,
      this.gameCanvas.canvasHeight
    );
    this.renderer.renderMap();
    this.renderer.renderPlayable(
      this.playable.getPlayable(),
      this.playable.getPlayable().isMoving
        ? this.playable.walkAnimation(this.playable.getPlayable().direction)
        : this.playable.idleAnimation()
    );
    // Draw game elements here
  }
}
