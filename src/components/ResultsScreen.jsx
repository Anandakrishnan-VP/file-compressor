import { useEffect, useRef } from "react";
import { Download, ArrowRight, RotateCcw } from "lucide-react";
import { formatBytes } from "../utils/compress";
export default function ResultsScreen({
  preview,
  previewURL,
  result,
  resultURL,
  onReset,
}) {
  const title = useRef(null);
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() =>
      title.current
        ?.closest("section")
        ?.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <section
      id="result"
      className="results-panel"
      aria-labelledby="result-title"
    >
      <div className="result-heading">
        <div>
          <p className="eyebrow">FRESH OFF THE PRESS</p>
          <h2 id="result-title" ref={title} tabIndex={-1}>
            Compression complete.
          </h2>
          <p>You asked for smaller. We took it literally.</p>
        </div>
        <span className="result-stamp" aria-hidden="true">
          100%
          <br />
          <small>CRUSHED</small>
        </span>
      </div>
      <div className="result-body">
        <div className="comparison">
          <figure>
            <div className="before-preview">
              <img
                src={previewURL}
                alt={`Before: ${preview.label.toLowerCase()}`}
              />
            </div>
            <figcaption>
              Before <span>{preview.label}</span>
            </figcaption>
          </figure>
          <ArrowRight
            className="comparison-arrow"
            size={23}
            aria-hidden="true"
          />
          <figure>
            <div className="after-preview">
              <img
                src={resultURL}
                alt="After: the same document crumpled into a paper ball"
              />
            </div>
            <figcaption>
              After <span>A little more compact</span>
            </figcaption>
          </figure>
        </div>
        <div className="download-panel">
          <p className="ball-joke">
            New file format: <em>ball.</em>
          </p>
          <p className="download-name">{result.downloadName}</p>
          <div className="download-info">
            <span className="format-label">PNG image</span>
            <span>1600 × 1600 · {formatBytes(result.blob.size)}</span>
          </div>
          {result.blob && resultURL ? (
            <a
              className="button primary download-button"
              href={resultURL}
              download={result.downloadName}
            >
              <Download size={19} /> Download compressed file
            </a>
          ) : (
            <button className="button primary" disabled>
              Preparing download…
            </button>
          )}
          <button className="text-button reset-button" onClick={onReset}>
            <RotateCcw size={16} /> Compress another file
          </button>
        </div>
      </div>
    </section>
  );
}
