import React, { useEffect, useState } from 'react';
import { AlertCircle, Cpu } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function FakeProgressBar({ active = false, onComplete }) {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Hydraulic Pressure...');
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!active) {
      setPercent(0);
      setIsGlitching(false);
      setStatusText('Standby...');
      return;
    }

    let isMounted = true;
    let timer;

    // Sequence:
    // 0 -> 25 (0.5s)
    // 25 -> 70 (1.5s)
    // 70 -> 99 (2.5s)
    // At 99%: Hang for 1.2s -> Glitch & drop to 42%!
    // 42% -> 80 (4.5s)
    // 80 -> 100 (5.8s)

    const update = (p, text, glitch = false) => {
      if (!isMounted) return;
      setPercent(p);
      setStatusText(text);
      setIsGlitching(glitch);
    };

    update(15, 'Engaging primary destruction gears...');

    timer = setTimeout(() => {
      update(48, 'Squeezing redundant entropy...');
    }, 800);

    const t2 = setTimeout(() => {
      update(78, 'Applying severe algorithmic brutality...');
    }, 1800);

    const t3 = setTimeout(() => {
      update(99, 'Almost done! Preparing download...', false);
    }, 2800);

    const t4 = setTimeout(() => {
      // THE FAKE GLITCH AT 99%!
      soundEngine.playSiren();
      soundEngine.scream("WAIT STOP NO!");
      update(99, '⚠️ ERROR: QUANTUM RESISTANCE DETECTED! RECALIBRATING...', true);
    }, 3600);

    const t5 = setTimeout(() => {
      // JUMP BACK TO 42%!
      update(42, 'Emergency re-indexing: 42% Complete (Sorry)...', false);
    }, 4500);

    const t6 = setTimeout(() => {
      update(72, 'Re-crushing stubborn remaining bytes...');
    }, 5200);

    const t7 = setTimeout(() => {
      update(94, 'Finalizing structural compaction...');
    }, 5900);

    const t8 = setTimeout(() => {
      update(100, 'Obliteration Complete!', false);
      if (onComplete) onComplete();
    }, 6400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
    };
  }, [active]);

  return (
    <div className="w-full max-w-xl mx-auto my-3 px-4">
      <div className="flex justify-between items-center text-xs font-mono-tech mb-1.5">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Cpu size={13} className={active ? 'text-amber-400 animate-spin' : 'text-slate-500'} />
          <span className={isGlitching ? 'text-red-400 font-bold animate-pulse' : 'text-slate-300'}>
            {statusText}
          </span>
        </div>
        <span className={`font-bold ${isGlitching ? 'text-red-400' : 'text-amber-400'}`}>
          {Math.round(percent)}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="h-4 w-full bg-slate-900/90 rounded-full border border-slate-700/80 p-0.5 overflow-hidden shadow-inner relative">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out relative ${
            isGlitching
              ? 'hazard-stripes-danger animate-shaking'
              : 'hazard-stripes'
          }`}
          style={{ width: `${percent}%` }}
        >
          {/* Subtle glossy sheen */}
          <div className="absolute inset-0 bg-white/15 rounded-full" />
        </div>
      </div>

      {isGlitching && (
        <div className="flex items-center gap-1 text-[11px] font-mono-tech text-rose-400 mt-1 justify-center animate-bounce">
          <AlertCircle size={12} />
          <span>PARADOX DETECTED: PROGRESS REGRESSION INITIATED</span>
        </div>
      )}
    </div>
  );
}
