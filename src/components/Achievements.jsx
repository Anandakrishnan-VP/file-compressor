import React, { useState, useEffect } from 'react';
import { Trophy, Award, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const ALL_ACHIEVEMENTS = [
  { id: 'FIRST_BLOOD', title: 'First Blood', desc: 'Crushed your very first file', icon: '🩸' },
  { id: 'RESUME_KILLER', title: 'Career Destroyer', desc: 'Crushed a resume or CV document', icon: '📄' },
  { id: 'CLIPPY_BANE', title: "Clippy's Bane", desc: 'Stomped a Word document into the dirt', icon: '📎' },
  { id: 'REF_PANIC', title: '#REF! Catastrophe', desc: 'Shattered an Excel grid into rubble', icon: '🪨' },
  { id: 'ORBITAL', title: 'To Infinity & Beyond', desc: 'Blasted a presentation into deep orbit', icon: '🚀' },
  { id: 'NO_MERCY', title: 'Plea Rejected', desc: 'Tried to beg for mercy and got denied', icon: '🛑' },
  { id: 'REST_IN_BYTES', title: 'Solemn Mourner', desc: 'Attended a funeral and paid respects', icon: '⚰️' },
  { id: 'CERTIFIED_KILLER', title: 'Certified Extinction', desc: 'Inspected official Certificate of Destruction', icon: '📜' },
  { id: 'INSURANCE_FRAUD', title: 'Fraudulent Claim', desc: 'Tried to file a $0.00 CrushrCare claim', icon: '🛡️' },
  { id: 'THERAPY_SESSION', title: 'In Therapy', desc: 'Sent a compacted file to psychotherapy', icon: '🩺' },
  { id: 'ROULETTE_MASTER', title: 'Roulette Fanatic', desc: 'Crushed a file with Torture Roulette', icon: '🎲' },
];

export function useAchievements() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const saved = localStorage.getItem('crushr_achievements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentUnlock, setRecentUnlock] = useState(null);

  const unlock = (id) => {
    if (unlocked.includes(id)) return;
    const item = ALL_ACHIEVEMENTS.find((a) => a.id === id);
    if (!item) return;

    const next = [...unlocked, id];
    setUnlocked(next);
    try {
      localStorage.setItem('crushr_achievements', JSON.stringify(next));
    } catch {}

    soundEngine.playPinataWhack();
    setRecentUnlock(item);
    setTimeout(() => {
      setRecentUnlock(null);
    }, 4500);
  };

  return { unlocked, unlock, recentUnlock };
}

export function AchievementToast({ achievement, onClose }) {
  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-amber-950/95 border-2 border-amber-400 text-amber-100 p-4 rounded-2xl shadow-2xl animate-bounce">
      <div className="text-3xl p-2 bg-amber-500/20 rounded-xl border border-amber-400/50">
        {achievement.icon}
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs font-mono-tech font-bold text-amber-400">
          <Trophy size={14} />
          <span>ACHIEVEMENT UNLOCKED!</span>
        </div>
        <div className="font-display font-extrabold text-sm text-white">
          {achievement.title}
        </div>
        <div className="text-xs text-amber-200/80">
          {achievement.desc}
        </div>
      </div>
    </div>
  );
}

export function AchievementsModal({ unlocked, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Trophy size={26} className="text-amber-400" />
          <h2 className="font-display font-extrabold text-xl text-white tracking-wider">
            CRUSHR TROPHY ROOM
          </h2>
        </div>

        <span className="text-xs font-mono-tech text-amber-400/80 mb-4">
          Unlocked {unlocked.length} of {ALL_ACHIEVEMENTS.length} Accomplishments
        </span>

        {/* List of achievements */}
        <div className="w-full space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {ALL_ACHIEVEMENTS.map((a) => {
            const isUnlocked = unlocked.includes(a.id);
            return (
              <div
                key={a.id}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/30 border-amber-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-black/40 border border-slate-700">
                  {isUnlocked ? a.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-display font-bold text-sm">
                    <span>{a.title}</span>
                    {isUnlocked && <CheckCircle2 size={14} className="text-emerald-400" />}
                  </div>
                  <div className="text-xs text-slate-400">{a.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
