import { COUPLE, WEDDING_DATE } from "../../config/site";
import "./HomeFooter.css";

const initial1 = COUPLE.nome1.trim().charAt(0).toUpperCase();
const initial2 = COUPLE.nome2.trim().charAt(0).toUpperCase();

export function HomeFooter() {
  const ano = WEDDING_DATE.getFullYear();

  return (
    <footer className="home-footer">
      <div className="home-footer__monogram" aria-hidden="true">
        <span>{initial1}</span>
        <em>&amp;</em>
        <span>{initial2}</span>
      </div>
      <p className="home-footer__names">
        {COUPLE.nome1} <span aria-hidden="true">&middot;</span> {COUPLE.nome2}
      </p>
      <p className="home-footer__year">{ano}</p>
    </footer>
  );
}
