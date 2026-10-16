import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';
import { soundEngine } from '../utils/soundEngine';

/**
 * Creates a high-fidelity replica of a PDF document on an offscreen canvas.
 * Exactly renders an A4 page with Adobe-style badge, actual filename,
 * text lines, image placeholder, and realistic paper styling.
 */
export function createFileReplica(width = 240, height = 340, fileName = 'document.pdf') {
  const canvas = document.createElement('canvas');
  canvas.width = width * 2; // Retina 2x scale
  canvas.height = height * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // 1. Paper Base with subtle warmth & shadow
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [6, 6, 6, 6]);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 2. Top Red Adobe-style PDF Banner / Badge
  const badgeWidth = 42;
  const badgeHeight = 24;
  ctx.fillStyle = '#dc2626'; // Adobe Crimson
  ctx.beginPath();
  ctx.roundRect(16, 16, badgeWidth, badgeHeight, [4, 4, 4, 4]);
  ctx.fill();

  // "PDF" text inside badge
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PDF', 16 + badgeWidth / 2, 16 + badgeHeight / 2);

  // 3. Document Title Bar (with user's actual file name)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px Inter, sans-serif';
  
  // Truncate file name cleanly
  const maxTitleWidth = width - 85;
  let displayTitle = fileName || 'document.pdf';
  if (ctx.measureText(displayTitle).width > maxTitleWidth) {
    while (ctx.measureText(displayTitle + '...').width > maxTitleWidth && displayTitle.length > 0) {
      displayTitle = displayTitle.slice(0, -1);
    }
    displayTitle += '...';
  }
  ctx.fillText(displayTitle, 66, 26);

  // Subtitle / metadata
  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillText('Adobe Acrobat Document • A4 Standard', 66, 38);

  // Red accent divider
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(16, 48);
  ctx.lineTo(width - 16, 48);
  ctx.stroke();

  // 4. Headline Placeholder
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(16, 62, 110, 8);

  // 5. Paragraph Text Lines
  ctx.fillStyle = '#cbd5e1';
  const lines1 = [
    { w: width - 32, y: 78 },
    { w: width - 48, y: 88 },
    { w: width - 64, y: 98 },
    { w: width - 40, y: 108 },
  ];
  lines1.forEach(l => {
    ctx.beginPath();
    ctx.roundRect(16, l.y, l.w, 4, [2, 2, 2, 2]);
    ctx.fill();
  });

  // 6. Embedded Image / Chart Box
  const imgX = 16;
  const imgY = 124;
  const imgW = width - 32;
  const imgH = 82;
  
  // Image Box Background
  const grad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
  grad.addColorStop(0, '#f1f5f9');
  grad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(imgX, imgY, imgW, imgH, [4, 4, 4, 4]);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Image diagram graphics inside
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(imgX + 16, imgY + 45, 18, 26);
  ctx.fillStyle = '#818cf8';
  ctx.fillRect(imgX + 42, imgY + 32, 18, 39);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(imgX + 68, imgY + 20, 18, 51);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(imgX + 94, imgY + 38, 18, 33);

  // Chart axes
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(imgX + 10, imgY + 72);
  ctx.lineTo(imgX + imgW - 10, imgY + 72);
  ctx.stroke();

  // Image caption
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 8px Inter, sans-serif';
  ctx.fillText('Figure 1.1: Compression Metrics & Redundancy Distribution', imgX + 10, imgY + imgH + 12);

  // 7. Secondary Paragraph Lines (Two-column layout)
  const colW = (width - 40) / 2;
  ctx.fillStyle = '#cbd5e1';
  for (let i = 0; i < 5; i++) {
    // Left column
    ctx.beginPath();
    ctx.roundRect(16, 230 + i * 10, colW - (i % 2 === 0 ? 10 : 0), 4, [2, 2, 2, 2]);
    ctx.fill();
    // Right column
    ctx.beginPath();
    ctx.roundRect(16 + colW + 8, 230 + i * 10, colW - (i % 3 === 0 ? 15 : 0), 4, [2, 2, 2, 2]);
    ctx.fill();
  }

  // 8. Footer Bar
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(16, height - 24);
  ctx.lineTo(width - 16, height - 24);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '8px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('CRUSHR LABS • DESTRUCTION READY', 16, height - 12);
  ctx.textAlign = 'right';
  ctx.fillText('Page 1 of 1', width - 16, height - 12);

  return canvas;
}

