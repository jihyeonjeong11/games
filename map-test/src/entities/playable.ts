import { Direction, Position } from "../types";

export type PlayableType = {
  position: Position;
  speed: number;
  direction: Direction;
  isMoving: boolean;
};

export class Playable {
  private playable: PlayableType;
  constructor() {
    this.playable = {
      position: { x: 0, y: 0 },
      speed: 100,
      direction: Direction.NONE,
      isMoving: false,
    };
  }

  public getPlayable() {
    return this.playable;
  }

  public setPlayable(object: PlayableType) {
    this.playable = { ...this.playable, ...object };
  }
}
