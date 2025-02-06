import { DogPainter, SPRITE_HEIGHT, SPRITE_WIDTH } from "./dogPainter";
import { GameCanvas } from "./gameCanvas";

export class DogRenderer {
  constructor(private canvas: GameCanvas) {}

  // this will be used rater to save pregenerated map after stage movement feature.
  render(asset: HTMLImageElement): void {
    const ctx = this.canvas.getContext();
    const dogSprites = new DogPainter();

    const position = dogSprites.spritePositionToImagePosition(1, 0);
    ctx.drawImage(
      asset,
      position.x,
      position.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      0,
      0,
      40,
      40
    );
  }
}
