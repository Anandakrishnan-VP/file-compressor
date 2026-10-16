import React from 'react';

export default function Matryoshka({ fileName, progress = 0 }) {
  // Determine recursion level 1 to 5 based on progress
  const level = Math.min(4, Math.floor((progress / 100) * 5));
  const sizes = [
    'w-40 h-52 text-5xl',
    'w-32 h-40 text-4xl',
    'w-24 h-32 text-3xl',
    'w-16 h-24 text-2xl',
    'w-10 h-16 text-sm',
  ];
  const currentSize = sizes[level] || sizes[0];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* File Badge */}
      <div className="absolute top-4 z-30 bg-slate-900 border border-pink-500/50 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
        <span>📦</span>
        <span className="text-xs font-mono-tech text-pink-300 font-bold truncate max-w-[140px]">
          {fileName || 'archive.zip'}
        </span>
      </div>

      <div className="text-xs font-mono-tech text-pink-400 mb-4 font-bold tracking-widest">
        RECURSION LEVEL: {level + 1} / 5
      </div>

      {/* Sledgehammer Strike effect */}
      <div className="absolute top-16 text-3xl animate-bounce">
        🔨
      </div>

      {/* Russian Doll Zip Box */}
      <div
        className={`${currentSize} bg-pink-700 rounded-3xl border-4 border-pink-400 shadow-2xl flex flex-col items-center justify-center text-white transition-all duration-300 relative`}
      >
        <span>🪆</span>
        <span className="text-[10px] font-mono-tech mt-1 font-bold">ZIP</span>
      </div>
    </div>
  );
}
