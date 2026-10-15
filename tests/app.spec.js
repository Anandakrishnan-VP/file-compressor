import { test, expect } from "@playwright/test";
import { readFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { samplePDF } from "./fixtures";

const evidence = process.env.CRUSHR_EVIDENCE_DIR;
async function screenshot(page, name) {
  if (evidence) {
    await mkdir(evidence, { recursive: true });
    await page.screenshot({ path: path.join(evidence, name), fullPage: true });
  }
}
async function phase(page, value) {
  await expect(page.locator(".app-shell")).toHaveAttribute("data-phase", value);
}
async function choose(page, name, mimeType, buffer) {
  await page.locator("#file-input").setInputFiles({ name, mimeType, buffer });
}
async function sample(page) {
  await page.getByRole("button", { name: /Try a sample/ }).click();
  await phase(page, "ready");
}
async function crush(page) {
  await page.getByRole("button", { name: "Compress this file" }).click();
  await phase(page, "complete");
}
async function download(page, testInfo) {
  const waiting = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download compressed file" }).click();
  const file = await waiting,
    location = testInfo.outputPath(file.suggestedFilename());
  await file.saveAs(location);
  const bytes = await readFile(location);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(bytes.readUInt32BE(16)).toBe(1600);
  expect(bytes.readUInt32BE(20)).toBe(1600);
  // Byte-for-byte equality with the displayed result, not just a similar image.
  const displayed = await page
    .locator(".after-preview img")
    .evaluate(async (img) => [
      ...new Uint8Array(await (await fetch(img.src)).arrayBuffer()),
    ]);
  expect(bytes.equals(Buffer.from(displayed))).toBe(true);
  if (evidence)
    await copyFile(location, path.join(evidence, file.suggestedFilename()));
  return file.suggestedFilename();
}
test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  page._crushrErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect(page._crushrErrors).toEqual([]);
});

test("full timed sequence, mute during run, download, reset and same file replay", async ({
  page,
}, testInfo) => {
  await screenshot(page, "desktop-idle.png");
  await sample(page);
  await screenshot(page, "desktop-ready.png");
  const before = await page
    .locator(".selected-preview img")
    .getAttribute("src");
  const started = Date.now();
  await page.getByRole("button", { name: "Compress this file" }).click();
  await phase(page, "compressing");
  await expect(
    page.getByRole("button", { name: "Applying pressure…" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Mute sound", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Unmute sound" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(3300);
  await screenshot(page, "desktop-folding.png");
  await phase(page, "complete");
  expect(Date.now() - started).toBeGreaterThan(6500);
  expect(Date.now() - started).toBeLessThan(12000);
  await screenshot(page, "desktop-result.png");
  expect(await download(page, testInfo)).toBe(
    "very-important-document-compressed.png",
  );
  await page.getByRole("button", { name: "Unmute sound" }).click();
  await phase(page, "complete");
  await page.getByRole("button", { name: "Compress another file" }).click();
  await phase(page, "idle");
  expect(
    await page.evaluate(async (url) => {
      try {
        await fetch(url);
        return true;
      } catch {
        return false;
      }
    }, before),
  ).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await sample(page);
  await crush(page);
  await download(page, testInfo);
});

test("real multipage PDF first page, local assets and recoverable invalid PDF", async ({
  page,
}, testInfo) => {
  const requests = [];
  page.on("request", (req) => requests.push(req.url()));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await choose(page, "real-pages.pdf", "application/pdf", samplePDF());
  await phase(page, "ready");
  await expect(
    page.getByText("First page of 2 pages", { exact: true }),
  ).toBeVisible();
  const pixel = await page
    .locator(".selected-preview img")
    .evaluate(async (img) => {
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return [...ctx.getImageData(c.width * 0.2, c.height * 0.35, 1, 1).data];
    });
  expect(pixel[0]).toBeGreaterThan(180);
  expect(pixel[1]).toBeLessThan(80);
  await screenshot(page, "pdf-first-page.png");
  await crush(page);
  expect(await download(page, testInfo)).toBe("real-pages-compressed.png");
  expect(
    requests.every(
      (url) =>
        url.startsWith("http://127.0.0.1:5173/") || url.startsWith("blob:"),
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Compress another file" }).click();
  await choose(
    page,
    "broken.pdf",
    "application/pdf",
    Buffer.from("%PDF-1.4 definitely invalid"),
  );
  await phase(page, "error");
  await expect(page.getByRole("alert")).toContainText("couldn’t read this PDF");
  await sample(page);
});

test("uploaded image keeps real colors in a decodable PNG", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const data = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = 1000;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f3ba2e";
    ctx.fillRect(0, 0, 800, 1000);
    ctx.fillStyle = "#e84738";
    ctx.fillRect(0, 0, 400, 1000);
    ctx.fillStyle = "#316ca7";
    ctx.beginPath();
    ctx.arc(400, 500, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("HELLO!", 400, 530);
    return c.toDataURL().split(",")[1];
  });
  await choose(
    page,
    "hello-world.png",
    "image/png",
    Buffer.from(data, "base64"),
  );
  await phase(page, "ready");
  await screenshot(page, "image-before.png");
  await crush(page);
  const colors = await page
    .locator(".after-preview img")
    .evaluate(async (img) => {
      await img.decode();
      const c = document.createElement("canvas");
      c.width = c.height = 1600;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0, 0, 1600, 1600).data;
      let red = 0,
        blue = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] > pixels[i + 1] * 1.5 && pixels[i] > pixels[i + 2] * 1.5)
          red++;
        if (pixels[i + 2] > pixels[i] * 1.4) blue++;
      }
      return { red, blue };
    });
  expect(colors.red).toBeGreaterThan(15000);
  expect(colors.blue).toBeGreaterThan(15000);
  await screenshot(page, "image-result.png");
  await download(page, testInfo);
});

