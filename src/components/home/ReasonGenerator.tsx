import { useState } from "react";
import { REASONS } from "../../config/site";
import "./ReasonGenerator.css";

function randomReason(exclude: string): string {
  if (REASONS.length <= 1) return REASONS[0] ?? "";
  let next = exclude;
  while (next === exclude) {
    next = REASONS[Math.floor(Math.random() * REASONS.length)];
  }
  return next;
}

export function ReasonGenerator() {
  const [reason, setReason] = useState(REASONS[0] ?? "");
  const [fading, setFading] = useState(false);

  function handleNewReason() {
    setFading(true);
    setTimeout(() => {
      setReason((current) => randomReason(current));
      setFading(false);
    }, 250);
  }

  return (
    <section className="section-container bg-alt">
      <div className="section-heading">
        <span className="section-eyebrow">Manifesto</span>
        <h2 className="section-title">Por que nos casamos</h2>
      </div>

      <div className="reason-container">
        <span className="reason-quote" aria-hidden="true">
          &ldquo;
        </span>
        <p
          className={fading ? "reason-text reason-text--fading" : "reason-text"}
        >
          {reason}
        </p>
        <button
          className="reason-btn"
          type="button"
          onClick={handleNewReason}
          aria-label="Ver outro motivo"
        >
          <span>Outro motivo</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12a8 8 0 018-8 8 8 0 017.5 5.2M20 12a8 8 0 01-8 8 8 8 0 01-7.5-5.2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M19 4v5h-5M5 20v-5h5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
