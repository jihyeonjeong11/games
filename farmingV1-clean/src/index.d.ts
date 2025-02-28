export type Position = {
  x: number;
  y: number;
};

export type MapDirection = "n" | "w" | "e" | "s";

export type PlayerDirection = "up" | "down" | "left" | "right" | "none";

export type PlayableType = {
  position: Position;
  speed: number;
  direction: PlayerDirection;
  isMoving: boolean;
};

export type InventoryType = {
  wood: number;
  stone: number;
};
