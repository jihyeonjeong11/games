export function renderTileMap() {
  //   render(ctx: CanvasRenderingContext2D, camera: Camera): void {
  //     const startCol = Math.floor(camera.x / TILE_SIZE);
  //     const endCol = Math.ceil((camera.x + VIEWPORT_WIDTH) / TILE_SIZE);
  //     const startRow = Math.floor(camera.y / TILE_SIZE);
  //     const endRow = Math.ceil((camera.y + VIEWPORT_HEIGHT) / TILE_SIZE);
  //     for (let row = startRow; row < endRow; row++) {
  //       for (let col = startCol; col < endCol; col++) {
  //         if (this.map[row] && this.map[row][col] !== undefined) {
  //           const imageOrColor = this.getTileImage(this.map[row][col]);
  //           if (typeof imageOrColor === "string") {
  //             ctx.fillStyle = imageOrColor;
  //             ctx.fillRect(
  //               col * this.tileSize - camera.x,
  //               row * this.tileSize - camera.y,
  //               this.tileSize,
  //               this.tileSize
  //             );
  //           } else {
  //             ctx.drawImage(
  //               imageOrColor,
  //               0,
  //               0,
  //               this.tileSize,
  //               this.tileSize,
  //               col * this.tileSize - camera.x,
  //               row * this.tileSize - camera.y,
  //               this.tileSize,
  //               this.tileSize
  //             );
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}
