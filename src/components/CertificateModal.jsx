import React, { useRef } from 'react';
import { Award, Printer, X, ShieldCheck } from 'lucide-react';
import { formatBytes } from '../utils/compress';

export default function CertificateModal({ result, chamber, onClose }) {
  const certRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const serial = `CRUSH-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Certificate Paper Frame */}
        <div
          ref={certRef}
          className="w-full bg-[#fcf9ee] text-[#1c1917] p-8 rounded-2xl border-8 border-double border-[#854d0e] shadow-inner relative flex flex-col items-center text-center my-2"
        >
          {/* Ornate Corner Accents */}
          <div className="absolute top-2 left-2 text-[#854d0e] text-xl font-serif">❖</div>
          <div className="absolute top-2 right-2 text-[#854d0e] text-xl font-serif">❖</div>
          <div className="absolute bottom-2 left-2 text-[#854d0e] text-xl font-serif">❖</div>
          <div className="absolute bottom-2 right-2 text-[#854d0e] text-xl font-serif">❖</div>

          {/* Department Header */}
          <div className="text-[11px] font-mono tracking-widest uppercase text-stone-600 mb-1">
            Department of Algorithmic Sanitation & Compression
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#78350f] tracking-wide my-1">
            CERTIFICATE OF DESTRUCTION
          </h1>

          <div className="text-xs font-serif italic text-stone-600 mb-4">
            This document certifies that the following digital artifact has ceased to exist in its bloated form.
          </div>

          <div className="w-24 h-0.5 bg-[#854d0e] mb-5" />

          {/* Case Information */}
          <div className="w-full max-w-lg space-y-3 text-left font-serif text-sm border border-stone-300 p-4 rounded bg-stone-50/70 mb-5">
            <div className="flex justify-between border-b border-stone-200 pb-1.5">
              <span className="font-bold text-stone-800">SUBJECT DECEASED:</span>
              <span className="font-mono text-stone-900 truncate max-w-[260px] font-bold">
                {result?.originalName || 'unknown_target.bin'}
              </span>
            </div>

            <div className="flex justify-between border-b border-stone-200 pb-1.5">
              <span className="font-bold text-stone-800">METHOD OF EXTINCTION:</span>
              <span className="font-sans text-stone-800 font-semibold">
                {chamber?.name || 'Hydraulic Pressure'}
              </span>
            </div>

            <div className="flex justify-between border-b border-stone-200 pb-1.5">
              <span className="font-bold text-stone-800">PRE-MORTEM MASS:</span>
              <span className="font-mono text-stone-800">
                {formatBytes(result?.beforeSize || 0)}
              </span>
            </div>

            <div className="flex justify-between border-b border-stone-200 pb-1.5">
              <span className="font-bold text-stone-800">POST-MORTEM MASS:</span>
              <span className="font-mono text-stone-800">
                {formatBytes(result?.afterSize || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-bold text-stone-800">DIGNITY REDUCTION:</span>
              <span className="font-mono text-red-700 font-extrabold">
                {result?.ratio || 0}% ANNIHILATED
              </span>
            </div>
          </div>

          {/* Coroner's Observation */}
          <p className="text-xs font-serif italic text-stone-700 max-w-md mb-6">
            "Coroner's Autopsy Note: The subject file exhibited mild screaming upon insertion into the chamber, followed by immediate submission to high-density DEFLATE algorithms. No recovery is possible."
          </p>

          {/* Signatures & Seal */}
          <div className="w-full flex items-end justify-between px-6 pt-2">
            {/* Signature 1 */}
            <div className="flex flex-col items-center">
              <div className="font-serif italic text-base text-stone-800 border-b border-stone-500 w-36 pb-0.5">
                Dr. Clanky Von Press
              </div>
              <span className="text-[10px] font-mono text-stone-500 mt-1 uppercase">
                Chief Hydraulic Coroner
              </span>
            </div>

            {/* Official Embossed Gold Seal */}
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#854d0e] bg-amber-100 flex flex-col items-center justify-center shadow-md p-1">
              <Award size={26} className="text-[#854d0e]" />
              <span className="text-[8px] font-bold tracking-tighter text-[#78350f]">OFFICIAL SEAL</span>
              <span className="text-[7px] font-mono text-[#854d0e]">ISO-9000</span>
            </div>

            {/* Date & Serial */}
            <div className="flex flex-col items-center">
              <div className="font-mono text-xs text-stone-800 border-b border-stone-500 w-36 pb-0.5">
                {dateStr}
              </div>
              <span className="text-[10px] font-mono text-stone-500 mt-1 uppercase">
                Serial: {serial}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs tracking-wider transition-all shadow-lg active:scale-95"
          >
            <Printer size={16} />
            <span>PRINT / SAVE CERTIFICATE</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-display text-xs tracking-wider transition-all"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
