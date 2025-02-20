import {
  MAP_HEIGHT,
  MAP_WIDTH,
  PLAYER_SIZE,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "../utils/constants";
import { Player } from "./player";

export class Camera {
  private player: Player;
  public x: number = 0;
  public y: number = 0;

  constructor(player: Player) {
    this.player = player;
    this.update();
  }

  update() {
    this.x = Math.max(
      0,
      Math.min(
        this.player.getPlayable().position.x - VIEWPORT_WIDTH / 2,
        MAP_WIDTH * TILE_SIZE - VIEWPORT_WIDTH
      )
    );
    this.y = Math.max(
      0,
      Math.min(
        this.player.getPlayable().position.y - VIEWPORT_HEIGHT / 2,
        MAP_HEIGHT * TILE_SIZE - VIEWPORT_HEIGHT
      )
    );
  }
}
