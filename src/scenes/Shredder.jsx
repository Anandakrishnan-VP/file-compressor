import React from 'react';

export default function Shredder({ fileName, progress = 0 }) {
  const paperDescent = Math.min(80, (progress / 100) * 80);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* File Badge */}
      <div className="absolute top-4 z-30 bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
        <span>📄</span>
        <span className="text-xs font-mono-tech text-amber-300 font-bold truncate max-w-[140px]">
          {fileName || 'notes.txt'}
        </span>
      </div>

      {/* Shredder Intake Mouth */}
      <div className="w-64 h-14 bg-slate-800 rounded-t-2xl border-t-2 border-slate-600 shadow-2xl flex items-center justify-center relative z-20">
        <div className="w-56 h-2.5 bg-black rounded border border-slate-700" />
      </div>

      {/* Entering Document Getting Pulled Down */}
      <div
        className="w-48 h-40 bg-slate-100 text-slate-800 rounded-lg shadow-xl p-3 flex flex-col justify-between -mt-10 z-10 transition-transform duration-100"
        style={{ transform: `translateY(${paperDescent}px)` }}
      >
        <div className="text-[10px] font-mono-tech font-bold text-red-600 tracking-wider">
          CLASSIFIED • SHRED
        </div>
        <div className="space-y-1.5">
          <div className="h-1 bg-slate-300 w-full" />
          <div className="h-1 bg-slate-300 w-3/4" />
          <div className="h-1 bg-slate-300 w-5/6" />
        </div>
        <span className="text-[9px] font-mono-tech truncate text-slate-500">
          {fileName || 'notes.txt'}
        </span>
      </div>

      {/* Shredded Confetti Strips Output */}
      <div className="w-56 flex justify-between gap-1 overflow-hidden h-24 -mt-2 z-0">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
          <div
            key={s}
            className="w-3 bg-slate-200 border-x border-slate-400 rounded-b transition-all duration-150"
            style={{
              height: `${Math.min(100, progress * 1.2)}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
