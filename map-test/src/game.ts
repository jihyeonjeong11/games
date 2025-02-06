// src/Game.ts
import { AssetLoader } from "./assetLoader";
import { GameCanvas } from "./gameCanvas";
import { GameRenderer } from "./gameRenderer";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastUpdateTime: number = 0;
  private renderer: GameRenderer;
  private gameCanvas: GameCanvas;
  private isLoaded: boolean;
  private assetLoader: AssetLoader;

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
    const deltaTime = timestamp - this.lastUpdateTime;
    this.lastUpdateTime = timestamp;
    this.update(deltaTime);
    this.render();

    //requestAnimationFrame(this.gameLoop.bind(this));
  }

  private update(deltaTime: number): void {
    // Update game logic here
  }

  private async render(): Promise<any> {
    this.ctx.clearRect(
      0,
      0,
      this.gameCanvas.canvasWidth,
      this.gameCanvas.canvasHeight
    );
    this.renderer.renderMap();
    this.renderer.renderDog();
    // Draw game elements here
  }
}
