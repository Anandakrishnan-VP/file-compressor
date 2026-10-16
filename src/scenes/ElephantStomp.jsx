import React from 'react';

export default function ElephantStomp({ fileName, progress = 0 }) {
  const travel = Math.min(160, (progress / 100) * 160);
  const isStomp = progress > 35;
  const squash = isStomp ? Math.max(0.15, 1 - ((progress - 35) / 40) * 0.85) : 1;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 select-none relative overflow-hidden">
      {/* Clippy Cameo begging for mercy */}
      <div className="absolute top-4 right-6 z-30 flex items-center gap-2 bg-slate-900/95 border border-blue-400/60 p-2.5 rounded-2xl shadow-xl animate-bounce">
        <span className="text-2xl">📎</span>
        <div className="text-left font-sans text-[11px] text-blue-200">
          <p className="font-bold text-blue-400">Clippy:</p>
          <p>"It looks like you're trying to survive!"</p>
        </div>
      </div>

      {/* Giant Elephant Leg & Foot descending from top */}
      <div
        className="absolute top-0 z-20 flex flex-col items-center transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${travel - 150}px)` }}
      >
        {/* Grey Wrinkly Elephant Leg */}
        <div className="w-44 h-56 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-600 rounded-t-2xl border-x-4 border-slate-700 relative shadow-2xl">
          <div className="w-full h-1 bg-slate-600/40 my-8" />
          <div className="w-full h-1 bg-slate-600/40 my-8" />
          <div className="w-full h-1 bg-slate-600/40 my-8" />
        </div>

        {/* Massive Foot & Toenails */}
        <div className="w-52 h-16 bg-slate-600 rounded-b-3xl border-4 border-slate-700 flex items-end justify-around px-4 pb-1 shadow-2xl">
          <div className="w-9 h-6 bg-stone-200 rounded-t-full border border-stone-400" />
          <div className="w-10 h-7 bg-stone-200 rounded-t-full border border-stone-400" />
          <div className="w-9 h-6 bg-stone-200 rounded-t-full border border-stone-400" />
        </div>
      </div>

      {/* Target Word Document on Floor */}
      <div className="relative z-10 mt-auto mb-4 flex flex-col items-center">
        <div
          className="w-28 h-36 bg-blue-600 rounded-xl border-2 border-blue-300 shadow-2xl flex flex-col items-center justify-between p-3 text-white transition-transform duration-100 origin-bottom"
          style={{
            transform: `scale(${1 + (progress / 100) * 0.8}, ${squash})`,
          }}
        >
          <span className="font-display font-extrabold text-base tracking-wider">DOCX</span>
          <div className="space-y-1.5 w-full px-2">
            <div className="h-1 bg-white/40 rounded w-full" />
            <div className="h-1 bg-white/40 rounded w-3/4" />
            <div className="h-1 bg-white/40 rounded w-5/6" />
          </div>
          <span className="text-[10px] font-mono-tech truncate max-w-[90px] bg-blue-950/60 px-1.5 py-0.5 rounded">
            {fileName || 'document.docx'}
          </span>
        </div>

        {/* Dust Puffs when Stomping */}
        {isStomp && (
          <div className="absolute -bottom-3 flex gap-16 pointer-events-none">
            <div className="w-16 h-8 bg-stone-500/60 rounded-full blur-md animate-ping" />
            <div className="w-16 h-8 bg-stone-500/60 rounded-full blur-md animate-ping" />
          </div>
        )}

        <div className="w-80 h-4 bg-slate-800 rounded-full mt-2 border border-slate-700" />
      </div>
    </div>
  );
}
