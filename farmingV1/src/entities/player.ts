import { AssetLoader } from "../data-access/assetLoader";
import { PLAYER_SIZE } from "../utils/constants";
import { Direction, Position } from "../utils/types";
import { Camera } from "./camera";
import { TileMap } from "./tileMap";

export type PlayableType = {
  position: Position;
  speed: number;
  direction: Direction;
  isMoving: boolean;
};

export class Player {
  private playable: PlayableType;
  position: Position;
  speed: number;
  direction: Direction;
  public isMoving: boolean = false;

  x: number;
  y: number;

  private frameIndex: number = 0;
  private frameCount: number = 9; // 총 9 프레임
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

  public update(deltaTime: number) {
    // 0.1초마다 프레임 변경
    this.lastFrameTime += deltaTime;
    if (this.lastFrameTime >= this.frameDuration) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.lastFrameTime = 0;
    }

    this.isMoving = false;
  }

  // varies to handleInteraction
  move(key: string, tileMap: TileMap): void {
    const xCoord = this.x + (key === "a" ? -1 : key === "d" ? 1 : 0);
    const yCoord = this.y + (key === "w" ? -1 : key === "s" ? 1 : 0);
    if (key === "a" || key === "d" || key === "w" || key === "s") {
      this.isMoving = true;
    }
    if (tileMap.canMoveTo(xCoord, yCoord)) {
      this.x = xCoord;
      this.y = yCoord;
    }
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    assetLoader: AssetLoader,
    camera: Camera,
    image
  ) {
    console.log(image);
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
