import { DogPainter, SPRITE_HEIGHT, SPRITE_WIDTH } from "./dogPainter";
import { GameCanvas } from "./gameCanvas";

export class DogRenderer {
  constructor(private canvas: GameCanvas, char) {}

  // this will be used rater to save pregenerated map after stage movement feature.
  render(asset: HTMLImageElement, char: any): void {
    const ctx = this.canvas.getContext();
    const dogSprites = new DogPainter();
    console.log(char);
    const position = dogSprites.spritePositionToImagePosition(1, 0);
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
