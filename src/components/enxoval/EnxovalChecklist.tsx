import { useMemo, useState } from "react";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import { useEnxovalPresentes } from "../../hooks/useEnxovalPresentes";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  type EnxovalCategoria,
  type EnxovalItem,
} from "../../types/enxoval";
import { PALETA_CORES, PIX_KEY } from "../../config/site";
import { PixModal } from "../common/PixModal";
import "./Enxoval.css";

/** Página pública da lista de presentes: somente leitura para convidados.
 * Gerenciamento completo (itens, status "já temos", edição) fica em /noivos —
 * pra quem vem presentear, só interessa o que ainda falta e quanto custa. */

// Alterna a categoria por uma paleta de tons do próprio site, pra dar
// personalidade sem sair da identidade visual (nada de cor aleatória).
const TINTS = ["terracota", "musgo", "mostarda", "tinta", "areia"] as const;
function tintFor(cat: EnxovalCategoria): (typeof TINTS)[number] {
  return TINTS[ENXOVAL_CATEGORIAS.indexOf(cat) % TINTS.length];
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function GiftCard({
  item,
  featured,
  arrecadado,
  contribuintes,
  onPresentear,
}: {
  item: EnxovalItem;
  featured: boolean;
  arrecadado: number;
  contribuintes: number;
  onPresentear: (item: EnxovalItem) => void;
}) {
  const podePresentear = PIX_KEY || item.link;
  const tint = tintFor(item.categoria);
  const meta = item.preco_estimado;

  const dividido = (item.cotas ?? 1) > 1 && meta != null;
  const valorCota = dividido ? meta! / item.cotas! : null;
  const cotasPreenchidas = dividido ? Math.min(item.cotas!, contribuintes) : 0;

  const pct = dividido
    ? Math.round((cotasPreenchidas / item.cotas!) * 100)
    : meta
      ? Math.min(100, Math.round((arrecadado / meta) * 100))
      : 0;
  const completo = dividido ? cotasPreenchidas >= item.cotas! : meta != null && arrecadado >= meta;

  return (
    <div className={`gift-card gift-card--${tint} ${featured ? "gift-card--featured" : ""}`}>
      <div className="gift-card__media">
        {item.imagem_url ? (
          <img src={item.imagem_url} alt={item.nome} loading="lazy" />
        ) : (
          <span className="gift-card__placeholder" aria-hidden="true" />
        )}
        {item.quantidade > 1 && <span className="gift-card__qty">{item.quantidade}x</span>}
        {completo && <span className="gift-card__completo">Presente completo! 🎉</span>}
      </div>
      <div className="gift-card__body">
        <span className="gift-card__cat">{item.categoria}</span>
        <p className="gift-card__nome">{item.nome}</p>

        {meta != null && (
          <span className="gift-card__preco">
            {formatBRL(dividido ? valorCota! : meta)}
            {dividido && <span className="gift-card__preco-nota"> / cota</span>}
          </span>
        )}

        {(dividido || arrecadado > 0) && (
          <div className="gift-card__progresso">
            <div className="gift-card__bar">
              <div className="gift-card__bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="gift-card__progresso-info">
              {dividido ? (
                <span>{cotasPreenchidas} de {item.cotas} cotas preenchidas</span>
              ) : (
                <>
                  <span>{formatBRL(arrecadado)}</span>
                  <span className="gift-card__meta">de {formatBRL(meta!)}</span>
                </>
              )}
            </div>
          </div>
        )}

        {meta == null && (
          <span className="gift-card__preco">
            {arrecadado > 0 ? `${formatBRL(arrecadado)} contribuídos` : "Valor a definir"}
          </span>
        )}

        {contribuintes > 0 && !dividido && (
          <span className="gift-card__contribuintes">
            {contribuintes === 1 ? "1 pessoa já contribuiu" : `${contribuintes} pessoas já contribuíram`}
          </span>
        )}

        {podePresentear && !completo && (
          <button type="button" className="gift-card__btn" onClick={() => onPresentear(item)}>
            {dividido ? "Presentear 1 cota" : "Presentear"}
          </button>
        )}
      </div>
    </div>
  );
}

export function EnxovalChecklist() {
  const { items, loading, error } = useEnxovalItems();
  const { presentes, registrar } = useEnxovalPresentes();
  const [presenteando, setPresenteando] = useState<EnxovalItem | null>(null);

  const precisamos = useMemo(() => items.filter((i) => i.status !== "temos"), [items]);

  const contribuicoesPorItem = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const p of presentes) {
      if (!p.item_id) continue;
      const atual = map.get(p.item_id) ?? { total: 0, count: 0 };
      map.set(p.item_id, { total: atual.total + p.valor, count: atual.count + 1 });
    }
    return map;
  }, [presentes]);

  const { totalMeta, totalArrecadado, itensCompletos, totalContribuicoes } = useMemo(() => {
    let meta = 0;
    let arrecadado = 0;
    let completos = 0;
    for (const item of precisamos) {
      if (item.preco_estimado) meta += item.preco_estimado;
      const c = contribuicoesPorItem.get(item.id);
      if (c) {
        arrecadado += c.total;
        const dividido = (item.cotas ?? 1) > 1;
        const completo = dividido
          ? c.count >= (item.cotas ?? 1)
          : item.preco_estimado != null && c.total >= item.preco_estimado;
        if (completo) completos += 1;
      }
    }
    return { totalMeta: meta, totalArrecadado: arrecadado, itensCompletos: completos, totalContribuicoes: presentes.length };
  }, [precisamos, contribuicoesPorItem, presentes.length]);

  const pctGeral = totalMeta > 0 ? Math.min(100, Math.round((totalArrecadado / totalMeta) * 100)) : 0;

  const categorias = ENXOVAL_CATEGORIAS.filter((cat) => precisamos.some((i) => i.categoria === cat));

  function handlePresentear(item: EnxovalItem) {
    if (PIX_KEY) {
      setPresenteando(item);
    } else if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  }

  async function handleConfirm(nomeDoador: string, valor: number) {
    if (!presenteando) return;
    await registrar({
      item_id: presenteando.id,
      item_nome: presenteando.nome,
      valor,
      nome_doador: nomeDoador,
      mensagem: null,
    });
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
          {totalMeta > 0 && (
            <div className="enxoval-hero-stat">
              <div className="enxoval-hero-stat__bar">
                <div className="enxoval-hero-stat__fill" style={{ width: `${pctGeral}%` }} />
              </div>
              <div className="enxoval-hero-stat__info">
                <span className="enxoval-hero-stat__valor">{formatBRL(totalArrecadado)}</span>
                <span className="enxoval-hero-stat__label">arrecadados de {formatBRL(totalMeta)}</span>
              </div>
              <div className="enxoval-hero-stat__grid">
                <div className="enxoval-hero-stat__mini">
                  <strong>{pctGeral}%</strong>
                  <span>da meta</span>
                </div>
                <div className="enxoval-hero-stat__mini">
                  <strong>{itensCompletos}</strong>
                  <span>{itensCompletos === 1 ? "item completo" : "itens completos"}</span>
                </div>
                <div className="enxoval-hero-stat__mini">
                  <strong>{totalContribuicoes}</strong>
                  <span>{totalContribuicoes === 1 ? "contribuição" : "contribuições"}</span>
                </div>
              </div>
            </div>
          )}

          {precisamos.length === 0 ? (
            <p className="enxoval-section__vazio">Nenhum item por aqui ainda.</p>
          ) : (
            categorias.map((cat) => (
              <div key={cat} className={`gift-group gift-group--${tintFor(cat)}`}>
                <h4 className="gift-group__cat">
                  {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
                </h4>
                <div className="gift-group__grid">
                  {precisamos
                    .filter((i) => i.categoria === cat)
                    .map((item, idx) => {
                      const c = contribuicoesPorItem.get(item.id);
                      return (
                        <GiftCard
                          key={item.id}
                          item={item}
                          featured={idx === 0}
                          arrecadado={c?.total ?? 0}
                          contribuintes={c?.count ?? 0}
                          onPresentear={handlePresentear}
                        />
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {presenteando && (
        <PixModal
          itemNome={presenteando.nome}
          valorSugerido={
            (presenteando.cotas ?? 1) > 1 && presenteando.preco_estimado != null
              ? presenteando.preco_estimado / presenteando.cotas!
              : presenteando.preco_estimado
          }
          onClose={() => setPresenteando(null)}
          onConfirm={handleConfirm}
        />
      )}
    </section>
  );
}
