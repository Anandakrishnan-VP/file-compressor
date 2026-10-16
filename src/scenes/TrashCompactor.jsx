import React from 'react';

export default function TrashCompactor({ fileName, progress = 0 }) {
  // Walls close in from left and right
  const squeeze = Math.min(85, (progress / 100) * 85);
  const squishReel = Math.max(0.18, 1 - (progress / 100) * 0.82);

  return (
    <div className="w-full h-full flex items-center justify-between p-4 select-none relative overflow-hidden bg-slate-950/60 rounded-2xl border border-slate-800">
      {/* Left Compactor Bulkhead */}
      <div
        className="w-28 h-64 bg-slate-800 rounded-r-2xl border-r-4 border-amber-500 shadow-2xl flex flex-col justify-around p-3 transition-transform duration-100 z-20"
        style={{ transform: `translateX(${squeeze}px)` }}
      >
        <div className="w-full h-3 hazard-stripes rounded" />
        <div className="w-full h-3 hazard-stripes rounded" />
        <div className="w-full h-3 hazard-stripes rounded" />
      </div>

      {/* Trapped Video Film Reel */}
      <div className="relative flex flex-col items-center z-10">
        <div
          className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-500 shadow-2xl flex flex-col items-center justify-center text-white transition-transform duration-100"
          style={{ transform: `scale(${squishReel}, 1)` }}
        >
          <span className="text-4xl">🎬</span>
          <span className="text-[10px] font-mono-tech mt-1 font-bold text-amber-400">
            4K VIDEO
          </span>
        </div>

        <span className="text-[11px] font-mono-tech text-purple-300 mt-3 truncate max-w-[120px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
          {fileName || 'movie.mp4'}
        </span>
      </div>

      {/* Right Compactor Bulkhead */}
      <div
        className="w-28 h-64 bg-slate-800 rounded-l-2xl border-l-4 border-amber-500 shadow-2xl flex flex-col justify-around p-3 transition-transform duration-100 z-20"
        style={{ transform: `translateX(-${squeeze}px)` }}
      >
        <div className="w-full h-3 hazard-stripes rounded" />
        <div className="w-full h-3 hazard-stripes rounded" />
        <div className="w-full h-3 hazard-stripes rounded" />
      </div>
    </div>
  );
}
