import React from 'react';

export default function BlackHole({ fileName, progress = 0 }) {
  const rotation = progress * 14;
  const fileScale = Math.max(0.04, 1 - (progress / 100) * 0.96);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* File Badge */}
      <div className="absolute top-4 z-30 bg-slate-900 border border-violet-500/50 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
        <span>📁</span>
        <span className="text-xs font-mono-tech text-violet-300 font-bold truncate max-w-[140px]">
          {fileName || 'mystery_file.bin'}
        </span>
      </div>

      {/* Swirling Gravitational Accretion Disk */}
      <div
        className="w-64 h-64 rounded-full border-8 border-violet-600/40 border-t-amber-400 border-r-violet-500 shadow-[0_0_80px_rgba(139,92,246,0.5)] flex items-center justify-center transition-transform"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Pitch Black Singularity Event Horizon */}
        <div className="w-40 h-40 rounded-full bg-black border-4 border-violet-900 shadow-inner flex items-center justify-center">
          {/* File getting spaghettified into the void */}
          <div
            className="text-white font-mono-tech text-xs bg-violet-900/80 px-2.5 py-1.5 rounded-lg border border-violet-400/50 transition-all duration-150 flex items-center gap-1.5"
            style={{
              transform: `scale(${fileScale}) rotate(${rotation * 2}deg)`,
            }}
          >
            <span>📁</span>
            <span className="truncate max-w-[70px]">{fileName || 'unknown'}</span>
          </div>
        </div>
      </div>

      <span className="text-[10px] font-mono-tech text-violet-400 mt-4">
        "We don't know what this is. Into the void."
      </span>
    </div>
  );
}
