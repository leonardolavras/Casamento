import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./EnxovalCta.css";

export function EnxovalCta() {
  const { ref, visible } = useScrollReveal<HTMLElement>();

  return (
    <section
      className="enxoval-cta"
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(40px)",
      }}
    >
      <div className="enxoval-cta__inner">
        <span className="enxoval-cta__eyebrow">Lista de presentes</span>
        <h2 className="enxoval-cta__title">
          Nos ajude a construir<br />nosso primeiro lar
        </h2>
        <p className="enxoval-cta__lead">
          Montamos uma lista com tudo que precisamos para começar essa nova fase.
          Escolha um presente pelo valor que quiser e contribua pelo Pix.
        </p>
        <Link to="/presentes" className="btn btn--cta">
          Ver lista completa
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}
