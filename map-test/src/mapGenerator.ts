export type TileType = 0 | 1 | 2 | 3;
export type GameMap = TileType[][];
export type Directions = "n" | "s" | "e" | "w";
export type MapStructure = Map<Directions, GameMap>;

// 1. 먼저 기본 맵 필요 10*10
// 2. 해당 맵은 NESW 키를 가지는 빈 어레이를 가짐
// 3. 캐릭터가 방향중 하나에 도달하면 해당 키에 맵 생성
// 4. 맵 이동

export class MapGenerator {
  private map: GameMap;
  private rows: number;
  private cols: number;
  private gameMap: any;

  constructor(rows: number, cols: number, defaultTile: TileType = 0) {
    this.rows = rows;
    this.cols = cols;
    this.map = MapGenerator.generateRandomMap(rows, cols);
  }

  static generateRandomMap(rows: number, cols: number): TileType[][] {
    const distribution: { type: TileType; weight: number }[] = [
      { type: 0, weight: 0.4 }, // 40% empty land
      { type: 1, weight: 0.35 }, // 35% grassed land
      { type: 2, weight: 0.25 }, // 25% wood
    ];

    const cumulativeDistribution = distribution.reduce((acc, curr) => {
      const last = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      acc.push({ type: curr.type, cumulative: last + curr.weight });
      return acc;
    }, [] as { type: TileType; cumulative: number }[]);

    const getRandomTile = (): TileType => {
      const rand = Math.random();
      return cumulativeDistribution.find((d) => rand < d.cumulative)!.type;
    };

    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => getRandomTile())
    );
  }

  getTile(row: number, col: number): TileType | null {
    if (this.isValidPosition(row, col)) {
      return this.map[row][col];
    }
    return null;
  }

  setTile(row: number, col: number, value: TileType): boolean {
    if (this.isValidPosition(row, col)) {
      this.map[row][col] = value;
      return true;
    }
    return false;
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  printMap(): void {
    console.log(this.map.map((row) => row.join(" ")).join("\n"));
  }

  getMap(): TileType[][] {
    return this.map;
  }
}
