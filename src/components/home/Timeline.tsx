import { TIMELINE_ITEMS } from "../../config/site";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./Timeline.css";

function TimelineItem({ item, idx }: { item: typeof TIMELINE_ITEMS[number]; idx: number }) {
  const { ref, visible } = useScrollReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className={item.concluido ? "timeline__item timeline__item--done" : "timeline__item"}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-20px)",
        transitionDelay: `${idx * 80}ms`,
      }}
    >
      <span className="timeline__index">{String(idx + 1).padStart(2, "0")}</span>
      <span className="timeline__dot" aria-hidden="true" />
      <span className="timeline__label">{item.texto}</span>
      <span className="timeline__status">
        {item.concluido ? "Feito" : "Em breve"}
      </span>
    </li>
  );
}

export function Timeline() {
  return (
    <section className="section-container">
      <div className="section-heading">
        <span className="section-eyebrow">A jornada</span>
        <h2 className="section-title">Onde estamos, onde vamos</h2>
      </div>

      <ol className="timeline">
        {TIMELINE_ITEMS.map((item, idx) => (
          <TimelineItem key={item.id} item={item} idx={idx} />
        ))}
      </ol>
    </section>
  );
}
