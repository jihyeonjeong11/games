import { Player } from "../entities/player";
import { TileMap } from "../entities/tileMap";

export class MovePlayerUseCase {
  player: Player;
  tileMap: TileMap;

  constructor(player: Player, tileMap: TileMap) {
    this.player = player;
    this.tileMap = tileMap;
  }

  execute(direction: "up" | "down" | "left" | "right") {
    this.player.move(direction, this.tileMap);
  }
}
