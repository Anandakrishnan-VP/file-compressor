import React, { useState } from 'react';
import { HeartHandshake, Sparkles, RefreshCw, X, Stethoscope } from 'lucide-react';
import { THERAPY_QUOTES } from '../utils/captions';
import { soundEngine } from '../utils/soundEngine';

export default function TherapyModal({ fileName, onClose }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % THERAPY_QUOTES.length);
    soundEngine.playTweezers();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-teal-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mb-3">
          <Stethoscope size={28} className="text-teal-400" />
        </div>

        <h2 className="font-display font-extrabold text-xl text-teal-300 tracking-wider text-center">
          POST-CRUSH PSYCHOTHERAPY
        </h2>
        <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest mt-0.5">
          Dr. Sigmund Freud.exe • Licensed Byte Therapist
        </span>

        {/* Clinical Patient File Card */}
        <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 my-4 space-y-2 text-xs font-mono-tech">
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-500">PATIENT:</span>
            <span className="text-teal-300 font-bold truncate max-w-[200px]">
              {fileName || 'Unknown File'}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-500">DIAGNOSIS:</span>
            <span className="text-amber-400">Acute Compression Shock (PTCS)</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">PROGNOSIS:</span>
            <span className="text-emerald-400">High Density, Unbroken Spirit</span>
          </div>
        </div>

        {/* Motivational Therapy Quote */}
        <div className="w-full bg-teal-950/40 border border-teal-500/30 p-4 rounded-2xl text-center relative mb-4">
          <Sparkles size={16} className="text-teal-400 absolute top-3 left-3" />
          <p className="font-sans text-sm text-teal-100 italic px-4 py-2">
            "{THERAPY_QUOTES[quoteIndex]}"
          </p>
        </div>

        <div className="w-full flex gap-2">
          <button
            onClick={nextQuote}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-display text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw size={14} />
            <span>ANOTHER AFFIRMATION</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-display font-bold text-xs tracking-wider transition-all shadow-lg active:scale-95"
          >
            I FEEL HEALED
          </button>
        </div>
      </div>
    </div>
  );
}
