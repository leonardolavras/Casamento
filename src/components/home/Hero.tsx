import { HERO_PHOTO, WEDDING_DATE } from "../../config/site";
import { useCountdown } from "../../hooks/useCountdown";
import { useGreeting } from "../../hooks/useGreeting";
import { useTypewriter } from "../../hooks/useTypewriter";
import "./Hero.css";

const FRASE = "Contando os dias para dizer sim, um para o outro, para sempre.";

export function Hero() {
  const greeting = useGreeting();
  const countdown = useCountdown(WEDDING_DATE);
  const typed = useTypewriter(FRASE);

  const dataFormatada = WEDDING_DATE.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section className="hero">
      <p className="hero__pre-title fade-in">{greeting}</p>
      <h1 className="hero__date fade-in hero__delay-1">{dataFormatada}</h1>

      <div className="hero__countdown fade-in hero__delay-2">
        <div className="hero__time">
          <span>{countdown.dias}</span>
          <small>dias</small>
        </div>
        <div className="hero__divider">/</div>
        <div className="hero__time">
          <span>{String(countdown.horas).padStart(2, "0")}</span>
          <small>horas</small>
        </div>
        <div className="hero__divider">/</div>
        <div className="hero__time">
          <span>{String(countdown.minutos).padStart(2, "0")}</span>
          <small>min</small>
        </div>
      </div>

      <div className="hero__typing">
        <p>{typed}</p>
        <span className="hero__cursor">|</span>
      </div>

      <div className="hero__photo fade-in hero__delay-2">
        <div className="hero__photo-inner">
          <img src={HERO_PHOTO} alt="Nós" />
        </div>
        <div className="hero__tape" />
      </div>

      <div className="hero__scroll-hint">
        <span className="hero__script">Continue descendo</span>
        <div className="hero__arrow">↓</div>
      </div>
    </section>
  );
}
