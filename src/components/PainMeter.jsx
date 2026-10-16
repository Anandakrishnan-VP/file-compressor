import React, { useMemo } from 'react';
import { Flame, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function PainMeter({ value = 0, isCrushing = false }) {
  // Clamped 0-100
  const pain = Math.min(100, Math.max(0, value));

  // Needle angle (-90deg at 0% to +90deg at 100%)
  const needleRotation = useMemo(() => {
    const base = -90 + (pain / 100) * 180;
    // Add jitter if crushing
    const jitter = isCrushing ? (Math.random() - 0.5) * 6 : 0;
    return base + jitter;
  }, [pain, isCrushing]);

  const getStatus = (v) => {
    if (v < 25) return { label: 'MILD APPREHENSION', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' };
    if (v < 55) return { label: 'BYTE COERCION', color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/10' };
    if (v < 85) return { label: 'STRUCTURAL TEARING', color: 'text-orange-400', border: 'border-orange-500/40', bg: 'bg-orange-500/10' };
    if (v < 99) return { label: 'MOLECULAR AGONY', color: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10' };
    return { label: 'ABSOLUTE ATOMIZATION', color: 'text-red-500', border: 'border-red-600', bg: 'bg-red-500/20' };
  };

  const status = getStatus(pain);

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col items-center border border-amber-500/20 relative overflow-hidden w-full max-w-xs shadow-2xl">
      {/* Background Warning Glow if pain is high */}
      {pain > 75 && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-display tracking-wider text-amber-400">
          <Flame size={14} className={pain > 60 ? 'text-red-500 animate-bounce' : 'text-amber-400'} />
          <span>PAIN METER 9000</span>
        </div>
        <div className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-slate-700">
          SUFFERING INDEX
        </div>
      </div>

      {/* Analog Semi-Circle Gauge */}
      <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
        {/* SVG Arc Gauge */}
        <svg viewBox="0 0 200 115" className="w-full h-full drop-shadow-md">
          {/* Arc Background Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="painGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Colored Meter Path */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#painGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * pain) / 100}
            style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
          />

          {/* Tick marks */}
          {[-70, -35, 0, 35, 70].map((deg, i) => (
            <line
              key={i}
              x1="100"
              y1="32"
              x2="100"
              y2="24"
              stroke="#64748b"
              strokeWidth="2"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}

          {/* Pivot Center Hub */}
          <circle cx="100" cy="100" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-3 left-1/2 w-1.5 h-20 origin-bottom rounded-t-full transition-transform duration-100 ease-out z-10 pointer-events-none"
          style={{
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            backgroundColor: pain > 80 ? '#ef4444' : '#f59e0b',
            boxShadow: pain > 80 ? '0 0 8px #ef4444' : '0 0 6px #f59e0b',
          }}
        >
          {/* Arrow Tip */}
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white mx-auto -mt-1" />
        </div>
      </div>

      {/* Digital Readout */}
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-mono-tech text-3xl font-extrabold tracking-tight text-white">
          {Math.round(pain)}
        </span>
        <span className="font-mono-tech text-sm text-amber-400 font-bold">%</span>
      </div>

      {/* Dynamic Status Badge */}
      <div className={`mt-2 px-3 py-1 rounded-full text-[11px] font-display font-semibold tracking-wider border ${status.bg} ${status.color} ${status.border} text-center flex items-center gap-1.5 shadow-sm`}>
        {pain > 85 ? (
          <ShieldAlert size={12} className="animate-pulse text-red-500" />
        ) : (
          <AlertTriangle size={12} />
        )}
        <span>{status.label}</span>
      </div>
    </div>
  );
}
