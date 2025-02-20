import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../utils/constants";
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

  // cleanCanvas, resizeCanvas
}
