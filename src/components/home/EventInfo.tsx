import { CERIMONIA, DRESS_CODE, RECEPCAO, type EventoInfo } from "../../config/site";
import "./EventInfo.css";

function EventCard({ evento }: { evento: EventoInfo }) {
  return (
    <div className="event-card">
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
    <section className="section-container bg-alt event-info">
      <h2 className="section-title">Onde e quando</h2>
      <div className="event-info__cards">
        <EventCard evento={CERIMONIA} />
        {!mesmoLocal && <EventCard evento={RECEPCAO} />}
      </div>
      <p className="event-info__dress-code">
        <strong>Traje:</strong> {DRESS_CODE}
      </p>
    </section>
  );
}
