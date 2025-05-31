import { Direction } from "../utils/types";

export class GameEvent {
  private keys: Set<string> = new Set();
  private interactionCallback: (() => void) | null = null;

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keys.add(key);

    // Check if Enter is pressed and trigger the interaction
    if (key === "enter" && this.interactionCallback) {
      this.interactionCallback();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.key.toLowerCase());
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  getDirection(): Direction {
    if (this.isKeyPressed("w") || this.isKeyPressed("arrowup"))
      return Direction.UP;
    if (this.isKeyPressed("s") || this.isKeyPressed("arrowdown"))
      return Direction.DOWN;
    if (this.isKeyPressed("a") || this.isKeyPressed("arrowleft"))
      return Direction.LEFT;
    if (this.isKeyPressed("d") || this.isKeyPressed("arrowright"))
      return Direction.RIGHT;
    return Direction.NONE;
  }

  onInteraction(callback: () => void): void {
    this.interactionCallback = callback;
  }
}
