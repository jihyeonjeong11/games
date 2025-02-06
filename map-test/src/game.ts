// src/Game.ts
import { AssetLoader } from "./assetLoader";
import { Direction } from "./gameEvent";
import { GameCanvas } from "./gameCanvas";
import { GameRenderer } from "./gameRenderer";
import { GameEvent } from "./gameEvent";
import { FrameLimiter } from "./frameLimiter";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastUpdateTime: number = 0;
  private renderer: GameRenderer;
  private gameCanvas: GameCanvas;
  private isLoaded: boolean;
  private assetLoader: AssetLoader;
  private dogChar: any;
  private gameEvent: GameEvent;
  private frameLimiter: FrameLimiter;

  constructor(canvasId: string) {
    this.gameCanvas = new GameCanvas(canvasId);
    this.assetLoader = new AssetLoader();
    this.renderer = new GameRenderer(this.gameCanvas, this.assetLoader);

    if (!this.gameCanvas) {
      throw new Error(`Canvas with ID "${canvasId}" not found.`);
    }

    const context = this.gameCanvas.getContext();
    if (!context) {
      throw new Error("Failed to get 2D context from canvas.");
    }

    this.ctx = context;

    this.gameEvent = new GameEvent();
    this.dogChar = {
      position: { x: 0, y: 0 },
      speed: 100,
      direction: Direction.NONE,
      isMoving: false,
    };

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
    const direction = this.gameEvent.getDirection();
    const moveAmount = (this.dogChar.speed * deltaTime) / 1000; // Convert to seconds

    this.dogChar.direction = direction;
    this.dogChar.isMoving = direction !== Direction.NONE;

    switch (direction) {
      case Direction.UP:
        this.dogChar.position.y -= moveAmount;
        break;
      case Direction.DOWN:
        this.dogChar.position.y += moveAmount;
        break;
      case Direction.LEFT:
        this.dogChar.position.x -= moveAmount;
        break;
      case Direction.RIGHT:
        this.dogChar.position.x += moveAmount;
        break;
    }

    // Add boundary checking
    this.dogChar.position.x = Math.max(
      0,
      Math.min(this.dogChar.position.x, this.gameCanvas.canvasWidth - 32)
    ); // Assuming dogChar width is 32
    this.dogChar.position.y = Math.max(
      0,
      Math.min(this.dogChar.position.y, this.gameCanvas.canvasHeight - 32)
    ); // Assuming character height is 32
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
    this.renderer.renderDog(this.dogChar);
    // Draw game elements here
  }
}
