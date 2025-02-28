import {
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./constants";
import { Position } from "./index";

export class Camera {
  private x: number = 0;
  private y: number = 0;

  public getCameraPosition() {
    return { x: this.x, y: this.y };
  }

  public update(position: Position) {
    this.x = Math.max(
      0,
      Math.min(
        position.x - VIEWPORT_WIDTH / 2,
        MAP_WIDTH * TILE_SIZE - VIEWPORT_WIDTH
      )
    );
    this.y = Math.max(
      0,
      Math.min(
        position.y - VIEWPORT_HEIGHT / 2,
        MAP_HEIGHT * TILE_SIZE - VIEWPORT_HEIGHT
      )
    );
  }
}
