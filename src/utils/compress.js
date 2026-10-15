import { drawPaper, drawSoftShadow, paperBounds } from "./paperMesh";

export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Could not create the PNG. Please try again.")),
      "image/png",
    );
  });
}

// Export the exact final mesh, never a screenshot of the interface.
export async function compressFile(file, mesh) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f8f5ed";
  ctx.fillRect(0, 0, 1600, 1600);
  const bounds = paperBounds(mesh);
  const size =
    1040 / Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  const x = 800 - ((bounds.minX + bounds.maxX) / 2) * size;
  const y = 760 - ((bounds.minY + bounds.maxY) / 2) * size;
  drawSoftShadow(ctx, 800, y + bounds.maxY * size + 22, 560, 105, 0.24);
  drawPaper(ctx, mesh, { x, y, size });
  const blob = await canvasToBlob(canvas);
  const base = file.name.replace(/\.[^/.]+$/, "") || file.name || "file";
  return {
    blob,
    downloadName: `${base}-compressed.png`,
    width: 1600,
    height: 1600,
  };
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const i = Math.min(3, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${Number((bytes / 1024 ** i).toFixed(1))} ${["B", "KB", "MB", "GB"][i]}`;
}
