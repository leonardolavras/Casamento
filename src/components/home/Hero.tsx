import { useRef } from "react";
import { COUPLE, HERO_PHOTO, WEDDING_DATE } from "../../config/site";
import { useCountdown } from "../../hooks/useCountdown";
import { useParallax } from "../../hooks/useParallax";
import "./Hero.css";

export function Hero() {
  const countdown = useCountdown(WEDDING_DATE);
  const ref = useRef<HTMLElement>(null);
  const offset = useParallax(ref, 0.35);

  const dataFormatada = WEDDING_DATE.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="hero" ref={ref}>
      <div className="hero__bg" style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.1)` }}>
        <img src={HERO_PHOTO} alt="" />
      </div>
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__date fade-in">{dataFormatada}</p>
        <h1 className="hero__names fade-in fade-in--1">
          {COUPLE.nome1} <span className="hero__amp">&</span> {COUPLE.nome2}
        </h1>

        <div className="hero__countdown fade-in fade-in--2">
          {[
            { v: countdown.dias, l: "dias" },
            { v: String(countdown.horas).padStart(2, "0"), l: "horas" },
            { v: String(countdown.minutos).padStart(2, "0"), l: "min" },
            { v: String(countdown.segundos).padStart(2, "0"), l: "seg" },
          ].map((u) => (
            <div className="hero__unit" key={u.l}>
              <span>{u.v}</span>
              <small>{u.l}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="hero__scroll fade-in fade-in--3">
        <span>Scroll</span>
        <div className="hero__scroll-bar"><div className="hero__scroll-fill" /></div>
      </div>
    </section>
  );
}
