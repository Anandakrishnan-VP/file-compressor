import React, { useRef, useState } from 'react';
import { UploadCloud, File, FileArchive, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { mapFileTypeToScene } from '../utils/mapFileType';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-60" />

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
              ? 'border-blue-400 bg-blue-950/30 shadow-[0_0_40px_rgba(59,130,246,0.25)] scale-[1.01]'
              : 'border-slate-700 bg-slate-950/50 hover:border-blue-500/60 hover:bg-slate-950/80'
          }`}
        >
          {/* Upload Icon */}
          <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-inner text-blue-400">
            <UploadCloud size={38} />
          </div>

          <h3 className="font-sans font-bold text-xl text-white tracking-tight mb-2">
            Drag & drop file here
          </h3>

          <p className="font-sans text-xs text-slate-400 max-w-xs mb-6">
            Accepts any file format: PDF, Word, Excel, PPT, images, video, audio, code, and zip archives.
          </p>

          {/* "Choose File" Button inside zone */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current && fileInputRef.current.click();
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans font-semibold text-xs tracking-wider shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95 uppercase cursor-pointer"
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
            className="mt-4 text-[11px] font-sans text-blue-400/90 hover:text-blue-300 underline underline-offset-4 cursor-pointer transition-colors"
          >
            📄 Try sample file: Q3_Financial_Audit_Report.pdf
          </button>

          <div className="flex items-center gap-1.5 mt-5 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>100% in-browser processing • Zero upload risk</span>
          </div>
        </div>
      ) : (
        /* STATE 2: FILE PICKED - SHOW FILE NAME + ICON + "COMPRESS FILE" BUTTON */
        <div className="w-full flex flex-col items-center justify-center text-center space-y-6 my-auto select-none">
          {/* File Name & Small Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl p-4 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-xl">
              {fileInfo?.icon || '📄'}
            </div>

            <div className="font-sans font-bold text-lg text-white max-w-[280px] break-all px-2">
              {file.name}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                {formatFileSize(file.size)}
              </span>
              <span className="text-xs font-sans text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
                Ready to compress
              </span>
            </div>

            <button
              type="button"
              disabled={isCrushing}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="text-[11px] font-sans text-slate-400 hover:text-blue-400 flex items-center gap-1 mt-1 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} />
              <span>Choose a different file</span>
            </button>
          </div>

          {/* Single "Compress File" button below file name */}
          <button
            onClick={onCrush}
            disabled={isCrushing}
            className={`w-full max-w-xs py-4 px-8 rounded-2xl font-sans font-bold text-base tracking-wide transition-all duration-200 shadow-xl flex items-center justify-center gap-3 cursor-pointer ${
              isCrushing
                ? 'bg-blue-800 text-white/80 opacity-90 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.35)]'
            }`}
          >
            {isCrushing ? (
              <Loader2 size={20} className="animate-spin text-white" />
            ) : (
              <FileArchive size={20} className="text-white" />
            )}
            <span>{isCrushing ? 'COMPRESSING...' : 'COMPRESS FILE'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
