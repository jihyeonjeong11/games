import { InventoryType, PlayableType, Position } from ".";
import { AssetLoader } from "./assetLoader";
import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { MAP_HEIGHT, MAP_WIDTH, MapObject } from "./constants";
import { FrameLimiter } from "./frameLimiter";
import { GameEvent } from "./gameEvent";
import { Player } from "./player";
import { TileMap } from "./tileMap";
import { _whatTile } from "./utils";

class Game {
  canvas: Canvas;
  debugCanvas: Canvas;
  assetLoader: AssetLoader;
  player: Player;
  camera: Camera;
  tileMap: TileMap;
  gameEvent: GameEvent;
  isLoaded: boolean = false;
  frameLimiter: FrameLimiter;

  private lastFrameTime: number = 0;

  constructor() {
    this.debugCanvas = new Canvas({ id: "debug", width: 500, height: 50 });
    this.canvas = new Canvas({});

    this.camera = new Camera();
    this.player = new Player(0, 0);
    this.gameEvent = new GameEvent();
    this.gameEvent.onInteraction(this.gatherResources.bind(this));
    this.frameLimiter = new FrameLimiter(60);

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
  private gameLoop(currentTime: number) {
    if (this.frameLimiter.shouldProcessFrame(currentTime)) {
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;

      const ctx = this.canvas.getCtx();
      const { isMoving, position } = this.player.getState();

      this.drawDebugInfo();

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
    }

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private init() {
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private getIsOutOfBounds(x, y, direction) {
    const tileCoord = _whatTile(x, y);
    return (
      (tileCoord.row < 0 && direction === "up") ||
      (tileCoord.col < 0 && direction === "left") ||
      (tileCoord.row >= this.tileMap.getMap().length - 1 &&
        direction === "down") ||
      (tileCoord.col >= this.tileMap.getMap()[0].length - 1 &&
        direction === "right")
    );
  }

  private drawDebugInfo() {
    const { position, inventory } = this.player.getState();

    const { x, y } = position;
    const ctx = this.debugCanvas.getCtx();
    ctx.clearRect(0, 0, 400, 50);
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    const tileCoord = _whatTile(x, y);

    const isOutOfBounds =
      tileCoord.row < 0 ||
      tileCoord.col < 0 ||
      tileCoord.row >= this.tileMap.getMap().length - 1 ||
      tileCoord.col >= this.tileMap.getMap()[0].length - 1;

    if (isOutOfBounds) {
      ctx.fillText(`Debug failed due to boundary collision`, 15, 25);
    } else {
      ctx.fillText(
        `X: ${Math.floor(x)}, Y: ${Math.floor(y)}, whatTile ${
          MapObject[this.tileMap.getMap()[tileCoord.row][tileCoord.col]]
        }, wood: ${inventory.wood} , stone: ${inventory.stone}`,
        15,
        25
      );
    }
  }

  private gatherResources() {
    const { x, y } = this.player.getState().position;
    const currentTile = _whatTile(x, y);

    const mapData = this.tileMap.getMap();
    const tileValue = mapData[currentTile.row][currentTile.col];

    const gatherableTiles: {
      [key: number]: { resource: string; newTile: number };
    } = {
      [MapObject.STONE]: { resource: "stone", newTile: MapObject.DIRT },
      [MapObject.TREE]: { resource: "wood", newTile: MapObject.DIRT },
    };

    const action = gatherableTiles[tileValue];
    if (action) {
      const newMap = mapData.slice();
      newMap[currentTile.row][currentTile.col] = action.newTile;
      this.player.setResource(action.resource as keyof InventoryType, 1);
      this.tileMap.setMap(newMap);
    }
  }

  private updateCharacterMovement(deltaTime: number): void {
    const state = this.player.getState();
    const direction = this.gameEvent.getDirection();
    const moveAmount = (state.speed * deltaTime) / 20;
    const { x, y } = state.position;

    const newLocation: PlayableType = {
      ...state,
      position: { ...state.position }, // Create a new object for position
    };
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

    if (this.getIsOutOfBounds(x, y, direction)) {
      console.warn("Boundary check: Player attempted to move out of bounds.");
      return;
    } else {
      this.player.setState(newLocation);
    }
  }
}

window.onload = () => new Game();
