import { canvasToBlob } from "./compress";

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_RENDER_EDGE = 1400;
const MAX_IMAGE_PIXELS = 40_000_000;
const TEXT_BYTES = 12_000;

function canvasOf(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error("Canvas is unavailable. Please use a current browser.");
  ctx.fillStyle = "#fffefa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}
function wrapText(ctx, text, width, limit) {
  const lines = [];
  for (const paragraph of text.replace(/\r\n?/g, "\n").split("\n")) {
    let line = "";
    for (const char of paragraph.replace(/\t/g, "    ")) {
      if (ctx.measureText(line + char).width > width) {
        lines.push(line);
        line = "";
        if (lines.length >= limit) return { lines, truncated: true };
      }
      line += char;
    }
    lines.push(line);
    if (lines.length >= limit) return { lines, truncated: true };
  }
  return { lines, truncated: false };
}
async function renderPDF(file, signal) {
  const [{ getDocument, GlobalWorkerOptions }, { default: workerUrl }] =
    await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
    ]);
  signal.throwIfAborted();
  GlobalWorkerOptions.workerSrc = workerUrl;
  const data = new Uint8Array(await file.arrayBuffer());
  signal.throwIfAborted();
  const task = getDocument({
    data,
    isEvalSupported: false,
    stopAtErrors: true,
    cMapUrl: `${import.meta.env.BASE_URL}pdf-assets/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${import.meta.env.BASE_URL}pdf-assets/standard_fonts/`,
    wasmUrl: `${import.meta.env.BASE_URL}pdf-assets/wasm/`,
    maxImageSize: MAX_IMAGE_PIXELS,
  });
  const abort = () => {
    void task.destroy();
  };
  signal.addEventListener("abort", abort, { once: true });
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    void task.destroy();
  }, 25000);
  try {
    const pdf = await task.promise;
    signal.throwIfAborted();
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    if (
      !Number.isFinite(base.width + base.height) ||
      base.width <= 0 ||
      base.height <= 0
    )
      throw new Error("Invalid page dimensions");
    const viewport = page.getViewport({
      scale: Math.min(2, MAX_RENDER_EDGE / Math.max(base.width, base.height)),
    });
    const canvas = canvasOf(viewport.width, viewport.height);
    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport,
      background: "#fffefa",
    }).promise;
    return {
      canvas,
      label: pdf.numPages > 1 ? "Page 1 preview" : "PDF preview",
      detail:
        pdf.numPages > 1 ? `First page of ${pdf.numPages} pages` : "1 page",
    };
  } catch (error) {
    signal.throwIfAborted();
    if (error.name === "PasswordException")
      throw new Error(
        "This PDF is password-protected. Save an unlocked copy, then try again.",
      );
    if (timedOut)
      throw new Error(
        "This PDF took too long to read. Try a simpler PDF or export its first page as an image.",
      );
    throw new Error(
      "We couldn’t read this PDF. Try opening it in a PDF viewer and saving a fresh copy.",
    );
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
    await task.destroy();
  }
}
async function renderImage(file, signal) {
  const url = URL.createObjectURL(file),
    image = new Image();
  try {
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        signal.removeEventListener("abort", abort);
        image.onload = image.onerror = null;
        clearTimeout(timeout);
      };
      const abort = () => {
        cleanup();
        image.src = "";
        reject(new DOMException("Cancelled", "AbortError"));
      };
      const timeout = setTimeout(() => {
        cleanup();
        image.src = "";
        reject(new Error("Image decoding timed out. Try a smaller image."));
      }, 15000);
      image.onload = () => {
        cleanup();
        resolve();
      };
      image.onerror = () => {
        cleanup();
        reject(
          new Error(
            "We couldn’t read this image. Try a valid PNG, JPEG or WebP file.",
          ),
        );
      };
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) return abort();
      image.src = url;
    });
    signal.throwIfAborted();
    if (
      !image.naturalWidth ||
      image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS
    )
      throw new Error(
        "This image is too large to render. Resize it to 40 megapixels or less.",
      );
    const scale = Math.min(
      1,
      MAX_RENDER_EDGE / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = canvasOf(
      image.naturalWidth * scale,
      image.naturalHeight * scale,
    );
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return { canvas, label: "Image preview", detail: "Your original image" };
  } finally {
    image.src = "";
    URL.revokeObjectURL(url);
  }
}
async function renderText(file, signal) {
  const text = await file.slice(0, TEXT_BYTES).text();
  signal.throwIfAborted();
  const canvas = canvasOf(990, 1400),
    ctx = canvas.getContext("2d");
  ctx.fillStyle = "#df705d";
  ctx.fillRect(74, 76, 56, 8);
  ctx.fillStyle = "#292b27";
  ctx.font = "bold 32px monospace";
  wrapText(ctx, file.name, 840, 2).lines.forEach((line, i) =>
    ctx.fillText(line, 74, 137 + i * 40),
  );
  ctx.font = "24px monospace";
  const excerpt = wrapText(
    ctx,
    text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "�"),
    840,
    30,
  );
  excerpt.lines.forEach((line, i) => ctx.fillText(line, 74, 245 + i * 34));
  const truncated = excerpt.truncated || file.size > TEXT_BYTES;
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#77766d";
  ctx.fillText(
    truncated ? "Text excerpt · continued in original file" : "Text preview",
    74,
    1330,
  );
  return {
    canvas,
    label: truncated ? "Text excerpt" : "Text preview",
    detail: truncated ? "A bounded excerpt of your text" : "Your text on paper",
  };
}
function renderFileCard(file) {
  const canvas = canvasOf(990, 1400),
    ctx = canvas.getContext("2d");
  const extension = file.name.includes(".")
    ? file.name.split(".").pop().slice(0, 24).toUpperCase()
    : "FILE";
  ctx.strokeStyle = "#292b27";
  ctx.lineWidth = 5;
  ctx.strokeRect(75, 75, 840, 1250);
  ctx.fillStyle = "#f8dd7d";
  ctx.fillRect(76, 76, 838, 230);
  ctx.fillStyle = "#292b27";
  ctx.font = "bold 52px sans-serif";
  ctx.fillText(extension, 120, 215, 750);
  ctx.font = "bold 39px sans-serif";
  wrapText(ctx, file.name, 740, 8).lines.forEach((line, i) =>
    ctx.fillText(line, 120, 420 + i * 52),
  );
  ctx.font = "25px sans-serif";
  ctx.fillStyle = "#706e65";
  wrapText(ctx, file.type || "Unknown file type", 740, 3).lines.forEach(
    (line, i) => ctx.fillText(line, 120, 960 + i * 34),
  );
  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = "#292b27";
  ctx.fillText("FILE CARD", 120, 1170);
  ctx.font = "24px sans-serif";
  ctx.fillText("Contents are not previewed.", 120, 1212);
  return {
    canvas,
    label: "File card",
    detail: "Filename and type only · contents are not previewed",
  };
}
export async function generatePreview(
  file,
  { signal = new AbortController().signal } = {},
) {
  if (!file.size)
    throw new Error(
      "This file is empty. Choose a file with something to crush.",
    );
  if (file.size > MAX_FILE_SIZE)
    throw new Error(
      "This file is over 20 MB. Choose a smaller file and try again.",
    );
  signal.throwIfAborted();
  const ext = file.name.split(".").pop().toLowerCase();
  let preview;
  if (ext === "pdf" || file.type === "application/pdf")
    preview = await renderPDF(file, signal);
  else if (
    ["png", "jpg", "jpeg", "webp"].includes(ext) ||
    ["image/png", "image/jpeg", "image/webp"].includes(file.type)
  )
    preview = await renderImage(file, signal);
  else if (ext === "txt" || file.type === "text/plain")
    preview = await renderText(file, signal);
  else preview = renderFileCard(file);
  signal.throwIfAborted();
  const blob = await canvasToBlob(preview.canvas);
  signal.throwIfAborted();
  return { ...preview, blob };
}
export function createSampleFile() {
  return new File(
    [
      "VERY IMPORTANT DOCUMENT\n\nA modest proposal\n\n1. Make something useful.\n2. Get distracted.\n3. Build a hydraulic press.\n\nProjected results\n\nFewer corners.\nMore character.\nAbsolutely no meetings.\n\nApproved by:\nThe Department of Smaller Things\n\nPlease do not fold this document.",
    ],
    "very-important-document.txt",
    { type: "text/plain", lastModified: 1 },
  );
}
