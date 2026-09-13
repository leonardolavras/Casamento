import { NavLink } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar__brand">Nosso Casamento</span>
      <div className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Início
        </NavLink>
        <NavLink
          to="/enxoval"
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Enxoval
        </NavLink>
      </div>
    </nav>
  );
}