test("TXT, unsupported fallback, bounds, corrupt image and newer selection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await choose(
    page,
    "notes.txt",
    "text/plain",
    Buffer.from("Actual text!\n".repeat(3000)),
  );
  await phase(page, "ready");
  await expect(page.getByText("A bounded excerpt of your text")).toBeVisible();
  await choose(
    page,
    "budget.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    Buffer.from("Not an actual spreadsheet"),
  );
  await phase(page, "ready");
  await expect(page.getByText(/Filename and type only/)).toBeVisible();
  await screenshot(page, "file-card.png");
  await crush(page);
  await page.getByRole("button", { name: "Compress another file" }).click();
  await choose(page, "empty.txt", "text/plain", Buffer.alloc(0));
  await phase(page, "error");
  await expect(page.getByRole("alert")).toContainText("empty");
  await choose(
    page,
    "huge.txt",
    "text/plain",
    Buffer.alloc(20 * 1024 * 1024 + 1),
  );
  await phase(page, "error");
  await expect(page.getByRole("alert")).toContainText("over 20 MB");
  await choose(
    page,
    "corrupt.png",
    "image/png",
    Buffer.from("this is not an image"),
  );
  await phase(page, "error");
  await expect(page.getByRole("alert")).toContainText(
    "couldn’t read this image",
  );
  // Supersede an in-flight PDF with a text file; it must remain selected.
  await choose(page, "older.pdf", "application/pdf", samplePDF());
  await choose(
    page,
    "newer.txt",
    "text/plain",
    Buffer.from("Newer selection wins."),
  );
  await phase(page, "ready");
  await page.waitForTimeout(600);
  await expect(page.locator(".selected-name")).toHaveText("newer.txt");
  await choose(
    page,
    "newer.txt",
    "text/plain",
    Buffer.from("Newer selection wins."),
  );
  await phase(page, "ready");
});

test("mobile, reduced motion and downloadable result", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await screenshot(page, "mobile-idle.png");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await sample(page);
  const start = Date.now();
  await crush(page);
  expect(Date.now() - start).toBeLessThan(3000);
  await screenshot(page, "mobile-result.png");
  await download(page, testInfo);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Compress another file" }).click();
  await phase(page, "idle");
});

test("password-protected PDF has a useful error and recovers", async ({
  page,
}) => {
  await page.locator("#file-input").setInputFiles("tests/fixtures/locked.pdf");
  await phase(page, "error");
  await expect(page.getByRole("alert")).toContainText("password-protected");
  await sample(page);
});

