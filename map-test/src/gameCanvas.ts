export class GameCanvas {
  private context: CanvasRenderingContext2D;
  public canvasWidth: number;
  public canvasHeight: number;
  // resize

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    this.context = canvas.getContext("2d")!;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }
}
