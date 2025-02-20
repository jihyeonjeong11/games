import { MapObject } from "../entities/tileMap";

export function generateTile() {
  const rand = Math.random();
  if (rand < 0.2) return MapObject.STONE;
  if (rand < 0.5) return MapObject.GRASS;
  if (rand < 0.7) return MapObject.DIRT;
  if (rand < 0.9) return MapObject.TREE;
  return MapObject.WATER;
}

export function generateRandomMap(maxX, maxY) {
  return Array.from({ length: maxY }, () =>
    Array.from({ length: maxX }, () => generateTile())
  );
}
