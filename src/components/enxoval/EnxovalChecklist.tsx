import { useMemo, useState } from "react";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import { useEnxovalPresentes } from "../../hooks/useEnxovalPresentes";
import { ENXOVAL_CATEGORIAS, type EnxovalCategoria, type EnxovalItem } from "../../types/enxoval";
import { PALETA_CORES, PIX_KEY } from "../../config/site";
import { agruparContribuicoes, NOME_VALOR_LIVRE, presenteCompleto, rotuloPreco } from "../../lib/presente";
import { PixModal } from "../common/PixModal";
import { GiftThumb } from "./GiftThumb";
import "./Enxoval.css";

/** Página pública da lista de presentes: somente leitura para convidados.
 * Gerenciamento (itens, "já temos", valores arrecadados) fica em /noivos. */

type Linha = { item: EnxovalItem; completo: boolean };
type Ordem = "categoria" | "valor";

// Completos sempre no fim: quem chega vê primeiro o que ainda dá pra presentear.
function porValor(a: Linha, b: Linha): number {
  if (a.completo !== b.completo) return Number(a.completo) - Number(b.completo);
  return (a.item.preco_estimado ?? Infinity) - (b.item.preco_estimado ?? Infinity);
}

function GiftCard({ item, completo, onPresentear }: Linha & { onPresentear: (item: EnxovalItem) => void }) {
  const podePresentear = Boolean(PIX_KEY || item.link);

  return (
    <li className={`gift-card ${completo ? "gift-card--completo" : ""}`}>
      <div className="gift-card__foto">
        <GiftThumb nome={item.nome} src={item.imagem_url} size="lg" />
        {completo && <span className="gift-card__selo">Presenteado</span>}
      </div>
      <p className="gift-card__nome">
        {item.nome}
        {item.quantidade > 1 && <span className="gift-card__qtd"> · {item.quantidade} un.</span>}
      </p>
      <p className="gift-card__preco">{rotuloPreco(item)}</p>
      {completo ? (
        <span className="gift-card__btn gift-card__btn--done">Já presenteado</span>
      ) : (
        podePresentear && (
          <button type="button" className="gift-card__btn" onClick={() => onPresentear(item)}>
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
  // null = fechado; item = presente escolhido; "livre" = convidado escolhe o valor
  const [presenteando, setPresenteando] = useState<EnxovalItem | "livre" | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState<EnxovalCategoria | "todas">("todas");
  const [ordem, setOrdem] = useState<Ordem>("categoria");

  const contribuicoes = useMemo(() => agruparContribuicoes(presentes), [presentes]);

  const linhas = useMemo(
    () =>
      items
        .filter((item) => item.status !== "temos")
        .map((item) => ({ item, completo: presenteCompleto(item, contribuicoes.get(item.id)) })),
    [items, contribuicoes],
  );

  const contagemPorCategoria = useMemo(() => {
    const map = new Map<EnxovalCategoria, number>();
    for (const { item } of linhas) map.set(item.categoria, (map.get(item.categoria) ?? 0) + 1);
    return map;
  }, [linhas]);

  const categorias = ENXOVAL_CATEGORIAS.filter((cat) => contagemPorCategoria.has(cat));
  const filtradas = categoriaAtiva === "todas" ? linhas : linhas.filter((l) => l.item.categoria === categoriaAtiva);

  const grupos: { titulo: string | null; linhas: Linha[] }[] =
    ordem === "valor"
      ? [{ titulo: null, linhas: [...filtradas].sort(porValor) }]
      : categorias
          .filter((cat) => categoriaAtiva === "todas" || cat === categoriaAtiva)
          .map((cat) => ({
            titulo: cat,
            linhas: filtradas.filter((l) => l.item.categoria === cat).sort((a, b) => Number(a.completo) - Number(b.completo)),
          }));

  function handlePresentear(item: EnxovalItem) {
    if (PIX_KEY) {
      setPresenteando(item);
    } else if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  }

  async function handleConfirm(nomeDoador: string, valor: number) {
    if (!presenteando) return;
    const livre = presenteando === "livre";
    await registrar({
      item_id: livre ? null : presenteando.id,
      item_nome: livre ? NOME_VALOR_LIVRE : presenteando.nome,
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
        <p>
          Escolha o presente pelo valor que você quer dar e pague pelo Pix. Não achou o valor ideal? Você
          pode escolher qualquer valor.
        </p>
      </header>

      {error && <p className="enxoval__erro">Erro: {error}</p>}

      {PIX_KEY && (
        <button type="button" className="gift-livre" onClick={() => setPresenteando("livre")}>
          <span className="gift-livre__icone" aria-hidden="true">R$</span>
          <span className="gift-livre__texto">
            <strong>Escolher um valor</strong>
            <span>Presenteie com o valor que quiser</span>
          </span>
          <span className="gift-pill" aria-hidden="true">Escolher</span>
        </button>
      )}

      {loading ? (
        <p className="enxoval__loading">Carregando...</p>
      ) : linhas.length === 0 ? (
        <p className="enxoval-section__vazio">Nenhum presente por aqui ainda.</p>
      ) : (
        <>
          <div className="gift-toolbar">
            <nav className="gift-chips" aria-label="Filtrar por categoria">
              <button
                type="button"
                className={`gift-chip ${categoriaAtiva === "todas" ? "gift-chip--ativo" : ""}`}
                onClick={() => setCategoriaAtiva("todas")}
              >
                Todos <span>{linhas.length}</span>
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`gift-chip ${categoriaAtiva === cat ? "gift-chip--ativo" : ""}`}
                  onClick={() => setCategoriaAtiva(cat)}
                >
                  {cat} <span>{contagemPorCategoria.get(cat)}</span>
                </button>
              ))}
            </nav>
            <div className="gift-ordem" role="group" aria-label="Ordenar">
              <button type="button" aria-pressed={ordem === "categoria"} onClick={() => setOrdem("categoria")}>
                Por categoria
              </button>
              <button type="button" aria-pressed={ordem === "valor"} onClick={() => setOrdem("valor")}>
                Por valor
              </button>
            </div>
          </div>

          {grupos.map((grupo) => (
            <div key={grupo.titulo ?? "valor"} className="gift-section">
              {grupo.titulo && <h2 className="gift-section__titulo">{grupo.titulo}</h2>}
              <ul className="gift-grid">
                {grupo.linhas.map((linha) => (
                  <GiftCard key={linha.item.id} {...linha} onPresentear={handlePresentear} />
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
          itemNome={presenteando === "livre" ? NOME_VALOR_LIVRE : presenteando.nome}
          valorSugerido={presenteando === "livre" ? null : presenteando.preco_estimado}
          onClose={() => setPresenteando(null)}
          onConfirm={handleConfirm}
        />
      )}
    </section>
  );
}
