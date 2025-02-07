import { DogPainter, SPRITE_HEIGHT, SPRITE_WIDTH } from "./dogPainter";
import { GameCanvas } from "./gameCanvas";
import { Position } from "./types";

export class playableRenderer {
  constructor(private canvas: GameCanvas) {}

  render(asset: HTMLImageElement, char: any, position: Position): void {
    const ctx = this.canvas.getContext();
    const dogSprites = new DogPainter();
    ctx.drawImage(
      asset,
      position.x,
      position.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      char.position.x,
      char.position.y,
      40,
      40
    );
  }
}
