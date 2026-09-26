import { TIMELINE_ITEMS } from "../../config/site";
import "./Timeline.css";

export function Timeline() {
  return (
    <section className="section-container">
      <div className="section-heading">
        <span className="section-eyebrow">A jornada</span>
        <h2 className="section-title">Onde estamos, onde vamos</h2>
      </div>

      <ol className="timeline">
        {TIMELINE_ITEMS.map((item, idx) => (
          <li
            key={item.id}
            className={
              item.concluido ? "timeline__item timeline__item--done" : "timeline__item"
            }
          >
            <span className="timeline__index">{String(idx + 1).padStart(2, "0")}</span>
            <span className="timeline__dot" aria-hidden="true" />
            <span className="timeline__label">{item.texto}</span>
            <span className="timeline__status">
              {item.concluido ? "Feito" : "Em breve"}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
