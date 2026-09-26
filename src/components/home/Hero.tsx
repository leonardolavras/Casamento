import { COUPLE, HERO_PHOTO, WEDDING_DATE } from "../../config/site";
import { useCountdown } from "../../hooks/useCountdown";
import { useGreeting } from "../../hooks/useGreeting";
import "./Hero.css";

export function Hero() {
  const greeting = useGreeting();
  const countdown = useCountdown(WEDDING_DATE);

  const dataFormatada = WEDDING_DATE.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="hero">
      <div className="hero__media">
        <img src={HERO_PHOTO} alt={`${COUPLE.nome1} e ${COUPLE.nome2}`} />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow fade-up">{greeting}, seja bem-vindo(a)</p>
        <h1 className="hero__names fade-up fade-up--1">
          {COUPLE.nome1} <span>&amp;</span> {COUPLE.nome2}
        </h1>
        <p className="hero__date fade-up fade-up--2">{dataFormatada}</p>

        <div className="hero__countdown fade-up fade-up--3">
          <div className="hero__time">
            <span>{countdown.dias}</span>
            <small>dias</small>
          </div>
          <div className="hero__time">
            <span>{String(countdown.horas).padStart(2, "0")}</span>
            <small>horas</small>
          </div>
          <div className="hero__time">
            <span>{String(countdown.minutos).padStart(2, "0")}</span>
            <small>min</small>
          </div>
          <div className="hero__time">
            <span>{String(countdown.segundos).padStart(2, "0")}</span>
            <small>seg</small>
          </div>
        </div>
      </div>

      <a className="hero__scroll-hint" href="#onde-e-quando" aria-label="Continuar descendo">
        <span />
      </a>
    </section>
  );
}
