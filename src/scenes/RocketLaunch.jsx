import React from 'react';

export default function RocketLaunch({ fileName, progress = 0 }) {
  const isBlastOff = progress > 30;
  const isReturn = progress > 75;
  const altitude = isBlastOff && !isReturn ? (progress - 30) * 12 : 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-end p-8 select-none relative overflow-hidden">
      {/* Returning Tiny Pellet with Parachute */}
      {isReturn && (
        <div className="absolute top-12 z-30 flex flex-col items-center animate-bounce">
          <div className="w-16 h-8 border-t-4 border-amber-400 rounded-t-full bg-amber-400/20" />
          <div className="w-0.5 h-6 bg-slate-400" />
          <div className="w-5 h-5 bg-black border border-amber-400 rounded-full flex items-center justify-center text-[8px] font-bold text-amber-400">
            PPT
          </div>
          <span className="text-[9px] font-mono-tech text-amber-300 mt-1">
            Tiny Pellet Returned!
          </span>
        </div>
      )}

      {/* ACME Rocket Launching Presentation into Space */}
      {!isReturn && (
        <div
          className="relative z-20 flex flex-col items-center transition-transform duration-150"
          style={{ transform: `translateY(-${altitude}px)` }}
        >
          {/* Rocket Fuselage */}
          <div className="w-16 h-32 bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-t-full border-2 border-red-300 shadow-2xl flex flex-col items-center justify-between py-2 relative">
            <div className="w-5 h-5 rounded-full bg-cyan-300 border-2 border-white shadow-inner" />
            <span className="text-[9px] font-mono-tech font-extrabold text-white">ACME-PPT</span>

            {/* Strapped PowerPoint Slides */}
            <div className="absolute inset-x-[-14px] top-10 h-14 bg-amber-600 border border-amber-300 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-lg p-1">
              <span>PPTX SLIDES</span>
              <span className="text-[8px] font-mono-tech truncate max-w-[80px]">
                {fileName || 'slides.pptx'}
              </span>
            </div>
          </div>

          {/* Exhaust Flame & Smoke */}
          {isBlastOff && (
            <div className="flex flex-col items-center -mt-2 pointer-events-none">
              <div className="w-8 h-20 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent rounded-b-full animate-pulse" />
              <div className="w-24 h-10 bg-white/40 rounded-full blur-md -mt-6 animate-ping" />
            </div>
          )}
        </div>
      )}

      {/* Launch Pad Base */}
      <div className="w-64 h-8 bg-slate-800 rounded-t-xl border-t-2 border-amber-500 flex items-center justify-center shadow-lg relative z-10">
        <span className="text-[10px] font-mono-tech text-slate-400 font-bold tracking-widest">
          LAUNCH GANTRY 39-A
        </span>
      </div>
    </div>
  );
}
