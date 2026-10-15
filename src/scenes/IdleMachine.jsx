import React from 'react';
import { Cpu, Layers, ShieldCheck, Zap, ArrowRight, FileText, CheckCircle2, Sliders } from 'lucide-react';
import { mapFileTypeToScene } from '../utils/mapFileType';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function IdleMachine({ file }) {
  const fileInfo = file ? mapFileTypeToScene(file) : null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Background subtle modern grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {!file ? (
        /* STATE A: NO FILE SELECTED YET */
        <div className="w-full max-w-lg flex flex-col items-center text-center space-y-6 z-10 animate-fade-in">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Compression Engine Standby</span>
          </div>

          {/* Engine Processing Pipeline Graphic */}
          <div className="w-full p-5 bg-slate-950/60 border border-slate-800 rounded-2xl shadow-xl">
            <div className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider mb-4 text-left flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu size={14} className="text-blue-400" />
                Pipeline Visualizer
              </span>
              <span className="text-emerald-400 font-semibold">Ready</span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center py-2">
              <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <FileText size={22} className="text-blue-400 mb-1.5" />
                <span className="text-xs font-semibold text-white">Source File</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Raw Data</span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-center gap-1">
                  <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <ArrowRight size={14} className="text-indigo-400 flex-shrink-0" />
                </div>
                <span className="text-[9px] font-mono-tech text-indigo-400 mt-1 uppercase">Stream Engine</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <Layers size={22} className="text-emerald-400 mb-1.5" />
                <span className="text-xs font-semibold text-white">Optimized</span>
                <span className="text-[10px] text-emerald-400 mt-0.5">High Ratio</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-bold text-2xl text-white tracking-tight mb-2">
              Select a file to begin compression
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Choose or drop any document, image, or video in the left panel to initialize client-side compression.
            </p>
          </div>

          {/* Value Props / Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
                <Zap size={14} className="text-amber-400" />
                <span>Instant</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Zero queue delay, executes immediately in RAM.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Private</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Never uploaded to external servers or cloud.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
                <CheckCircle2 size={14} className="text-blue-400" />
                <span>Lossless</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Cleans redundant bytes and stream tokens.</p>
            </div>
          </div>
        </div>
      ) : (
        /* STATE B: FILE IS SELECTED - SHOW ANALYSIS PREVIEW (BEFORE CLICKING COMPRESS) */
        <div className="w-full max-w-lg flex flex-col items-center text-center space-y-6 z-10 animate-fade-in">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>File Analyzed • Ready to Compress</span>
          </div>

          {/* Document Technical Inspection Card */}
          <div className="w-full p-5 bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{fileInfo?.icon || '📄'}</span>
                <div>
                  <div className="text-xs font-mono-tech text-slate-400 uppercase">Input Target</div>
                  <div className="text-sm font-semibold text-white truncate max-w-[260px]">{file.name}</div>
                </div>
              </div>
              <span className="font-mono-tech text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                {formatFileSize(file.size)}
              </span>
            </div>

            {/* Presets and Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-mono-tech mb-1">Target Engine</div>
                <div className="font-semibold text-white">Adaptive Multi-Stream</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-mono-tech mb-1">Estimated Savings</div>
                <div className="font-semibold text-emerald-400">~65% – 85% Reduction</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-mono-tech mb-1">Deduplication</div>
                <div className="font-semibold text-blue-400">Deep Structural Pass</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-mono-tech mb-1">Integrity Check</div>
                <div className="font-semibold text-emerald-400">Verified Compatible</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-bold text-xl text-white tracking-tight mb-1.5">
              Ready for processing
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Click the <span className="text-blue-400 font-semibold">"Compress File"</span> button in the left panel to execute compression.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
