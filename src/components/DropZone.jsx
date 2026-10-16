import React, { useRef, useState } from 'react';
import { UploadCloud, File, Flame } from 'lucide-react';
import { mapFileTypeToScene } from '../utils/mapFileType';

export default function DropZone({ file, onFileSelected, onCrush, isCrushing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const fileInfo = file ? mapFileTypeToScene(file) : null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
      {/* Top Hazard Accent */}
      <div className="absolute top-0 inset-x-0 h-2 hazard-stripes opacity-80" />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* STATE 1: NO FILE PICKED - SHOW LARGE DRAG AND DROP ZONE */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`w-full h-full min-h-[360px] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
            isDragOver
              ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_40px_rgba(245,158,11,0.25)] scale-[1.01]'
              : 'border-slate-700 bg-slate-950/50 hover:border-amber-500/60 hover:bg-slate-950/80'
          }`}
        >
          {/* Industrial Upload Icon */}
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-inner text-amber-400">
            <UploadCloud size={38} />
          </div>

          <h3 className="font-display font-extrabold text-xl text-white tracking-wide mb-2">
            DRAG & DROP FILE HERE
          </h3>

          <p className="font-sans text-xs text-slate-400 max-w-xs mb-6">
            Accepts any file format: PDF, Word, Excel, PPT, images, video, audio, code, zip, or unknown files.
          </p>

          {/* "Choose File" Button inside zone */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current && fileInputRef.current.click();
            }}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-xs tracking-widest shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95 uppercase"
          >
            CHOOSE FILE
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const mockPdf = new File(['%PDF-1.4 Mock PDF Content'], 'Q3_Financial_Audit_Report.pdf', { type: 'application/pdf' });
              onFileSelected(mockPdf);
            }}
            className="mt-4 text-[11px] font-mono-tech text-amber-400/90 hover:text-amber-300 underline underline-offset-4 cursor-pointer transition-colors"
          >
            ⚡ Test Benchmark: Q3_Financial_Audit_Report.pdf
          </button>
        </div>
      ) : (
        /* STATE 2: FILE PICKED - SHOW ONLY FILE NAME + SMALL ICON + "CRUSH IT" BUTTON */
        <div className="w-full flex flex-col items-center justify-center text-center space-y-6 my-auto select-none">
          {/* File Name & Small Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl p-4 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-xl">
              {fileInfo?.icon || '📄'}
            </div>

            <div className="font-display font-bold text-lg text-white max-w-[280px] break-all px-2">
              {file.name}
            </div>
          </div>

          {/* Single "Crush It" button below file name */}
          <button
            onClick={onCrush}
            disabled={isCrushing}
            className={`w-full max-w-xs py-4 px-8 rounded-2xl font-display font-black text-base tracking-widest uppercase transition-all duration-200 shadow-xl flex items-center justify-center gap-3 ${
              isCrushing
                ? 'bg-amber-700 text-black opacity-80 cursor-wait'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
            }`}
          >
            <Flame size={20} className={isCrushing ? 'animate-bounce' : ''} />
            <span>{isCrushing ? 'CRUSHING...' : 'CRUSH IT'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
