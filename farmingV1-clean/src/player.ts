import { InventoryType, PlayerDirection, Position } from "./index";
import { Camera } from "./camera";
import { PLAYER_SIZE } from "./constants";

class PlayerState {
  position: Position;
  speed: number;
  direction: PlayerDirection;
  inventory: InventoryType = { wood: 0, stone: 0 };
  isMoving: boolean = false;

  setResource(key: keyof InventoryType, amount: number) {
    console.log("setResource");
    this.inventory[key] += amount;
  }

  constructor(startX: number, startY: number, speed: number) {
    this.position = { x: startX, y: startY };
    this.speed = speed;
    this.direction = "none";
  }
}

class PlayerAnimation {
  private frameIndex: number = 0;
  private frameCount: number = 9; // Total frames
  private walkingFrameCount: number = 5;
  private frameDuration: number = 100; // Change every 0.1 sec
  private lastFrameTime: number = 0;

  update(deltaTime: number, isMoving: boolean) {
    const frameCount = isMoving ? this.walkingFrameCount : this.frameCount;
    this.lastFrameTime += deltaTime;

    if (this.lastFrameTime >= this.frameDuration) {
      this.frameIndex = (this.frameIndex + 1) % frameCount;
      this.lastFrameTime = 0;
    }
  }

  getFrameIndex(): number {
    return this.frameIndex;
  }
}

export class Player {
  private playerState: PlayerState;
  private animation: PlayerAnimation;
  public isMoving: boolean = false;

  public getState() {
    return this.playerState;
  }

  // Is this the best way? change player entity
  public setState(newState: Partial<PlayerState>) {
    const newPlayerState = new PlayerState(
      newState.position?.x ?? this.playerState.position.x,
      newState.position?.y ?? this.playerState.position.y,
      newState.speed ?? this.playerState.speed
    );

    newPlayerState.direction = newState.direction ?? this.playerState.direction;
    newPlayerState.inventory = {
      ...newState.inventory,
      ...this.playerState.inventory,
    };

    newPlayerState.isMoving = newState.isMoving ?? this.playerState.isMoving;

    this.playerState = newPlayerState;
  }

  public update(deltaTime: number, isMoving: boolean) {
    this.animation.update(deltaTime, isMoving);
  }

  public setResource(key: keyof InventoryType, number: number) {
    this.playerState.setResource(key, number);
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    image: HTMLImageElement
  ) {
    ctx.drawImage(
      image,
      22 * this.animation.getFrameIndex(),
      0,
      24,
      32,
      this.playerState.position.x - camera.x,
      this.playerState.position.y - camera.y,
      PLAYER_SIZE,
      PLAYER_SIZE
    );
  }

  constructor(startX: number, startY: number, speed: number = 4) {
    this.animation = new PlayerAnimation();
    this.playerState = new PlayerState(startX, startY, speed);
  }
}
