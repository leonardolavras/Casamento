import { Link } from "react-router-dom";
import "./EnxovalCta.css";

export function EnxovalCta() {
  return (
    <section className="section-container">
      <div className="enxoval-cta">
        <span className="enxoval-cta__emoji">💛</span>
        <h2>Quer nos ajudar a montar nosso lar?</h2>
        <p>
          Preparamos uma lista com tudo que já temos, o que estamos
          namorando e o que ainda precisamos para a nossa casa nova.
        </p>
        <Link to="/enxoval" className="enxoval-cta__botao">
          Ver lista de enxoval
        </Link>
      </div>
    </section>
  );
}
