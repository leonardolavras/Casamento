import { useScrollReveal } from "../../hooks/useScrollReveal";
import {
  CERIMONIA,
  DRESS_CODE,
  HERO_PHOTO,
  HONEYMOON,
  PALETA_CORES,
  RECEPCAO,
  SPOTIFY_PLAYLIST_URL,
  WEDDING_DATE,
} from "../../config/site";
import "./Destaques.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function buildCalendarGrid(date: Date): (number | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function MiniCalendar() {
  const cells = buildCalendarGrid(WEDDING_DATE);
  const diaCasamento = WEDDING_DATE.getDate();
  const mesAno = WEDDING_DATE.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="destaque-card destaque-card--calendario">
      <span className="destaque-card__eyebrow">{mesAno}</span>
      <div className="mini-cal">
        {DIAS_SEMANA.map((d, i) => (
          <span key={`h${i}`} className="mini-cal__head">{d}</span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={`mini-cal__cell ${day === diaCasamento ? "mini-cal__cell--marcado" : ""}`}
          >
            {day ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function LocalCard() {
  const mesmoLocal = CERIMONIA.local === RECEPCAO.local;
  const temMapa = Boolean(CERIMONIA.mapaUrl);

  const conteudo = (
    <>
      <div className="destaque-card__mapa" aria-hidden="true">
        <span className="destaque-card__pin">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
      </div>
      <div className="destaque-card__body">
        <span className="destaque-card__eyebrow">{mesmoLocal ? "Cerimônia & Recepção" : "Local"}</span>
        <p className="destaque-card__titulo">{CERIMONIA.local}</p>
        <p className="destaque-card__sub">
          {temMapa ? CERIMONIA.endereco : "Endereço em breve"}
        </p>
      </div>
    </>
  );

  return temMapa ? (
    <a
      href={CERIMONIA.mapaUrl ?? undefined}
      target="_blank"
      rel="noreferrer"
      className="destaque-card destaque-card--local destaque-card--link"
    >
      {conteudo}
    </a>
  ) : (
    <div className="destaque-card destaque-card--local">{conteudo}</div>
  );
}

function DressCodeCard() {
  return (
    <div className="destaque-card destaque-card--dresscode">
      <span className="destaque-card__eyebrow">Dress code</span>
      <p className="destaque-card__titulo">{DRESS_CODE}</p>
      {PALETA_CORES.length > 0 && (
        <div className="destaque-card__dots">
          {PALETA_CORES.map((cor) => (
            <span key={cor.hex} className="destaque-card__dot" style={{ backgroundColor: cor.hex }} title={cor.nome} />
          ))}
        </div>
      )}
    </div>
  );
}

function HoneymoonCard() {
  if (!HONEYMOON) return null;
  return (
    <div className="destaque-card destaque-card--lua">
      <img src={HONEYMOON.foto} alt={HONEYMOON.destino} />
      <div className="destaque-card__overlay">
        <span className="destaque-card__eyebrow destaque-card__eyebrow--claro">Lua de mel</span>
        <p className="destaque-card__titulo destaque-card__titulo--claro">{HONEYMOON.destino}</p>
      </div>
    </div>
  );
}

function PlaylistCard() {
  if (!SPOTIFY_PLAYLIST_URL) return null;
  return (
    <a
      href={SPOTIFY_PLAYLIST_URL}
      target="_blank"
      rel="noreferrer"
      className="destaque-card destaque-card--playlist destaque-card--link"
    >
      <span className="destaque-card__play">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
      </span>
      <div>
        <span className="destaque-card__eyebrow destaque-card__eyebrow--claro">A trilha do grande dia</span>
        <p className="destaque-card__titulo destaque-card__titulo--claro">Ouvir no Spotify</p>
      </div>
    </a>
  );
}

export function Destaques() {
  const { ref, visible } = useScrollReveal<HTMLElement>();

  return (
    <section
      className="destaques"
      ref={ref}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)" }}
    >
      <div className="destaques__grid">
        <div className="destaque-card destaque-card--foto">
          <img src={HERO_PHOTO} alt="" />
        </div>

        <LocalCard />
        <MiniCalendar />
        <DressCodeCard />
        <HoneymoonCard />
        <PlaylistCard />
      </div>
    </section>
  );
}
