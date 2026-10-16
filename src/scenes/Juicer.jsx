import React from 'react';

export default function Juicer({ fileName, progress = 0 }) {
  const isJuicing = progress > 20;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Industrial Blender Pitcher */}
      <div className="w-52 h-64 bg-cyan-950/40 rounded-3xl border-2 border-cyan-400/80 backdrop-blur-md relative flex flex-col items-center justify-between p-4 overflow-hidden shadow-2xl">
        {/* Top Lid */}
        <div className="w-44 h-5 bg-slate-700 rounded-t-xl border border-slate-500 -mt-2" />

        {/* Swirling Image & Pixels */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 border-2 border-white flex flex-col items-center justify-center text-white font-extrabold text-xs shadow-xl transition-all duration-150"
            style={{
              transform: `scale(${Math.max(0.2, 1 - (progress / 100) * 0.8)}) rotate(${progress * 18}deg)`,
            }}
          >
            <span>IMG</span>
            <span className="text-[8px] font-mono-tech truncate max-w-[65px] px-1">
              {fileName || 'photo.png'}
            </span>
          </div>

          {/* Flying Pixel Droplets */}
          {isJuicing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3 h-3 bg-red-400 rounded-sm animate-ping" style={{ transform: 'translate(35px, -20px)' }} />
              <div className="w-3 h-3 bg-green-400 rounded-sm animate-ping" style={{ transform: 'translate(-35px, 25px)' }} />
              <div className="w-3 h-3 bg-blue-400 rounded-sm animate-ping" style={{ transform: 'translate(20px, 40px)' }} />
            </div>
          )}
        </div>

        {/* High-speed Spinning Blades */}
        <div
          className="w-32 h-5 bg-slate-200 rounded border-2 border-slate-600 shadow-lg"
          style={{ transform: `rotate(${progress * 36}deg)` }}
        />

        {/* Squeezed Pixel Juice Spigot */}
        <div className="w-full flex justify-center -mb-3">
          <div className="w-5 h-6 bg-slate-600 border border-slate-400 rounded-b" />
        </div>
      </div>

      {/* Fresh Pixel Juice Beaker below */}
      <div className="w-28 h-14 bg-gradient-to-t from-pink-500/80 via-purple-500/60 to-transparent rounded-b-2xl border-2 border-cyan-400/60 mt-1 flex items-center justify-center shadow-lg">
        <span className="text-[9px] font-mono-tech text-white font-bold tracking-wider">
          PIXEL JUICE 100%
        </span>
      </div>
    </div>
  );
}
