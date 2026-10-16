import React, { useState } from 'react';
import { Shield, ShieldAlert, Heart, XCircle } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function MercyButton({ isCrushing = false, onMercyDenied, disabled = false }) {
  const [begging, setBegging] = useState(false);
  const [denialMessage, setDenialMessage] = useState('');

  const handleMercyClick = () => {
    if (!isCrushing || begging || disabled) return;

    setBegging(true);
    soundEngine.playSiren();
    soundEngine.scream("HOLD ON! MERCY REQUEST RECEIVED!");

    setTimeout(() => {
      soundEngine.playCrunch();
      soundEngine.scream("MERCY DENIED!");
      setDenialMessage('MERCY DENIED BY BOARD OF DIRECTORS: RESUMING AT MAXIMUM OVERDRIVE!');
      if (onMercyDenied) onMercyDenied();

      setTimeout(() => {
        setBegging(false);
        setDenialMessage('');
      }, 2000);
    }, 1400);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleMercyClick}
        disabled={!isCrushing || begging || disabled}
        className={`px-4 py-2 rounded-xl font-display text-xs tracking-wider flex items-center gap-2 border transition-all duration-200 shadow-lg ${
          !isCrushing || disabled
            ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
            : begging
            ? 'bg-amber-600 border-amber-400 text-black font-bold animate-pulse'
            : 'bg-rose-950/80 hover:bg-rose-900 border-rose-500/50 text-rose-300 hover:text-white hover:scale-105 active:scale-95'
        }`}
      >
        {begging ? (
          <>
            <ShieldAlert size={14} className="animate-spin text-black" />
            <span>DELIBERATING MERCY...</span>
          </>
        ) : (
          <>
            <Heart size={14} className="text-rose-400 fill-rose-500/20" />
            <span>BEG FOR MERCY (SPARE FILE)</span>
          </>
        )}
      </button>

      {/* Floating Denial Toast */}
      {denialMessage && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 bg-red-950 border border-red-500 text-red-200 text-[11px] font-mono-tech p-2.5 rounded-xl shadow-2xl text-center z-50 animate-bounce">
          <div className="flex items-center justify-center gap-1 font-bold text-red-400 mb-0.5">
            <XCircle size={14} />
            <span>PETITION REJECTED</span>
          </div>
          <div>{denialMessage}</div>
        </div>
      )}
    </div>
  );
}
