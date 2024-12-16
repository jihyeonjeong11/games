import { useEffect, useRef } from "preact/hooks";
import "./app.css";

const rows = 20;
const cols = 10;
const cellSize = 20;

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;

    // vertical lines
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, rows * cellSize);
      ctx.stroke();
    }

    // horizontal lines
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(cols * cellSize, y * cellSize);
      ctx.stroke();
    }
  }, []);

  return (
    <>
      <h1>Vite + Preact</h1>
      <canvas
        ref={canvasRef}
        width={rows * cellSize}
        height={cols * cellSize}
      />
    </>
  );
}
