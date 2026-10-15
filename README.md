# CRUSHR

Make your files smaller. Literally.

Drop in a file, watch a hydraulic press crumple its actual preview into a paper ball, and download that ball as a 1600 × 1600 PNG. This is a physical compression joke; it does not reduce the original file's bytes or create an archive.

## Run locally

Use Node 20.19+ (or Node 22.12+) and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. `predev` and `prebuild` copy PDF.js fonts, character maps and WASM decoders into `public/pdf-assets/`. These generated assets are ignored by Git and included in production builds. No CDN is required.

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 5173
```

## What gets crushed

- **PDF:** the actual first page rendered by PDF.js, with a Vite-bundled worker. Multipage files say “Page 1 preview”. Password-protected PDFs ask for an unlocked copy.
- **PNG / JPEG / WebP:** the actual image, composited onto a light paper surface.
- **TXT:** a bounded text excerpt, wrapped onto paper; truncated previews are labelled.
- **Other formats:** an explicitly labelled file card with the real filename and type. Their contents are not rendered.

Processing stays in the browser. Files are limited to 20 MB; image source dimensions to 40 megapixels; preview canvases to 1400 pixels on their longest edge. PDF preparation and image decoding have time limits. The download is `<original-base-name>-compressed.png`.

## Implementation

`App.jsx` owns an explicit `idle → preparing → ready → compressing → complete` flow and recoverable errors. An abort controller and generation ID prevent an older selection from replacing a newer one. Download URLs live until reset/unmount. Export and animation must both finish before the result is available.

`preview.js` creates one real content texture. `paperMesh.js` builds a connected, seeded 160-triangle sheet with fixed texture coordinates. The vertices buckle, wrap, overlap and acquire directional crease shading. `HydraulicPress.jsx` drives this sheet with a 7.35-second GSAP sequence: feed, wobble, contact, squeeze, dust, release, tray drop and bounce. `compress.js` draws the exact same final mesh onto a clean export canvas. This is a stylized geometric crumple, not a physical cloth simulation.

The original procedural hydraulic hiss and crunch effects are reused, routed through a live mute gain. Audio starts after interaction, crunches align with contact/squeeze, and the context closes on reset/unmount. Reduced motion uses a 450 ms fade to the identical result. Other original scenes remain in the repository but are outside the active flow.

## Browser checks

```sh
npx playwright install chromium
npm test
```

Playwright builds and serves production output unless a server already runs on port 5173. The suite covers real PDF page content, valid PNG decoding, downloaded/displayed byte equality, image colors, JPEG/WebP, text excerpts, honest file cards, empty/oversized/corrupt/password-protected files, stale selection, repeated runs, object URL cleanup, mobile overflow, reduced motion, and live audio mute/timing/cleanup. Set `CRUSHR_EVIDENCE_DIR` to an absolute directory to save desktop/mobile screenshots and downloaded PNGs.

`tests/fixtures/locked.pdf` is a generated test-only encrypted PDF (password `crushr-test`), created with ReportLab; no real user document is bundled. The unencrypted two-page PDF is built directly by `tests/fixtures.js`.

Verified in desktop Chromium with emulated mobile viewports. Safari, Firefox and physical mobile devices require separate testing. Very complex PDFs may hit preparation limits; formats other than the supported previews intentionally use file cards.
