export class AssetLoader {
  public assets: Map<string, HTMLImageElement> = new Map();

  async loadAll(): Promise<void> {
    await Promise.all([
      this.loadImage("map", "floortileset.png"),
      this.loadImage("dog", "dogtileset.png"),
    ]);
  }

  public loadImage(key: string, src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        this.assets.set(key, image);
        resolve(image);
      };
      image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
  }

  public getImage(key: string): HTMLImageElement | undefined {
    return this.assets.get(key);
  }
}
