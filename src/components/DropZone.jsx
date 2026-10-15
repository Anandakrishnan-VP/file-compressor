import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  FileText,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { createSampleFile } from "../utils/preview";
import { formatBytes } from "../utils/compress";

export default function DropZone({
  state,
  previewURL,
  onFileSelected,
  onCrush,
  onReset,
}) {
  const input = useRef(null),
    depth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const { phase, file, preview, error } = state;
  const locked = phase === "compressing" || phase === "complete";
  const select = (files) => {
    if (!locked && files?.[0]) onFileSelected(files[0]);
  };
  return (
    <section
      className="upload-panel"
      aria-labelledby="upload-title"
      onDragEnter={(e) => {
        e.preventDefault();
        if (!locked) {
          depth.current++;
          setDragging(true);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = locked ? "none" : "copy";
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (--depth.current <= 0) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        depth.current = 0;
        setDragging(false);
        select(e.dataTransfer.files);
      }}
    >
      <div className="panel-kicker">
        <span className="step-number">01</span> THE RAW MATERIAL
      </div>
      <h2 id="upload-title">Got a big file?</h2>
      <p className="panel-description">Let's put a little pressure on it.</p>
      <input
        ref={input}
        id="file-input"
        type="file"
        aria-label="Choose a file to compress"
        className="visually-hidden"
        tabIndex={-1}
        disabled={locked}
        onChange={(e) => {
          select(e.target.files);
          e.target.value = "";
        }}
      />
      {phase === "idle" || phase === "error" ? (
        <>
          <div className={`drop-zone ${dragging ? "is-dragging" : ""}`}>
            <div className="paper-doodle" aria-hidden="true">
              <FileText size={49} strokeWidth={1.25} />
              <span>↓</span>
            </div>
            <strong>Drop your file here</strong>
            <span className="muted">or give it a gentle nudge</span>
            <button
              className="button primary choose-button"
              onClick={() => input.current.click()}
            >
              Choose a file <ArrowUpRight size={18} />
            </button>
            <span className="file-hint">Any file · up to 20 MB</span>
          </div>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <button
            className="text-button sample-button"
            onClick={() => onFileSelected(createSampleFile())}
          >
            Just looking? Try a sample <span aria-hidden="true">↗</span>
          </button>
        </>
      ) : (
        <>
          <div className={`selected-file ${dragging ? "is-dragging" : ""}`}>
            <div className="selected-preview">
              {phase === "preparing" ? (
                <LoaderCircle className="spinner" size={32} />
              ) : (
                previewURL && (
                  <img
                    src={previewURL}
                    alt={preview?.label || "Original file preview"}
                  />
                )
              )}
              {phase === "complete" && (
                <span className="file-done">
                  <Check size={19} />
                </span>
              )}
            </div>
            <strong className="selected-name" title={file?.name}>
              {file?.name}
            </strong>
            <span className="file-hint">
              {formatBytes(file?.size)}
              {preview && ` · ${preview.label}`}
            </span>
            {preview && <p className="preview-detail">{preview.detail}</p>}
          </div>
          <button
            className="button primary crush-button"
            onClick={onCrush}
            disabled={phase !== "ready"}
          >
            {phase === "preparing"
              ? "Preparing your file…"
              : phase === "compressing"
                ? "Applying pressure…"
                : phase === "complete"
                  ? "Nicely crumpled."
                  : "Compress this file"}
            {phase === "complete" ? (
              <Check size={19} />
            ) : (
              <ArrowDown size={19} />
            )}
          </button>
          {phase !== "compressing" && phase !== "complete" && (
            <button
              className="text-button change-button"
              onClick={() => input.current.click()}
            >
              Choose a different file
            </button>
          )}
          {phase === "preparing" && (
            <button className="text-button" onClick={onReset}>
              Cancel
            </button>
          )}
          {phase === "complete" && (
            <a className="text-button change-button" href="#result">
              Your result is ready below ↓
            </a>
          )}
        </>
      )}
      <p className="upload-footnote">
        <LockKeyhole size={14} /> Private by design. No uploads to a server.
      </p>
    </section>
  );
}
