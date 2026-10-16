import React, { useState, useEffect } from 'react';
import { Heart, Flame, Flower, Volume2, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { EULOGIES } from '../utils/captions';

export default function FuneralScene({ file, onClose }) {
  const [candles, setCandles] = useState(1);
  const [flowers, setFlowers] = useState(0);
  const [respectsCount, setRespectsCount] = useState(42);
  const [eulogy] = useState(() => EULOGIES[Math.floor(Math.random() * EULOGIES.length)]);

  useEffect(() => {
    soundEngine.playFuneralMarch();
  }, []);

  const addCandle = () => {
    setCandles((c) => c + 1);
    soundEngine.playTweezers();
  };

  const addFlower = () => {
    setFlowers((f) => f + 1);
    soundEngine.playTweezers();
  };

  const payRespects = () => {
    setRespectsCount((r) => r + 1);
    soundEngine.playTweezers();
  };

  const fileName = file ? file.name : 'Unknown_Victim.dat';
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center overflow-hidden">
        {/* Somber Rain Ambience (CSS drops) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-mono-tech text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Leave Memorial</span>
        </button>

        {/* Header */}
        <div className="text-center mt-6 mb-4">
          <div className="text-3xl mb-1">⚰️</div>
          <h2 className="font-display font-extrabold text-xl tracking-wider text-slate-200">
            DIGITAL MEMORIAL CHAPEL
          </h2>
          <p className="text-xs font-mono-tech text-slate-500">
            In Loving Memory of an Uncompressed File
          </p>
        </div>

        {/* Tombstone */}
        <div className="relative w-64 h-72 bg-gradient-to-b from-stone-600 via-stone-700 to-stone-800 rounded-t-full border-4 border-stone-500 shadow-2xl flex flex-col items-center justify-between p-6 text-center">
          <div className="text-lg font-display font-bold text-stone-300 mt-2">
            R. I. P.
          </div>

          <div className="my-2">
            <div className="font-mono-tech font-bold text-sm text-amber-200 break-all line-clamp-2 px-2">
              {fileName}
            </div>
            <div className="text-[10px] font-mono-tech text-stone-400 mt-1">
              Destroyed on {currentDate}
            </div>
          </div>

          <div className="text-[11px] font-mono-tech italic text-stone-300 border-t border-stone-600 pt-2">
            "Your whitespace was beautiful."
          </div>
        </div>

        {/* Eulogy Speech */}
        <div className="my-4 max-w-md text-center bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-sans text-slate-300 italic shadow-inner">
          "{eulogy}"
        </div>

        {/* Interactive Offerings */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-2 z-10">
          <button
            onClick={addCandle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-display hover:bg-amber-900/60 transition-all active:scale-95 shadow-md"
          >
            <Flame size={14} className="text-amber-400" />
            <span>Light Candle ({candles})</span>
          </button>

          <button
            onClick={addFlower}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-display hover:bg-rose-900/60 transition-all active:scale-95 shadow-md"
          >
            <Flower size={14} className="text-rose-400" />
            <span>Lay Flowers ({flowers})</span>
          </button>

          <button
            onClick={payRespects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 text-xs font-display hover:bg-slate-700 transition-all active:scale-95 shadow-md"
          >
            <Heart size={14} className="text-red-400" />
            <span>Pay Respects [F] ({respectsCount})</span>
          </button>
        </div>

        {/* Rendered Candlesticks */}
        <div className="flex items-center gap-2 mt-2 h-8">
          {Array.from({ length: Math.min(candles, 8) }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-1.5 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_#f59e0b]" />
              <div className="w-1 h-3 bg-stone-300 rounded-b" />
            </div>
          ))}
          {flowers > 0 && (
            <div className="text-lg animate-bounce">
              {'💐'.repeat(Math.min(flowers, 4))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
