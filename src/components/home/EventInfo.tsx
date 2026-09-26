import { CERIMONIA, DRESS_CODE, RECEPCAO, type EventoInfo } from "../../config/site";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./EventInfo.css";

function EventCard({ evento, delay }: { evento: EventoInfo; delay: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="event-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <h3>{evento.titulo}</h3>
      <p className="event-card__data">{evento.data}</p>
      <p className="event-card__hora">{evento.hora}</p>
      <div className="event-card__local">
        <strong>{evento.local}</strong>
        <span>{evento.endereco}</span>
      </div>
      {evento.mapaUrl && (
        <a
          className="event-card__mapa"
          href={evento.mapaUrl}
          target="_blank"
          rel="noreferrer"
        >
          Ver no mapa ↗
        </a>
      )}
    </div>
  );
}

export function EventInfo() {
  const mesmoLocal = CERIMONIA.local === RECEPCAO.local;

  return (
    <section id="onde-e-quando" className="section-container bg-alt">
      <div className="section-heading">
        <span className="section-eyebrow">Cerimônia &amp; recepção</span>
        <h2 className="section-title">Onde e quando</h2>
      </div>
      <div className="event-info__cards">
        <EventCard evento={CERIMONIA} delay={0} />
        {!mesmoLocal && <EventCard evento={RECEPCAO} delay={150} />}
      </div>
      <p className="event-info__dress-code">
        <strong>Traje:</strong> {DRESS_CODE}
      </p>
    </section>
  );
}
