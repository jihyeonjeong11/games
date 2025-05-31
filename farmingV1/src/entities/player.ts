import { PLAYER_SIZE } from "../utils/constants";
import { Direction, Position } from "../utils/types";
import { Camera } from "./camera";

export type PlayableType = {
  position: Position;
  speed: number;
  direction: Direction;
  isMoving: boolean;
};

export type InventoryType = {
  wood: number;
  stone: number;
};

export class Player {
  private playable: PlayableType;
  position: Position;
  speed: number;
  direction: Direction;
  inventory: InventoryType = {
    wood: 0,
    stone: 0,
  };
  tree: number = 0;
  public isMoving: boolean = false;

  x: number;
  y: number;

  private frameIndex: number = 0;
  private frameCount: number = 9; // 총 9 프레임
  private walkingFrameCount: number = 5;
  private frameWidth: number = 24;
  private frameHeight: number = 32;
  private frameDuration: number = 100; // 0.1초마다 프레임 변경
  private lastFrameTime: number = 0;

  constructor(startX: number, startY: number) {
    this.playable = {
      position: { x: 0, y: 0 },
      speed: 100,
      direction: Direction.NONE,
      isMoving: false,
    };

    this.x = startX;
    this.y = startY;
  }

  public getPlayable() {
    return this.playable;
  }

  public setPlayable(object: PlayableType) {
    this.playable = { ...this.playable, ...object };
  }

  public update(deltaTime: number, isMoving: boolean) {
    const frameCount = isMoving ? this.walkingFrameCount : this.frameCount;
    // 0.1초마다 프레임 변경
    this.lastFrameTime += deltaTime;
    if (this.lastFrameTime >= this.frameDuration) {
      this.frameIndex = (this.frameIndex + 1) % frameCount;
      this.lastFrameTime = 0;
    }

    this.isMoving = false;
  }

  public setResource(key, number) {
    this.inventory = {
      ...this.inventory,
      [key]: (this.inventory[key] += number),
    };
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera, image) {
    ctx.drawImage(
      image,
      22 * this.frameIndex,
      0,
      24,
      32,
      this.playable.position.x - camera.x,
      this.playable.position.y - camera.y,
      PLAYER_SIZE,
      PLAYER_SIZE
    );
  }
}