test("JPEG and WebP images use their actual content", async ({ page }) => {
  for (const mimeType of ["image/jpeg", "image/webp"]) {
    const data = await page.evaluate((type) => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#177ec4";
      ctx.fillRect(0, 0, 640, 480);
      return canvas.toDataURL(type).split(",")[1];
    }, mimeType);
    await choose(
      page,
      `photo.${mimeType.split("/")[1]}`,
      mimeType,
      Buffer.from(data, "base64"),
    );
    await phase(page, "ready");
    const pixel = await page
      .locator(".selected-preview img")
      .evaluate(async (img) => {
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 10;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 10, 10);
        return [...ctx.getImageData(5, 5, 1, 1).data];
      });
    expect(pixel[2]).toBeGreaterThan(150);
    expect(pixel[0]).toBeLessThan(50);
  }
});

test("audio starts on interaction, mutes the live output, and closes on reset", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext;
    window.__audioEvidence = { contexts: [], outputs: [], starts: [] };
    window.AudioContext = class extends NativeAudioContext {
      constructor(...args) {
        super(...args);
        window.__audioEvidence.contexts.push(this);
      }
      createGain() {
        const gain = super.createGain(),
          connect = gain.connect.bind(gain);
        gain.connect = (...args) => {
          if (args[0] === this.destination)
            window.__audioEvidence.outputs.push(gain);
          return connect(...args);
        };
        return gain;
      }
      createOscillator() {
        const osc = super.createOscillator(),
          start = osc.start.bind(osc);
        osc.start = (...args) => {
          window.__audioEvidence.starts.push(performance.now());
          return start(...args);
        };
        return osc;
      }
    };
  });
  await page.reload();
  await sample(page);
  expect(
    await page.evaluate(() => window.__audioEvidence.contexts.length),
  ).toBe(0);
  const started = await page.evaluate(() => performance.now());
  await page.getByRole("button", { name: "Compress this file" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__audioEvidence.outputs.length))
    .toBe(1);
  await page.getByRole("button", { name: "Mute sound", exact: true }).click();
  expect(
    await page.evaluate(() => window.__audioEvidence.outputs[0].gain.value),
  ).toBe(0);
  await page.getByRole("button", { name: "Unmute sound", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.__audioEvidence.outputs[0].gain.value),
    )
    .toBeCloseTo(0.8);
  await expect(page.locator(".app-shell")).toHaveAttribute(
    "data-phase",
    "complete",
    { timeout: 10000 },
  );
  const starts = await page.evaluate(() => window.__audioEvidence.starts);
  expect(starts).toHaveLength(2);
  expect(starts[0] - started).toBeGreaterThan(2500);
  expect(starts[0] - started).toBeLessThan(3500);
  expect(starts[1] - starts[0]).toBeGreaterThan(1200);
  await page.getByRole("button", { name: "Compress another file" }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.__audioEvidence.contexts.every((ctx) => ctx.state === "closed"),
      ),
    )
    .toBe(true);
});

test("download waits for PNG encoding and an encoding failure is recoverable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const toBlob = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
      if (this.width !== 1600) return toBlob.call(this, callback, ...args);
      if (window.__failExport) {
        setTimeout(() => callback(null), 50);
        return;
      }
      return toBlob.call(
        this,
        (blob) => setTimeout(() => callback(blob), 1500),
        ...args,
      );
    };
  });
  await page.reload();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await sample(page);
  await page.getByRole("button", { name: "Compress this file" }).click();
  await page.waitForTimeout(700);
  await phase(page, "compressing");
  await expect(
    page.getByRole("link", { name: "Download compressed file" }),
  ).toHaveCount(0);
  await phase(page, "complete");
  await page.getByRole("button", { name: "Compress another file" }).click();
  await page.evaluate(() => {
    window.__failExport = true;
  });
  await sample(page);
  await page.getByRole("button", { name: "Compress this file" }).click();
  await phase(page, "error");
  await expect(page.getByRole("alert")).toContainText(
    "PNG could not be created",
  );
  await page.evaluate(() => {
    window.__failExport = false;
  });
  await sample(page);
  await crush(page);
});
