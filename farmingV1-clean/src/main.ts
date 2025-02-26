import { InventoryType, PlayableType } from ".";
import { AssetLoader } from "./assetLoader";
import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { DEV_FPS, MAP_HEIGHT, MAP_WIDTH, MapObject } from "./constants";
import { GameEvent } from "./gameEvent";
import { Player } from "./player";
import { TileMap } from "./tileMap";
import { _whatTile, isReachedEndTile } from "./utils";

class Game {
  canvas: Canvas;
  assetLoader: AssetLoader;
  player: Player;
  camera: Camera;
  tileMap: TileMap;
  gameEvent: GameEvent;
  isLoaded: boolean = false;

  private gameLoop(currentTime) {
    const deltaTime = currentTime;
    const ctx = this.canvas.getCtx();
    const { isMoving, position } = this.player.getState();
    this.tileMap.draw(ctx, this.camera, this.assetLoader);

    this.updateCharacterMovement(deltaTime);
    this.canvas.clearCanvas();
    this.camera.update(position);
    this.tileMap.draw(ctx, this.camera, this.assetLoader);
    this.player.update(deltaTime, isMoving);

    if (isMoving) {
      this.player.draw(
        this.canvas.getCtx(),
        this.camera,
        this.assetLoader.getAsset("playerWalk")!
      );
    } else {
      this.player.draw(
        this.canvas.getCtx(),
        this.camera,
        this.assetLoader.getAsset("playerIdle")!
      );
    }

    setTimeout(
      () => requestAnimationFrame((time) => this.gameLoop(time)),
      1000 / DEV_FPS
    );
  }

  private init() {
    setTimeout(
      () => requestAnimationFrame((time) => this.gameLoop(time)),
      1000 / DEV_FPS
    );
  }

  private gatherResources() {
    const { x, y } = this.player.getState().position;
    const currentTile = _whatTile(x, y);

    const mapData = this.tileMap.getMap();
    const tileValue = mapData[currentTile.col][currentTile.row];

    const gatherableTiles: {
      [key: number]: { resource: string; newTile: number };
    } = {
      [MapObject.STONE]: { resource: "stone", newTile: MapObject.DIRT },
      [MapObject.TREE]: { resource: "wood", newTile: MapObject.DIRT },
    };

    const action = gatherableTiles[tileValue];
    if (action) {
      // Update the tile and add the corresponding resource to the player.
      const newMap = mapData.slice();
      newMap[currentTile.col][currentTile.row] = action.newTile;
      this.player.setResource(action.resource as keyof InventoryType, 1);
      return;
      this.tileMap.setMap(newMap);
    }
  }

  private updateCharacterMovement(deltaTime: number): void {
    const state = this.player.getState();
    const direction = this.gameEvent.getDirection();
    const moveAmount = (state.speed * deltaTime) / 1000;
    const { x, y } = state.position;
    const newLocation: PlayableType = { ...state };
    newLocation.direction = direction;
    newLocation.isMoving = direction !== "none";
    switch (direction) {
      case "up":
        newLocation.position.y -= moveAmount;
        break;
      case "down":
        newLocation.position.y += moveAmount;
        break;
      case "left":
        newLocation.position.x -= moveAmount;
        break;
      case "right":
        newLocation.position.x += moveAmount;
        break;
    }
    // Add Woods collision checking
    // Add boundary checking
    const tileCoord = _whatTile(x, y);
    // newLocation.position.x = Math.max(
    //   0,
    //   Math.min(newLocation.position.x, VIEWPORT_WIDTH - TILE_SIZE)
    // ); // Assuming playable width is 32
    // playable.position.y = Math.max(
    //   0,
    //   Math.min(newLocation.position.y, VIEWPORT_HEIGHT - TILE_SIZE)
    // ); // Assuming character height is 32
    // detect map movement
    const isReachedEnd = isReachedEndTile(
      tileCoord.row,
      tileCoord.col,
      this.tileMap.getMap().length,
      this.tileMap.getMap()[0].length
    );
    if (!isReachedEnd) {
      this.player.setState(newLocation);
    }
  }

  constructor() {
    this.canvas = new Canvas();
    this.camera = new Camera();
    this.player = new Player(0, 0);
    this.gameEvent = new GameEvent();
    this.gameEvent.onInteraction(this.gatherResources.bind(this));

    this.assetLoader = new AssetLoader(
      [
        { key: "playerIdle", src: "assets/chars/Woman_Idle.png" },
        { key: "playerWalk", src: "assets/chars/Woman_Walk.png" },
        { key: "grassTile", src: "assets/backgrounds/Grass.png" },
        { key: "waterTile", src: "assets/backgrounds/Water.png" },
        { key: "dirtTile", src: "assets/backgrounds/Sand.png" },
        { key: "treeTrunkTile", src: "assets/objects/Trunk.png" },
        { key: "rockTile", src: "assets/objects/Rock.png" },
      ],
      () => {
        this.isLoaded = true;
        this.tileMap = new TileMap(MAP_WIDTH, MAP_HEIGHT, this.assetLoader);
        if (this.isLoaded && this.tileMap.getMap().length) this.init();
      }
    );
  }
}

window.onload = () => new Game();
