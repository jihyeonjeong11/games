export const firstGameMap = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1,
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1,
  0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
  0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// export const tileW = 40,
//   tileH = 40;
// export const mapW = 10,
//   mapH = 10;
// export const currentSecond = 0,
//   frameCount = 0,
//   framesLastSecond = 0;

export class FirstMap {
  public readonly firstGameMap: Array<number>;

  constructor(firstGameMap) {
    this.firstGameMap = firstGameMap;
  }
}
