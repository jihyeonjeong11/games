export class FrameLimiter {
  private lastFrameTime: number = 0;
  private frameInterval: number;
  private enabled: boolean = true;

  constructor(fps: number = 60) {
    this.frameInterval = 1000 / fps;
  }

  shouldProcessFrame(timestamp: number): boolean {
    if (!this.enabled) return true;

    const delta = timestamp - this.lastFrameTime;
    if (delta >= this.frameInterval) {
      this.lastFrameTime = timestamp;
      return true;
    }
    return false;
  }

  setFPS(fps: number): void {
    this.frameInterval = 1000 / fps;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  getFPS(): number {
    return 1000 / this.frameInterval;
  }
}
