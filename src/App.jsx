import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import DropZone from './components/DropZone';
import StagePanel from './components/StagePanel';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [file, setFile] = useState(null);
  const [isCrushing, setIsCrushing] = useState(false);
  const [muted, setMuted] = useState(false);

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleCrush = () => {
    if (!file || isCrushing) return;
    setIsCrushing(true);
  };

  const handleAnimationFinish = () => {
    setIsCrushing(false);
  };

  const handleReset = () => {
    setFile(null);
    setIsCrushing(false);
  };

  const toggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 bg-industrial-dark text-slate-100 select-none overflow-x-hidden">
      {/* Header Bar */}
      <header className="w-full flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-wider text-white">
              CRUSHR <span className="text-amber-400">9000</span>
            </h1>
            <span className="hazard-stripes text-[9px] font-mono-tech font-black text-black px-2 py-0.5 rounded shadow">
              USELESS EDITION
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-slate-400 mt-0.5">
            Your file gets crushed. Your dignity stays intact.
          </p>
        </div>

        {/* Sound Mute Toggle */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/60 transition-colors shadow-lg active:scale-95 cursor-pointer"
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {muted ? (
            <VolumeX size={18} className="text-red-400" />
          ) : (
            <Volume2 size={18} className="text-amber-400 animate-pulse" />
          )}
          <span className="font-mono-tech text-xs text-slate-300 font-bold uppercase hidden sm:inline">
            {muted ? 'Muted' : 'Sound ON'}
          </span>
        </button>
      </header>

      {/* Main Full-Screen Split View Layout */}
      <main className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-[550px]">
        {/* LEFT PANEL (~35-40% width): File Input */}
        <section className="w-full lg:w-[38%] flex flex-col h-full min-h-[380px] lg:min-h-0">
          <DropZone
            file={file}
            onFileSelected={handleFileSelected}
            onCrush={handleCrush}
            isCrushing={isCrushing}
          />
        </section>

        {/* RIGHT PANEL (~60-65% width): Animation Stage */}
        <section className="w-full lg:w-[62%] flex flex-col h-full min-h-[420px] lg:min-h-0">
          <StagePanel
            file={file}
            isCrushing={isCrushing}
            onAnimationFinish={handleAnimationFinish}
            onReset={handleReset}
          />
        </section>
      </main>

      {/* Subtle Industrial Footer */}
      <footer className="w-full pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tech text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>CRUSHR 9000 • INDUSTRIAL DESTRUCTION UNIT</span>
        </div>
        <div>NO BYTES WERE HURT (COMPRESSION IS USELESS)</div>
      </footer>
    </div>
  );
}
