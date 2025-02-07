import { Direction, Position } from "../types";

export type AnimationState = "idle" | "walkingLeft" | "walkingRight";
export type DirectionFrames = Record<Direction, number[]>;

export interface AnimationConfig {
  frameWidth: number;
  frameHeight: number;
  animations: Record<AnimationState, Position[]>;
  frameDuration: number;
}

export const dogAnimations: AnimationConfig = {
  frameWidth: 32,
  frameHeight: 32,
  frameDuration: 150,
  animations: {
    idle: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    walkingLeft: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    walkingRight: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    // up and down
  },
};
