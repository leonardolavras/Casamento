import { useState } from "react";
import { MESSAGE_CARDS } from "../../config/site";
import "./MessageCards.css";

export function MessageCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-container">
      <div className="section-heading">
        <span className="section-eyebrow">Chapter one</span>
        <h2 className="section-title">Nossa história</h2>
      </div>

      <div className="story-cards">
        {MESSAGE_CARDS.map((card, index) => {
          const num = String(index + 1).padStart(2, "0");
          const isOpen = openIndex === index;
          return (
            <button
              key={card.titulo}
              type="button"
              className={`story-card ${isOpen ? "story-card--open" : ""}`}
              onClick={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
              aria-expanded={isOpen}
            >
              <span className="story-card__num">{num}</span>
              <h3 className="story-card__title">{card.titulo}</h3>
              <p className="story-card__text">{card.texto}</p>
              <span className="story-card__cta" aria-hidden="true">
                {isOpen ? "Fechar" : "Ler"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
