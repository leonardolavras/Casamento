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
    }, 300);
  }

  return (
    <section className="section-container">
      <h2 className="section-title">Por que nos casamos</h2>
      <div className="reason-container">
        <div className="reason-box">
          <p className={fading ? "reason-text reason-text--fading" : "reason-text"}>
            "{reason}"
          </p>
        </div>
        <button className="reason-btn" type="button" onClick={handleNewReason}>
          Outro motivo
        </button>
      </div>
    </section>
  );
}
