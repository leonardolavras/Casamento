import { useState } from "react";
import { TIMELINE_ITEMS } from "../config/site";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./HistoriaPage.css";

function HistoriaItem({
  item,
  idx,
  isOpen,
  onToggle,
}: {
  item: (typeof TIMELINE_ITEMS)[number];
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`historia-item ${item.concluido ? "historia-item--done" : ""} ${isOpen ? "historia-item--open" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transitionDelay: `${idx * 100}ms`,
      }}
    >
      <button
        type="button"
        className="historia-item__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="historia-item__dot" aria-hidden="true" />
        <div className="historia-item__info">
          <span className="historia-item__index">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <h3 className="historia-item__title">{item.texto}</h3>
        </div>
        <span className="historia-item__status">
          {item.concluido ? "Vivido" : "Em breve"}
        </span>
        <svg
          className="historia-item__chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className="historia-item__body">
        <div className="historia-item__content">
          {item.descricao ? (
            <p>{item.descricao}</p>
          ) : (
            <p className="historia-item__placeholder">
              {item.concluido
                ? "Em breve adicionaremos mais detalhes e fotos desse momento..."
                : "Esse capítulo ainda está por vir..."}
            </p>
          )}
          {item.foto && (
            <img
              src={item.foto}
              alt={item.texto}
              className="historia-item__photo"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function HistoriaPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="page-transition" style={{ paddingTop: "80px" }}>
      <section className="section-container">
        <div className="section-heading">
          <span className="section-eyebrow">A jornada</span>
          <h2 className="section-title">Nossa história</h2>
        </div>

        <div className="historia-timeline">
          <div className="historia-timeline__line" aria-hidden="true" />
          {TIMELINE_ITEMS.map((item, idx) => (
            <HistoriaItem
              key={item.id}
              item={item}
              idx={idx}
              isOpen={openId === item.id}
              onToggle={() =>
                setOpenId((prev) => (prev === item.id ? null : item.id))
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
