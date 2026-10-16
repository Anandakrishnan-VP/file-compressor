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
      const speed = 0.04 + Math.random() * 0.1;
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.particles.push({
        mesh, mat,
        vx: Math.cos(angle) * Math.cos(elev) * speed,
        vy: Math.abs(Math.sin(elev)) * speed + 0.015,
        vz: Math.sin(angle) * Math.cos(elev) * speed * 0.5,
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
        this.particles.splice(i, 1);
      }
    }
  }
  dispose() {
    this.particles.forEach(p => { this.scene.remove(p.mesh); p.mat.dispose(); });
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

    // Three.js bootstrap
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d13);
    camera = new THREE.PerspectiveCamera(35, W / H, 0.01, 100);
    camera.position.set(0, 0, 8.5);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffd0a0, 2.5);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x7eceff, 0.8);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    // Anvil bed
    const anvil = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 0.35, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.5 })
    );
    anvil.position.set(0, -2.2, 0);
    anvil.receiveShadow = true;
    scene.add(anvil);

    // Hazard stripe on anvil
    const stripesMesh = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.06, 1.9),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
    );
    stripesMesh.position.set(0, -2.02, 0);
    scene.add(stripesMesh);

    // Press plate (starts above)
    const pressPlate = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.28, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.85 })
    );
    pressPlate.position.set(0, 4.5, 0);
    pressPlate.castShadow = true;
    scene.add(pressPlate);

    // Hazard stripe on press plate
    const plateStripe = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.05, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    plateStripe.position.set(0, 0.17, 0);
    pressPlate.add(plateStripe);

    // Hydraulic rods
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.9 });
    [-1.5, 1.5].forEach(x => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 12, 16), rodMat);
      rod.position.set(x, 0, 0);
      scene.add(rod);
    });

    // Paper group -- starts off-right
    const paperGrp = new THREE.Group();
    paperGrp.position.set(8, -0.65, 0);
    scene.add(paperGrp);

    // Paper mesh (subdivided for deformation)
    const W_SEGS = 30;
    const H_SEGS = 40;
    const paperGeo = new THREE.PlaneGeometry(2.2, 3.0, W_SEGS, H_SEGS);
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, side: THREE.DoubleSide, roughness: 0.7 });
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.castShadow = true;
    paperGrp.add(paperMesh);

    // Store original Y positions for deformation
    const origPos = Float32Array.from(paperGeo.attributes.position.array);

    // Crease lines
    const creaseMaterials = [];
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.LineBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0 });
      creaseMaterials.push(mat);
      const yOff = -1.5 + i * 0.43 + (Math.random() - 0.5) * 0.1;
      const pts = [
        new THREE.Vector3(-1.1 + Math.random() * 0.2, yOff, 0.015),
        new THREE.Vector3(1.1 - Math.random() * 0.2, yOff + (Math.random() - 0.5) * 0.15, 0.015),
      ];
      paperGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }

    particles = new ParticleSystem(scene);

    // Load real PDF texture async
    const fileObj = file instanceof File ? file : null;
    loadPdfTexture(fileObj, 600, 848).then(texCanvas => {
      if (isCleanedUp) return;
      const tex = new THREE.CanvasTexture(texCanvas);
      tex.needsUpdate = true;
      paperMesh.material = new THREE.MeshStandardMaterial({
        map: tex,
        side: THREE.DoubleSide,
        roughness: 0.7,
      });
    });

    // Deform paper vertices: squashAmt in [0,1], buckleAmt in [0,1]
    function deformPaper(squashAmt, buckleAmt) {
      const pos = paperGeo.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const origY = origPos[i * 3 + 1];
        const normY = (origY + 1.5) / 3.0; // 0=bottom 1=top
        const newY = origY * (1 - squashAmt * 0.92);
        let newZ = 0;
        if (buckleAmt > 0) {
          // Random buckle peaks near center rows
          const mid = Math.sin(normY * Math.PI);
          newZ = origPos[i * 3 + 2] + (Math.random() - 0.5) * buckleAmt * mid * 0.3;
        }
        pos.setY(i, newY);
        pos.setZ(i, origPos[i * 3 + 2] * (1 - buckleAmt) + newZ * buckleAmt);
      }
      pos.needsUpdate = true;
      paperGeo.computeVertexNormals();
    }

    // GSAP state
    const state = {
      paperX: 8,
      plateY: 4.5,
      pressure: 0,
      squash: 0,
      buckle: 0,
      creaseAlpha: 0,
    };

    soundEngine.init?.();

    tl = gsap.timeline();

    // Phase 1: slide paper in (0-1s)
    tl.to(state, {
      paperX: 0,
      duration: 1.0,
      ease: "power2.out",
      onUpdate: () => { paperGrp.position.x = state.paperX; },
    });

    // Phase 2: slow descent + hiss (1-3.2s)
    tl.to(state, {
      plateY: 0.35,
      pressure: 35,
      duration: 2.2,
      ease: "power1.inOut",
      onStart: () => { soundEngine.playHydraulicHiss?.(); },
      onUpdate: () => {
        pressPlate.position.y = state.plateY;
        if (gaugeRef.current)
          gaugeRef.current.style.transform = `rotate(${-60 + state.pressure * 1.8}deg)`;
        if (psiValueRef.current)
          psiValueRef.current.textContent = Math.round(state.pressure * 28);
      },
    });

    // Phase 2b: creases appear (overlap -0.8s)
    tl.to(state, {
      creaseAlpha: 0.9,
      duration: 0.8,
      ease: "power2.in",
      onUpdate: () => {
        creaseMaterials.forEach(m => { m.opacity = state.creaseAlpha; });
      },
    }, "-=0.8");

    // Phase 3: SLAM (3.2-3.65s)
    tl.to(state, {
      plateY: -1.88,
      pressure: 100,
      squash: 1.0,
      buckle: 1.0,
      duration: 0.45,
      ease: "power4.in",
      onStart: () => {
        soundEngine.playCrunch?.();
        gsap.to(camera.position, {
          x: "random(-0.18, 0.18)",
          y: "random(-0.12, 0.12)",
          duration: 0.04,
          repeat: 16,
          yoyo: true,
          ease: "none",
          onComplete: () => camera.position.set(0, 0, 8.5),
        });
        particles.spawn(-1.1, -2.0, 0.6, 40, 0xf8fafc);
        particles.spawn(1.1, -2.0, 0.6, 40, 0xf8fafc);
        particles.spawn(-0.5, -2.0, 0.6, 25, 0xdc2626);
        particles.spawn(0.5, -2.0, 0.6, 25, 0x0284c7);
      },
      onUpdate: () => {
        pressPlate.position.y = state.plateY;
        if (gaugeRef.current)
          gaugeRef.current.style.transform = `rotate(${-60 + state.pressure * 1.8}deg)`;
        if (psiValueRef.current)
          psiValueRef.current.textContent = Math.round(state.pressure * 28);
        deformPaper(state.squash, state.buckle);
      },
    });

    // Phase 4: hold (3.65-4.85s)
    tl.to(state, {
      duration: 1.2,
      onStart: () => { particles.spawn(0, -2.0, 0.6, 20, 0xe2e8f0); },
    });

    // Phase 5: retract (4.85-6.45s)
    tl.to(state, {
      plateY: 4.5,
      pressure: 0,
      duration: 1.6,
      ease: "power2.out",
      onStart: () => { soundEngine.playHydraulicHiss?.(); },
      onUpdate: () => {
        pressPlate.position.y = state.plateY;
        if (gaugeRef.current)
          gaugeRef.current.style.transform = `rotate(${-60 + state.pressure * 1.8}deg)`;
        if (psiValueRef.current)
          psiValueRef.current.textContent = Math.round(state.pressure * 28);
      },
    });

    // Phase 6: linger + capture (6.45-7.5s)
    tl.to(state, {
      duration: 1.0,
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
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fileName, file, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between relative overflow-hidden select-none bg-slate-950 rounded-2xl">
      <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl">??</span>
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
