import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, X, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { INSURANCE_POLICIES } from '../utils/captions';
import { soundEngine } from '../utils/soundEngine';

export default function InsuranceModal({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [claimStatus, setClaimStatus] = useState('idle'); // idle | processing | denied

  const handleClaim = () => {
    setClaimStatus('processing');
    soundEngine.playSiren();

    setTimeout(() => {
      soundEngine.playCrunch();
      soundEngine.scream("CLAIM REJECTED!");
      setClaimStatus('denied');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={28} className="text-amber-400" />
          <h2 className="font-display font-extrabold text-xl text-white tracking-wider">
            CRUSH-CARE™ COMPRESSION INSURANCE
          </h2>
        </div>

        <p className="text-xs font-mono-tech text-slate-400 text-center mb-4">
          Guaranteed 100% peace of mind, 0% compensation.
        </p>

        {/* Policy Selector */}
        <div className="w-full space-y-2 mb-4">
          {INSURANCE_POLICIES.map((p, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPlan(idx)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === idx
                  ? 'bg-amber-950/40 border-amber-500 shadow-lg'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-bold text-sm text-slate-200">{p.plan}</span>
                <span className="font-mono-tech text-xs text-amber-400 font-extrabold">{p.price}</span>
              </div>
              <p className="text-xs text-slate-400">{p.coverage}</p>
            </div>
          ))}
        </div>

        {/* Claim Status Area */}
        {claimStatus === 'processing' && (
          <div className="w-full bg-slate-950 p-4 rounded-2xl border border-amber-500/50 flex flex-col items-center gap-2 my-2 animate-pulse">
            <ShieldAlert size={24} className="text-amber-400 animate-spin" />
            <span className="font-mono-tech text-xs text-amber-300">
              AUDITING COMPRESSION TRAUMA WITH UNDERWRITERS...
            </span>
          </div>
        )}

        {claimStatus === 'denied' && (
          <div className="w-full bg-red-950/80 p-4 rounded-2xl border border-red-500 flex flex-col items-center gap-2 my-2 text-center animate-shake-brutal">
            <div className="flex items-center gap-1.5 text-red-400 font-bold font-display text-sm">
              <AlertOctagon size={18} />
              <span>CLAIM REJECTED WITH EXTREME PREJUDICE</span>
            </div>
            <p className="font-mono-tech text-xs text-red-200">
              {INSURANCE_POLICIES[selectedPlan].status}
            </p>
            <span className="text-[10px] text-red-400/80 italic">
              Dispute Fee: $999.00 (Non-refundable)
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full mt-2">
          {claimStatus !== 'denied' ? (
            <button
              onClick={handleClaim}
              disabled={claimStatus === 'processing'}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-sm tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              FILE COMPRESSION DAMAGE CLAIM ($0.00)
            </button>
          ) : (
            <button
              onClick={handleClaim}
              className="w-full py-3 rounded-2xl bg-red-800 hover:bg-red-700 text-white font-display font-bold text-sm tracking-wider transition-all shadow-lg active:scale-95"
            >
              SUBMIT FUTILE APPEAL (WILL ALSO FAIL)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
