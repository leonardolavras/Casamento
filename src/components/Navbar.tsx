import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { COUPLE } from "../config/site";
import "./Navbar.css";

const initial1 = COUPLE.nome1.trim().charAt(0).toUpperCase();
const initial2 = COUPLE.nome2.trim().charAt(0).toUpperCase();

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navClass = [
    "navbar",
    isHome && !scrolled && !open ? "navbar--transparent" : "",
    scrolled ? "navbar--solid" : "",
  ].filter(Boolean).join(" ");

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "navbar__link navbar__link--active" : "navbar__link";

  return (
    <nav className={navClass}>
      <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
        <span className="navbar__monogram">
          {initial1}<em>&</em>{initial2}
        </span>
      </NavLink>

      <div className="navbar__links navbar__links--desktop">
        <NavLink to="/" end className={linkClass}>Inicio</NavLink>
        <NavLink to="/galeria" className={linkClass}>Fotos</NavLink>
        <NavLink to="/historia" className={linkClass}>História</NavLink>
        <NavLink to="/mural" className={linkClass}>Recados</NavLink>
        <NavLink to="/enxoval" className={linkClass}>Enxoval</NavLink>
        <NavLink to="/noivos" className={linkClass}>Para os Noivos</NavLink>
      </div>

      <button
        type="button"
        className={`navbar__toggle ${open ? "navbar__toggle--open" : ""}`}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span />
      </button>

      <div className={`navbar__mobile ${open ? "navbar__mobile--open" : ""}`}>
        <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Inicio</NavLink>
        <NavLink to="/galeria" className={linkClass} onClick={() => setOpen(false)}>Fotos</NavLink>
        <NavLink to="/historia" className={linkClass} onClick={() => setOpen(false)}>História</NavLink>
        <NavLink to="/mural" className={linkClass} onClick={() => setOpen(false)}>Recados</NavLink>
        <NavLink to="/enxoval" className={linkClass} onClick={() => setOpen(false)}>Enxoval</NavLink>
        <NavLink to="/noivos" className={linkClass} onClick={() => setOpen(false)}>Para os Noivos</NavLink>
      </div>
    </nav>
  );
}