/**
 * PDF Hydraulic Press Component
 * Features realistic physics slicing with Matter.js, slow pneumatic descent,
 * buckling, crease lines, explosive flattening, dust particles, and release aftermath.
 */
export default function HydraulicPress({ fileName = 'report.pdf', onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pressPistonRef = useRef(null);
  const pressHeadRef = useRef(null);
  const gaugeNeedleRef = useRef(null);

  useEffect(() => {
    let animId;
    let isCleanedUp = false;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Generate Realistic A4 PDF Texture Replica
    const docW = 200;
    const docH = 280;
    const replicaCanvas = createFileReplica(docW, docH, fileName);

    // 2. Setup Matter.js Physics Engine
    const { Engine, World, Bodies, Body } = Matter;
    const engine = Engine.create({
      gravity: { x: 0, y: 1.4, scale: 0.001 },
    });
    const world = engine.world;

    // Ground anvil at bottom
    const anvilY = height - 50;
    const anvilWidth = Math.min(width - 40, 480);
    const ground = Bodies.rectangle(width / 2, anvilY + 25, anvilWidth + 80, 50, {
      isStatic: true,
      friction: 0.8,
      restitution: 0.1,
    });
    // Side containment walls
    const leftWall = Bodies.rectangle(width / 2 - anvilWidth / 2 - 20, height / 2, 40, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width / 2 + anvilWidth / 2 + 20, height / 2, 40, height, { isStatic: true });
    World.add(world, [ground, leftWall, rightWall]);

    // 3. Slice Document into 36 Fragments (6 cols x 6 rows)
    const cols = 6;
    const rows = 6;
    const pieceW = docW / cols;
    const pieceH = docH / rows;
    const fragments = [];

    const startX = (width - docW) / 2;
    const startY = anvilY - docH;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const posX = startX + c * pieceW + pieceW / 2;
        const posY = startY + r * pieceH + pieceH / 2;
        
        const body = Bodies.rectangle(posX, posY, pieceW, pieceH, {
          isStatic: true, // Static initially, unlocked on impact
          friction: 0.7,
          restitution: 0.15,
          frictionAir: 0.06,
        });

        fragments.push({
          body,
          c,
          r,
          sx: c * (replicaCanvas.width / cols),
          sy: r * (replicaCanvas.height / rows),
          sw: replicaCanvas.width / cols,
          sh: replicaCanvas.height / rows,
          w: pieceW,
          h: pieceH,
          unlocked: false,
        });

        World.add(world, body);
      }
    }

    // 4. Dynamic Particle System (Dust & Ink Splatters)
    const particles = [];
    function spawnPuff(x, y, count = 25, isInk = false) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed * (isInk ? 1.5 : 1),
          vy: Math.sin(angle) * speed - (isInk ? 1 : 2),
          size: Math.random() * (isInk ? 4 : 5) + 1.5,
          color: isInk
            ? (Math.random() > 0.5 ? '#dc2626' : '#0284c7')
            : (Math.random() > 0.5 ? '#f8fafc' : '#cbd5e1'),
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
        });
      }
    }

    // Crease lines that appear when buckling under compression
    const creaseLines = [];
    function generateCreases() {
      for (let i = 0; i < 7; i++) {
        creaseLines.push({
          x1: startX + Math.random() * docW * 0.2,
          y1: startY + (i + 0.5) * (docH / 7) + (Math.random() - 0.5) * 15,
          x2: startX + docW - Math.random() * docW * 0.2,
          y2: startY + (i + 0.5) * (docH / 7) + (Math.random() - 0.5) * 15,
          alpha: 0,
        });
      }
    }
    generateCreases();

    // 5. Setup Master Timeline with GSAP
    const masterTL = gsap.timeline();
    const pistonState = {
      y: 0, // 0 = at top resting, 1 = touching page top, 2 = fully compressed to slab
      pressure: 0, // 0 to 100 for gauge needle
      slabCrush: 1, // vertical scale of page before explosion
      creaseOpacity: 0,
      opacity: 1,
    };

    // Piston coordinates
    const pistonTravelMax = anvilY - 18; // Bottom resting height of press plate
    const initialPistonY = 40;

    // AUDIO: Start hydraulic pump hiss at t=0
    soundEngine.playHydraulicHiss();

    // ACT 1: Slow pneumatic descent (0s to 2.2s)
    masterTL.to(pistonState, {
      y: 0.65,
      pressure: 35,
      duration: 2.0,
      ease: 'power1.inOut',
      onUpdate: () => {
        // Gauge needle rotates
        if (gaugeNeedleRef.current) {
          gaugeNeedleRef.current.style.transform = `rotate(${-60 + pistonState.pressure * 1.8}deg)`;
        }
      },
    });

    // Page starts crinkling under approaching pressure (1.6s to 2.2s)
    masterTL.to(pistonState, {
      creaseOpacity: 0.85,
      duration: 0.6,
      ease: 'power2.in',
    }, '-=0.6');

    // ACT 2: MASSIVE CRUSHING SLAM (t = 2.2s to 3.0s)
    masterTL.to(pistonState, {
      y: 1.0,
      pressure: 100,
      slabCrush: 0.08,
      duration: 0.45,
      ease: 'power3.in',
      onStart: () => {
        // Sound sync: HEAVY CRUNCH & IMPACT
        soundEngine.playCrunch();

        // Screen shake
        gsap.to(container, {
          x: 'random(-10, 10)',
          y: 'random(-8, 8)',
          duration: 0.04,
          repeat: 12,
          yoyo: true,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.set(container, { x: 0, y: 0 });
          },
        });

        // Dust & Ink explosions out the sides
        spawnPuff(startX, anvilY - 10, 30, false);
        spawnPuff(startX + docW, anvilY - 10, 30, false);
        spawnPuff(startX + docW * 0.3, anvilY - 10, 20, true);
        spawnPuff(startX + docW * 0.7, anvilY - 10, 20, true);

        // UNLOCK MATTER.JS BODIES: Outer fragments fly, central fragments compress
        fragments.forEach((frag) => {
          Body.setStatic(frag.body, false);
          frag.unlocked = true;

          // Outward radial explosive force
          const centerDistX = frag.body.position.x - (width / 2);
          const isEdge = Math.abs(centerDistX) > docW * 0.28 || frag.r === 0 || frag.r === rows - 1;

          if (isEdge) {
            Body.setVelocity(frag.body, {
              x: (centerDistX / (docW / 2)) * (Math.random() * 12 + 6),
              y: -Math.random() * 8 - 2,
            });
            Body.setAngularVelocity(frag.body, (Math.random() - 0.5) * 0.4);
          } else {
            // Flattened down against anvil
            Body.setPosition(frag.body, {
              x: frag.body.position.x + (Math.random() - 0.5) * 20,
              y: anvilY - 4 + (Math.random() - 0.5) * 4,
            });
            Body.setVelocity(frag.body, {
              x: (Math.random() - 0.5) * 3,
              y: 0,
            });
          }
        });
      },
      onUpdate: () => {
        if (gaugeNeedleRef.current) {
          gaugeNeedleRef.current.style.transform = `rotate(${-60 + pistonState.pressure * 1.8}deg)`;
        }
      },
    });

    // Hold at maximum tonnage for 1.2 seconds (t = 2.65s to 3.85s)
    masterTL.to(pistonState, {
      duration: 1.2,
      onStart: () => {
        // Lingering secondary puffs
        spawnPuff(width / 2, anvilY - 8, 12, false);
      },
    });

    // ACT 3: Pressure Release & Retraction (t = 3.85s to 5.4s)
    masterTL.to(pistonState, {
      y: 0.15, // Retracts up
      pressure: 0,
      duration: 1.6,
      ease: 'power2.out',
      onStart: () => {
        soundEngine.playHydraulicHiss(); // Pressure relief hiss
      },
      onUpdate: () => {
        if (gaugeNeedleRef.current) {
          gaugeNeedleRef.current.style.transform = `rotate(${-60 + pistonState.pressure * 1.8}deg)`;
        }
      },
    });

    // Reveal flattened paper slab on anvil, then fade out debris
    masterTL.to(pistonState, {
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      onComplete: () => {
        if (!isCleanedUp && onComplete) {
          onComplete();
        }
      },
    });

    // 6. 60 FPS Render Loop (Canvas + Matter.js World)
    const renderLoop = () => {
      if (isCleanedUp) return;

      Engine.update(engine, 1000 / 60);

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = pistonState.opacity;

      // Draw Anvil / Base Bed
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(width / 2 - anvilWidth / 2, anvilY, anvilWidth, 50, [6, 6, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Anvil bed grooved slots & warning hazard plate
      ctx.fillStyle = '#334155';
      for (let gx = width / 2 - anvilWidth / 2 + 30; gx < width / 2 + anvilWidth / 2 - 30; gx += 40) {
        ctx.fillRect(gx, anvilY + 6, 12, 4);
      }

      // Draw Ground Shadow under anvil
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(width / 2 - anvilWidth / 2 - 10, anvilY + 48, anvilWidth + 20, 10);

      // Current Piston Y position in pixels
      const currentPlateY = initialPistonY + pistonState.y * (pistonTravelMax - initialPistonY);

      // Draw Piston Chrome Cylinder & Hydraulic Rods
      const rodW = 20;
      const rodH = currentPlateY;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(width / 2 - 70, 0, rodW, rodH);
      ctx.fillRect(width / 2 + 50, 0, rodW, rodH);

      // Chrome highlight on rods
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(width / 2 - 66, 0, 4, rodH);
      ctx.fillRect(width / 2 + 54, 0, 4, rodH);

      // Draw Hydraulic Press Foot Plate
      const plateW = anvilWidth - 40;
      const plateH = 34;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(width / 2 - plateW / 2, currentPlateY, plateW, plateH, [4, 4, 8, 8]);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Yellow/Black Hazard Strip on Press Foot
      const stripeW = 12;
      ctx.save();
      ctx.beginPath();
      ctx.rect(width / 2 - plateW / 2 + 8, currentPlateY + 8, plateW - 16, 14);
      ctx.clip();
      for (let sx = width / 2 - plateW / 2; sx < width / 2 + plateW / 2 + 40; sx += stripeW * 2) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(sx, currentPlateY + 8);
        ctx.lineTo(sx + stripeW, currentPlateY + 8);
        ctx.lineTo(sx + stripeW - 8, currentPlateY + 22);
        ctx.lineTo(sx - 8, currentPlateY + 22);
        ctx.fill();
      }
      ctx.restore();

      // Draw Document Fragments or Intact Buckling Document
      fragments.forEach((frag) => {
        ctx.save();
        ctx.translate(frag.body.position.x, frag.body.position.y);
        ctx.rotate(frag.body.angle);

        if (!frag.unlocked) {
          // While locked under initial descent, apply vertical squashing
          ctx.scale(1, pistonState.slabCrush);
        }

        // Draw the sliced texture piece from the replica canvas
        ctx.drawImage(
          replicaCanvas,
          frag.sx,
          frag.sy,
          frag.sw,
          frag.sh,
          -frag.w / 2,
          -frag.h / 2,
          frag.w,
          frag.h
        );

        ctx.restore();
      });

      // Draw Crease Lines during paper buckling (before full shatter)
      if (pistonState.creaseOpacity > 0 && pistonState.slabCrush > 0.4) {
        ctx.save();
        ctx.strokeStyle = `rgba(15, 23, 42, ${pistonState.creaseOpacity})`;
        ctx.lineWidth = 1.5;
        creaseLines.forEach((c) => {
          ctx.beginPath();
          ctx.moveTo(c.x1, c.y1);
          ctx.lineTo(c.x2, c.y2);
          ctx.stroke();
        });
        ctx.restore();
      }

      // Draw Debris & Dust Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha * pistonState.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    // Cleanup on unmount
    return () => {
      isCleanedUp = true;
      cancelAnimationFrame(animId);
      masterTL.kill();
      World.clear(world, false);
      Engine.clear(engine);
    };
  }, [fileName, onComplete]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-between relative overflow-hidden select-none bg-slate-950/70 rounded-2xl"
    >
      {/* Top Industrial Header & Pressure Gauge */}
      <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏭</span>
          <div>
            <div className="font-display font-black text-sm text-amber-400 tracking-wider">
              HYDRAULIC CRUSHR MK-V
            </div>
            <div className="font-mono-tech text-[10px] text-slate-400">
              TARGET: {fileName || 'document.pdf'}
            </div>
          </div>
        </div>

        {/* Analog Pressure Gauge */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-2xl shadow-xl">
          <div className="relative w-8 h-8 rounded-full border-2 border-slate-600 bg-slate-950 flex items-center justify-center">
            {/* Needle */}
            <div
              ref={gaugeNeedleRef}
              className="absolute w-0.5 h-3.5 bg-red-500 origin-bottom rounded transition-transform duration-75"
              style={{ transform: 'rotate(-60deg)', bottom: '50%' }}
            />
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full z-10" />
          </div>
          <div className="text-[10px] font-mono-tech text-slate-300">
            <span className="font-bold text-amber-400">PSI x1000</span>
          </div>
        </div>
      </div>

      {/* Primary 60FPS Matter.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
