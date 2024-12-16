export type Size = NonNullable<{
  width: number;
  height: number;
}>;

export const createOffscreenCanvas = (
  containerElement: HTMLElement,
  devicePixelRatio = 1,
  customSize: Size = Object.create(null) as Size
): OffscreenCanvas => {
  const canvas = document.createElement("canvas");
  const height = Number(customSize?.height) || containerElement.offsetHeight;
  const width = Number(customSize?.width) || containerElement.offsetWidth;

  canvas.style.height = `${height}px`;
  canvas.style.width = `${width}px`;

  canvas.height = Math.floor(height * devicePixelRatio);
  canvas.width = Math.floor(width * devicePixelRatio);

  containerElement.append(canvas);

  return canvas.transferControlToOffscreen();
};
