// import { GameMap, TileType } from "./mapGenerator";

// // Types for directions and map coordinates
// type Direction = "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";
// type Position = [number, number]; // [row, col]

// type DirectionVector = [number, number]; // [deltaRow, deltaCol]

// // Interface for neighbor information
// interface Neighbor {
//   position: Position;
//   value: number;
// }

// interface NeighborMap {
//   [key: string]: Neighbor;
// }

// interface MoveResult {
//   newPosition: Position;
//   newMap: TileMap | null;
// }

// class TileMap {
//   private map_data: GameMap;
//   private height: number;
//   private width: number;
//   private connected_maps: Map<Direction, TileMap>;
//   private directions: Map<Direction, DirectionVector>;

//   constructor(mapData: GameMap) {
//     this.map_data = mapData;
//     this.height = mapData.length;
//     this.width = this.height > 0 ? mapData[0].length : 0;
//     this.connected_maps = new Map();

//     // Initialize direction vectors using a Map
//     this.directions = new Map([
//       ["N", [-1, 0]], // North: move up one row
//       ["S", [1, 0]], // South: move down one row
//       ["E", [0, 1]], // East: move right one column
//       ["W", [0, -1]], // West: move left one column
//       //   ["NE", [-1, 1]], // Northeast
//       //   ["NW", [-1, -1]], // Northwest
//       //   ["SE", [1, 1]], // Southeast
//       //   ["SW", [1, -1]], // Southwest
//     ]);
//   }

//   /**
//    * Get the tile value at the specified position
//    */
//   public getTile(row: number, col: number): number | null {
//     if (this.isValidPosition(row, col)) {
//       return this.map_data[row][col];
//     }
//     return null;
//   }

//   /**
//    * Set the tile value at the specified position
//    */
//   public setTile(row: number, col: number, value: TileType): boolean {
//     if (this.isValidPosition(row, col)) {
//       this.map_data[row][col] = value;
//       return true;
//     }
//     return false;
//   }

//   /**
//    * Check if the given position is within map boundaries
//    */
//   public isValidPosition(row: number, col: number): boolean {
//     return row >= 0 && row < this.height && col >= 0 && col < this.width;
//   }

//   /**
//    * Calculate new position after moving in specified direction
//    */
//   public move(
//     startRow: number,
//     startCol: number,
//     direction: Direction
//   ): MoveResult | null {
//     const directionVector = this.directions.get(direction);

//     if (!directionVector) {
//       return null;
//     }

//     const [deltaRow, deltaCol] = directionVector;
//     const newRow = startRow + deltaRow;
//     const newCol = startCol + deltaCol;

//     // Check if the new position is within current map
//     if (this.isValidPosition(newRow, newCol)) {
//       return {
//         newPosition: [newRow, newCol],
//         newMap: null,
//       };
//     }

//     // Check if we should transition to a connected map
//     const connectedMap = this.connected_maps.get(direction);
//     if (connectedMap) {
//       let transitionRow = newRow;
//       let transitionCol = newCol;

//       // Calculate entry position in the new map
//       switch (direction) {
//         case "N":
//           transitionRow = connectedMap.height - 1;
//           break;
//         case "S":
//           transitionRow = 0;
//           break;
//         case "E":
//           transitionCol = 0;
//           break;
//         case "W":
//           transitionCol = connectedMap.width - 1;
//           break;
//       }

//       return {
//         newPosition: [transitionRow, transitionCol],
//         newMap: connectedMap,
//       };
//     }

//     return null;
//   }

//   /**
//    * Connect another map in the specified direction
//    */
//   public connectMap(direction: Direction, otherMap: TileMap): void {
//     if (["N", "S", "E", "W"].includes(direction)) {
//       this.connected_maps.set(direction, otherMap);
//     }
//   }

//   /**
//    * Get all valid neighboring tiles
//    */
//   public getNeighbors(row: number, col: number): NeighborMap {
//     const neighbors: NeighborMap = {};

//     this.directions.forEach((vector, direction) => {
//       const [deltaRow, deltaCol] = vector;
//       const newRow = row + deltaRow;
//       const newCol = col + deltaCol;

//       if (this.isValidPosition(newRow, newCol)) {
//         neighbors[direction] = {
//           position: [newRow, newCol],
//           value: this.map_data[newRow][newCol],
//         };
//       }
//     });

//     return neighbors;
//   }

//   /**
//    * Get the dimensions of the map
//    */
//   public getDimensions(): Position {
//     return [this.height, this.width];
//   }

//   /**
//    * Get the raw map data
//    */
//   public getMapData(): GameMap {
//     return this.map_data;
//   }

//   /**
//    * Create a copy of the map
//    */
//   public clone(): TileMap {
//     const newMapData = this.map_data.map((row) => [...row]);
//     return new TileMap(newMapData);
//   }
// }

// export default TileMap;
