import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { soundEngine } from "../utils/soundEngine";

/* -------------------------------------------------------------
   PDF TEXTURE LOADER
   Renders page-1 of the real PDF onto a canvas. Falls back to
   a white A4 replica with the file name on it.
------------------------------------------------------------- */
async function loadPdfTexture(file, targetW = 600, targetH = 848) {
  try {
    if (!file) throw new Error("no file");
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).href;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(targetW / viewport.width, targetH / viewport.height) * 2;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
    return canvas;
  } catch (e) {
    console.warn("[CRUSHR] PDF render failed, using fallback:", e?.message ?? e);
    return buildFallbackTexture(targetW * 2, targetH * 2, file?.name ?? "document.pdf");
  }
}

function buildFallbackTexture(w = 1200, h = 1696, fileName = "document.pdf") {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);

  // PDF badge
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.roundRect(40, 40, 100, 56, 10);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 52px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PDF", 90, 80);

  // File name
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 40px Inter, sans-serif";
  ctx.textAlign = "left";
  let displayName = fileName;
  const maxW = w - 200;
  while (ctx.measureText(displayName).width > maxW && displayName.length > 4) {
    displayName = displayName.slice(0, -1);
  }
  if (displayName !== fileName) displayName += "...";
  ctx.fillText(displayName, 160, 78);

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(40, 116);
  ctx.lineTo(w - 40, 116);
  ctx.stroke();

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(40, 150, 300, 22);
  ctx.fillStyle = "#cbd5e1";
  [w - 100, w - 160, w - 130, w - 180, w - 110].forEach((lw, i) => {
    ctx.beginPath();
    ctx.roundRect(40, 190 + i * 30, lw, 14, 6);
    ctx.fill();
  });

  const cx = 40, cy = 360, cw = w - 80, ch = 240;
  const grad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  grad.addColorStop(0, "#f1f5f9");
  grad.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(cx, cy, cw, ch, 10);
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  ctx.stroke();
  ["#38bdf8", "#818cf8", "#f43f5e", "#10b981", "#f59e0b"].forEach((col, i) => {
    const barH = 80 + Math.sin(i * 1.3) * 60;
    ctx.fillStyle = col;
    ctx.fillRect(cx + 40 + i * 100, cy + ch - barH - 20, 60, barH);
  });

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, h - 80);
  ctx.lineTo(w - 40, h - 80);
  ctx.stroke();
  ctx.fillStyle = "#94a3b8";
  ctx.font = "28px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("CRUSHR LABS • DESTRUCTION READY", 40, h - 40);
  ctx.textAlign = "right";
  ctx.fillText("Page 1 of 1", w - 40, h - 40);

  return canvas;
}

/* -------------------------------------------------------------
   PARTICLE SYSTEM (dust + ink puffs)
------------------------------------------------------------- */
class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }
  spawn(x, y, z, count = 30, color = 0xffffff) {
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(0.035, 4, 4);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const elev = (Math.random() - 0.5) * Math.PI;
      const speed = 0.04 + Math.random() * 0.12;
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        mat,
        vx: Math.cos(angle) * Math.cos(elev) * speed,
        vy: Math.abs(Math.sin(elev)) * speed + 0.02,
        vz: Math.sin(angle) * Math.cos(elev) * speed * 0.6,
        gravity: -0.003,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018,
      });
    }
  }
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      p.mat.opacity = Math.max(0, p.alpha);
      if (p.alpha <= 0) {
        this.scene.remove(p.mesh);
        p.mat.dispose();
        p.mesh.geometry.dispose();
        this.particles.splice(i, 1);
      }
    }
  }
  dispose() {
    this.particles.forEach(p => {
      this.scene.remove(p.mesh);
      p.mat.dispose();
      p.mesh.geometry.dispose();
    });
    this.particles = [];
  }
}

