import { useMemo } from "react";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  ENXOVAL_STATUS_LABEL,
  type EnxovalItem,
  type EnxovalStatus,
} from "../../types/enxoval";
import { PALETA_CORES } from "../../config/site";
import "./Enxoval.css";

/** Página pública do enxoval: somente leitura para convidados.
 * Gerenciamento completo (adicionar/editar/status) fica em /noivos. */

const GUEST_STATUS_ORDER: Extract<EnxovalStatus, "temos" | "precisamos">[] = [
  "temos",
  "precisamos",
];

const SECTION_TITLE: Record<string, string> = {
  temos: "O que já temos",
  precisamos: "O que precisamos",
};

const STATUS_EMPTY_MSG: Record<string, string> = {
  temos: "Nenhum item marcado como 'já temos' ainda.",
  precisamos: "Nenhum item marcado como 'precisamos' ainda.",
};

function scrollToSection(status: string) {
  const el = document.getElementById(`enxoval-${status}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function GuestRow({ item }: { item: EnxovalItem }) {
  return (
    <div className={`enxoval-row enxoval-row--${item.status} enxoval-row--guest`}>
      <span className={`enxoval-row__nome ${item.status === "temos" ? "enxoval-row__nome--done" : ""}`}>
        {item.nome}
      </span>
      {item.quantidade > 1 && (
        <span className="enxoval-row__qty">{item.quantidade}x</span>
      )}
      {item.status === "precisamos" && item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="enxoval-row__gift"
        >
          Presentear
        </a>
      )}
    </div>
  );
}

export function EnxovalChecklist() {
  const { items, loading, error } = useEnxovalItems();

  const grouped = useMemo(() => {
    const temos = items.filter((i) => i.status === "temos");
    const precisamos = items.filter((i) => i.status === "precisamos");
    return { temos, precisamos };
  }, [items]);

  const pct = items.length ? Math.round((grouped.temos.length / items.length) * 100) : 0;

  function renderCategoryGroup(list: EnxovalItem[]) {
    const cats = ENXOVAL_CATEGORIAS.filter((cat) =>
      list.some((i) => i.categoria === cat),
    );

    return cats.map((cat) => {
      const catItems = list.filter((i) => i.categoria === cat);
      return (
        <div key={cat} className="enxoval-expand__group">
          <h4 className="enxoval-expand__cat">
            {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
            <span>{catItems.length}</span>
          </h4>
          <div className="enxoval-expand__items">
            {catItems.map((item) => (
              <GuestRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      );
    });
  }

  return (
    <section className="enxoval">
      <header className="enxoval__header">
        <h1>Nosso Enxoval</h1>
        <p>Ajude a gente a preparar nosso lar. Clique em "Presentear" para contribuir com um item.</p>
      </header>

      {PALETA_CORES.length > 0 && (
        <div className="paleta-cores">
          <h2 className="paleta-cores__titulo">Nossa paleta de cores</h2>
          <p className="paleta-cores__sub">
            Para presentes de decoração ou tecidos, essas são as cores do nosso lar.
          </p>
          <div className="paleta-cores__swatches">
            {PALETA_CORES.map((cor) => (
              <div key={cor.hex} className="paleta-swatch">
                <div className="paleta-swatch__color" style={{ backgroundColor: cor.hex }} />
                <div className="paleta-swatch__info">
                  <span className="paleta-swatch__nome">{cor.nome}</span>
                  {cor.descricao && <span className="paleta-swatch__desc">{cor.descricao}</span>}
                  <span className="paleta-swatch__hex">{cor.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="enxoval__erro">Erro: {error}</p>}

      {loading ? (
        <p className="enxoval__loading">Carregando...</p>
      ) : (
        <>
          {items.length > 0 && (
            <div className="enxoval-progress">
              <div className="enxoval-progress__bar">
                <div className="enxoval-progress__fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="enxoval-progress__info">
                <span className="enxoval-progress__pct">{pct}% pronto</span>
                <span className="enxoval-progress__label">
                  {grouped.temos.length} de {items.length} itens
                </span>
              </div>
            </div>
          )}

          <div className="enxoval-cards enxoval-cards--2">
            {GUEST_STATUS_ORDER.map((s) => (
              <button
                key={s}
                type="button"
                className={`enxoval-card enxoval-card--${s}`}
                onClick={() => scrollToSection(s)}
              >
                <strong>{grouped[s].length}</strong>
                <span>{ENXOVAL_STATUS_LABEL[s]}</span>
              </button>
            ))}
          </div>

          {GUEST_STATUS_ORDER.map((status) => (
            <div key={status} id={`enxoval-${status}`} className="enxoval-section">
              <div className={`enxoval-section__header enxoval-section__header--${status}`}>
                <h3>{SECTION_TITLE[status]}</h3>
                <span className="enxoval-section__count">{grouped[status].length}</span>
              </div>
              {grouped[status].length === 0 ? (
                <p className="enxoval-section__vazio">{STATUS_EMPTY_MSG[status]}</p>
              ) : (
                <div className="enxoval-expand__groups">
                  {renderCategoryGroup(grouped[status])}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </section>
  );
}
