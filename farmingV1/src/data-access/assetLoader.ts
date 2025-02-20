export class AssetLoader {
  private assets: Map<string, HTMLImageElement> = new Map();
  private loadedCount: number = 0;
  private totalCount: number = 0;

  constructor(
    private assetList: { key: string; src: string }[],
    private onLoadComplete: () => void
  ) {
    this.totalCount = assetList.length;
    this.loadAssets();
  }

  private loadAssets() {
    this.assetList.forEach(({ key, src }) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.assets.set(key, img);
        this.loadedCount++;
        if (this.loadedCount === this.totalCount) {
          this.onLoadComplete();
        }
      };
    });
  }

  getAsset(key: string): HTMLImageElement | undefined {
    return this.assets.get(key);
  }

  isLoaded(): boolean {
    return this.loadedCount === this.totalCount;
  }
}
