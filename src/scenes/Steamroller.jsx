import React from 'react';

export default function Steamroller({ fileName, progress = 0 }) {
  // Steamroller drum advances from left to right across the scene
  const rollerX = (progress / 100) * 220;

  return (
    <div className="w-full h-full flex flex-col justify-end p-8 select-none relative overflow-hidden">
      {/* Target Audio File Badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
        <span>🎵</span>
        <span className="text-xs font-mono-tech text-amber-300 font-bold truncate max-w-[140px]">
          {fileName || 'audio.mp3'}
        </span>
      </div>

      {/* Pulsing Audio Waveform / Equalizer Bars */}
      <div className="relative flex items-end justify-center gap-2 h-32 mb-6">
        {[25, 60, 95, 70, 100, 80, 45, 90, 40, 65, 30].map((h, i) => {
          const isFlattened = rollerX > i * 18;
          return (
            <div
              key={i}
              className={`w-4 rounded-t transition-all duration-200 ${
                isFlattened ? 'h-1 bg-red-500 shadow-[0_0_6px_#ef4444]' : 'bg-amber-400'
              }`}
              style={{ height: isFlattened ? '3px' : `${h}%` }}
            />
          );
        })}
      </div>

      {/* Industrial Steamroller Drum */}
      <div
        className="absolute bottom-8 left-4 transition-transform duration-100 ease-out z-30"
        style={{ transform: `translateX(${rollerX}px)` }}
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-600 via-yellow-500 to-amber-300 border-4 border-stone-800 shadow-2xl flex items-center justify-center relative">
          <div className="w-10 h-10 rounded-full bg-stone-900 border-2 border-stone-600" />
          <div className="absolute inset-0 border-4 border-dashed border-stone-900/50 rounded-full" />
        </div>
      </div>

      {/* Road / Asphalt Floor */}
      <div className="w-full h-6 bg-slate-800 rounded border-t-2 border-stone-600 flex items-center justify-center">
        <span className="text-[9px] font-mono-tech text-slate-500">BASS REMOVAL ZONE</span>
      </div>
    </div>
  );
}
