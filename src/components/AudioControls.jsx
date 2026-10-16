import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function AudioControls() {
  const [muted, setMuted] = useState(false);
  const [screamMuted, setScreamMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  const toggleScream = () => {
    const next = !screamMuted;
    setScreamMuted(next);
    soundEngine.setScreamMuted(next);
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg text-xs">
      <button
        onClick={toggleMute}
        title={muted ? 'Unmute All Audio' : 'Mute All Audio'}
        className={`p-1.5 rounded-full transition-colors ${
          muted ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
        }`}
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolume}
        disabled={muted}
        className="w-16 accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
        title={`Volume: ${Math.round(volume * 100)}%`}
      />

      <div className="w-[1px] h-4 bg-slate-700" />

      <button
        onClick={toggleScream}
        title={screamMuted ? 'Enable File Screams' : 'Silence File Screams'}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-mono-tech transition-colors ${
          screamMuted
            ? 'bg-slate-800/80 text-slate-500 line-through'
            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
        }`}
      >
        {screamMuted ? <MicOff size={13} /> : <Mic size={13} className="text-amber-400 animate-pulse" />}
        <span>SCREAMS</span>
      </button>
    </div>
  );
}
