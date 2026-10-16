import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Volume2, VolumeX, ArrowDown, LockKeyhole } from "lucide-react";
import DropZone from "./components/DropZone";
import StagePanel from "./components/StagePanel";
import ResultsScreen from "./components/ResultsScreen";
import { soundEngine } from "./utils/soundEngine";
import { generatePreview } from "./utils/preview";
import { createPaperMesh, fileSeed } from "./utils/paperMesh";
import { compressFile } from "./utils/compress";

const initial = {
  phase: "idle",
  id: 0,
  file: null,
  preview: null,
  mesh: null,
  result: null,
  animationDone: false,
  error: "",
};
export function flowReducer(state, action) {
  if (action.type === "reset") return { ...initial, id: action.id };
  if (action.type === "prepare")
    return { ...initial, phase: "preparing", id: action.id, file: action.file };
  if (action.id !== state.id) return state;
  switch (action.type) {
    case "ready":
      return state.phase === "preparing"
        ? {
            ...state,
            phase: "ready",
            preview: action.preview,
            mesh: action.mesh,
          }
        : state;
    case "start":
      return state.phase === "ready"
        ? { ...state, phase: "compressing" }
        : state;
    case "exported":
      return state.phase === "compressing"
        ? {
            ...state,
            result: action.result,
            phase: state.animationDone ? "complete" : "compressing",
          }
        : state;
    case "animated":
      return state.phase === "compressing"
        ? {
            ...state,
            animationDone: true,
            phase: state.result ? "complete" : "compressing",
          }
        : state;
    case "error":
      return { ...state, phase: "error", error: action.message };
    default:
      return state;
  }
}
function useObjectURL(blob) {
  const [url, setURL] = useState(null);
  useEffect(() => {
    if (!blob) {
      setURL(null);
      return;
    }
    const next = URL.createObjectURL(blob);
    setURL(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url;
}
export default function App() {
  const [state, dispatch] = useReducer(flowReducer, initial);
  const [muted, setMuted] = useState(false);
  const generation = useRef(0),
    controller = useRef(null),
    running = useRef(false);
  const previewURL = useObjectURL(state.preview?.blob);
  const resultURL = useObjectURL(state.result?.blob);
  useEffect(
    () => () => {
      generation.current++;
      controller.current?.abort();
      soundEngine.dispose();
    },
    [],
  );
  const selectFile = useCallback(async (file) => {
    if (running.current) return;
    const id = ++generation.current;
    controller.current?.abort();
    const abortController = new AbortController();
    controller.current = abortController;
    dispatch({ type: "prepare", id, file });
    try {
      const preview = await generatePreview(file, {
        signal: abortController.signal,
      });
      if (generation.current !== id) return;
      dispatch({
        type: "ready",
        id,
        preview,
        mesh: createPaperMesh(preview.canvas, fileSeed(file)),
      });
    } catch (error) {
      if (generation.current === id && !abortController.signal.aborted)
        dispatch({
          type: "error",
          id,
          message:
            error.message ||
            "This file could not be prepared. Try another file.",
        });
    }
  }, []);
  const crush = () => {
    if (state.phase !== "ready" || running.current) return;
    running.current = true;
    soundEngine.init();
    const id = state.id;
    dispatch({ type: "start", id });
    if (window.matchMedia("(max-width: 760px)").matches) {
      document
        .querySelector(".stage-panel")
        ?.scrollIntoView({
          block: "center",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
    }
    compressFile(state.file, state.mesh)
      .then((result) => {
        if (generation.current === id)
          dispatch({ type: "exported", id, result });
      })
      .catch(() => {
        if (generation.current !== id) return;
        running.current = false;
        soundEngine.stopAll();
        dispatch({
          type: "error",
          id,
          message:
            "The PNG could not be created. Please choose the file again.",
        });
      });
  };
  const animationFinished = useCallback(
    (id) => dispatch({ type: "animated", id }),
    [],
  );
  const reset = useCallback(() => {
    const id = ++generation.current;
    controller.current?.abort();
    running.current = false;
    soundEngine.stopAll();
    dispatch({ type: "reset", id });
  }, []);
  const toggleMute = () => {
    soundEngine.init();
    setMuted(soundEngine.toggleMute());
  };
  return (
    <div className="app-shell" data-phase={state.phase}>
      <header className="site-header">
        <a href="./" className="wordmark" aria-label="CRUSHR home">
          <span className="brand-mark" aria-hidden="true">
            <ArrowDown size={19} />
          </span>
          CRUSHR<span className="brand-dot">.</span>
        </a>
        <button
          className="sound-button"
          onClick={toggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute sound" : "Mute sound"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>Sound {muted ? "off" : "on"}</span>
        </button>
      </header>
      <main>
        <section className="intro">
          <p className="eyebrow">BIG FILE ENERGY. SMALL FILE SHAPE.</p>
          <h1>
            Make your files{" "}
            <span>
              smaller.
              <svg viewBox="0 0 300 15" aria-hidden="true">
                <path d="M5 10 Q145 -3 295 7" />
              </svg>
            </span>
          </h1>
          <p className="intro-subtitle">Upload. Compress. Download.</p>
        </section>
        <section className="workspace" aria-label="File compression workspace">
          <DropZone
            state={state}
            previewURL={previewURL}
            onFileSelected={selectFile}
            onCrush={crush}
            onReset={reset}
          />
          <StagePanel
            mesh={state.mesh}
            phase={state.phase}
            runId={state.id}
            onAnimationFinish={animationFinished}
          />
        </section>
        {state.phase === "complete" && (
          <ResultsScreen
            preview={state.preview}
            previewURL={previewURL}
            result={state.result}
            resultURL={resultURL}
            onReset={reset}
          />
        )}
        <div className="workspace-note">
          <LockKeyhole size={14} />
          <span>
            Your files stay in your browser. This machine works locally.
          </span>
        </div>
      </main>
      <footer className="site-footer">
        <span>A little less file. A little more fun.</span>
        <span>
          BUILT TO TAKE THINGS LITERALLY <span aria-hidden="true">↘</span>
        </span>
      </footer>
    </div>
  );
}
