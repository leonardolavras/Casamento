import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { COUPLE } from "../config/site";
import "./Navbar.css";

const initial1 = COUPLE.nome1.trim().charAt(0).toUpperCase();
const initial2 = COUPLE.nome2.trim().charAt(0).toUpperCase();

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "navbar__link navbar__link--active" : "navbar__link";

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
        <span className="navbar__monogram">
          {initial1}
          <em>&amp;</em>
          {initial2}
        </span>
        <span className="navbar__names">
          {COUPLE.nome1} &amp; {COUPLE.nome2}
        </span>
      </NavLink>

      <div className="navbar__links navbar__links--desktop">
        <NavLink to="/" end className={linkClass}>
          Início
        </NavLink>
        <NavLink to="/enxoval" className={linkClass}>
          Enxoval
        </NavLink>
      </div>

      <button
        type="button"
        className={`navbar__toggle ${open ? "navbar__toggle--open" : ""}`}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      <div className={`navbar__mobile ${open ? "navbar__mobile--open" : ""}`}>
        <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
          Início
        </NavLink>
        <NavLink to="/enxoval" className={linkClass} onClick={() => setOpen(false)}>
          Enxoval
        </NavLink>
      </div>
    </nav>
  );
}