/* -------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------- */
export default function HydraulicPress({ file, fileName = "report.pdf", onComplete }) {
  const mountRef = useRef(null);
  const gaugeRef = useRef(null);
  const psiValueRef = useRef(null);

  useEffect(() => {
    let rafId;
    let renderer, scene, camera, tl, particles;
    let isCleanedUp = false;

    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth || 700;
    const H = container.clientHeight || 500;

    // --- Physical & Geometric Constants (World Y coordinates) ---
    const BED_Y = -1.95;            // Top surface of anvil where paper sits
    const PLATE_H = 0.36;           // Thickness of press plate
    const PAPER_W = 2.2;            // Sheet width
    const PAPER_H = 3.0;            // Sheet original uncompressed height
    const MIN_CRUSH_H = 0.12;       // Flattened pancake wafer thickness

    // When plate bottom touches top of paper (world Y = BED_Y + PAPER_H = +1.05):
    const PLATE_START_Y    = 3.8;
    const PLATE_CONTACT_Y  = BED_Y + PAPER_H + PLATE_H / 2; // = 1.05 + 0.18 = 1.23
    const PLATE_HALFWAY_Y  = BED_Y + PAPER_H * 0.48 + PLATE_H / 2; // = -1.95 + 1.44 + 0.18 = -0.33
    const PLATE_SLAM_Y     = BED_Y + MIN_CRUSH_H + PLATE_H / 2;    // = -1.95 + 0.12 + 0.18 = -1.65

    // Three.js setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d13);
    camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(0, -0.1, 8.4);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.8);
    keyLight.position.set(3, 6, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.9);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 1.2, 10);
    rimLight.position.set(0, -1.0, -1.5);
    scene.add(rimLight);

    // Anvil base
    const anvil = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.6, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.6 })
    );
    anvil.position.set(0, BED_Y - 0.3, 0);
    anvil.receiveShadow = true;
    scene.add(anvil);

    // Hazard stripes along front edge of anvil
    const anvilStripe = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.08, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
    );
    anvilStripe.position.set(0, BED_Y - 0.05, 1.11);
    scene.add(anvilStripe);

    // Press plate
    const pressPlate = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, PLATE_H, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.85 })
    );
    pressPlate.position.set(0, PLATE_START_Y, 0);
    pressPlate.castShadow = true;
    scene.add(pressPlate);

    // Hazard stripe on front face of press plate
    const plateStripe = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 0.08, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
    );
    plateStripe.position.set(0, -0.04, 1.11);
    pressPlate.add(plateStripe);

    // Hydraulic cylinders & steel rods
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.95 });
    [-1.7, 1.7].forEach(x => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 12, 20), rodMat);
      rod.position.set(x, 0, 0);
      scene.add(rod);
    });

    // Paper group — sits at BED_Y
    const paperGrp = new THREE.Group();
    paperGrp.position.set(7.5, BED_Y, 0);
    scene.add(paperGrp);

    // Paper Mesh (subdivided grid for smooth dynamic buckle and crumple)
    const W_SEGS = 32;
    const H_SEGS = 48;
    const paperGeo = new THREE.PlaneGeometry(PAPER_W, PAPER_H, W_SEGS, H_SEGS);
    // Shift geometry so bottom edge is at y=0, top edge at y=PAPER_H
    paperGeo.translate(0, PAPER_H / 2, 0);

    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      roughness: 0.75,
      metalness: 0.05
    });
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.castShadow = true;
    paperMesh.receiveShadow = true;
    paperGrp.add(paperMesh);

    // Cache initial vertices for deformation computations
    const origPositions = Float32Array.from(paperGeo.attributes.position.array);

    // Crease lines overlay
    const creaseLines = [];
    for (let i = 0; i < 9; i++) {
      const mat = new THREE.LineBasicMaterial({ color: 0x090d16, transparent: true, opacity: 0 });
      const normY = 0.1 + (i / 9) * 0.8 + (Math.random() - 0.5) * 0.04;
      const pts = [
        new THREE.Vector3(-PAPER_W * 0.48 + Math.random() * 0.1, normY * PAPER_H, 0.012),
        new THREE.Vector3(PAPER_W * 0.48 - Math.random() * 0.1, (normY + (Math.random() - 0.5) * 0.06) * PAPER_H, 0.012)
      ];
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
      paperGrp.add(line);
      creaseLines.push({ line, mat, normY, origPts: pts });
    }

    particles = new ParticleSystem(scene);

    // Load real PDF texture
    const fileObj = file instanceof File ? file : null;
    loadPdfTexture(fileObj, 640, 900).then(texCanvas => {
      if (isCleanedUp) return;
      const tex = new THREE.CanvasTexture(texCanvas);
      tex.needsUpdate = true;
      paperMesh.material = new THREE.MeshStandardMaterial({
        map: tex,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.05
      });
    });

    // -------------------------------------------------------------
    // Deformation Engine: Couples mesh vertices directly to plate Y
    // -------------------------------------------------------------
    let minPaperHSoFar = PAPER_H; // Never un-crush once deformed

    function updateDeformation(plateY) {
      const plateBottomY = plateY - PLATE_H / 2;
      // How much clearance between plate and anvil bed:
      const clearance = plateBottomY - BED_Y;
      // Allowable current height under the plate
      const currentAllowedH = Math.max(MIN_CRUSH_H, Math.min(PAPER_H, clearance));

      // Record compression (paper retains deformation, doesn't bounce back on retract)
      if (currentAllowedH < minPaperHSoFar) {
        minPaperHSoFar = currentAllowedH;
      }
      const activeH = minPaperHSoFar;

      // Crush fraction: 0 = untouched sheet, 1 = fully squashed wafer
      const crushFrac = Math.max(0, Math.min(1, (PAPER_H - activeH) / (PAPER_H - MIN_CRUSH_H)));

      const pos = paperGeo.attributes.position;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const origX = origPositions[i * 3 + 0];
        const origY = origPositions[i * 3 + 1]; // 0 (bottom) .. PAPER_H (top)

        // Normalized vertical position 0 (bed) .. 1 (plate)
        const u = origY / PAPER_H;

        // 1. Direct vertical compression: bottom stays at 0, top matches activeH
        const newY = u * activeH;

        // 2. Lateral bulge (accordion folds push paper outward left and right)
        const arch = Math.sin(u * Math.PI); // 0 at bed and plate, peaks in middle
        const lateralSpread = arch * crushFrac * 0.22 * Math.sign(origX);
        const newX = origX + lateralSpread;

        // 3. Realistic 3D buckling & accordion folds along Z normal
        // Clamped to 0 at top and bottom so it never clips through plate or bed
        let newZ = 0;
        if (crushFrac > 0) {
          const foldWave = Math.sin(u * Math.PI * 6.0) * 0.20;
          const crinkleWave = Math.sin(u * Math.PI * 14.0 + origX * 3.0) * 0.08;
          const creaseWave = Math.cos(u * Math.PI * 10.0 - origX * 4.0) * 0.05;
          newZ = arch * Math.pow(crushFrac, 0.8) * (foldWave + crinkleWave + creaseWave);
        }

        pos.setXYZ(i, newX, newY, newZ);
      }

      pos.needsUpdate = true;
      paperGeo.computeVertexNormals();

      // Update crease lines
      creaseLines.forEach(({ line, mat, normY, origPts }) => {
        mat.opacity = Math.min(0.9, crushFrac * 1.5);
        const linePos = line.geometry.attributes.position;
        if (linePos) {
          origPts.forEach((p, idx) => {
            const lineY = normY * activeH;
            const lineZ = Math.sin(normY * Math.PI) * crushFrac * 0.18 + 0.01;
            linePos.setXYZ(idx, p.x * (1 + crushFrac * 0.1), lineY, lineZ);
          });
          linePos.needsUpdate = true;
        }
      });

      return { crushFrac, activeH };
    }

    soundEngine.init?.();

    // -------------------------------------------------------------
    // GSAP Master Timeline (7.6 seconds total)
    // -------------------------------------------------------------
    const animState = {
      paperX: 7.5,
      plateY: PLATE_START_Y,
      pressurePsi: 0,
    };

    tl = gsap.timeline();

    // PHASE 1: Slide paper in onto the press bed (0 - 1.1s)
    tl.to(animState, {
      paperX: 0,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: () => {
        paperGrp.position.x = animState.paperX;
      },
    });

    // PHASE 2: Fast descent until plate gently touches top of paper (1.1 - 2.0s)
    tl.to(animState, {
      plateY: PLATE_CONTACT_Y,
      duration: 0.9,
      ease: "power1.in",
      onStart: () => {
        soundEngine.playHydraulicHiss?.();
      },
      onUpdate: () => {
        pressPlate.position.y = animState.plateY;
        updateDeformation(animState.plateY);
      },
    });

    // PHASE 3: Slow crushing & buckling down to halfway (2.0 - 3.8s)
    // Synchronized live deformation: mesh visibly crinkles, buckles and spreads as plate pushes down!
    tl.to(animState, {
      plateY: PLATE_HALFWAY_Y,
      pressurePsi: 1400,
      duration: 1.8,
      ease: "sine.inOut",
      onStart: () => {
        particles.spawn(-1.1, BED_Y + 0.1, 0.4, 15, 0xf8fafc);
        particles.spawn( 1.1, BED_Y + 0.1, 0.4, 15, 0xf8fafc);
      },
      onUpdate: () => {
        pressPlate.position.y = animState.plateY;
        updateDeformation(animState.plateY);
        if (gaugeRef.current) {
          gaugeRef.current.style.transform = `rotate(${-60 + (animState.pressurePsi / 3500) * 180}deg)`;
        }
        if (psiValueRef.current) {
          psiValueRef.current.textContent = Math.round(animState.pressurePsi);
        }
      },
    });

    // PHASE 4: The Hesitation / Pressure Build (3.8 - 4.4s)
    // Machine hesitates, pressure jumps violently, gauge needle quivers!
    tl.to(animState, {
      duration: 0.6,
      onStart: () => {
        soundEngine.playHydraulicHiss?.();
        // Needle jitter
        gsap.to(animState, {
          pressurePsi: 2400,
          duration: 0.6,
          ease: "rough({strength: 2, points: 15, randomize: true})",
          onUpdate: () => {
            if (gaugeRef.current) {
              const jitter = (Math.random() - 0.5) * 6;
              gaugeRef.current.style.transform = `rotate(${-60 + (animState.pressurePsi / 3500) * 180 + jitter}deg)`;
            }
            if (psiValueRef.current) {
              psiValueRef.current.textContent = Math.round(animState.pressurePsi);
            }
          },
        });
        // Subtle machine vibration
        gsap.to(camera.position, {
          x: "random(-0.02, 0.02)",
          y: "random(-0.12, -0.08)",
          duration: 0.05,
          repeat: 10,
          yoyo: true,
          ease: "none",
        });
      },
      onUpdate: () => {
        pressPlate.position.y = animState.plateY;
        updateDeformation(animState.plateY);
      },
    });

    // PHASE 5: THE SLAM! (4.4 - 4.75s)
    // Instant explosive slam flattening paper into a paper wafer!
    tl.to(animState, {
      plateY: PLATE_SLAM_Y,
      pressurePsi: 3500,
      duration: 0.35,
      ease: "power4.in",
      onStart: () => {
        soundEngine.playCrunch?.();
        // Explosive burst of paper dust and shredded fibres
        particles.spawn(-1.1, BED_Y + 0.08, 0.5, 45, 0xffffff);
        particles.spawn( 1.1, BED_Y + 0.08, 0.5, 45, 0xffffff);
        particles.spawn(-0.5, BED_Y + 0.08, 0.6, 30, 0xef4444);
        particles.spawn( 0.5, BED_Y + 0.08, 0.6, 30, 0x38bdf8);
        particles.spawn( 0.0, BED_Y + 0.08, 0.7, 40, 0xf1f5f9);

        // Heavy camera shake
        gsap.to(camera.position, {
          x: "random(-0.25, 0.25)",
          y: "random(-0.3, 0.1)",
          duration: 0.04,
          repeat: 14,
          yoyo: true,
          ease: "none",
          onComplete: () => {
            camera.position.set(0, -0.1, 8.4);
          },
        });
      },
      onUpdate: () => {
        pressPlate.position.y = animState.plateY;
        updateDeformation(animState.plateY);
        if (gaugeRef.current) {
          gaugeRef.current.style.transform = `rotate(${-60 + (animState.pressurePsi / 3500) * 180}deg)`;
        }
        if (psiValueRef.current) {
          psiValueRef.current.textContent = Math.round(animState.pressurePsi);
        }
      },
    });

    // PHASE 6: Hold at maximum compression (4.75 - 5.5s)
    tl.to(animState, {
      duration: 0.75,
      onStart: () => {
        particles.spawn(0, BED_Y + 0.08, 0.5, 20, 0xe2e8f0);
      },
      onUpdate: () => {
        pressPlate.position.y = animState.plateY;
        updateDeformation(animState.plateY);
      },
    });

    // PHASE 7: Retract press plate (5.5 - 6.8s)
    // Plate retracts up, leaving behind the mangled crushed paper pancake!
    tl.to(animState, {
      plateY: PLATE_START_Y,
      pressurePsi: 0,
      duration: 1.3,
      ease: "power2.out",
      onStart: () => {
        soundEngine.playHydraulicHiss?.();
      },
      onUpdate: () => {
        pressPlate.position.y = animState.plateY;
        updateDeformation(animState.plateY);
        if (gaugeRef.current) {
          gaugeRef.current.style.transform = `rotate(${-60 + (animState.pressurePsi / 3500) * 180}deg)`;
        }
        if (psiValueRef.current) {
          psiValueRef.current.textContent = Math.round(animState.pressurePsi);
        }
      },
    });

    // PHASE 8: Dramatic Camera Zoom on Wreckage (6.8 - 7.8s)
    // Zooms in tightly to show the crushed document pancake in detail
    tl.to(camera.position, {
      x: 0,
      y: BED_Y + 0.4,
      z: 5.6,
      duration: 1.0,
      ease: "power2.inOut",
      onComplete: () => {
        if (isCleanedUp) return;
        try {
          renderer.render(scene, camera);
          renderer.domElement.toBlob(blob => {
            if (!isCleanedUp && onComplete) onComplete(blob);
          }, "image/png");
        } catch {
          if (!isCleanedUp && onComplete) onComplete(null);
        }
      },
    });

    // Render loop
    const renderLoop = () => {
      if (isCleanedUp) return;
      particles.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderLoop);
    };
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      isCleanedUp = true;
      cancelAnimationFrame(rafId);
      tl?.kill();
      particles?.dispose();
      renderer?.dispose();
      if (renderer?.domElement?.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fileName, file, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between relative overflow-hidden select-none bg-slate-950 rounded-2xl">
      <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-display font-black text-sm text-amber-400 tracking-wider">
              HYDRAULIC CRUSHR MK-V
            </div>
            <div className="font-mono-tech text-[10px] text-slate-400 truncate max-w-[180px]">
              TARGET: {fileName || "document.pdf"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-2xl shadow-xl">
          <div className="relative w-9 h-9 rounded-full border-2 border-slate-600 bg-slate-950 flex items-center justify-center">
            <div
              ref={gaugeRef}
              className="absolute w-0.5 h-4 bg-red-500 origin-bottom rounded"
              style={{ transform: "rotate(-60deg)", bottom: "50%" }}
            />
            <div className="w-2 h-2 bg-amber-400 rounded-full z-10" />
          </div>
          <div className="text-[10px] font-mono-tech text-slate-300">
            <div className="text-amber-400 font-bold">PSI</div>
            <div ref={psiValueRef} className="text-white font-black text-sm tabular-nums">0</div>
          </div>
        </div>
      </div>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
