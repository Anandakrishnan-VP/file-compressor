import React, { useEffect, useState } from "react";
import { RotateCcw, Download } from "lucide-react";
import { mapFileTypeToScene } from "../utils/mapFileType";
import { soundEngine } from "../utils/soundEngine";

import IdleMachine from "../scenes/IdleMachine";
import HydraulicPress from "../scenes/HydraulicPress";
import ElephantStomp from "../scenes/ElephantStomp";
import WreckingBall from "../scenes/WreckingBall";
import RocketLaunch from "../scenes/RocketLaunch";
import Juicer from "../scenes/Juicer";
import TrashCompactor from "../scenes/TrashCompactor";
import Steamroller from "../scenes/Steamroller";
import BugZapper from "../scenes/BugZapper";
import Shredder from "../scenes/Shredder";
import Matryoshka from "../scenes/Matryoshka";
import BlackHole from "../scenes/BlackHole";

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
  const [crushedBlob, setCrushedBlob] = useState(null);

  const fileInfo = file ? mapFileTypeToScene(file) : null;
  const SceneComponent = fileInfo ? SCENE_COMPONENTS[fileInfo.scene] || BlackHole : BlackHole;
  const isPdf = fileInfo?.scene === "HydraulicPress";

  useEffect(() => {
    if (!isCrushing) return;
    setIsFinished(false);
    setCrushedBlob(null);
  }, [isCrushing]);

  // Called by the scene when animation ends. Receives optional blob for PDF.
  const handleSceneComplete = (blob) => {
    setIsFinished(true);
    if (blob instanceof Blob) setCrushedBlob(blob);
    if (onAnimationFinish) onAnimationFinish();
  };

  const handleReset = () => {
    setIsFinished(false);
    setCrushedBlob(null);
    onReset();
  };

  const handleDownload = () => {
    if (!crushedBlob) return;
    const url = URL.createObjectURL(crushedBlob);
    const a = document.createElement("a");
    const base = file?.name?.replace(/\.pdf$/i, "") ?? "crushed";
    a.href = url;
    a.download = `${base}-CRUSHED.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
      {/* Top Accent: Hazard stripes only during crushing or finished reveal state */}
      <div
        className={`absolute top-0 inset-x-0 h-1.5 z-30 transition-all duration-300 ${
          isCrushing || isFinished
            ? 'hazard-stripes opacity-90'
            : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-60'
        }`}
      />

      {/* STATE 1: FINISHED */}
      {isFinished ? (
        <div className="flex flex-col items-center justify-center text-center space-y-6 my-auto select-none animate-fade-in z-20">
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400 tracking-wide">
            ✅ File compressed successfully
          </div>

          {/* Thumbnail preview (PDF only) */}
          {crushedBlob && (
            <div className="relative w-40 h-32 rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
              <img
                src={URL.createObjectURL(crushedBlob)}
                alt="Crushed result"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end justify-center pb-1">
                <span className="font-mono-tech text-[9px] text-white bg-black/60 px-2 py-0.5 rounded">
                  FINAL STATE
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Download — only when we have a blob (PDF flow) */}
            {crushedBlob && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-display text-xs tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-display text-xs tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Compress another file</span>
            </button>
          </div>
        </div>
      ) : isCrushing ? (
        /* STATE 2: ACTIVE CRUSHING */
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <SceneComponent
            file={file}
            fileName={file?.name}
            onComplete={handleSceneComplete}
          />
        </div>
      ) : (
        /* STATE 3: IDLE */
        <IdleMachine file={file} />
      )}
    </div>
  );
}
