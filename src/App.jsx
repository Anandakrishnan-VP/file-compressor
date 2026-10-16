import React, { useState } from 'react';
import { Volume2, VolumeX, FileArchive, ShieldCheck, Zap } from 'lucide-react';
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
      <header className="w-full flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
            <FileArchive size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                File <span className="text-blue-500">Compressor</span>
              </h1>
              <span className="text-[10px] font-mono-tech font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SECURE CLIENT-SIDE
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-400 mt-0.5">
              High-ratio document, image & video compression directly in your browser.
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 hover:bg-slate-800 text-slate-300 transition-all shadow-sm active:scale-95 cursor-pointer"
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {muted ? (
            <VolumeX size={17} className="text-slate-400" />
          ) : (
            <Volume2 size={17} className="text-blue-400" />
          )}
          <span className="font-sans text-xs text-slate-300 font-medium hidden sm:inline">
            {muted ? 'Audio Off' : 'Audio On'}
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

      {/* Professional Footer */}
      <footer className="w-full pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-sans text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>File Compressor • Private In-Browser Optimization Engine</span>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          All files are processed in local memory. Zero cloud uploads.
        </div>
      </footer>
    </div>
  );
}
