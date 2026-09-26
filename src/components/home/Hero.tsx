import { useRef } from "react";
import { COUPLE, HERO_PHOTO, WEDDING_DATE } from "../../config/site";
import { useCountdown } from "../../hooks/useCountdown";
import { useParallax } from "../../hooks/useParallax";
import "./Hero.css";

export function Hero() {
  const countdown = useCountdown(WEDDING_DATE);
  const ref = useRef<HTMLElement>(null);
  const offset = useParallax(ref, 0.4);

  const dataFormatada = WEDDING_DATE.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="hero" ref={ref}>
      <div className="hero__media" style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
        <img src={HERO_PHOTO} alt={`${COUPLE.nome1} e ${COUPLE.nome2}`} />
      </div>
      <div className="hero__scrim" />

      <div className="hero__content">
        <h1 className="hero__names fade-up">
          {COUPLE.nome1} <span>&amp;</span> {COUPLE.nome2}
        </h1>
        <p className="hero__date fade-up fade-up--1">{dataFormatada}</p>

        <div className="hero__countdown fade-up fade-up--2">
          {[
            { value: countdown.dias, label: "dias" },
            { value: String(countdown.horas).padStart(2, "0"), label: "horas" },
            { value: String(countdown.minutos).padStart(2, "0"), label: "min" },
            { value: String(countdown.segundos).padStart(2, "0"), label: "seg" },
          ].map((unit) => (
            <div className="hero__time" key={unit.label}>
              <span>{unit.value}</span>
              <small>{unit.label}</small>
            </div>
          ))}
        </div>
      </div>

      <a className="hero__scroll-hint" href="#onde-e-quando" aria-label="Rolar para baixo">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-dot" />
      </a>
    </section>
  );
}
