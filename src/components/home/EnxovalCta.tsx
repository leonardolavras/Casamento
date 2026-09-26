import { Link } from "react-router-dom";
import "./EnxovalCta.css";

export function EnxovalCta() {
  return (
    <section className="section-container">
      <div className="enxoval-cta">
        <div className="enxoval-cta__mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <span className="section-eyebrow">Nosso lar</span>
        <h2 className="enxoval-cta__title">Ajude-nos a montar nossa casa</h2>
        <p className="enxoval-cta__lead">
          Preparamos uma lista viva com tudo que já temos, o que estamos
          namorando e o que ainda precisamos. Escolher qualquer item é um jeito
          especial de estar com a gente nesse começo.
        </p>
        <Link to="/enxoval" className="btn btn--primary">
          Ver a lista de enxoval
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
