// src/Game.ts
import { Renderer } from "./renderer";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastUpdateTime: number = 0;
  private renderer: any;

  constructor(canvasId: string) {
    const renderer = new Renderer();
    this.renderer = renderer;
    const canvasElement = document.getElementById(
      canvasId
    ) as HTMLCanvasElement | null;
    if (!canvasElement) {
      throw new Error(`Canvas with ID "${canvasId}" not found.`);
    }

    this.canvas = canvasElement;
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context from canvas.");
    }

    this.ctx = context;
    this.start();
  }

  private start(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
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

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderer.drawMap();
    // Draw game elements here
  }
}
