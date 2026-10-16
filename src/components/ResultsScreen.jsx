import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Download, RotateCcw, Award, ShieldAlert, Heart, FileCheck, ArrowDownRight, Sparkles } from 'lucide-react';
import { formatBytes } from '../utils/compress';
import { soundEngine } from '../utils/soundEngine';

export default function ResultsScreen({
  result,
  chamber,
  onReset,
  onOpenFuneral,
  onOpenCertificate,
  onOpenInsurance,
  onOpenTherapy,
}) {
  useEffect(() => {
    // Fire celebratory confetti cannons
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    soundEngine.playPinataWhack();
  }, []);

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundEngine.playCrunch();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-tech text-xs mb-2">
          <FileCheck size={14} />
          <span>CARNAGE COMPLETE • GENUINE ARCHIVE READY</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider">
          FILE SUCCESSFULLY FLATTENED
        </h2>
        <p className="font-sans text-xs text-slate-400">
          Your file has been compressed by the {chamber?.name || 'Machine'}.
        </p>
      </div>

      {/* Comparative Carnage Stats Board */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Before Size */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center">
          <span className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest">
            ORIGINAL BLOAT
          </span>
          <span className="font-mono-tech text-xl font-bold text-slate-300 mt-1 line-through opacity-70">
            {formatBytes(result?.beforeSize || 0)}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">Heavy & Vulnerable</span>
        </div>

        {/* Saved Ratio (Hero) */}
        <div className="glass-panel-glow p-4 rounded-2xl flex flex-col items-center text-center border-amber-500/40 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
          <span className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-widest font-bold">
            DIGNITY DESTROYED
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono-tech text-3xl font-black text-amber-400">
              {result?.ratio || 0}
            </span>
            <span className="font-mono-tech text-base font-bold text-amber-400">%</span>
          </div>
          <span className="text-[10px] text-amber-300/80 mt-0.5 flex items-center gap-1 font-semibold">
            <ArrowDownRight size={12} /> {formatBytes(result?.savedBytes || 0)} Saved
          </span>
        </div>

        {/* After Size */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center">
          <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-widest font-bold">
            COMPACTED MASS
          </span>
          <span className="font-mono-tech text-xl font-black text-emerald-400 mt-1">
            {formatBytes(result?.afterSize || 0)}
          </span>
          <span className="text-[10px] text-emerald-500/80 mt-0.5">Streamlined ZIP</span>
        </div>
      </div>

      {/* Primary Download Button */}
      <div className="w-full flex flex-col items-center gap-2">
        <button
          onClick={handleDownload}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-display font-black text-base tracking-widest flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={22} className="stroke-[2.5]" />
          <span>DOWNLOAD {result?.downloadName || 'CRUSHED.ZIP'}</span>
        </button>

        <span className="text-[10px] font-mono-tech text-slate-500">
          Valid standard ZIP archive compressed with fflate Level 9. Compatible with Windows, Mac, Linux.
        </span>
      </div>

      {/* Extra Ridiculous Actions */}
      <div className="w-full glass-panel p-4 rounded-3xl flex flex-col gap-3">
        <span className="text-[11px] font-display font-bold text-amber-400 tracking-wider">
          POST-CRUSH SPECIAL SERVICES:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Funeral Mode */}
          <button
            onClick={onOpenFuneral}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 flex flex-col items-center text-center gap-1 transition-all hover:border-slate-500"
          >
            <span className="text-xl">⚰️</span>
            <span className="font-display font-bold text-xs text-slate-200">Hold Funeral</span>
            <span className="text-[9px] text-slate-400">Pay respects</span>
          </button>

          {/* Certificate */}
          <button
            onClick={onOpenCertificate}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 flex flex-col items-center text-center gap-1 transition-all hover:border-slate-500"
          >
            <span className="text-xl">📜</span>
            <span className="font-display font-bold text-xs text-slate-200">Certificate</span>
            <span className="text-[9px] text-slate-400">Proof of death</span>
          </button>

          {/* Insurance */}
          <button
            onClick={onOpenInsurance}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 flex flex-col items-center text-center gap-1 transition-all hover:border-slate-500"
          >
            <span className="text-xl">🛡️</span>
            <span className="font-display font-bold text-xs text-slate-200">Claim Insurance</span>
            <span className="text-[9px] text-slate-400">$0 policy (fails)</span>
          </button>

          {/* Therapy */}
          <button
            onClick={onOpenTherapy}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 flex flex-col items-center text-center gap-1 transition-all hover:border-slate-500"
          >
            <span className="text-xl">🩺</span>
            <span className="font-display font-bold text-xs text-slate-200">Therapy</span>
            <span className="text-[9px] text-slate-400">Heal the bytes</span>
          </button>
        </div>
      </div>

      {/* Crush Another File Button */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white font-display text-xs tracking-wider transition-all"
      >
        <RotateCcw size={14} />
        <span>ANNIHILATE ANOTHER FILE</span>
      </button>
    </div>
  );
}
