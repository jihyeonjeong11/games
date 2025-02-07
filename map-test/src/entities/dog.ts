import { AnimationConfig, dogAnimations } from "../configs/animations";
import { DogPainter } from "../dogPainter";
import { Direction, Position } from "../types";
import { Playable } from "./playable";

export class Dog extends Playable {
  private animationConfig: AnimationConfig;
  public col: number;
  public row: number;
  public frameIndex: number;

  constructor() {
    super();
    this.col = 0;
    this.row = 0;
    this.frameIndex = 0;
  }

  public updateAnimation() {}

  public idleAnimation() {
    const dogSprites = new DogPainter();

    if (this.frameIndex > 4) {
      this.frameIndex = 0;
    }

    const result = dogSprites.spritePositionToImagePosition(
      dogAnimations.animations.idle[this.frameIndex].x,
      dogAnimations.animations.idle[this.frameIndex].y
    );
    this.frameIndex += 1;
    return result;
  }

  public walkAnimation(direction: Direction) {
    const dogSprites = new DogPainter();
    if (this.frameIndex > 2) {
      this.frameIndex = 0;
    }
    let result: Position | null = null;
    if (direction === "left") {
      result = dogSprites.spritePositionToImagePosition(
        dogAnimations.animations.walkingLeft[this.frameIndex].x,
        dogAnimations.animations.walkingLeft[this.frameIndex].y
      );
    } else {
      result = dogSprites.spritePositionToImagePosition(
        dogAnimations.animations.walkingRight[this.frameIndex].x,
        dogAnimations.animations.walkingRight[this.frameIndex].y
      );
    }

    this.frameIndex += 1;
    return result;
  }
}
