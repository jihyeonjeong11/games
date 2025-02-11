import { GameMap, MapGenerator } from "./mapGenerator";

export enum Direction {
  NORTH = "n",
  SOUTH = "s",
  EAST = "e",
  WEST = "w",
}

export type Coordinate = {
  x: number;
  y: number;
};

export class MapNode {
  map: GameMap | null;
  north: MapNode | null = null;
  south: MapNode | null = null;
  east: MapNode | null = null;
  west: MapNode | null = null;
  parent: MapNode | null = null;
  coordinate: Coordinate;

  constructor(map: GameMap | null, coordinate: Coordinate) {
    this.map = map;
    this.coordinate = coordinate;
  }
}

export class TileMap {
  private root: MapNode;
  private currentNode: MapNode;
  private moveHistory: Direction[] = [];

  constructor() {
    const initialCoord = { x: 0, y: 0 };
    this.root = new MapNode(new MapGenerator(10, 10).getMap(), initialCoord);
    this.currentNode = this.root;
  }

  public move(direction: Direction): void {
    let nextNode: MapNode | null = null;
    const newCoord = this.calculateNewCoordinate(direction);

    // Check if direction node exists
    switch (direction) {
      case Direction.NORTH:
        nextNode = this.currentNode.north;
        break;
      case Direction.SOUTH:
        nextNode = this.currentNode.south;
        break;
      case Direction.EAST:
        nextNode = this.currentNode.east;
        break;
      case Direction.WEST:
        nextNode = this.currentNode.west;
        break;
    }

    if (!nextNode) {
      // Create new node if it doesn't exist
      nextNode = new MapNode(new MapGenerator(10, 10).getMap(), newCoord);
      nextNode.parent = this.currentNode;

      // Link nodes
      switch (direction) {
        case Direction.NORTH:
          this.currentNode.north = nextNode;
          nextNode.south = this.currentNode;
          break;
        case Direction.SOUTH:
          this.currentNode.south = nextNode;
          nextNode.north = this.currentNode;
          break;
        case Direction.EAST:
          this.currentNode.east = nextNode;
          nextNode.west = this.currentNode;
          break;
        case Direction.WEST:
          this.currentNode.west = nextNode;
          nextNode.east = this.currentNode;
          break;
      }
    }

    this.currentNode = nextNode;
    this.moveHistory.push(direction);
  }

  public moveBack(): void {
    if (this.currentNode.parent) {
      this.currentNode = this.currentNode.parent;
      this.moveHistory.pop();
    }
  }

  public getCurrentMap(): GameMap {
    return this.currentNode.map!;
  }

  public getCurrentCoordinate(): Coordinate {
    return this.currentNode.coordinate;
  }

  public getMoveHistory(): Direction[] {
    return [...this.moveHistory];
  }

  private calculateNewCoordinate(direction: Direction): Coordinate {
    const current = this.currentNode.coordinate;
    switch (direction) {
      case Direction.NORTH:
        return { x: current.x, y: current.y - 1 };
      case Direction.SOUTH:
        return { x: current.x, y: current.y + 1 };
      case Direction.EAST:
        return { x: current.x + 1, y: current.y };
      case Direction.WEST:
        return { x: current.x - 1, y: current.y };
    }
  }
}
