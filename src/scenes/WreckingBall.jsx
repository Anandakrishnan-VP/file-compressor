import React from 'react';

export default function WreckingBall({ fileName, progress = 0 }) {
  // Swings in from left, strikes at ~40%
  const swing = Math.sin((progress / 100) * Math.PI * 4) * (45 - (progress / 100) * 20);
  const isShattered = progress > 35;

  return (
    <div className="w-full h-full flex items-center justify-between p-8 select-none relative overflow-hidden">
      {/* Crane Anchor & Pendulum Chain */}
      <div className="relative -top-12 left-4 flex flex-col items-center z-20">
        <div className="w-12 h-6 bg-amber-600 rounded-t border-2 border-amber-400" />
        <div
          className="origin-top flex flex-col items-center transition-transform"
          style={{ transform: `rotate(${swing}deg)` }}
        >
          <div className="w-2 h-36 bg-gradient-to-b from-stone-400 to-stone-600 border border-stone-700" />
          {/* Spiked Heavy Steel Wrecking Ball */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-400 via-stone-700 to-black border-2 border-stone-500 shadow-2xl flex items-center justify-center text-3xl">
            💣
          </div>
        </div>
      </div>

      {/* Excel Spreadsheet Matrix */}
      <div className="relative flex flex-col items-center z-10 mr-8">
        <div
          className={`w-44 h-48 bg-emerald-800 rounded-2xl border-2 border-emerald-400 p-3 shadow-2xl flex flex-col justify-between transition-all duration-300 ${
            isShattered ? 'rotate-12 translate-x-6 opacity-75 scale-90' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-display font-black text-emerald-200 text-sm">XLSX</span>
            <span className="text-[10px] font-mono-tech text-emerald-400">
              {isShattered ? '💥 COLLAPSED' : 'CALCULATING'}
            </span>
          </div>

          {/* Cell Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono-tech">
            <div className="bg-emerald-950 p-1.5 border border-emerald-600 rounded text-center font-bold text-emerald-300">
              {isShattered ? '#REF!' : 'A1: 42'}
            </div>
            <div className="bg-emerald-950 p-1.5 border border-emerald-600 rounded text-center font-bold text-emerald-300">
              {isShattered ? '#DIV/0!' : 'B1: 99'}
            </div>
            <div className="bg-emerald-950 p-1.5 border border-emerald-600 rounded text-center font-bold text-emerald-300">
              {isShattered ? '#VALUE!' : 'C1: SUM'}
            </div>
            <div className="bg-emerald-950 p-1.5 border border-emerald-600 rounded text-center font-bold text-emerald-300">
              {isShattered ? '💥 #NULL!' : 'D1: OK'}
            </div>
          </div>

          <span className="text-[10px] font-mono-tech text-emerald-300 truncate bg-emerald-950/70 px-2 py-0.5 rounded">
            {fileName || 'data.xlsx'}
          </span>
        </div>
      </div>
    </div>
  );
}
