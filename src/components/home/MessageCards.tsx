import { useState } from "react";
import { MESSAGE_CARDS } from "../../config/site";
import "./MessageCards.css";

export function MessageCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-container">
      <h2 className="section-title">Nossa história</h2>
      <div className="cards">
        {MESSAGE_CARDS.map((card, index) => (
          <div
            key={card.titulo}
            className="card-wrapper"
            onClick={() =>
              setOpenIndex((current) => (current === index ? null : index))
            }
          >
            <div
              className={`card-3d ${openIndex === index ? "card-3d--open" : ""}`}
            >
              <div className="card-face card-face--front">
                <h3 className="card-script">{card.titulo}</h3>
                <div className="card-sep" />
              </div>
              <div className="card-face card-face--back">
                <div className="card-frame">
                  <p>{card.texto}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
