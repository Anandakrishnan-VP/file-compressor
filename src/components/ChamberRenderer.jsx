import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';

export default function ChamberRenderer({
  chamber,
  file,
  pain = 0,
  isCrushing = false,
  isMercyPaused = false,
}) {
  const [frame, setFrame] = useState(0);
  const [screamText, setScreamText] = useState('');
  const [matryoshkaLevel, setMatryoshkaLevel] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  // Trigger sound effects and screaming during compression cycle
  useEffect(() => {
    if (!isCrushing || isMercyPaused) return;

    let soundTimer;
    let screamTimer;

    // Pick a scream quote
    if (chamber.screams && chamber.screams.length > 0) {
      const scream = chamber.screams[Math.floor(Math.random() * chamber.screams.length)];
      setScreamText(scream);
      screamTimer = setTimeout(() => {
        soundEngine.scream(scream);
      }, 600);
    }

    // Play chamber-specific sound sequence
    switch (chamber.id) {
      case 'HydraulicPress':
        soundEngine.playHydraulicHiss();
        soundTimer = setTimeout(() => {
          soundEngine.playCrunch();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
        }, 1800);
        break;

      case 'ElephantStomp':
        soundTimer = setTimeout(() => {
          soundEngine.playElephantStomp();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 800);
        }, 1600);
        break;

      case 'WreckingBall':
        soundEngine.playWreckingBall();
        soundTimer = setTimeout(() => {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }, 2100);
        break;

      case 'RocketLaunch':
        soundEngine.playRocketLaunch();
        break;

      case 'Juicer':
        soundEngine.playJuicer();
        break;

      case 'TrashCompactor':
        soundEngine.playTrashCompactor();
        soundTimer = setTimeout(() => {
          soundEngine.playCrunch();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
        }, 2200);
        break;

      case 'Steamroller':
        soundEngine.playSteamroller();
        soundTimer = setTimeout(() => {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
        }, 1800);
        break;

      case 'BugZapper':
        soundEngine.playBugZapper();
        break;

      case 'Shredder':
        soundEngine.playShredder();
        soundTimer = setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#ffffff', '#cbd5e1', '#94a3b8'],
          });
        }, 1500);
        break;

      case 'Matryoshka':
        [0.8, 1.8, 2.8, 3.8].forEach((sec, idx) => {
          setTimeout(() => {
            soundEngine.playMatryoshkaSmash(idx + 1);
            setMatryoshkaLevel(idx + 1);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 300);
          }, sec * 1000);
        });
        break;

      case 'Pinata':
        soundTimer = setTimeout(() => {
          soundEngine.playPinataWhack();
          setIsShaking(true);
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.5 },
          });
          setTimeout(() => setIsShaking(false), 500);
        }, 1800);
        break;

      case 'BlackHole':
        soundEngine.playBlackHole();
        break;

      case 'Volcano':
        soundEngine.playVolcano();
        soundTimer = setTimeout(() => {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 800);
        }, 1900);
        break;

      case 'Tweezers':
        soundEngine.playTweezers();
        break;

      default:
        soundEngine.playCrunch();
        break;
    }

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(screamTimer);
      setIsShaking(false);
    };
  }, [isCrushing, isMercyPaused, chamber.id]);

  // Frame tick for custom physics animations
  useEffect(() => {
    let animId;
    const tick = () => {
      setFrame((f) => (f + 1) % 360);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const fileName = file ? file.name : 'unknown_target.bin';

  return (
    <div
      className={`relative w-full h-[380px] bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center select-none ${
        isShaking ? 'animate-shake-brutal' : ''
      }`}
    >
      {/* Chamber Header Overlay */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{chamber.icon}</span>
          <div>
            <div className="font-display font-bold text-sm tracking-wider text-amber-400">
              {chamber.machineTitle}
            </div>
            <div className="text-[10px] font-mono-tech text-slate-400">
              {chamber.subtitle}
            </div>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded bg-black/60 border border-slate-700/80 text-[10px] font-mono-tech text-amber-300">
          CHAMBER: {chamber.id.toUpperCase()}
        </div>
      </div>

      {/* Scream Speech Bubble */}
      {isCrushing && screamText && (
        <div className="absolute top-16 z-40 bg-red-950/90 border border-red-500 text-red-200 px-3 py-1.5 rounded-xl font-mono-tech text-xs shadow-xl animate-bounce">
          <span className="text-red-400 font-bold">FILE SCREAM:</span> "{screamText}"
        </div>
      )}

      {/* SCENE RENDERING BASED ON CHAMBER ID */}
      <div className="relative w-full h-full flex items-center justify-center pt-8">
        {chamber.id === 'HydraulicPress' && (
          <HydraulicPressScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'ElephantStomp' && (
          <ElephantStompScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
          />
        )}

        {chamber.id === 'WreckingBall' && (
          <WreckingBallScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'RocketLaunch' && (
          <RocketLaunchScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'Juicer' && (
          <JuicerScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'TrashCompactor' && (
          <TrashCompactorScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
          />
        )}

        {chamber.id === 'Steamroller' && (
          <SteamrollerScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'BugZapper' && (
          <BugZapperScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'Shredder' && (
          <ShredderScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
          />
        )}

        {chamber.id === 'Matryoshka' && (
          <MatryoshkaScene
            pain={pain}
            level={matryoshkaLevel}
            fileName={fileName}
          />
        )}

        {chamber.id === 'Pinata' && (
          <PinataScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'BlackHole' && (
          <BlackHoleScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'Volcano' && (
          <VolcanoScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}

        {chamber.id === 'Tweezers' && (
          <TweezersScene
            pain={pain}
            isCrushing={isCrushing}
            fileName={fileName}
            frame={frame}
          />
        )}
      </div>

      {/* Bottom Subtitle / Funny Caption */}
      <div className="absolute bottom-3 text-center px-4 z-20">
        <span className="font-mono-tech text-xs text-slate-400 italic">
          "{chamber.caption}"
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 1: HYDRAULIC PRESS
   ========================================================================= */
function HydraulicPressScene({ pain, isCrushing, fileName }) {
  // Piston descends based on pain (0% -> top, 100% -> crushed against anvil)
  const pistonTravel = Math.min(135, (pain / 100) * 135);
  const fileSquashY = Math.max(0.12, 1 - (pain / 100) * 0.88);
  const fileSpreadX = 1 + (pain / 100) * 0.9;

  return (
    <div className="relative w-72 h-64 flex flex-col items-center justify-between">
      {/* Top Hydraulic Gantry & Cylinder */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-56 h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 rounded-t border-b border-amber-500/40 shadow-lg flex items-center justify-around px-4">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600" />
          <div className="text-[9px] font-mono-tech text-amber-400 tracking-widest font-bold">
            HYDRAULIC FORCE 50T
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600" />
        </div>

        {/* Dual Chrome Pistons */}
        <div
          className="relative flex justify-center gap-16 transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${pistonTravel}px)` }}
        >
          {/* Piston Rod 1 */}
          <div className="w-4 h-24 bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-md border-x border-slate-500" />
          {/* Piston Rod 2 */}
          <div className="w-4 h-24 bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-md border-x border-slate-500" />

          {/* Heavy Press Foot Plate */}
          <div className="absolute -bottom-5 w-44 h-8 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded border-2 border-slate-600 shadow-2xl flex items-center justify-center">
            <div className="w-36 h-2 hazard-stripes rounded-sm opacity-90" />
          </div>

          {/* Steam Vents */}
          {isCrushing && pain > 50 && (
            <>
              <div className="absolute -top-3 left-4 w-3 h-3 bg-white/60 rounded-full blur-xs animate-ping" />
              <div className="absolute -top-3 right-4 w-3 h-3 bg-white/60 rounded-full blur-xs animate-ping" />
            </>
          )}
        </div>
      </div>

      {/* Target File on Anvil */}
      <div className="relative z-0 flex flex-col items-center mt-auto mb-6">
        {/* Terified File Icon */}
        <div
          className="w-20 h-24 bg-red-600 rounded-lg shadow-xl border-2 border-red-400 flex flex-col items-center justify-center text-white relative transition-all duration-100 ease-out"
          style={{
            transform: `scale(${fileSpreadX}, ${fileSquashY})`,
            transformOrigin: 'bottom center',
          }}
        >
          <span className="font-display font-extrabold text-sm tracking-wider">PDF</span>
          {/* Googly Nervous Eyes */}
          <div className="flex gap-2 my-1">
            <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
            </div>
            <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
            </div>
          </div>
          <span className="text-[9px] font-mono-tech truncate max-w-[65px] px-1 opacity-80">
            {fileName}
          </span>

          {/* Cyan Ink Splatter on Impact */}
          {pain > 70 && (
            <div className="absolute -bottom-2 -left-4 w-8 h-4 bg-cyan-400 rounded-full blur-[1px] opacity-80" />
          )}
        </div>

        {/* Heavy Steel Anvil Base */}
        <div className="w-56 h-8 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 rounded-b border-t-2 border-slate-600 shadow-2xl flex items-center justify-center mt-1">
          <span className="text-[9px] font-mono-tech text-slate-500 font-bold tracking-widest">
            TITAN ANVIL BED
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 2: ELEPHANT STOMP
   ========================================================================= */
function ElephantStompScene({ pain, fileName }) {
  const footTravel = Math.min(140, (pain / 100) * 140);
  const docSquash = Math.max(0.15, 1 - (pain / 100) * 0.85);

  return (
    <div className="relative w-80 h-64 flex flex-col items-center justify-between overflow-hidden">
      {/* Clippy Cameo begging for mercy */}
      <div className="absolute top-2 right-4 z-20 flex items-center gap-1.5 bg-slate-800/90 border border-blue-400/50 px-2.5 py-1 rounded-xl shadow-lg">
        <span className="text-xl">📎</span>
        <div className="text-[10px] font-sans text-blue-200">
          <p className="font-bold">Clippy:</p>
          <p>"It looks like you're dying!"</p>
        </div>
      </div>

      {/* Giant Elephant Leg & Foot */}
      <div
        className="absolute top-0 z-10 flex flex-col items-center transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${footTravel - 130}px)` }}
      >
        {/* Grey Wrinkly Elephant Leg */}
        <div className="w-32 h-44 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-600 rounded-t-xl border-x-4 border-slate-700 relative shadow-2xl">
          {/* Wrinkle lines */}
          <div className="w-full h-1 bg-slate-600/40 my-6" />
          <div className="w-full h-1 bg-slate-600/40 my-6" />
          <div className="w-full h-1 bg-slate-600/40 my-6" />
        </div>
        {/* Elephant Foot & Toenails */}
        <div className="w-40 h-14 bg-slate-600 rounded-b-3xl border-4 border-slate-700 flex items-end justify-around px-3 pb-1 shadow-2xl">
          <div className="w-7 h-5 bg-stone-200 rounded-t-full border border-stone-400" />
          <div className="w-8 h-6 bg-stone-200 rounded-t-full border border-stone-400" />
          <div className="w-7 h-5 bg-stone-200 rounded-t-full border border-stone-400" />
        </div>
      </div>

      {/* Word Document */}
      <div className="relative mt-auto mb-3 flex flex-col items-center">
        <div
          className="w-24 h-28 bg-blue-600 rounded-lg border-2 border-blue-300 shadow-xl flex flex-col items-center justify-center text-white transition-all duration-100"
          style={{
            transform: `scale(${1 + (pain / 100) * 0.7}, ${docSquash})`,
            transformOrigin: 'bottom center',
          }}
        >
          <span className="font-display font-extrabold text-lg">DOCX</span>
          <div className="w-16 h-1 bg-white/40 my-1" />
          <div className="w-12 h-1 bg-white/40" />
          <span className="text-[9px] font-mono-tech mt-2 truncate max-w-[70px]">{fileName}</span>
        </div>

        {/* Dust Puffs when Stomping */}
        {pain > 60 && (
          <div className="absolute -bottom-2 flex gap-12 pointer-events-none">
            <div className="w-10 h-6 bg-stone-500/50 rounded-full blur-sm animate-ping" />
            <div className="w-10 h-6 bg-stone-500/50 rounded-full blur-sm animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 3: WRECKING BALL
   ========================================================================= */
function WreckingBallScene({ pain, fileName, frame }) {
  // Pendulum swing angle
  const swingAngle = Math.sin(frame * 0.08) * (40 - (pain / 100) * 15);
  const cellShatter = pain > 60;

  return (
    <div className="relative w-80 h-64 flex items-center justify-between px-6">
      {/* Crane Anchor & Chain Pendulum */}
      <div className="relative -top-10 left-4 flex flex-col items-center">
        <div className="w-8 h-4 bg-amber-600 rounded-t border border-amber-400" />
        {/* Chain links */}
        <div
          className="origin-top flex flex-col items-center transition-transform"
          style={{ transform: `rotate(${swingAngle}deg)` }}
        >
          <div className="w-1.5 h-28 bg-gradient-to-b from-stone-400 to-stone-600 border border-stone-700" />
          {/* Spiked Heavy Wrecking Ball */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stone-400 via-stone-700 to-black border-2 border-stone-500 shadow-2xl flex items-center justify-center relative">
            <span className="text-xl">💣</span>
          </div>
        </div>
      </div>

      {/* Excel Spreadsheet Matrix */}
      <div className="relative flex flex-col items-center">
        <div
          className={`w-32 h-36 bg-emerald-800 rounded-xl border-2 border-emerald-400 p-2 shadow-2xl flex flex-col justify-between transition-all ${
            cellShatter ? 'rotate-12 translate-x-4 opacity-75' : ''
          }`}
        >
          <div className="font-display font-extrabold text-emerald-200 text-sm">EXCEL.XLSX</div>
          {/* Cell Grid */}
          <div className="grid grid-cols-2 gap-1 text-[9px] font-mono-tech">
            <div className="bg-emerald-950/80 p-1 border border-emerald-700 rounded text-center">
              {cellShatter ? '#REF!' : 'A1: 42'}
            </div>
            <div className="bg-emerald-950/80 p-1 border border-emerald-700 rounded text-center">
              {cellShatter ? '#DIV/0!' : 'B1: 99'}
            </div>
            <div className="bg-emerald-950/80 p-1 border border-emerald-700 rounded text-center">
              {cellShatter ? '#VALUE!' : 'C1: SUM'}
            </div>
            <div className="bg-emerald-950/80 p-1 border border-emerald-700 rounded text-center">
              {cellShatter ? '💥' : 'OK'}
            </div>
          </div>
          <span className="text-[9px] font-mono-tech text-emerald-300 truncate">{fileName}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 4: ROCKET LAUNCH
   ========================================================================= */
function RocketLaunchScene({ pain, fileName, frame }) {
  const isBlastOff = pain > 45;
  const altitude = isBlastOff ? (pain - 45) * 6 : 0;

  return (
    <div className="relative w-80 h-64 flex flex-col items-center justify-end overflow-hidden pb-4">
      {/* Rocket strapped to PowerPoint slide */}
      <div
        className="relative z-10 flex flex-col items-center transition-transform duration-200"
        style={{ transform: `translateY(-${altitude}px)` }}
      >
        {/* ACME Rocket Body */}
        <div className="w-14 h-24 bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-t-full border-2 border-red-300 shadow-2xl flex flex-col items-center justify-between py-2 relative">
          <div className="w-4 h-4 rounded-full bg-cyan-300 border border-white mt-1 shadow-inner" />
          <span className="text-[8px] font-mono-tech text-white font-bold">ACME-9K</span>
          {/* Strapped PowerPoint presentation */}
          <div className="absolute inset-x-[-12px] top-6 h-12 bg-amber-600 border border-amber-300 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
            <span>PPTX</span>
          </div>
        </div>

        {/* Thruster Plume & Exhaust Flame */}
        {isBlastOff && (
          <div className="flex flex-col items-center -mt-1">
            <div className="w-6 h-12 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent rounded-b-full animate-pulse" />
            <div className="w-16 h-8 bg-white/40 rounded-full blur-md -mt-4 animate-ping" />
          </div>
        )}
      </div>

      {/* Launch Pad Base */}
      <div className="w-48 h-6 bg-slate-800 rounded-t-lg border-t-2 border-amber-500 flex items-center justify-center">
        <span className="text-[9px] font-mono-tech text-slate-400">GANTRY PAD 39-A</span>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 5: PIXEL JUICER
   ========================================================================= */
function JuicerScene({ pain, fileName, frame }) {
  return (
    <div className="relative w-72 h-64 flex items-center justify-center">
      {/* Industrial Blender Pitcher */}
      <div className="w-40 h-52 bg-cyan-950/40 rounded-2xl border-2 border-cyan-400/60 backdrop-blur-sm relative flex flex-col items-center justify-between p-3 overflow-hidden shadow-2xl">
        {/* Top Lid */}
        <div className="w-36 h-4 bg-slate-700 rounded-t-lg border border-slate-500 -mt-2" />

        {/* Swirling Pixel Slurry & Image */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 border border-white flex items-center justify-center text-white font-bold text-xs shadow-lg transition-transform"
            style={{
              transform: `rotate(${frame * 12}deg) scale(${Math.max(0.2, 1 - pain / 100)})`,
            }}
          >
            IMG
          </div>

          {/* Flying Pixel Particles */}
          {pain > 20 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 bg-red-400 rounded-sm animate-ping" style={{ transform: 'translate(25px, -15px)' }} />
              <div className="w-2.5 h-2.5 bg-green-400 rounded-sm animate-ping" style={{ transform: 'translate(-25px, 20px)' }} />
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm animate-ping" style={{ transform: 'translate(10px, 30px)' }} />
            </div>
          )}
        </div>

        {/* Spinning Stainless Steel Blades */}
        <div
          className="w-24 h-4 bg-slate-300 rounded border border-slate-600 shadow-md transition-transform"
          style={{ transform: `rotate(${frame * 24}deg)` }}
        />

        {/* Juice Spigot at Bottom */}
        <div className="w-full flex justify-center -mb-2">
          <div className="w-4 h-5 bg-slate-600 border border-slate-400" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 6: TRASH COMPACTOR
   ========================================================================= */
function TrashCompactorScene({ pain, fileName }) {
  // Walls close in from sides (0 -> 50px inward)
  const wallSqueeze = Math.min(65, (pain / 100) * 65);

  return (
    <div className="relative w-80 h-64 flex items-center justify-between px-2 overflow-hidden bg-slate-900/50 rounded-xl border border-slate-800">
      {/* Left Compactor Bulkhead */}
      <div
        className="w-20 h-52 bg-slate-800 rounded-r-xl border-r-4 border-amber-500 shadow-2xl flex flex-col justify-around p-2 transition-transform duration-100"
        style={{ transform: `translateX(${wallSqueeze}px)` }}
      >
        <div className="w-full h-2 hazard-stripes" />
        <div className="w-full h-2 hazard-stripes" />
        <div className="w-full h-2 hazard-stripes" />
      </div>

      {/* Trapped Video Film Reel */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-500 flex items-center justify-center text-white shadow-2xl transition-all duration-100"
          style={{
            transform: `scale(${Math.max(0.2, 1 - (pain / 100) * 0.8)}, 1)`,
          }}
        >
          <span className="text-2xl">🎬</span>
        </div>
        <span className="text-[10px] font-mono-tech text-purple-300 mt-2 truncate max-w-[80px]">
          {fileName}
        </span>
      </div>

      {/* Right Compactor Bulkhead */}
      <div
        className="w-20 h-52 bg-slate-800 rounded-l-xl border-l-4 border-amber-500 shadow-2xl flex flex-col justify-around p-2 transition-transform duration-100"
        style={{ transform: `translateX(-${wallSqueeze}px)` }}
      >
        <div className="w-full h-2 hazard-stripes" />
        <div className="w-full h-2 hazard-stripes" />
        <div className="w-full h-2 hazard-stripes" />
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 7: STEAMROLLER
   ========================================================================= */
function SteamrollerScene({ pain, fileName, frame }) {
  const rollerX = (pain / 100) * 160;

  return (
    <div className="relative w-80 h-64 flex flex-col justify-end pb-8 overflow-hidden">
      {/* Audio Waveform Equalizer */}
      <div className="relative flex items-end justify-center gap-1.5 h-24 mb-4">
        {[20, 45, 80, 60, 95, 75, 40, 90, 30].map((h, i) => {
          const isFlattened = rollerX > i * 18;
          return (
            <div
              key={i}
              className={`w-3.5 rounded-t transition-all duration-200 ${
                isFlattened ? 'h-1 bg-red-500' : 'bg-amber-400'
              }`}
              style={{ height: isFlattened ? '3px' : `${h}%` }}
            />
          );
        })}
      </div>

      {/* Steamroller Drum */}
      <div
        className="absolute bottom-8 left-4 transition-transform duration-100 ease-out z-10"
        style={{ transform: `translateX(${rollerX}px)` }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-600 via-yellow-500 to-amber-300 border-4 border-stone-800 shadow-2xl flex items-center justify-center relative">
          <div className="w-8 h-8 rounded-full bg-stone-900 border-2 border-stone-600" />
          <div className="absolute inset-0 border-4 border-dashed border-stone-900/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 8: BUG ZAPPER
   ========================================================================= */
function BugZapperScene({ pain, fileName, frame }) {
  return (
    <div className="relative w-72 h-64 flex items-center justify-center">
      {/* High-Voltage Bug Zapper Lantern */}
      <div className="w-44 h-56 rounded-3xl bg-slate-900 border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex flex-col items-center justify-around p-3 relative overflow-hidden">
        {/* UV Glowing Core */}
        <div className="absolute inset-4 bg-cyan-500/20 rounded-2xl blur-md" />

        {/* Electric Grid Bars */}
        <div className="flex justify-around w-full h-full relative z-10">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div key={bar} className="w-1 h-full bg-cyan-300/80 shadow-[0_0_8px_#06b6d4]" />
          ))}
        </div>

        {/* Trapped Code Syntax & Bugs */}
        <div className="absolute z-20 flex flex-col items-center">
          <span className="text-3xl animate-bounce">🐛</span>
          <div className="font-mono-tech text-xs text-cyan-200 bg-black/80 px-2 py-0.5 rounded border border-cyan-500 mt-1">
            {pain > 50 ? 'ERR: DEAD_LOCK' : 'syntax_err;'}
          </div>
        </div>

        {/* Electric Sparks */}
        {pain > 30 && (
          <div className="absolute z-30 text-amber-300 font-bold text-lg animate-ping">
            ⚡
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 9: SHREDDER
   ========================================================================= */
function ShredderScene({ pain, fileName }) {
  const paperDescent = Math.min(60, (pain / 100) * 60);

  return (
    <div className="relative w-72 h-64 flex flex-col items-center justify-center">
      {/* Shredder Intake Mouth */}
      <div className="w-56 h-12 bg-slate-800 rounded-t-xl border-t-2 border-slate-600 shadow-xl flex items-center justify-center relative z-20">
        <div className="w-48 h-2 bg-black rounded border border-slate-700" />
      </div>

      {/* Entering Document */}
      <div
        className="w-40 h-32 bg-slate-100 text-slate-800 rounded shadow-md p-2 flex flex-col justify-between -mt-8 z-10 transition-transform duration-100"
        style={{ transform: `translateY(${paperDescent}px)` }}
      >
        <div className="text-[10px] font-mono-tech font-bold text-red-600">CONFIDENTIAL</div>
        <div className="space-y-1">
          <div className="h-1 bg-slate-300 w-full" />
          <div className="h-1 bg-slate-300 w-3/4" />
          <div className="h-1 bg-slate-300 w-5/6" />
        </div>
        <span className="text-[9px] font-mono-tech truncate">{fileName}</span>
      </div>

      {/* Shredded Strips Output */}
      <div className="w-48 flex justify-between gap-1 overflow-hidden h-20 -mt-2 z-0">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <div
            key={s}
            className="w-3 bg-slate-200 border-x border-slate-400 rounded-b"
            style={{
              height: `${Math.min(100, pain * 1.2)}%`,
              transition: 'height 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 10: MATRYOSHKA SMASH
   ========================================================================= */
function MatryoshkaScene({ pain, level, fileName }) {
  const sizes = ['w-36 h-44 text-4xl', 'w-28 h-36 text-3xl', 'w-20 h-28 text-2xl', 'w-14 h-20 text-xl', 'w-8 h-12 text-xs'];
  const currentSize = sizes[Math.min(4, level)] || sizes[0];

  return (
    <div className="relative w-72 h-64 flex flex-col items-center justify-center">
      <div className="text-xs font-mono-tech text-pink-400 mb-2">
        RECURSION LEVEL: {level + 1} / 5
      </div>
      <div
        className={`${currentSize} bg-pink-700 rounded-2xl border-4 border-pink-400 shadow-2xl flex flex-col items-center justify-center text-white transition-all duration-300`}
      >
        <span>🪆</span>
        <span className="text-[8px] font-mono-tech mt-1">ZIP</span>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 11: PIÑATA
   ========================================================================= */
function PinataScene({ pain, fileName, frame }) {
  const swing = Math.sin(frame * 0.1) * 20;

  return (
    <div className="relative w-72 h-64 flex flex-col items-center justify-between py-4">
      {/* Hanging Piñata */}
      <div
        className="flex flex-col items-center origin-top transition-transform"
        style={{ transform: `rotate(${swing}deg)` }}
      >
        <div className="w-1 h-16 bg-slate-500" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-4 border-emerald-300 shadow-2xl flex items-center justify-center text-3xl relative">
          <span>💣</span>
          {pain > 50 && (
            <div className="absolute text-xs font-mono-tech text-amber-300 font-bold animate-ping">
              0101!
            </div>
          )}
        </div>
      </div>

      {/* Baseball Bat */}
      <div
        className="w-4 h-32 bg-amber-700 rounded-full border border-amber-900 shadow-xl transition-transform"
        style={{
          transform: pain > 60 ? 'rotate(-60deg) translate(-20px, -40px)' : 'rotate(30deg)',
        }}
      />
    </div>
  );
}

/* =========================================================================
   SCENE 12: BLACK HOLE
   ========================================================================= */
function BlackHoleScene({ pain, fileName, frame }) {
  return (
    <div className="relative w-72 h-64 flex items-center justify-center overflow-hidden">
      {/* Accretion Disk Swirl */}
      <div
        className="w-48 h-48 rounded-full border-8 border-violet-600/40 border-t-amber-400 border-r-violet-500 shadow-[0_0_60px_rgba(139,92,246,0.6)] flex items-center justify-center transition-transform"
        style={{ transform: `rotate(${frame * 4}deg)` }}
      >
        {/* Event Horizon Pitch Black Core */}
        <div className="w-28 h-28 rounded-full bg-black border-4 border-violet-900 shadow-inner flex items-center justify-center">
          {/* File getting spaghettified */}
          <div
            className="text-white font-mono-tech text-xs bg-violet-900/60 px-2 py-1 rounded transition-all duration-300"
            style={{
              transform: `scale(${Math.max(0.05, 1 - pain / 100)}) rotate(${frame * 8}deg)`,
            }}
          >
            {fileName}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 13: VOLCANO
   ========================================================================= */
function VolcanoScene({ pain, fileName, frame }) {
  const fileDescent = Math.min(90, (pain / 100) * 90);

  return (
    <div className="relative w-80 h-64 flex flex-col justify-end items-center overflow-hidden">
      {/* Sacrificial File Falling */}
      <div
        className="relative z-10 w-24 h-24 bg-orange-700 rounded-xl border-2 border-orange-400 shadow-2xl flex flex-col items-center justify-center text-white transition-transform duration-100"
        style={{
          transform: `translateY(${fileDescent}px) scale(${Math.max(0.3, 1 - pain / 120)})`,
        }}
      >
        <span className="text-2xl">📦</span>
        <span className="text-[9px] font-mono-tech mt-1 truncate max-w-[70px]">{fileName}</span>
      </div>

      {/* Volcano Caldera & Bubbling Magma */}
      <div className="w-full h-24 bg-gradient-to-t from-red-950 via-stone-900 to-stone-800 rounded-t-3xl border-t-4 border-orange-600 flex items-center justify-around px-4 relative z-20">
        <div className="w-12 h-6 bg-orange-500 rounded-full blur-xs animate-bounce" />
        <div className="w-16 h-8 bg-red-500 rounded-full blur-xs animate-pulse" />
        <div className="w-10 h-5 bg-yellow-400 rounded-full blur-xs animate-bounce" />
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 14: QUANTUM TWEEZERS
   ========================================================================= */
function TweezersScene({ pain, fileName }) {
  const tweezerY = Math.min(70, (pain / 100) * 70);

  return (
    <div className="relative w-72 h-64 flex flex-col items-center justify-between py-6">
      {/* Microscope Reticle Crosshairs */}
      <div className="absolute inset-4 border border-teal-500/20 rounded-full flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-teal-500/30" />
        <div className="h-full w-[1px] bg-teal-500/30 absolute" />
      </div>

      {/* Titanium Tweezers Tips */}
      <div
        className="relative z-10 flex gap-4 transition-transform duration-100"
        style={{ transform: `translateY(${tweezerY}px)` }}
      >
        <div className="w-2 h-28 bg-gradient-to-b from-stone-400 to-teal-300 rounded-b rotate-6 shadow-md" />
        <div className="w-2 h-28 bg-gradient-to-b from-stone-400 to-teal-300 rounded-b -rotate-6 shadow-md" />
      </div>

      {/* Single Lonely Byte */}
      <div className="relative z-0 bg-teal-950 border border-teal-400 px-3 py-1.5 rounded-lg text-teal-300 font-mono-tech text-xs shadow-lg">
        01000001 (1 Byte)
      </div>
    </div>
  );
}
