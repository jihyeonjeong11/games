import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "./constants";

type CanvasType = {
  id?: string;
  width?: number;
  height?: number;
};

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasProps: CanvasType) {
    this.canvas = document.createElement("canvas");
    if (canvasProps && canvasProps.id)
      this.canvas.setAttribute("id", canvasProps.id);
    this.canvas.width =
      canvasProps && canvasProps.width ? canvasProps.width : VIEWPORT_WIDTH;
    this.canvas.height =
      canvasProps && canvasProps.height ? canvasProps.height : VIEWPORT_HEIGHT;
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
