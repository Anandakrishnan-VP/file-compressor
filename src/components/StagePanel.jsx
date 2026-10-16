import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { mapFileTypeToScene } from '../utils/mapFileType';
import { soundEngine } from '../utils/soundEngine';

import IdleMachine from '../scenes/IdleMachine';
import HydraulicPress from '../scenes/HydraulicPress';
import ElephantStomp from '../scenes/ElephantStomp';
import WreckingBall from '../scenes/WreckingBall';
import RocketLaunch from '../scenes/RocketLaunch';
import Juicer from '../scenes/Juicer';
import TrashCompactor from '../scenes/TrashCompactor';
import Steamroller from '../scenes/Steamroller';
import BugZapper from '../scenes/BugZapper';
import Shredder from '../scenes/Shredder';
import Matryoshka from '../scenes/Matryoshka';
import BlackHole from '../scenes/BlackHole';

const SCENE_COMPONENTS = {
  HydraulicPress,
  ElephantStomp,
  WreckingBall,
  RocketLaunch,
  Juicer,
  TrashCompactor,
  Steamroller,
  BugZapper,
  Shredder,
  Matryoshka,
  BlackHole,
};

export default function StagePanel({ file, isCrushing, onAnimationFinish, onReset }) {
  const [isFinished, setIsFinished] = useState(false);

  const fileInfo = file ? mapFileTypeToScene(file) : null;
  const SceneComponent = fileInfo ? SCENE_COMPONENTS[fileInfo.scene] || BlackHole : BlackHole;

  useEffect(() => {
    if (!isCrushing) {
      return;
    }
    setIsFinished(false);
  }, [isCrushing]);

  const handleSceneComplete = () => {
    setIsFinished(true);
    if (onAnimationFinish) onAnimationFinish();
  };

  const handleReset = () => {
    setIsFinished(false);
    onReset();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
      {/* Top Hazard Border */}
      <div className="absolute top-0 inset-x-0 h-2 hazard-stripes opacity-80 z-30" />

      {/* STATE 1: FINISHED - SHOW ONLY "✅ File compressed successfully" + "Crush another file" button */}
      {isFinished ? (
        <div className="flex flex-col items-center justify-center text-center space-y-6 my-auto select-none animate-fade-in z-20">
          {/* Centered message */}
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400 tracking-wide">
            ✅ File compressed successfully
          </div>

          {/* Small "Crush another file" button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-display text-xs tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Crush another file</span>
          </button>
        </div>
      ) : isCrushing ? (
        /* STATE 2: ACTIVE CRUSHING - FULL-PANEL REALISTIC PHYSICS ANIMATION */
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <SceneComponent
            fileName={file?.name}
            onComplete={handleSceneComplete}
          />
        </div>
      ) : (
        /* STATE 3: IDLE MACHINE - "Waiting for a victim..." */
        <IdleMachine />
      )}
    </div>
  );
}
