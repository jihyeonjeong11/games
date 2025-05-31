import { TILE_H, TILE_W } from "./enums";
import { Position } from "./types";

export function getCenterCoordinates(rowCount: number, colCount: number) {
  const centerRow1 = Math.floor((rowCount - 1) / 2);
  const centerRow2 = Math.ceil((rowCount - 1) / 2);
  const centerCol1 = Math.floor((colCount - 1) / 2);
  const centerCol2 = Math.ceil((colCount - 1) / 2);

  return {
    centerRows: [centerRow1, centerRow2], // Supports even and odd rows
    centerCols: [centerCol1, centerCol2], // Supports even and odd columns
    lastRow: rowCount - 1,
    lastCol: colCount - 1,
  };
}

export function isReachedEndTile(
  row: number,
  col: number,
  rowCount: number,
  colCount: number
) {
  const { centerRows, centerCols, lastRow, lastCol } = getCenterCoordinates(
    rowCount,
    colCount
  );

  return row === 0 && centerCols.includes(col)
    ? "w" // Top center(s)
    : row === lastRow && centerCols.includes(col)
    ? "e" // Bottom center(s)
    : col === 0 && centerRows.includes(row)
    ? "n" // Left center(s)
    : col === lastCol && centerRows.includes(row)
    ? "s"
    : ""; // Right center(s)
}

export function _whatTile(x, y) {
  return {
    row: Math.floor(x / 32),
    col: Math.floor(y / 32),
  };
}
