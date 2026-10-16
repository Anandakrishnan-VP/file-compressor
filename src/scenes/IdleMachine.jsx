import React from 'react';
import { Cog, ShieldAlert } from 'lucide-react';

export default function IdleMachine() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 select-none relative overflow-hidden">
      {/* Background industrial grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Center Idle Machine Chamber Graphic */}
      <div className="relative flex flex-col items-center mb-6">
        {/* Upper Hydraulic Gantry */}
        <div className="w-64 h-8 bg-slate-800 rounded-t-xl border-x-2 border-t-2 border-slate-600 flex items-center justify-around px-4 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-mono-tech text-[10px] text-amber-400 font-bold tracking-widest">
            CHAMBER IDLE • ARMED
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        </div>

        {/* Resting Piston Head & Hazard Beam */}
        <div className="w-56 h-6 hazard-stripes border-x-2 border-slate-700 shadow-inner" />

        {/* Empty Crushing Stage */}
        <div className="w-72 h-44 bg-slate-950/80 border-2 border-slate-700/80 rounded-b-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-2xl">
          {/* Subtle spinning gears in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <Cog size={120} className="animate-spin text-amber-500" style={{ animationDuration: '15s' }} />
          </div>

          {/* Pedestal with crosshairs */}
          <div className="w-28 h-6 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center shadow-md">
            <span className="text-[9px] font-mono-tech text-slate-400 tracking-wider font-semibold">
              TARGET ZONE
            </span>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-500/80 font-mono-tech">
            <ShieldAlert size={14} className="animate-pulse" />
            <span>STANDBY READY</span>
          </div>
        </div>
      </div>

      {/* Main Idle Prompt */}
      <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wider mb-2">
        Waiting for a victim...
      </h3>
      <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-sm">
        Select or drop a file in the left panel to load the execution chamber.
      </p>
    </div>
  );
}
