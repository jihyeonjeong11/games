export const SPRITE_WIDTH = 161;
export const SPRITE_HEIGHT = 151;
export const BORDER_WIDTH = 1;
export const SPACING_WIDTH = 1;

export class DogPainter {
  public spritePositionToImagePosition(row, col) {
    return {
      x: BORDER_WIDTH + col * (SPACING_WIDTH + SPRITE_WIDTH),
      y: BORDER_WIDTH + row * (SPACING_WIDTH + SPRITE_HEIGHT),
    };
  }
}
