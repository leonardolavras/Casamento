import { useMemo, useState } from "react";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  type EnxovalItem,
} from "../../types/enxoval";
import { PALETA_CORES, PIX_KEY } from "../../config/site";
import { PixModal } from "../common/PixModal";
import "./Enxoval.css";

/** Página pública do enxoval: somente leitura para convidados.
 * Gerenciamento completo (adicionar/editar/status) fica em /noivos. */

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TemosRow({ item }: { item: EnxovalItem }) {
  return (
    <div className="enxoval-row enxoval-row--guest">
      <span className="enxoval-row__nome enxoval-row__nome--done">{item.nome}</span>
      {item.quantidade > 1 && <span className="enxoval-row__qty">{item.quantidade}x</span>}
    </div>
  );
}

function GiftCard({ item, onPresentear }: { item: EnxovalItem; onPresentear: (item: EnxovalItem) => void }) {
  const podePresentear = PIX_KEY || item.link;

  return (
    <div className="gift-card">
      <div className="gift-card__media">
        {item.imagem_url ? (
          <img src={item.imagem_url} alt={item.nome} loading="lazy" />
        ) : (
          <span className="gift-card__icone">{ENXOVAL_CATEGORIA_ICONE[item.categoria]}</span>
        )}
      </div>
      <div className="gift-card__body">
        <p className="gift-card__nome">{item.nome}</p>
        <div className="gift-card__meta">
          <span className="gift-card__preco">
            {item.preco_estimado ? formatBRL(item.preco_estimado) : "Valor livre"}
          </span>
          {item.quantidade > 1 && <span className="gift-card__qty">{item.quantidade}x</span>}
        </div>
        {podePresentear && (
          <button type="button" className="gift-card__btn" onClick={() => onPresentear(item)}>
            Presentear
          </button>
        )}
      </div>
    </div>
  );
}

export function EnxovalChecklist() {
  const { items, loading, error } = useEnxovalItems();
  const [presenteando, setPresenteando] = useState<EnxovalItem | null>(null);

  const grouped = useMemo(() => {
    const temos = items.filter((i) => i.status === "temos");
    const precisamos = items.filter((i) => i.status === "precisamos");
    return { temos, precisamos };
  }, [items]);

  const pct = items.length ? Math.round((grouped.temos.length / items.length) * 100) : 0;

  const categoriasComPresente = ENXOVAL_CATEGORIAS.filter((cat) =>
    grouped.precisamos.some((i) => i.categoria === cat),
  );

  function handlePresentear(item: EnxovalItem) {
    if (PIX_KEY) {
      setPresenteando(item);
    } else if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="enxoval">
      <header className="enxoval__header">
        <h1>Lista de Presentes</h1>
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
            <button
              type="button"
              className="enxoval-card enxoval-card--precisamos"
              onClick={() => scrollToSection("enxoval-presentes")}
            >
              <strong>{grouped.precisamos.length}</strong>
              <span>Para presentear</span>
            </button>
            <button
              type="button"
              className="enxoval-card enxoval-card--temos"
              onClick={() => scrollToSection("enxoval-temos")}
            >
              <strong>{grouped.temos.length}</strong>
              <span>Já temos</span>
            </button>
          </div>

          <div id="enxoval-presentes" className="enxoval-section enxoval-section--presentes">
            <div className="enxoval-section__header enxoval-section__header--precisamos">
              <h3>O que precisamos</h3>
              <span className="enxoval-section__count">{grouped.precisamos.length}</span>
            </div>
            {grouped.precisamos.length === 0 ? (
              <p className="enxoval-section__vazio">Nenhum item por aqui ainda.</p>
            ) : (
              categoriasComPresente.map((cat) => (
                <div key={cat} className="gift-group">
                  <h4 className="gift-group__cat">
                    {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
                  </h4>
                  <div className="gift-group__grid">
                    {grouped.precisamos
                      .filter((i) => i.categoria === cat)
                      .map((item) => (
                        <GiftCard key={item.id} item={item} onPresentear={handlePresentear} />
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div id="enxoval-temos" className="enxoval-section">
            <div className="enxoval-section__header enxoval-section__header--temos">
              <h3>O que já temos</h3>
              <span className="enxoval-section__count">{grouped.temos.length}</span>
            </div>
            {grouped.temos.length === 0 ? (
              <p className="enxoval-section__vazio">Nenhum item marcado como 'já temos' ainda.</p>
            ) : (
              <div className="enxoval-expand__groups">
                {ENXOVAL_CATEGORIAS.filter((cat) => grouped.temos.some((i) => i.categoria === cat)).map((cat) => (
                  <div key={cat} className="enxoval-expand__group">
                    <h4 className="enxoval-expand__cat">
                      {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
                      <span>{grouped.temos.filter((i) => i.categoria === cat).length}</span>
                    </h4>
                    <div className="enxoval-expand__items">
                      {grouped.temos
                        .filter((i) => i.categoria === cat)
                        .map((item) => (
                          <TemosRow key={item.id} item={item} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {presenteando && (
        <PixModal
          itemNome={presenteando.nome}
          valorSugerido={presenteando.preco_estimado}
          onClose={() => setPresenteando(null)}
        />
      )}
    </section>
  );
}
