import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "./constants";
export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = VIEWPORT_WIDTH;
    this.canvas.height = VIEWPORT_HEIGHT;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;
  }

  public getCtx() {
    return this.ctx;
  }

  public clearCanvas() {
    this.ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }
}
