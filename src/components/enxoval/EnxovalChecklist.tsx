import { useMemo, useState } from "react";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import { useEnxovalPresentes } from "../../hooks/useEnxovalPresentes";
import { ENXOVAL_CATEGORIAS, type EnxovalCategoria, type EnxovalItem } from "../../types/enxoval";
import { PALETA_CORES, PIX_KEY } from "../../config/site";
import { agruparContribuicoes, resumirPresente, rotuloPreco, type ResumoPresente } from "../../lib/presente";
import { PixModal } from "../common/PixModal";
import { GiftThumb } from "./GiftThumb";
import "./Enxoval.css";

/** Página pública da lista de presentes: somente leitura para convidados.
 * Gerenciamento (itens, "já temos", valores arrecadados) fica em /noivos. */

type Linha = { item: EnxovalItem; resumo: ResumoPresente };

function GiftRow({ item, resumo, onPresentear }: Linha & { onPresentear: (item: EnxovalItem) => void }) {
  const podePresentear = Boolean(PIX_KEY || item.link);
  const pct = resumo.dividido ? (resumo.cotasPreenchidas / resumo.totalCotas) * 100 : 0;

  return (
    <li className={`gift-row ${resumo.completo ? "gift-row--completo" : ""}`}>
      <GiftThumb nome={item.nome} src={item.imagem_url} />

      <div className="gift-row__info">
        <p className="gift-row__nome">
          {item.nome}
          {item.quantidade > 1 && <span className="gift-row__qtd">{item.quantidade} un.</span>}
        </p>
        <p className="gift-row__meta">{rotuloPreco(resumo)}</p>
        {resumo.dividido && resumo.cotasPreenchidas > 0 && !resumo.completo && (
          <div className="gift-row__cotas" aria-label={`${resumo.cotasPreenchidas} de ${resumo.totalCotas} cotas presenteadas`}>
            <span className="gift-row__cotas-bar"><span style={{ width: `${pct}%` }} /></span>
            <span className="gift-row__cotas-txt">{resumo.cotasPreenchidas}/{resumo.totalCotas}</span>
          </div>
        )}
      </div>

      {resumo.completo ? (
        <span className="gift-pill gift-pill--done">Presenteado</span>
      ) : (
        podePresentear && (
          <button type="button" className="gift-pill" onClick={() => onPresentear(item)}>
            Presentear
          </button>
        )
      )}
    </li>
  );
}

export function EnxovalChecklist() {
  const { items, loading, error } = useEnxovalItems();
  const { presentes, registrar } = useEnxovalPresentes();
  const [presenteando, setPresenteando] = useState<Linha | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState<EnxovalCategoria | "todas">("todas");

  const contribuicoes = useMemo(() => agruparContribuicoes(presentes), [presentes]);

  // Completos vão pro fim de cada categoria: quem chega vê primeiro o que ainda falta.
  const linhasPorCategoria = useMemo(() => {
    const map = new Map<EnxovalCategoria, Linha[]>();
    for (const item of items) {
      if (item.status === "temos") continue;
      const linha = { item, resumo: resumirPresente(item, contribuicoes.get(item.id)) };
      const lista = map.get(item.categoria) ?? [];
      lista.push(linha);
      map.set(item.categoria, lista);
    }
    for (const lista of map.values()) {
      lista.sort((a, b) => Number(a.resumo.completo) - Number(b.resumo.completo));
    }
    return map;
  }, [items, contribuicoes]);

  const categorias = ENXOVAL_CATEGORIAS.filter((cat) => linhasPorCategoria.has(cat));
  const visiveis = categoriaAtiva === "todas" ? categorias : categorias.filter((c) => c === categoriaAtiva);
  const totalItens = categorias.reduce((n, c) => n + (linhasPorCategoria.get(c)?.length ?? 0), 0);

  function handlePresentear(item: EnxovalItem) {
    if (PIX_KEY) {
      setPresenteando({ item, resumo: resumirPresente(item, contribuicoes.get(item.id)) });
    } else if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  }

  async function handleConfirm(nomeDoador: string, valor: number) {
    if (!presenteando) return;
    await registrar({
      item_id: presenteando.item.id,
      item_nome: presenteando.item.nome,
      valor,
      nome_doador: nomeDoador,
      mensagem: null,
    });
  }

  return (
    <section className="enxoval">
      <header className="enxoval__header">
        <span className="enxoval__eyebrow">Nosso primeiro lar</span>
        <h1>Lista de Presentes</h1>
        <p>Escolha um presente e contribua pelo Pix. Presentes mais caros são divididos em cotas — você presenteia uma parte.</p>
      </header>

      {error && <p className="enxoval__erro">Erro: {error}</p>}

      {loading ? (
        <p className="enxoval__loading">Carregando...</p>
      ) : totalItens === 0 ? (
        <p className="enxoval-section__vazio">Nenhum presente por aqui ainda.</p>
      ) : (
        <>
          <nav className="gift-chips" aria-label="Filtrar por categoria">
            <button
              type="button"
              className={`gift-chip ${categoriaAtiva === "todas" ? "gift-chip--ativo" : ""}`}
              onClick={() => setCategoriaAtiva("todas")}
            >
              Todos <span>{totalItens}</span>
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`gift-chip ${categoriaAtiva === cat ? "gift-chip--ativo" : ""}`}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat} <span>{linhasPorCategoria.get(cat)?.length}</span>
              </button>
            ))}
          </nav>

          {visiveis.map((cat) => (
            <div key={cat} className="gift-section">
              <h2 className="gift-section__titulo">{cat}</h2>
              <ul className="gift-list">
                {linhasPorCategoria.get(cat)!.map((linha) => (
                  <GiftRow key={linha.item.id} {...linha} onPresentear={handlePresentear} />
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

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

      {presenteando && (
        <PixModal
          itemNome={
            presenteando.resumo.dividido
              ? `${presenteando.item.nome} (1 cota)`
              : presenteando.item.nome
          }
          valorSugerido={presenteando.resumo.valorPresente}
          onClose={() => setPresenteando(null)}
          onConfirm={handleConfirm}
        />
      )}
    </section>
  );
}
