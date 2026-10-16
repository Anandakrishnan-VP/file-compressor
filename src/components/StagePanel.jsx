import HydraulicPress from "../scenes/HydraulicPress";
export default function StagePanel({ mesh, phase, runId, onAnimationFinish }) {
  return (
    <section className="stage-panel" aria-label="Hydraulic press">
      <div className="stage-topline">
        <span className="panel-kicker">
          <span className="step-number">02</span> THE HEAVY LIFTING
        </span>
        <span
          className={`status-light ${phase === "compressing" ? "running" : ""}`}
        >
          {phase === "compressing"
            ? "Working"
            : phase === "complete"
              ? "Job done"
              : "Standing by"}
        </span>
      </div>
      <HydraulicPress
        mesh={mesh}
        phase={phase}
        runId={runId}
        onComplete={onAnimationFinish}
      />
    </section>
  );
}
