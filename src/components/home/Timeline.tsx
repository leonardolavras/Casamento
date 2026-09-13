import { useEffect, useState } from "react";
import { TIMELINE_ITEMS } from "../../config/site";
import "./Timeline.css";

const STORAGE_KEY = "casamento:timeline";

function loadState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function Timeline() {
  const [state, setState] = useState<Record<string, boolean>>(() => {
    const saved = loadState();
    const initial: Record<string, boolean> = {};
    for (const item of TIMELINE_ITEMS) {
      initial[item.id] = saved[item.id] ?? item.concluido ?? false;
    }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage indisponível (ex: navegação privada); ignora.
    }
  }, [state]);

  return (
    <section className="section-container bg-alt">
      <h2 className="section-title">Nossa jornada</h2>
      <ul className="timeline-list">
        {TIMELINE_ITEMS.map((item) => (
          <li
            key={item.id}
            className={state[item.id] ? "timeline-item timeline-item--done" : "timeline-item"}
            onClick={() =>
              setState((current) => ({
                ...current,
                [item.id]: !current[item.id],
              }))
            }
          >
            {item.texto}
          </li>
        ))}
      </ul>
    </section>
  );
}
