export type Position = {
  x: number;
  y: number;
};

export type MapDirection = "n" | "w" | "e" | "s";
export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
  NONE = "none",
}
