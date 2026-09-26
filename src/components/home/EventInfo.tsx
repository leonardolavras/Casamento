import { CERIMONIA, DRESS_CODE, RECEPCAO, WEDDING_DATE } from "../../config/site";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./EventInfo.css";

export function EventInfo() {
  const { ref, visible } = useScrollReveal<HTMLElement>();

  const dia = WEDDING_DATE.getDate();
  const mes = WEDDING_DATE.toLocaleDateString("pt-BR", { month: "long" });
  const ano = WEDDING_DATE.getFullYear();

  return (
    <section
      id="onde-e-quando"
      className="event-section"
      ref={ref}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)" }}
    >
      <div className="event-section__date">
        <span className="event-section__day">{String(dia).padStart(2, "0")}</span>
        <div className="event-section__month-year">
          <span>{mes}</span>
          <span>{ano}</span>
        </div>
      </div>

      <div className="event-section__details">
        <div className="event-section__block">
          <h3>{CERIMONIA.titulo}</h3>
          <p>{CERIMONIA.hora}</p>
          <p className="event-section__place">{CERIMONIA.local}</p>
          <p className="event-section__addr">{CERIMONIA.endereco}</p>
          {CERIMONIA.mapaUrl && (
            <a href={CERIMONIA.mapaUrl} target="_blank" rel="noreferrer" className="event-section__map">
              Ver no mapa
            </a>
          )}
        </div>

        {CERIMONIA.local !== RECEPCAO.local && (
          <div className="event-section__block">
            <h3>{RECEPCAO.titulo}</h3>
            <p>{RECEPCAO.hora}</p>
            <p className="event-section__place">{RECEPCAO.local}</p>
            <p className="event-section__addr">{RECEPCAO.endereco}</p>
          </div>
        )}

        <p className="event-section__dress">{DRESS_CODE}</p>
      </div>
    </section>
  );
}
