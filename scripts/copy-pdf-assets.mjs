import { cpSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
// Local font/CMap/WASM assets let PDFs render without third-party requests.
for (const folder of ["cmaps", "standard_fonts", "wasm"]) {
  const destination = new URL(
    `../public/pdf-assets/${folder}`,
    import.meta.url,
  );
  mkdirSync(destination, { recursive: true });
  cpSync(
    fileURLToPath(
      new URL(`../node_modules/pdfjs-dist/${folder}`, import.meta.url),
    ),
    fileURLToPath(destination),
    { recursive: true },
  );
}
