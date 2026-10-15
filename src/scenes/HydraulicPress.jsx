import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { drawPaper, drawSoftShadow, paperBounds } from "../utils/paperMesh";
import { soundEngine } from "../utils/soundEngine";

const INK = "#30332e",
  YELLOW = "#f5d56f";
const REST = {
  x: 120,
  bottom: 390,
  fold: 0,
  plate: 180,
  angle: -0.08,
  pressure: 0,
  dust: 0,
  shake: 0,
  contact: false,
  alpha: 1,
};
function box(ctx, x, y, w, h, radius, fill, stroke = INK, line = 2.5) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = line;
    ctx.stroke();
  }
}
function line(ctx, x1, y1, x2, y2, color = INK, width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function bolt(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#fff6ca";
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  line(ctx, x - 2, y + 2, x + 2, y - 2, INK, 1.3);
}
function paint(ctx, mesh, s, phase) {
  ctx.clearRect(0, 0, 720, 540);
  ctx.save();
  ctx.translate(
    Math.sin(s.shake * 40) * s.shake * 3,
    Math.cos(s.shake * 30) * s.shake * 1.7,
  );
  drawSoftShadow(ctx, 368, 489, 285, 25, 0.16);
  // Rear of the tray and frame.
  box(ctx, 503, 443, 147, 44, [13, 13, 6, 6], "#dce4d8");
  box(ctx, 188, 95, 29, 316, 8, "#5e685e");
  box(ctx, 477, 95, 29, 316, 8, "#5e685e");
  line(ctx, 198, 115, 198, 380, "#a2afa0", 4);
  line(ctx, 487, 115, 487, 380, "#a2afa0", 4);
  // Input shelf, machine bed, feet.
  box(ctx, 45, 390, 151, 16, 7, "#d2d8cd");
  for (let x = 59; x < 185; x += 20) {
    ctx.beginPath();
    ctx.arc(x, 398, 4, 0, Math.PI * 2);
    ctx.strokeStyle = "#6d7769";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  box(ctx, 193, 432, 39, 48, 8, "#535e51");
  box(ctx, 461, 432, 39, 48, 8, "#535e51");
  box(ctx, 178, 390, 338, 64, 12, YELLOW);
  box(ctx, 178, 390, 338, 15, [9, 9, 0, 0], "#fff0aa");
  bolt(ctx, 198, 435);
  bolt(ctx, 496, 435);
  for (let x = 318; x < 382; x += 12) line(ctx, x, 421, x, 437, "#8e7c42", 3);
  // Pressure dial on the side.
  box(ctx, 119, 219, 65, 102, 13, "#f8f3df");
  ctx.beginPath();
  ctx.arc(151, 253, 23, 0, Math.PI * 2);
  ctx.fillStyle = "#fffdf4";
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(151, 253, 17, Math.PI * 1.05, Math.PI * 1.95);
  ctx.strokeStyle = "#e7806c";
  ctx.lineWidth = 4;
  ctx.stroke();
  const angle = Math.PI * (1.12 + s.pressure * 0.78);
  line(
    ctx,
    151,
    253,
    151 + Math.cos(angle) * 15,
    253 + Math.sin(angle) * 15,
    INK,
    2,
  );
  ctx.beginPath();
  ctx.arc(151, 253, 3, 0, Math.PI * 2);
  ctx.fillStyle = INK;
  ctx.fill();
  box(
    ctx,
    138,
    289,
    26,
    13,
    6,
    phase === "compressing" ? "#e7826e" : "#9dad8f",
  );
  // Paper keeps a fixed lower edge on the bed as connected facets fold.
  let top = 201;
  if (mesh) {
    const bounds = paperBounds(mesh, s.fold),
      size = 190;
    const y = s.bottom - bounds.maxY * size;
    top = y + bounds.minY * size;
    drawSoftShadow(ctx, s.x, s.bottom + 2, 65 - s.fold * 12, 10, 0.17);
    ctx.save();
    ctx.translate(s.x, s.bottom);
    ctx.rotate(s.angle);
    ctx.translate(-s.x, -s.bottom);
    drawPaper(ctx, mesh, { x: s.x, y, size, progress: s.fold, alpha: s.alpha });
    ctx.restore();
  } else {
    // An honest idle illustration, replaced entirely by the uploaded texture.
    ctx.save();
    ctx.translate(348, 319);
    ctx.rotate(-0.09);
    box(ctx, -49, -66, 98, 137, 4, "#fffdf6");
    line(ctx, -30, -42, 11, -42, "#c8c9bc", 3);
    line(ctx, -30, -31, 26, -31, "#c8c9bc", 3);
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.ellipse(-13, 7, 3, 5, 0, 0, 7);
    ctx.ellipse(13, 7, 3, 5, 0, 0, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 17, 9, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
  // Piston and hazard-striped press face.
  const plateBottom = s.contact ? top : s.plate;
  const chrome = ctx.createLinearGradient(325, 0, 369, 0);
  chrome.addColorStop(0, "#859183");
  chrome.addColorStop(0.35, "#f3f4e9");
  chrome.addColorStop(0.57, "#d6dece");
  chrome.addColorStop(1, "#87927f");
  box(ctx, 324, 105, 46, Math.max(20, plateBottom - 137), 3, chrome);
  box(ctx, 229, plateBottom - 32, 236, 32, 6, "#515b50");
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(235, plateBottom - 26, 224, 19, 3);
  ctx.clip();
  ctx.fillStyle = "#f6d574";
  ctx.fillRect(235, plateBottom - 26, 224, 19);
  for (let x = 220; x < 480; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, plateBottom - 26);
    ctx.lineTo(x + 14, plateBottom - 26);
    ctx.lineTo(x + 3, plateBottom - 7);
    ctx.lineTo(x - 11, plateBottom - 7);
    ctx.fillStyle = "#444a3f";
    ctx.fill();
  }
  ctx.restore();
  // Rounded top housing, offset side and simple engraved details.
  box(ctx, 185, 59, 328, 82, 17, "#c7a945");
  box(ctx, 177, 49, 328, 82, 17, YELLOW);
  box(ctx, 177, 49, 328, 14, [17, 17, 0, 0], "#ffe99f", null);
  ctx.font = "900 27px Arial, sans-serif";
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.fillText("CRUSHR", 341, 97);
  bolt(ctx, 198, 91);
  bolt(ctx, 484, 91);
  line(ctx, 267, 112, 415, 112, "#b49a49", 1.5);
  box(ctx, 317, 24, 49, 25, [8, 8, 0, 0], "#e58b73");
  box(ctx, 312, 43, 59, 7, 3, "#5e685e");
  // Small, deterministic dust puff at final squeeze.
  if (s.dust > 0)
    for (let i = 0; i < 12; i++) {
      const t = 1 - s.dust,
        side = i % 2 ? 1 : -1;
      ctx.globalAlpha = s.dust * 0.48;
      ctx.fillStyle = "#c6b993";
      ctx.beginPath();
      ctx.arc(
        347 + side * (54 + t * (50 + i * 4)),
        382 - Math.sin(t * Math.PI) * (12 + i * 2),
        3 + (i % 4),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  ctx.globalAlpha = 1;
  box(ctx, 503, 477, 147, 16, [3, 3, 8, 8], "#bdcbb6");
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = "#596450";
  ctx.fillText("OUTPUT", 576, 488);
  ctx.restore();
}
export default function HydraulicPress({ mesh, phase, runId, onComplete }) {
  const canvas = useRef(null),
    latestComplete = useRef(onComplete);
  const [caption, setCaption] = useState("Ready when you are.");
  useEffect(() => {
    latestComplete.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    const element = canvas.current,
      ctx = element.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    element.width = 720 * dpr;
    element.height = 540 * dpr;
    ctx.scale(dpr, dpr);
    const s = { ...REST };
    const draw = () => paint(ctx, mesh, s, phase);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timeline,
      finished = false;
    const finalState = () =>
      Object.assign(s, {
        x: 560,
        bottom: 477,
        fold: 1,
        plate: 180,
        angle: 0,
        pressure: 0,
        contact: false,
        alpha: 1,
        dust: 0,
        shake: 0,
      });
    const finish = () => {
      if (finished) return;
      finished = true;
      finalState();
      draw();
      setCaption("Small. Very, very small.");
      latestComplete.current(runId);
    };
    const reduceNow = () => {
      if (media.matches && phase === "compressing") {
        timeline?.kill();
        soundEngine.stopAll();
        finish();
      }
    };
    if (phase === "complete") {
      finalState();
      setCaption("Small. Very, very small.");
      draw();
    } else if (phase !== "compressing" || !mesh) {
      setCaption(
        phase === "ready"
          ? "Your file. Its moment of truth."
          : phase === "preparing"
            ? "Getting your paper ready…"
            : "Ready when you are.",
      );
      draw();
    } else if (media.matches) {
      finalState();
      s.alpha = 0.1;
      setCaption("A little pressure…");
      timeline = gsap
        .timeline({ onUpdate: draw, onComplete: finish })
        .to(s, { alpha: 1, duration: 0.45, ease: "none" });
    } else {
      setCaption("Coming right up.");
      timeline = gsap.timeline({ onUpdate: draw, onComplete: finish });
      timeline
        .to(s, { x: 347, angle: 0, duration: 1.15, ease: "power2.inOut" }, 0)
        .to(s, { angle: 0.025, duration: 0.12, repeat: 3, yoyo: true }, 1.16)
        .to(s, { angle: 0, duration: 0.1 }, 1.65)
        .call(
          () => {
            setCaption("A little pressure…");
            soundEngine.playHydraulicHiss();
          },
          [],
          1.65,
        )
        .to(
          s,
          {
            plate:
              390 -
              (paperBounds(mesh, 0).maxY - paperBounds(mesh, 0).minY) * 190,
            pressure: 0.3,
            duration: 1.05,
            ease: "power1.in",
          },
          1.7,
        )
        .call(
          () => {
            s.contact = true;
            soundEngine.playCrunch();
            setCaption("Not the margins!");
          },
          [],
          2.75,
        )
        .to(
          s,
          { fold: 1, pressure: 1, duration: 1.6, ease: "power2.inOut" },
          2.75,
        )
        .call(
          () => {
            soundEngine.playCrunch();
            s.dust = 1;
            s.shake = 1;
          },
          [],
          4.3,
        )
        .to(s, { dust: 0, shake: 0, duration: 0.65 }, 4.31)
        .call(
          () => {
            s.plate =
              390 - (paperBounds(mesh).maxY - paperBounds(mesh).minY) * 190;
            s.contact = false;
            soundEngine.playHydraulicHiss();
            setCaption("One compact little masterpiece.");
          },
          [],
          4.85,
        )
        .to(
          s,
          { plate: 180, pressure: 0, duration: 0.95, ease: "power2.out" },
          4.85,
        )
        .to(s, { x: 560, duration: 0.85, ease: "power1.inOut" }, 5.85)
        .to(s, { bottom: 477, duration: 0.85, ease: "bounce.out" }, 6.25)
        .to(s, { duration: 0.25 }, 7.1);
      draw();
    }
    media.addEventListener("change", reduceNow);
    return () => {
      timeline?.kill();
      media.removeEventListener("change", reduceNow);
    };
  }, [mesh, phase, runId]);
  return (
    <div className="machine-scene">
      <canvas
        ref={canvas}
        className="machine-canvas"
        role="img"
        aria-label={
          phase === "complete"
            ? "Your crumpled document resting in the output tray"
            : "An illustrated hydraulic press folding your document into a paper ball"
        }
      />
      <p className="machine-caption" role="status" aria-live="polite">
        {caption}
      </p>
    </div>
  );
}
