import React from 'react';

export default function BugZapper({ fileName, progress = 0 }) {
  const isZapping = progress > 25;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* File Badge */}
      <div className="absolute top-4 z-30 bg-slate-900 border border-cyan-500/50 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
        <span>💻</span>
        <span className="text-xs font-mono-tech text-cyan-300 font-bold truncate max-w-[140px]">
          {fileName || 'code.js'}
        </span>
      </div>

      {/* 50,000V High-Voltage Bug Zapper Lantern */}
      <div className="w-56 h-72 rounded-3xl bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(6,182,212,0.4)] flex flex-col items-center justify-around p-4 relative overflow-hidden">
        {/* UV Glowing Background Core */}
        <div className="absolute inset-4 bg-cyan-500/20 rounded-2xl blur-lg pointer-events-none" />

        {/* Electric Grid Vertical Bars */}
        <div className="flex justify-around w-full h-full relative z-10">
          {[1, 2, 3, 4, 5, 6].map((bar) => (
            <div key={bar} className="w-1.5 h-full bg-cyan-300 shadow-[0_0_10px_#06b6d4]" />
          ))}
        </div>

        {/* Floating Code & Bug Target */}
        <div className="absolute z-20 flex flex-col items-center">
          <span className="text-4xl animate-bounce">🐛</span>
          <div className="font-mono-tech text-xs text-cyan-200 bg-black/90 px-2.5 py-1 rounded border border-cyan-500 mt-2 shadow-lg">
            {isZapping ? 'FATAL: NULL_PTR;' : 'function solve() { ; }'}
          </div>
        </div>

        {/* Electric Sparks */}
        {isZapping && (
          <div className="absolute z-30 text-amber-300 font-bold text-3xl animate-ping pointer-events-none">
            ⚡
          </div>
        )}
      </div>

      <span className="text-[10px] font-mono-tech text-cyan-400 mt-3">
        "Fixed all bugs by deleting everything."
      </span>
    </div>
  );
}
